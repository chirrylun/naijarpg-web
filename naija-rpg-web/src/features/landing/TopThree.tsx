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
      <div className="mb-3 flex items-end justify-between">
        <h2 className="font-display text-2xl font-extrabold">Top 3 legends</h2>
        <Link href="/leaderboard" className="text-sm font-bold text-brand hover:underline">
          Full leaderboard →
        </Link>
      </div>
      <div className="grid grid-cols-3 items-end gap-3">
        {order.map((i) => {
          const p = players[i];
          const first = i === 0;
          if (loading) return <Skeleton key={i} className={first ? 'h-52' : 'h-44'} />;
          return (
            <motion.div
              key={i}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i }}
              className={cn(
                'flex flex-col items-center rounded-3xl border p-3 text-center',
                first ? 'border-gold/50 bg-gold/10 pb-5 pt-4' : 'border-line bg-panel',
                !p && 'border-dashed',
              )}
            >
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