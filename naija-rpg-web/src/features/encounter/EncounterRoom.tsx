'use client';

import { PlayerBar } from './PlayerBar';
import { ScenarioCard } from './ScenarioCard';
import { ChoicePanel } from './ChoicePanel';
import { EdgePanel } from './EdgePanel';
import { RoundReveal } from './RoundReveal';
import { RoundTimer } from './RoundTimer';
import { MarkChips } from './StoryBits';
import { WinMeter } from './WinMeter';
import { Stage } from '../stage/Stage';
import { useStageSequence } from '../stage/useStageSequence';
import { cn } from '@/lib/utils';
import { useGame } from '@/stores/game';
import { useSession } from '@/stores/session';
import type { RoomState } from '../../types';

export function EncounterRoom({ room }: { room: RoomState }) {
  const myId = useSession((s) => s.session?.user.id);
  const result = useGame((s) => s.result);
  const deadline = useGame((s) => s.localDeadline);
  const me = room.players.find((p) => p.userId === myId);
  const timerPhase = room.phase === 'edge' ? 'edge' : 'choose';
  const seq = useStageSequence({
    scenarioId: room.scenario.id,
    sceneKey: room.scene?.key,
    round: room.round,
    // rejoining during the edge phase or the reveal: go straight to the scene
    skipOpening: room.phase !== 'choose' || !!result,
  });
  const timerMs = (timerPhase === 'edge' ? room.edgeSeconds : room.roundSeconds) * 1000;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="rounded-full bg-panel-2 px-3 py-1 text-mute">
          Scene {room.round}/{room.maxRounds}
        </span>
        <MarkChips marks={room.world} />
        <span className="rounded-full bg-panel-2 px-3 py-1 uppercase tracking-wide text-brand">
          {room.solo ? 'Solo' : `${room.format} · ${room.mode === 'coop' ? 'Co-op' : room.mode === 'team' ? 'Teams' : 'Face off'}`}
        </span>
      </div>
      <WinMeter room={room} myId={myId} />
      <PlayerBar room={room} myId={myId} />
      {room.scene && <Stage seq={seq} solo={room.solo} />}
      <ScenarioCard room={room} ready={seq.ready} />
      {!result && room.phase !== 'reveal' && (
        <div className="sticky top-14 z-30 -mx-2 rounded-2xl border border-line bg-night/95 px-3 py-2 backdrop-blur">
          <RoundTimer deadline={deadline} totalMs={timerMs} locked={!!me?.acted} phase={timerPhase} />
        </div>
      )}
      {result ? (
        <RoundReveal key={`reveal-${result.round}`} room={room} result={result} myId={myId} />
      ) : room.phase === 'edge' ? (
        <EdgePanel key={`${room.id}:${room.round}`} />
      ) : (
        <div className={cn('transition-opacity duration-300', !seq.ready && 'pointer-events-none opacity-0')}>
          <ChoicePanel key={`${room.id}:${room.round}`} room={room} acted={!!me?.acted} />
        </div>
      )}
    </div>
  );
}