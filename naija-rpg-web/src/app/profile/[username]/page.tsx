'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, btn } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/features/avatar/Avatar';
import { SaveProgress } from '@/features/account/SaveProgress';
import { ReferralCard } from '@/features/referrals/ReferralCard';
import { requestChat } from '@/features/chat/requestChat';
import { useMe } from '@/hooks/useMe';
import { api, errorText } from '@/lib/api';
import { APPROACHES } from '@/lib/constants';
import { winRate } from '@/lib/utils';
import { useSession } from '@/stores/session';
import { useToast } from '@/stores/toast';
import type { Approach, PublicProfile } from '@/types';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const { data: me } = useMe();
  const isMe = me?.username === username;
  const [saveOpen, setSaveOpen] = useState(false);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const other = useQuery({
    queryKey: ['player', username],
    queryFn: () => api<PublicProfile>(`/api/players/${encodeURIComponent(username)}`, { auth: false }),
    enabled: !isMe,
    retry: false,
  });
  const p: PublicProfile | undefined = isMe && me ? me : other.data;

  async function rename(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(name)) return useToast.getState().push('3-16 letters, numbers or underscores', 'bad');
    setBusy(true);
    try {
      await api('/api/me', { method: 'PATCH', body: { username: name } });
      await qc.invalidateQueries({ queryKey: ['me'] });
      useToast.getState().push('Username updated', 'good');
      router.replace(`/profile/${name}`);
    } catch (err) {
      useToast.getState().push(errorText(err), 'bad');
    } finally {
      setBusy(false);
    }
  }

  if (!p) {
    return other.isError ? (
      <Card className="mx-auto mt-10 max-w-sm py-10 text-center">
        <div className="font-display text-xl font-extrabold">Player not found</div>
        <Link href="/leaderboard" className={btn('primary', 'md', 'mt-3')}>
          See the leaderboard
        </Link>
      </Card>
    ) : (
      <Skeleton className="mx-auto h-72 max-w-xl" />
    );
  }

  const r = p.record;
  const tiles = [
    ['Score', r?.score ?? 0],
    ['Wins', r?.wins ?? 0],
    ['Losses', r?.losses ?? 0],
    ['Win rate', `${winRate(r?.wins ?? 0, r?.encounters_played ?? 0)}%`],
  ];

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Card className="flex flex-col items-center py-6 text-center">
        <Avatar look={p.avatar} size={120} />
        <h1 className="mt-2 font-display text-3xl font-extrabold">{p.username}</h1>
        {p.title && <span className="mt-1 rounded-full bg-gold/15 px-3 py-0.5 text-xs font-bold text-gold">{p.title}</span>}
        {p.streak > 0 && <div className="mt-2 text-sm font-semibold">🔥 {p.streak}-day streak</div>}
        {!isMe && (
          <Button className="mt-3" size="sm" variant="ghost" onClick={() => requestChat(p.username)}>
            💬 Request chat
          </Button>
        )}
      </Card>

      <div className="grid grid-cols-4 gap-2">
        {tiles.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-line bg-panel p-3 text-center">
            <div className="font-display text-xl font-extrabold">{value}</div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-mute">{label}</div>
          </div>
        ))}
      </div>

      {isMe && me && (
        <>
          <Link href="/shop?tab=cosmetics" className={btn('gold', 'lg', 'w-full')}>
            Change my look
          </Link>

          <Card>
            <form onSubmit={rename} className="flex gap-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New username" maxLength={16} className="h-11 flex-1 rounded-2xl border border-line bg-panel-2 px-4 outline-none focus:border-brand" />
              <Button type="submit" loading={busy}>Save</Button>
            </form>
          </Card>

          <ReferralCard />

          {me.is_guest ? (
            <Card className="border-brand/30 bg-brand/5 text-center">
              <div className="font-display text-lg font-extrabold">You&apos;re playing as a guest</div>
              <p className="mt-1 text-sm text-mute">Create an account to keep your stars, streak and rank.</p>
              <Button className="mt-3" onClick={() => setSaveOpen(true)}>Save my progress</Button>
            </Card>
          ) : (
            <Button
              variant="ghost"
              className="w-full"
              onClick={async () => {
                await useSession.getState().signOut();
                qc.clear();
                router.push('/');
              }}
            >
              Sign out
            </Button>
          )}
          <SaveProgress open={saveOpen} onClose={() => setSaveOpen(false)} />
        </>
      )}
    </div>
  );
}