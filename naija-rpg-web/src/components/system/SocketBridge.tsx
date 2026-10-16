'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket } from '@/lib/socket';
import { useConn } from '@/stores/connection';
import { useGame } from '@/stores/game';
import { useSession } from '@/stores/session';
import { useToast } from '@/stores/toast';
import { useChatUi } from '@/stores/chatUi';
import type { ChatPerson, Conversation, PrivateRoll, FinishedPayload, Message, Profile, RoomState, RoundResult } from '@/types';

export function SocketBridge() {
  const router = useRouter();
  const qc = useQueryClient();
  const userId = useSession((s) => s.session?.user.id);

  const loginRef = useRef<() => void>(() => {});
  const lastUser = useRef<string | undefined>(undefined);

  useEffect(() => {
    const s = getSocket();
    const toast = useToast.getState().push;

    const login = () => {
      const token = useSession.getState().session?.access_token;
      if (!s.connected || !token) return;
      s.emit('auth:login', { token }, (r: { ok: boolean }) => useConn.setState({ authed: !!r?.ok }));
    };
    loginRef.current = login;

    const onConnect = () => {
      useConn.setState({ connected: true });
      login();
    };
    const onDisconnect = () => useConn.setState({ connected: false, authed: false });
    const onLive = (d: { liveUsers: number }) => useConn.setState({ liveUsers: d.liveUsers });

    const onRoom = (room: RoomState) => {
      useGame.getState().setRoom(room);
      const target = `/play/${room.id}`;
      // read the current path at event time, so no URL hook is needed during the build
      if (window.location.pathname !== target) router.push(target);
    };
    const onResult = (r: RoundResult) => useGame.getState().setResult(r);
    // 2. add the handler next to onResult
const onRoll = (r: PrivateRoll) => useGame.getState().setMyRoll(r);
    const onFinished = (f: FinishedPayload) => {
      useGame.getState().setFinished(f);
      // the server saves scores a moment after announcing the result
      setTimeout(() => {
        qc.invalidateQueries({ queryKey: ['me'] });
        qc.invalidateQueries({ queryKey: ['leaderboard'] });
        qc.invalidateQueries({ queryKey: ['landing'] });
      }, 2500);
    };
    const onRematchStatus = (d: { ready: string[] }) => useGame.getState().setRematch(d.ready);
    const onRematchStart = () => useGame.getState().reset();

    const onStarsUpdate = (d: { stars: number }) =>
      qc.setQueriesData<Profile>({ queryKey: ['me'] }, (old) => (old ? { ...old, stars: d.stars } : old));
    const onStarsRefresh = () => {
      qc.invalidateQueries({ queryKey: ['me'] });
      qc.invalidateQueries({ queryKey: ['stars'] });
    };

    const onChatRequest = (d: { from?: ChatPerson }) => {
      toast(`${d.from?.username ?? 'Someone'} wants to chat`, 'info');
      qc.invalidateQueries({ queryKey: ['chat', 'requests'] });
    };
    const onChatAccepted = () => {
      toast('Chat request accepted 🎉', 'good');
      qc.invalidateQueries({ queryKey: ['chat', 'conversations'] });
    };
    const onDm = (m: Message & { conversationId: string }) => {
  qc.setQueryData<Message[]>(['chat', 'messages', m.conversationId], (old) =>
    old && !old.some((x) => x.id === m.id) ? [...old, m] : old,
  );
  // keep the chat list's preview and ordering fresh without refetching
  qc.setQueryData<Conversation[]>(['chat', 'conversations'], (old) =>
    old
      ?.map((c) => (c.id === m.conversationId ? { ...c, last: m } : c))
      .sort((a, b) => (b.last?.id ?? 0) - (a.last?.id ?? 0)),
  );
  const me = useSession.getState().session?.user.id;
  const ui = useChatUi.getState();
  const viewing = ui.open && ui.convId === m.conversationId;
  if (m.sender_id !== me && !viewing) {
    ui.bump(m.conversationId);
    toast('New message 💬', 'info');
  }
};

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.on('stats:live', onLive);
    s.on('room:state', onRoom);
    s.on('round:result', onResult);
    s.on('roll:private', onRoll);
    s.on('encounter:finished', onFinished);
    s.on('rematch:status', onRematchStatus);
    s.on('rematch:start', onRematchStart);
    s.on('stars:update', onStarsUpdate);
    s.on('stars:refresh', onStarsRefresh);
    s.on('chat:request', onChatRequest);
    s.on('chat:accepted', onChatAccepted);
    s.on('dm:message', onDm);

    if (!s.connected) s.connect();
    else login();

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off('stats:live', onLive);
      s.off('room:state', onRoom);
      s.off('roll:private', onRoll);
      s.off('round:result', onResult);
      s.off('encounter:finished', onFinished);
      s.off('rematch:status', onRematchStatus);
      s.off('rematch:start', onRematchStart);
      s.off('stars:update', onStarsUpdate);
      s.off('stars:refresh', onStarsRefresh);
      s.off('chat:request', onChatRequest);
      s.off('chat:accepted', onChatAccepted);
      s.off('dm:message', onDm);
    };
  }, [router, qc]);

  // Player changed (guest created, signed in, signed out): re-login the socket cleanly
  useEffect(() => {
    const s = getSocket();
    const previous = lastUser.current;
    lastUser.current = userId;
    if (previous && previous !== userId) {
      useConn.setState({ authed: false });
      useGame.getState().reset();
      s.disconnect().connect();
    } else if (userId) {
      loginRef.current();
    }
  }, [userId]);

  return null;
}