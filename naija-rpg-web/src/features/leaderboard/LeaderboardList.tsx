import Link from 'next/link';
import { Avatar } from '@/features/avatar/Avatar';
import { cn } from '@/lib/utils';
import type { TopPlayer } from '../../types';

const MEDAL = ['🥇', '🥈', '🥉'];

export function LeaderboardList({ rows, me }: { rows: TopPlayer[]; me?: string }) {
  if (!rows.length) return <p className="py-10 text-center text-mute">Nobody on the board yet. Be the first!</p>;
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <Link
          key={r.username}
          href={`/profile/${r.username}`}
          className={cn('flex items-center gap-3 rounded-2xl border p-3 transition hover:border-brand/50', r.username === me ? 'border-brand bg-brand/10' : 'border-line bg-panel')}
        >
          <span className="w-8 text-center font-display text-lg font-extrabold text-mute">{MEDAL[r.rank - 1] ?? r.rank}</span>
          <Avatar look={r.avatar} size={40} crop="bust" />
          <span className="flex-1 truncate font-semibold">{r.username}</span>
          <span className="text-right">
            <span className="block font-display font-extrabold text-gold">{r.score}</span>
            <span className="block text-[11px] text-mute">{r.wins} wins</span>
          </span>
        </Link>
      ))}
    </div>
  );
}