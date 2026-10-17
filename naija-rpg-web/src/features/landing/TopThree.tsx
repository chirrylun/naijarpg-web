import Link from 'next/link';
import { motion } from 'framer-motion';
import { Avatar } from '@/features/avatar/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import type { TopPlayer } from '@/types';

const MEDAL = ['🥇', '🥈', '🥉'];

export function TopThree({ players, loading }: { players: TopPlayer[]; loading: boolean }) {
  const order = [1, 0, 2]; // podium: 2nd, 1st, 3rd
  return (
    <section>
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl font-extrabold">Top 3 legends</h2>
        <Link href="/leaderboard" className="text-sm font-bold text-brand hover:underline">
          Full leaderboard →
        </Link>
      </div>
      <div className="ankara-strip mb-4 mt-2 h-1.5 w-16 rounded-full" aria-hidden />
      <div className="grid grid-cols-3 items-end gap-3">
        {order.map((i) => {
          const p = players[i];
          const first = i === 0;
          if (loading) return <Skeleton key={i} className={first ? 'h-56' : 'h-44'} />;
          return (
            <motion.div
              key={i}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i }}
              // podium steps: 1st stands tallest, 3rd shortest
              className={cn(
                'relative flex flex-col items-center overflow-hidden rounded-3xl border p-3 text-center',
                first
                  ? 'min-h-56 border-gold bg-gradient-to-b from-gold/25 to-panel pb-5 pt-5 shadow-[0_0_32px_-8px_var(--color-gold)]'
                  : i === 1
                    ? 'ankara-dots min-h-48 border-line bg-panel pt-4'
                    : 'ankara-dots min-h-44 border-line bg-panel pt-4',
                !p && 'border-dashed',
              )}
            >
              {first && <div className="ankara-strip absolute inset-x-0 top-0 h-1.5" aria-hidden />}
              <div className="text-2xl">{MEDAL[i]}</div>
              {p ? (
                <Link href={`/profile/${p.username}`} className="flex flex-col items-center">
                  <Avatar look={p.avatar} size={first ? 78 : 62} crop="bust" />
                  <div className="mt-1 max-w-full truncate text-sm font-bold">{p.username}</div>
                  <div className="font-display text-lg font-extrabold text-gold">{p.score}</div>
                  <div className="text-[11px] text-mute">{p.wins} wins</div>
                </Link>
              ) : (
                <div className="py-6 text-xs font-semibold text-mute">Could be you</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}