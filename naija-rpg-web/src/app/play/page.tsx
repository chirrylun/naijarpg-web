'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/features/avatar/Avatar';
import { ReferralCard } from '@/features/referrals/ReferralCard';
import { useMe } from '@/hooks/useMe';
import { useRequireSession } from '@/hooks/useRequireSession';
import { api, errorText } from '@/lib/api';
import { MODE_CARDS } from '@/lib/constants';
import { emitAck, ensureReady, getSocket } from '@/lib/socket';
import { cn } from '@/lib/utils';
import { useToast } from '@/stores/toast';
import type { Daily, Format, Mode } from '@/types';

type Queued = { matched: boolean; roomId?: string };

export default function PlayPage() {
  useRequireSession();
  const router = useRouter();
  const { data: me } = useMe();
  const daily = useQuery({ queryKey: ['daily'], queryFn: () => api<Daily>('/api/daily', { auth: false }) });
  const [picked, setPicked] = useState(MODE_CARDS[0].id);
  const [searching, setSearching] = useState(false);
  const [busy, setBusy] = useState(false);
  const searchingRef = useRef(false);
  const toast = useToast.getState().push;
  const card = MODE_CARDS.find((m) => m.id === picked)!;

  useEffect(() => {
    searchingRef.current = searching;
  }, [searching]);
  // leaving the page while queued: leave the queue too
  useEffect(
    () => () => {
      if (searchingRef.current) getSocket().emit('queue:leave', {});
    },
    [],
  );

  async function quick(mode: Mode, format: Format, isDaily = false) {
    setSearching(true);
    try {
      const r = await emitAck<Queued>('queue:join', { mode, format, ...(isDaily ? { daily: true } : {}) });
      if (r.matched && r.roomId) router.push(`/play/${r.roomId}`);
    } catch (e) {
      setSearching(false);
      toast(errorText(e), 'bad');
    }
  }
  async function cancel() {
    setSearching(false);
    try {
      await emitAck('queue:leave');
    } catch {
      /* ignore */
    }
  }
  async function challenge() {
    setBusy(true);
    try {
      await ensureReady();
      const r = await api<{ roomId: string }>('/api/encounters/invite', { body: { mode: card.mode, format: card.format } });
      router.push(`/play/${r.roomId}`);
    } catch (e) {
      toast(errorText(e), 'bad');
    } finally {
      setBusy(false);
    }
  }
  function playDaily() {
    const d = daily.data;
    if (!d) return;
    const mode = d.scenario.modes[0];
    void quick(mode, mode === 'team' ? '2v2' : '1v1', true);
  }

  if (searching) {
    return (
      <Card className="mx-auto mt-10 max-w-sm space-y-4 py-10 text-center">
        <div className="mx-auto size-14 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        <div className="font-display text-xl font-extrabold">Looking for a player…</div>
        <p className="px-4 text-sm text-mute">Early days, so it can take a minute. Sending a friend a challenge link starts a game instantly.</p>
        <Button variant="ghost" onClick={cancel}>
          Cancel
        </Button>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {me && (
        <Card className="flex items-center gap-3">
          <Avatar look={me.avatar} size={52} crop="bust" />
          <div className="flex-1">
            <div className="font-display text-lg font-extrabold">Hey, {me.username}</div>
            <div className="text-sm text-mute">
              {me.streak > 0 ? `🔥 ${me.streak}-day streak. Play today to keep it.` : 'Play today to start a streak.'}
            </div>
          </div>
          <Link href="/shop" className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-bold text-gold">
            ★ {me.stars}
          </Link>
        </Card>
      )}

      {daily.data && (
        <Card className="border-gold/40 bg-gold/5">
          <p className="text-xs font-bold uppercase tracking-wider text-gold">Today&apos;s Gist · same for everyone</p>
          <div className="mt-1 font-display text-2xl font-extrabold">{daily.data.scenario.title}</div>
          <p className="text-sm text-mute">{daily.data.scenario.tagline}</p>
          <Button className="mt-3" variant="gold" onClick={playDaily}>
            Play today&apos;s Gist
          </Button>
        </Card>
      )}

      <section>
        <h2 className="mb-3 font-display text-2xl font-extrabold">Pick a mode</h2>
        <div className="grid grid-cols-2 gap-3">
          {MODE_CARDS.map((m) => (
            <button
              key={m.id}
              onClick={() => setPicked(m.id)}
              className={cn('rounded-3xl border p-4 text-left transition', picked === m.id ? 'border-brand bg-brand/10' : 'border-line bg-panel hover:border-brand/40')}
            >
              <div className="text-xs font-bold uppercase tracking-wide text-brand">{m.tag}</div>
              <div className="font-display text-lg font-extrabold">{m.name}</div>
              <p className="mt-1 text-xs text-mute">{m.blurb}</p>
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button size="lg" variant="gold" loading={busy} onClick={challenge}>
            Challenge a friend
          </Button>
          <Button size="lg" onClick={() => quick(card.mode, card.format)}>
            Quick match
          </Button>
        </div>
      </section>

      <ReferralCard />
    </div>
  );
}