'use client';

import { PlayerBar } from './PlayerBar';
import { ScenarioCard } from './ScenarioCard';
import { ChoicePanel } from './ChoicePanel';
import { RoundReveal } from './RoundReveal';
import { useGame } from '@/stores/game';
import { useSession } from '@/stores/session';
import type { RoomState } from '@/types';

export function EncounterRoom({ room }: { room: RoomState }) {
  const myId = useSession((s) => s.session?.user.id);
  const result = useGame((s) => s.result);
  const me = room.players.find((p) => p.userId === myId);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="rounded-full bg-panel-2 px-3 py-1 text-mute">
          Scene {room.round}/{room.maxRounds}
        </span>
        <span className="rounded-full bg-panel-2 px-3 py-1 uppercase tracking-wide text-brand">
          {room.format} · {room.mode === 'coop' ? 'Co-op' : room.mode === 'team' ? 'Teams' : 'Face off'}
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