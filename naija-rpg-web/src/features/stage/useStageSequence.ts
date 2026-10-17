'use client';

import { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { enterSeconds, resolveStage } from './registry';
import type { SetId, StageScene } from './types';

/** Scenes already shown this visit replay instantly, so a second run never makes anyone wait. */
const seen = new Set<string>();

/** How long the backdrop pans when the story moves to a new place. */
export const TRAVEL_SECONDS = 0.7;

export type StageSeq = {
  stage: StageScene;
  /** the location changed since the last scene, so the backdrop pans */
  travel: boolean;
  /** replaying a scene already seen, or reduced motion: final frame straight away */
  instant: boolean;
  /** seconds to wait before the actors start (the pan) */
  base: number;
  phase: 'enter' | 'idle';
  /** opening finished: show the scene text and let players choose */
  ready: boolean;
  /** the opening was skipped or never played: actors sit in their final spots */
  skipped: boolean;
  key: string;
  skip: () => void;
};

type Args = {
  scenarioId: string;
  sceneKey: string | undefined;
  round: number;
  /** Rejoining mid-round (edge phase, or the reveal is on screen): don't replay the opening */
  skipOpening?: boolean;
};

type Decision = { key: string; set: SetId; travel: boolean; instant: boolean };

export function useStageSequence({ scenarioId, sceneKey, round, skipOpening }: Args): StageSeq {
  const reduced = !!useReducedMotion();
  const key = `${scenarioId}:${sceneKey ?? '-'}:${round}`;
  const seenKey = `${scenarioId}:${sceneKey ?? '-'}`;
  const { stage } = resolveStage(scenarioId, sceneKey);

  // Decided once per scene, when the scene changes (state, not refs, so rendering stays pure):
  // is it a travel shot, and does the opening play at all.
  const decide = (prev: Decision | null): Decision => ({
    key,
    set: stage.set,
    travel: prev !== null && prev.set !== stage.set && !reduced,
    instant: reduced || !!skipOpening || seen.has(seenKey),
  });
  const [decision, setDecision] = useState<Decision>(() => decide(null));
  let current = decision;
  if (decision.key !== key) {
    current = decide(decision);
    setDecision(current);
  }
  const { travel, instant } = current;

  const base = travel ? TRAVEL_SECONDS : 0;
  const total = instant ? 0 : Math.round((base + enterSeconds(stage)) * 1000) + 150;

  const [doneKey, setDoneKey] = useState('');
  const [skippedKey, setSkippedKey] = useState('');
  const done = instant || doneKey === key;

  useEffect(() => {
    if (instant) {
      seen.add(seenKey);
      return;
    }
    const t = setTimeout(() => {
      seen.add(seenKey);
      setDoneKey(key);
    }, total);
    return () => clearTimeout(t);
  }, [key, seenKey, instant, total]);

  const skip = useCallback(() => {
    setSkippedKey(key);
    setDoneKey(key);
  }, [key]);

  return {
    stage,
    travel,
    instant,
    base,
    phase: done ? 'idle' : 'enter',
    ready: done,
    skipped: instant || skippedKey === key,
    key,
    skip,
  };
}
