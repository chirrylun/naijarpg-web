'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Dice } from './Dice';
import { cn } from '@/lib/utils';
import { luckTag, rollSum } from '@/lib/storyFx';
import type { RollRow, RoomState, RoundResult } from '../../types';

const TIE_STEP_MS = 2600; // keep in step with tieRerollMs on the server

function verdict(result: RoundResult, mine: RollRow | undefined, solo: boolean, race: boolean) {
  // Races: each side walks its own road, so "who is ahead" and "did my move work" are two separate things
  if (race) {
    const worked = mine ? (mine.passed ? 'Your move worked.' : 'Your move missed.') : '';
    if (mine?.standing === 'won') return { emoji: '🎉', text: 'You pull ahead!', sub: worked, tone: 'text-gold' };
    if (mine?.standing === 'lost') return { emoji: '😤', text: 'They pull ahead', sub: worked, tone: 'text-danger' };
    return { emoji: '🤝', text: 'Neck and neck', sub: worked, tone: 'text-sky' };
  }
  if (result.kind === 'all_pass') return { emoji: '🎉', text: solo ? 'You did it!' : 'You did it together!', sub: '', tone: 'text-brand' };
  if (result.kind === 'mixed') return { emoji: '😅', text: 'Some of you did it!', sub: '', tone: 'text-gold' };
  if (result.kind === 'all_fail') return { emoji: '😬', text: "It didn't work this time", sub: '', tone: 'text-danger' };
  if (mine?.standing === 'won') return { emoji: '🎉', text: 'You win this round!', sub: '', tone: 'text-gold' };
  if (mine?.standing === 'lost') return { emoji: '😤', text: 'They win this round', sub: '', tone: 'text-danger' };
  return { emoji: '🤝', text: "It's a tie!", sub: '', tone: 'text-sky' };
}

export function RoundReveal({ room, result, myId }: { room: RoomState; result: RoundResult; myId?: string }) {
  // your own die always comes first
  const rolls = [...result.rolls].sort((a, b) => (a.userId === myId ? -1 : b.userId === myId ? 1 : 0));
  const mine = rolls.find((r) => r.userId === myId);
  const ties = result.tieRounds ?? [];
  const nameOf = (id: string) => (id === myId ? 'You' : (room.players.find((p) => p.userId === id)?.username ?? 'Player'));

  const [landed, setLanded] = useState<ReadonlySet<string>>(new Set());
  const [timedOut, setTimedOut] = useState(false);
  const [tiesShown, setTiesShown] = useState(0); // how many re-rolls are on screen
  const [lastTieLanded, setLastTieLanded] = useState(0);
  const allLanded = timedOut || landed.size >= rolls.length;
  const land = (id: string) => setLanded((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));

  // safety net: still show the result if a die never reports back
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 2800 + rolls.length * 300);
    return () => clearTimeout(t);
  }, [rolls.length]);

  // a tie on the top roll: bring in each re-roll one after the other
  useEffect(() => {
    if (!allLanded || tiesShown >= ties.length) return;
    const t = setTimeout(() => setTiesShown((n) => n + 1), tiesShown === 0 ? 900 : TIE_STEP_MS);
    return () => clearTimeout(t);
  }, [allLanded, tiesShown, ties.length]);

  // final safety net for the verdict, in case a tie die never reports back
  const [forced, setForced] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setForced(true), Math.max(2000, result.revealMs - 1500));
    return () => clearTimeout(t);
  }, [result.revealMs]);

  const lastTie = ties[ties.length - 1];
  const tiesDone = ties.length === 0 || (tiesShown >= ties.length && lastTieLanded >= (lastTie?.length ?? 0));
  const ready = forced || (allLanded && tiesDone);
  const v = verdict(result, mine, room.solo, room.mode !== 'coop');

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {rolls.map((r, i) => {
          const name = nameOf(r.userId);
          const show = timedOut || landed.has(r.userId);
          const luck = luckTag(r.die, rolls.filter((o) => o.userId !== r.userId).map((o) => o.die));
          const sum = rollSum(r.die, r.modifier, r.starBonus);
          return (
            <div key={r.userId} className="flex flex-col items-center gap-2 rounded-3xl border border-line bg-panel p-3 text-center">
              <div className="max-w-full truncate text-sm font-bold">{name}</div>
              <Dice value={r.die} size={96} delay={i * 300} onSettled={() => land(r.userId)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                className="flex min-h-[84px] flex-col items-center"
              >
                <div className="font-display text-5xl font-extrabold leading-none">{r.total}</div>
                {sum && <div className="mt-1 text-xs font-semibold text-mute">{sum}</div>}
                {typeof r.dc === 'number' && (
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-bold">
                    <span className="text-mute">Needed {r.dc}</span>
                    <span className={cn('rounded-full px-2 py-0.5', r.passed ? 'bg-brand/15 text-brand' : 'bg-danger/15 text-danger')}>
                      {r.passed ? '✓ Made it' : '✗ Missed'}
                    </span>
                  </div>
                )}
                {luck && (
                  <div className={cn('mt-2 rounded-full border px-3 py-0.5 text-xs font-extrabold', luck.chip)}>
                    {luck.emoji} {luck.label}
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {ties.slice(0, tiesShown).map((round, k) => (
        <motion.div
          key={k}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 rounded-3xl border border-sky/30 bg-sky/5 p-3 text-center"
        >
          <div className="text-sm font-extrabold text-sky">{k === 0 ? 'Same number! Rolling again…' : 'Still level. Again…'}</div>
          <div className="flex justify-center gap-6">
            {round.map((t) => (
              <div key={t.userId} className="flex flex-col items-center">
                <div className="max-w-24 truncate text-xs font-bold">{nameOf(t.userId)}</div>
                <Dice
                  value={t.die}
                  size={64}
                  onSettled={() => {
                    if (k === ties.length - 1) setLastTieLanded((n) => n + 1);
                  }}
                />
                <div className="font-display text-2xl font-extrabold">{t.die}</div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, y: 8 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        className="min-h-[88px] text-center"
      >
        <div className="text-5xl">{v.emoji}</div>
        <div className={cn('font-display text-2xl font-extrabold', v.tone)}>{v.text}</div>
        {v.sub && <div className="text-sm font-semibold text-mute">{v.sub}</div>}
        {myId && result.bonusLost?.includes(myId) && result.bonusLostMessage && (
          <p className="mx-auto mt-2 max-w-xs rounded-xl border border-danger/30 bg-danger/10 px-3 py-1.5 text-sm font-semibold text-danger">
            {result.bonusLostMessage}
          </p>
        )}
      </motion.div>

      <div className="h-1 overflow-hidden rounded-full bg-panel-2">
        <motion.div
          className="h-full bg-brand"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: result.revealMs / 1000, ease: 'linear' }}
        />
      </div>
    </div>
  );
}
