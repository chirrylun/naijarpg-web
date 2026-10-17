'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, errorText } from '@/lib/api';
import { emitAck } from '@/lib/socket';
import { useSession } from '@/stores/session';
import { useGame } from '@/stores/game';
import { useChatUi } from '@/stores/chatUi';
import { useToast } from '@/stores/toast';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/features/avatar/Avatar';
import { cn } from '@/lib/utils';
import type { ChatPerson, ChatRequest, Conversation, Message } from '../../types';

export function ChatDock() {
  const session = useSession((s) => s.session);
  const myId = session?.user.id;
  const { open, convId, unread, setOpen, setConv, sync } = useChatUi();
  const playing = useGame((s) => s.room?.status === 'active' && !s.finished);
  const qc = useQueryClient();
  const toast = useToast.getState().push;

  const requests = useQuery({
    queryKey: ['chat', 'requests'],
    queryFn: () => api<ChatRequest[]>('/api/chat/requests'),
    enabled: !!session,
    refetchInterval: 60_000,
  });
  // loaded even while the dock is closed, so the bubble can count unread messages
  const convs = useQuery({
    queryKey: ['chat', 'conversations'],
    queryFn: () => api<Conversation[]>('/api/chat/conversations'),
    enabled: !!session,
    refetchInterval: 60_000,
  });
  const respond = useMutation({
    mutationFn: (v: { id: string; accept: boolean }) =>
      api<{ accepted: boolean; conversationId?: string }>(`/api/chat/requests/${v.id}/respond`, { body: { accept: v.accept } }),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ['chat'] });
      if (r.accepted && r.conversationId) setConv(r.conversationId);
    },
    onError: (e) => toast(errorText(e), 'bad'),
  });

  useEffect(() => {
    if (convs.data) sync(convs.data, myId);
  }, [convs.data, myId, sync]);

  if (!session || playing) return null;
  const pending = requests.data ?? [];
  const active = convs.data?.find((c) => c.id === convId);
  const badge = pending.length + Object.values(unread).reduce((a, b) => a + b, 0);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={badge ? `Open chat, ${badge} new` : 'Open chat'}
        className="fixed bottom-20 right-4 z-40 flex size-12 items-center justify-center rounded-full border border-line bg-panel-2 text-xl shadow-xl sm:bottom-6"
      >
        💬
        {badge > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[11px] font-bold leading-5">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={active ? active.with.username : 'Chats'}>
        {active ? (
          <Thread conv={active} onBack={() => setConv(null)} />
        ) : (
          <div className="space-y-4">
            {pending.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-bold uppercase tracking-wide text-mute">Requests</div>
                {pending.map((r) => (
                  <div key={r.id} className="mb-2 flex items-center gap-3 rounded-2xl border border-line bg-panel-2 p-2">
                    <Avatar look={r.from.avatar} size={40} crop="bust" />
                    <span className="flex-1 truncate font-semibold">{r.from.username}</span>
                    <Button size="sm" onClick={() => respond.mutate({ id: r.id, accept: true })}>Accept</Button>
                    <Button size="sm" variant="ghost" onClick={() => respond.mutate({ id: r.id, accept: false })}>No</Button>
                  </div>
                ))}
              </div>
            )}
            <div>
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-mute">Your chats</div>
              {(convs.data ?? []).length === 0 && (
                <p className="text-sm text-mute">No chats yet. After a game, tap &quot;Chat&quot; on a player to send a request. They must accept before you can message.</p>
              )}
              {(convs.data ?? []).map((c) => {
                const n = unread[c.id] ?? 0;
                return (
                  <button key={c.id} onClick={() => setConv(c.id)} className="mb-2 flex w-full items-center gap-3 rounded-2xl border border-line bg-panel-2 p-2 text-left hover:border-brand/50">
                    <Avatar look={c.with.avatar} size={40} crop="bust" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{c.with.username}</span>
                      {c.last && <span className={cn('block truncate text-xs', n ? 'font-bold text-ink' : 'text-mute')}>{c.last.sender_id === myId ? 'You: ' : ''}{c.last.body}</span>}
                    </span>
                    {n > 0 && <span className="flex min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[11px] font-bold leading-5">{n > 9 ? '9+' : n}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function Thread({ conv, onBack }: { conv: Conversation; onBack: () => void }) {
  const myId = useSession((s) => s.session?.user.id);
  const markRead = useChatUi((s) => s.markRead);
  const toast = useToast.getState().push;
  const [text, setText] = useState('');
  const bottom = useRef<HTMLDivElement>(null);
  const messages = useQuery({
    queryKey: ['chat', 'messages', conv.id],
    queryFn: () => api<Message[]>(`/api/chat/conversations/${conv.id}/messages`),
  });
  const list = messages.data;
  const lastId = list && list.length ? list[list.length - 1].id : undefined;

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' });
  }, [list?.length]);
  // viewing a thread clears its unread count
  useEffect(() => {
    markRead(conv.id, lastId);
  }, [conv.id, lastId, markRead]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setText('');
    try {
      await emitAck('dm:send', { conversationId: conv.id, body });
    } catch (err) {
      setText(body);
      toast(errorText(err), 'bad');
    }
  }
  async function moderate(kind: 'block' | 'report', person: ChatPerson) {
    try {
      await api(`/api/chat/${kind}`, { body: kind === 'block' ? { username: person.username } : { username: person.username, reason: 'Reported from chat' } });
      toast(kind === 'block' ? `Blocked ${person.username}` : 'Report sent. Thank you.', 'good');
      if (kind === 'block') onBack();
    } catch (err) {
      toast(errorText(err), 'bad');
    }
  }

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center justify-between text-sm font-semibold">
        <button onClick={onBack} className="text-brand">← Back</button>
        <div className="flex gap-3 text-mute">
          <button onClick={() => moderate('report', conv.with)} className="hover:text-ink">Report</button>
          <button onClick={() => moderate('block', conv.with)} className="hover:text-danger">Block</button>
        </div>
      </div>
      <div className="h-72 space-y-2 overflow-y-auto rounded-2xl border border-line bg-night/60 p-3">
        {(list ?? []).map((m) => (
          <div key={m.id} className={cn('max-w-[80%] rounded-2xl px-3 py-2 text-sm', m.sender_id === myId ? 'ml-auto bg-brand text-[#04110b]' : 'bg-panel-2')}>
            {m.body}
          </div>
        ))}
        <div ref={bottom} />
      </div>
      <form onSubmit={send} className="mt-2 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} maxLength={500} placeholder="Say something nice…" className="h-11 flex-1 rounded-2xl border border-line bg-panel-2 px-4 outline-none focus:border-brand" />
        <Button type="submit" size="md">Send</Button>
      </form>
    </div>
  );
}