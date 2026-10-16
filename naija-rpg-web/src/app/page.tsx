'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useConn } from '@/stores/connection';
import { useSession } from '@/stores/session';
import { useToast } from '@/stores/toast';
import { Button } from '@/components/ui/Button';
import { StatsStrip } from '@/features/landing/StatsStrip';
import { TopThree } from '@/features/landing/TopThree';
import { HeroCard } from '@/features/landing/HeroCard';
import { HowItWorks } from '@/features/landing/HowItWorks';
import type { Landing } from '@/types';

export default function Home() {
  const router = useRouter();
  const qc = useQueryClient();
  const live = useConn((s) => s.liveUsers);
  const [starting, setStarting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['landing'],
    queryFn: () => api<Landing>('/api/stats/landing', { auth: false }),
    refetchInterval: 30_000,
  });

  useEffect(() => {
    // remember a referral link until a player exists
    const ref = new URLSearchParams(window.location.search).get('ref');
    if (ref) localStorage.setItem('nrpg_ref', ref.toUpperCase());
    // count one visit per browser session
    if (!sessionStorage.getItem('nrpg_visit')) {
      sessionStorage.setItem('nrpg_visit', '1');
      api('/api/stats/visit', { method: 'POST', auth: false })
        .then(() => qc.invalidateQueries({ queryKey: ['landing'] }))
        .catch(() => {});
    }
  }, [qc]);

  async function play() {
    setStarting(true);
    try {
      await useSession.getState().ensureSession();
      router.push('/play');
    } catch {
      setStarting(false);
      useToast.getState().push("Couldn't start. Check your network and try again.", 'bad');
    }
  }

  return (
    <div className="space-y-10">
      <section className="grid items-center gap-8 pt-4 md:grid-cols-2">
        <div>
          <p className="mb-3 inline-block rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
            Free in your browser
          </p>
          <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
            Pick a move.
            <br />
            <span className="text-brand">Roll the dice.</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-mute">
            A street boss wants your money. What do you do? Play short 2-minute stories from Nigerian life, against your friends or with them.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" loading={starting} onClick={play}>
              Play now
            </Button>
            <Button size="lg" variant="ghost" onClick={play}>
              Challenge a friend
            </Button>
          </div>
        </div>
        <HeroCard />
      </section>

      <StatsStrip live={live ?? data?.liveUsers ?? 0} visits={data?.totalVisits ?? 0} topScore={data?.topPlayers[0]?.score ?? 0} />
      <TopThree players={data?.topPlayers ?? []} loading={isLoading} />
      <HowItWorks />
      <footer className="pb-4 text-center text-xs text-mute">Naija RPG · Roll responsibly 🎲</footer>
    </div>
  );
}