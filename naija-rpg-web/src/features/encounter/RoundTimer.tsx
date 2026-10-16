'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { cn } from '@/lib/utils';

const COPY = {
  choose: { idle: 'Pick your move', tense: 'Choose now or the dice choose for you!', locked: 'Locked in ✓ waiting for the others' },
  edge: { idle: 'Use an edge, or keep your roll', tense: 'Decide now or you keep your roll!', locked: 'Decided ✓ waiting for the others' },
};

export function RoundTimer({
  deadline,
  totalMs,
  locked,
  phase,
}: {
  deadline: number | null;
  totalMs: number;
  locked: boolean;
  phase: 'choose' | 'edge';
}) {
  const { secs, frac } = useCountdown(deadline, totalMs);
  if (!deadline) return null;

  const tense = !locked && secs <= (phase === 'edge' ? 5 : 10);
  const panic = !locked && secs <= 5;
  const color = locked ? 'bg-mute/50' : frac > 0.5 ? 'bg-brand' : frac > 0.25 ? 'bg-gold' : 'bg-danger';
  const copy = COPY[phase];

  return (
    <div className="space-y-1.5">
      <div className="flex items-end justify-between text-xs font-bold">
        <span className={cn('uppercase tracking-wide', locked ? 'text-brand' : tense ? 'text-danger' : 'text-mute')}>
          {locked ? copy.locked : tense ? copy.tense : copy.idle}
        </span>
        <span className={cn('font-display text-lg font-extrabold tabular-nums', panic ? 'animate-pulse text-danger' : tense ? 'text-gold' : 'text-ink')}>
          {secs}s
        </span>
      </div>
      <div className={cn('h-3.5 overflow-hidden rounded-full bg-panel-2 ring-1 ring-line', panic && 'ring-danger/60')}>
        <div
          className={cn('h-full rounded-full transition-[width] duration-200 ease-linear', color, panic && 'animate-pulse')}
          style={{ width: `${frac * 100}%` }}
        />
      </div>
    </div>
  );
}