'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SceneStyles } from '../scene/People';
import { cn } from '@/lib/utils';
import { drawArt } from './cast';
import { StageStyles } from './css';
import { DEFAULT_SCALE, beatSeconds } from './registry';
import { GROUND, H, W } from './scenery';
import { Backdrop } from './sets';
import { TRAVEL_SECONDS } from './useStageSequence';
import type { StageSeq } from './useStageSequence';
import type { ActorSpec, Beat, Pose } from './types';

/** Which way something is MOVING during a beat. Used to face it the right way. */
const MOVES: Partial<Record<Beat, 'L' | 'R'>> = {
  driveInL: 'R',
  walkInL: 'R',
  driveInR: 'L',
  walkInR: 'L',
  driveOutR: 'R',
  walkOffR: 'R',
  driveOutL: 'L',
  walkOffL: 'L',
};

const isWalkBeat = (b?: Beat) => b === 'walkInL' || b === 'walkInR' || b === 'walkOffL' || b === 'walkOffR';
const isDriveBeat = (b?: Beat) => b === 'driveInL' || b === 'driveInR' || b === 'driveOutL' || b === 'driveOutR';

function Actor({ spec, seq, solo }: { spec: ActorSpec; seq: StageSeq; solo: boolean }) {
  const reduced = useReducedMotion();
  if (spec.duo && solo) return null;
  const entering = seq.phase === 'enter' && !seq.skipped;
  const crossing = spec.idle === 'crossL' || spec.idle === 'crossR';
  const dir = spec.beat ? MOVES[spec.beat] : crossing ? (spec.idle === 'crossL' ? 'L' : 'R') : undefined;
  // a looping crosser would just stand in the road with motion off, so leave it out
  if (crossing && reduced) return null;
  const flip = spec.flip ?? dir === 'L';

  // legs only move while the actor is actually walking
  const walking = crossing || (entering && isWalkBeat(spec.beat));
  const pose: Pose = walking ? 'walk' : (spec.pose ?? 'stand');
  const moving = entering && isDriveBeat(spec.beat);

  const at = seq.skipped ? 0 : seq.base + (spec.at ?? 0);
  const vars = {
    '--at': `${at}s`,
    '--for': `${beatSeconds(spec) || 0.4}s`,
    '--idur': `${spec.idleFor ?? 12}s`,
  } as CSSProperties;

  const s = spec.scale ?? DEFAULT_SCALE;
  const idleClass = spec.idle && spec.idle !== 'none' ? `stg-idle-${spec.idle}` : undefined;

  return (
    <g transform={`translate(${spec.x} ${spec.y ?? GROUND}) scale(${s})`}>
      <g className={spec.beat ? 'stg-a' : undefined} data-beat={spec.beat} style={vars}>
        <g className={idleClass} style={vars}>
          {drawArt(spec.art, { pose, reach: spec.reach, flip, moving, step: crossing ? 0.38 : 0.7 })}
        </g>
      </g>
    </g>
  );
}

export function Stage({ seq, solo, className }: { seq: StageSeq; solo: boolean; className?: string }) {
  const reduced = !!useReducedMotion();
  const { stage } = seq;

  // pause the loops while the stage is off screen (saves battery on phones)
  const ref = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-paused={!onScreen}
      aria-hidden="true"
      onClick={seq.skip}
      className={cn(
        'stg-stage relative aspect-[600/220] w-full select-none overflow-hidden rounded-3xl border border-line bg-night [contain:paint]',
        seq.skipped && 'stg-skip',
        className,
      )}
    >
      <SceneStyles />
      <StageStyles />
      <AnimatePresence initial={false}>
        <motion.div
          key={stage.set}
          className="absolute inset-0"
          initial={seq.travel ? { x: '100%' } : false}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: reduced ? 0 : TRAVEL_SECONDS, ease: [0.4, 0, 0.2, 1] }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full">
            <Backdrop set={stage.set} />
            {/* remounted each scene, so a new scene in the same place replays only the actors */}
            <g key={seq.key}>
              {stage.cast.map((spec, i) => (
                <Actor key={`${spec.art}-${i}`} spec={spec} seq={seq} solo={solo} />
              ))}
            </g>
          </svg>
        </motion.div>
      </AnimatePresence>
      {seq.phase === 'enter' && !seq.skipped && (
        <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-night/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-mute backdrop-blur">
          Tap to skip
        </span>
      )}
    </div>
  );
}
