import { Avatar } from '@/features/avatar/Avatar';
import { cn } from '@/lib/utils';
import type { RoomState } from '@/types';

export function PlayerBar({ room, myId }: { room: RoomState; myId?: string }) {
  const myTeam = room.players.find((p) => p.userId === myId)?.team;
  const teams = [...new Set(room.players.map((p) => p.team))].sort((a, b) => (a === myTeam ? -1 : b === myTeam ? 1 : a - b));

  return (
    <div className="flex gap-3">
      {teams.map((t) => (
        <div key={t} className={cn('flex-1 rounded-2xl border p-2', t === myTeam ? 'border-brand/40 bg-brand/5' : 'border-line bg-panel')}>
          <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-mute">
            {room.mode === 'coop' ? 'Your crew' : t === myTeam ? 'Your side' : 'Rivals'}
          </div>
          <div className="flex flex-wrap gap-2">
            {room.players
              .filter((p) => p.team === t)
              .map((p) => (
                <div key={p.userId} className="flex items-center gap-2">
                  <div className={cn('rounded-full ring-2', p.acted ? 'ring-brand' : 'ring-transparent')}>
                    <Avatar look={p.avatar} size={36} crop="bust" />
                  </div>
                  <div className="leading-tight">
                    <div className="max-w-24 truncate text-sm font-bold">{p.userId === myId ? 'You' : p.username}</div>
                    <div className={cn('text-[11px] font-semibold', p.acted ? 'text-brand' : 'text-mute')}>
                      {room.phase === 'edge' ? (p.acted ? 'Ready ✓' : 'Deciding…') : p.acted ? 'Locked in ✓' : 'Thinking…'}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}