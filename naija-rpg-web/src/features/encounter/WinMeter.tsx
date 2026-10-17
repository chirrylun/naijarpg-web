import { cn } from '@/lib/utils';
import type { RoomState } from '../../types';

/** One quiet line: what you are playing for, and the story bonus. */
export function WinMeter({ room, myId }: { room: RoomState; myId?: string }) {
  const me = room.players.find((p) => p.userId === myId);
  const kept = me?.bonusKept ?? true;
  return (
    <p className="flex flex-wrap items-center justify-center gap-x-2 text-xs text-mute">
      <span>
        {room.mode === 'coop' ? 'Make it' : 'Win'}: <b className="text-gold">{room.win.points} pts + {room.win.stars}★</b>
      </span>
      {room.bonus && (
        <>
          <span aria-hidden>·</span>
          <span>
            Bonus: {room.bonus.label} <b className={cn(kept ? 'text-brand' : 'text-danger')}>{kept ? '✓' : '✕ lost'}</b>
          </span>
        </>
      )}
    </p>
  );
}
