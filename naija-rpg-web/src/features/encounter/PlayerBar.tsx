import { Avatar } from '@/features/avatar/Avatar';
import { cn } from '@/lib/utils';
import type { RoomState } from '../../types';

/** Players with their score right beside the avatar. Nothing else. */
export function PlayerBar({ room, myId }: { room: RoomState; myId?: string }) {
  const myTeam = room.players.find((p) => p.userId === myId)?.team;
  const teams = [...new Set(room.players.map((p) => p.team))].sort((a, b) => (a === myTeam ? -1 : b === myTeam ? 1 : a - b));

  return (
    <div className="flex gap-3">
      {teams.map((t) => (
        <div key={t} className={cn('flex flex-1 items-center justify-between gap-2 rounded-2xl border p-2', t === myTeam ? 'border-brand/40 bg-brand/5' : 'border-line bg-panel')}>
          <div className="flex min-w-0 flex-wrap gap-2">
            {room.players
              .filter((p) => p.team === t)
              .map((p) => (
                <div key={p.userId} className="flex min-w-0 items-center gap-2">
                  <div className={cn('shrink-0 rounded-full ring-2', p.acted ? 'ring-brand' : 'ring-transparent')}>
                    <Avatar look={p.avatar} size={36} crop="bust" />
                  </div>
                  <div className="min-w-0 leading-tight">
                    <div className="max-w-24 truncate text-sm font-bold">{p.userId === myId ? 'You' : p.username}</div>
                    <div className={cn('text-[11px] font-semibold', p.acted ? 'text-brand' : 'text-mute')}>
                      {room.phase === 'edge' ? (p.acted ? 'Ready ✓' : 'Deciding…') : p.acted ? 'Locked in ✓' : 'Thinking…'}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {room.wins && <span className="shrink-0 font-display text-3xl font-extrabold leading-none">{room.wins[t] ?? 0}</span>}
        </div>
      ))}
    </div>
  );
}
