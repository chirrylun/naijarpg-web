'use client';

import { PlayerBar } from './PlayerBar';
import { ScenarioCard } from './ScenarioCard';
import { ChoicePanel } from './ChoicePanel';
import { RoundReveal } from './RoundReveal';
import { useCountdown } from '@/hooks/useCountdown';
import { useGame } from '@/stores/game';
import { useSession } from '@/stores/session';
import { cn } from '@/lib/utils';
import type { RoomState } from '@/types';

export function EncounterRoom({ room }: { room: RoomState }) {
  const myId = useSession((s) => s.session?.user.id);
  const result = useGame((s) => s.result);
  const deadline = useGame((s) => s.localDeadline);
  const secs = useCountdown(deadline);
  const me = room.players.find((p) => p.userId === myId);
  const urgent = !result && !me?.acted && secs <= 5;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-panel-2 px-3 py-1 text-xs font-bold text-mute">
          Round {room.round}/{room.maxRounds}
        </span>
        <span className={cn('rounded-full px-3 py-1 text-sm font-black tabular-nums', urgent ? 'animate-pulse bg-danger/20 text-danger' : 'bg-panel-2')}>
          {result ? '🎲' : `${secs}s`}
        </span>
      </div>
      <PlayerBar room={room} myId={myId} />
      <ScenarioCard room={room} />
      {result ? (
        <RoundReveal room={room} result={result} myId={myId} />
      ) : (
        <ChoicePanel key={`${room.id}:${room.round}`} room={room} acted={!!me?.acted} />
      )}
    </div>
  );
}