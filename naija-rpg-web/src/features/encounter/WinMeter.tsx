import { cn } from '@/lib/utils';
import type { RoomState } from '@/types';

/** What you are playing for, the score, and the story bonus. Plain on purpose. */
export function WinMeter({ room, myId }: { room: RoomState; myId?: string }) {
  const me = room.players.find((p) => p.userId === myId);
  const coop = room.mode === 'coop';
  const mine = me && room.wins ? (room.wins[me.team] ?? 0) : 0;
  const theirs = me && room.wins ? (room.wins[me.team === 0 ? 1 : 0] ?? 0) : 0;
  const rival = room.players.find((p) => p.team !== me?.team)?.username;
  const kept = me?.bonusKept ?? true;

  return (
    <div className="rounded-2xl border border-line bg-panel px-3 py-2.5 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold">
          {coop ? 'Make it together' : 'Win this game'}
          <span className="ml-2 font-bold text-gold">
            {room.win.points} pts + {room.win.stars}★
          </span>
        </span>
        {!coop && (
          <span className="shrink-0 font-display font-extrabold">
            You {mine} <span className="text-mute">-</span> {theirs} <span className="max-w-20 truncate align-bottom text-xs font-semibold text-mute">{rival ?? 'Rival'}</span>
          </span>
        )}
      </div>
      {room.bonus && (
        <div className="mt-1.5 flex items-center justify-between gap-3 border-t border-line pt-1.5 text-xs">
          <span className="text-mute">
            Bonus: <span className="font-semibold text-ink">{room.bonus.label}</span> · +{room.bonus.stars}★ +{room.bonus.points} pts
          </span>
          <span className={cn('shrink-0 font-bold', kept ? 'text-brand' : 'text-danger')}>{kept ? '✓ Still safe' : '✕ Lost'}</span>
        </div>
      )}
    </div>
  );
}
