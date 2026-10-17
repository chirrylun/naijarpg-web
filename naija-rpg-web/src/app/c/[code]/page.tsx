'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button, btn } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { api, errorText } from '@/lib/api';
import { MODE_CARDS } from '@/lib/constants';
import { emitAck } from '@/lib/socket';
import { useToast } from '@/stores/toast';
import type { InviteInfo } from '../../../types';

export default function ChallengePage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const invite = useQuery({
    queryKey: ['invite', code],
    queryFn: () => api<InviteInfo>(`/api/encounters/invite/${code}`, { auth: false }),
    retry: false,
  });

  async function accept() {
    setBusy(true);
    try {
      const r = await emitAck<{ roomId: string }>('room:join', { code });
      router.push(`/play/${r.roomId}`);
    } catch (e) {
      setBusy(false);
      useToast.getState().push(errorText(e), 'bad');
    }
  }

  if (invite.isLoading) return <Skeleton className="mx-auto mt-10 h-64 max-w-md" />;

  if (invite.isError || !invite.data) {
    return (
      <Card className="mx-auto mt-10 max-w-md space-y-3 py-10 text-center">
        <div className="text-5xl">⌛</div>
        <h1 className="font-display text-2xl font-extrabold">This challenge has expired</h1>
        <p className="text-sm text-mute">Ask your friend for a fresh link, or start your own game.</p>
        <Link href="/play" className={btn('primary', 'md', 'mt-2')}>
          Play now
        </Link>
      </Card>
    );
  }

  const i = invite.data;
  const mode = MODE_CARDS.find((m) => m.mode === i.mode && m.format === i.format)?.name ?? i.mode;
  const open = i.status === 'waiting' && i.seatsLeft > 0;

  return (
    <Card className="mx-auto mt-6 max-w-md space-y-4 py-8 text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-gold">You&apos;ve been challenged</p>
      <h1 className="font-display text-3xl font-extrabold">{i.host ?? 'A player'} wants a game</h1>
      <div className="rounded-2xl border border-line bg-panel-2 p-4 text-left">
        <div className="text-xs font-bold uppercase text-brand">{mode} · {i.format}</div>
        <div className="font-display text-xl font-extrabold">{i.scenario.title}</div>
        <p className="text-sm text-mute">{i.scenario.tagline}</p>
      </div>
      {open ? (
        <>
          <Button size="lg" className="w-full" loading={busy} onClick={accept}>
            Accept challenge
          </Button>
          <p className="text-xs text-mute">No signup needed. You can save your progress after your first game.</p>
        </>
      ) : (
        <p className="font-semibold text-danger">This game already started or is full.</p>
      )}
    </Card>
  );
}