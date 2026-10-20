'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatsDashboard } from '@/features/stats/StatsDashboard';
import type { AdminStats } from '@/features/stats/types';
import { useMe } from '@/hooks/useMe';
import { ApiError, api } from '@/lib/api';
import { useSession } from '@/stores/session';

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md space-y-3 rounded-3xl border border-line bg-panel p-6 text-center">
      <h1 className="font-display text-2xl font-extrabold">{title}</h1>
      <div className="space-y-2 text-sm text-mute">{children}</div>
      <Link href="/" className="inline-block rounded-xl bg-panel-2 px-4 py-2 text-sm font-bold">
        Back home
      </Link>
    </div>
  );
}

export default function StatsPage() {
  const [days, setDays] = useState(30);
  const session = useSession((s) => s.session);
  const ready = useSession((s) => s.ready);
  const { data: me } = useMe();

  const stats = useQuery({
    queryKey: ['admin-stats', days],
    queryFn: () => api<AdminStats>(`/api/stats/admin?days=${days}`),
    enabled: !!session,
    refetchInterval: 30_000,
    retry: false,
    placeholderData: (prev) => prev, // keep the old numbers on screen while a new range loads
  });

  if (ready && !session) return <Notice title="Sign in first">This page is for the game owner. Sign in with your account to continue.</Notice>;

  if (stats.error instanceof ApiError && stats.error.status === 403) {
    return (
      <Notice title="Not allowed">
        <p>Your account is not on the owner list.</p>
        {me?.id && (
          <>
            <p>To get access, add this ID to <b className="text-ink">ADMIN_USER_IDS</b> on the server and restart it:</p>
            <code className="block break-all rounded-xl bg-night p-2 text-xs text-ink">{me.id}</code>
          </>
        )}
      </Notice>
    );
  }

  if (stats.error) {
    return (
      <Notice title="Couldn't load stats">
        <p>Something went wrong on the server. Try again in a moment.</p>
        <button onClick={() => stats.refetch()} className="rounded-xl bg-brand px-4 py-2 text-sm font-bold text-[#04110b]">
          Try again
        </button>
      </Notice>
    );
  }

  if (!stats.data) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  return <StatsDashboard data={stats.data} days={days} setDays={setDays} fetching={stats.isFetching} />;
}
