'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LeaderboardList } from '@/features/leaderboard/LeaderboardList';
import { Skeleton } from '@/components/ui/Skeleton';
import { useMe } from '@/hooks/useMe';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { TopPlayer } from '@/types';

type Period = 'week' | 'all';

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('week');
  const { data: me } = useMe();
  const board = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => api<{ rows: TopPlayer[] }>(`/api/leaderboard?period=${period}&limit=50`, { auth: false }),
    refetchInterval: 30_000,
  });
  const mine = useQuery({
    queryKey: ['leaderboard', 'me', period, me?.id],
    queryFn: () => api<{ rank: number | null; score: number }>(`/api/leaderboard/me?period=${period}`),
    enabled: !!me,
  });

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div>
        <h1 className="font-display text-3xl font-extrabold">Leaderboard</h1>
        <p className="text-sm text-mute">The weekly board resets every week, so anyone can climb.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-panel p-1">
        {(['week', 'all'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn('rounded-xl py-2 text-sm font-bold transition', period === p ? 'bg-brand text-[#04110b]' : 'text-mute')}
          >
            {p === 'week' ? 'This week' : 'All time'}
          </button>
        ))}
      </div>

      {me && (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-3 text-center text-sm font-semibold">
          {mine.data?.rank ? `You're #${mine.data.rank} with ${mine.data.score} points` : 'Play a game to get on the board'}
        </div>
      )}

      {board.isLoading ? (
        <div className="space-y-2">{[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-16" />)}</div>
      ) : (
        <LeaderboardList rows={board.data?.rows ?? []} me={me?.username} />
      )}
    </div>
  );
}