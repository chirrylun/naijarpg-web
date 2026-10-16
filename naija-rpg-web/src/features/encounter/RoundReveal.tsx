'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Dice } from './Dice';
import { TIERS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { RollRow, RoomState, RoundResult } from '@/types';

function verdict(result: RoundResult, mine: RollRow | undefined) {
  if (result.kind === 'all_pass') return { emoji: '🎉', text: 'You did it together!', tone: 'text-brand' };
  if (result.kind === 'mixed') return { emoji: '😅', text: 'Some of you did it!', tone: 'text-gold' };
  if (result.kind === 'all_fail') return { emoji: '😬', text: "It didn't work this time", tone: 'text-danger' };
  if (mine?.standing === 'won') return { emoji: '🎉', text: 'You win this round!', tone: 'text-gold' };
  if (mine?.standing === 'lost') return { emoji: '😤', text: 'They win this round', tone: 'text-danger' };
  return { emoji: '🤝', text: "It's a tie!", tone: 'text-sky' };
}

export function RoundReveal({ room, result, myId }: { room: RoomState; result: RoundResult; myId?: string }) {
  // your own die always comes first
  const rolls = [...result.rolls].sort((a, b) => (a.userId === myId ? -1 : b.userId === myId ? 1 : 0));
  const mine = rolls.find((r) => r.userId === myId);

  const [landed, setLanded] = useState<ReadonlySet<string>>(new Set());
  const [timedOut, setTimedOut] = useState(false);
  const allLanded = timedOut || landed.size >= rolls.length;
  const land = (id: string) => setLanded((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));

  // safety net: still show the result if a die never reports back
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 2800 + rolls.length * 300);
    return () => clearTimeout(t);
  }, [rolls.length]);

  const v = verdict(result, mine);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {rolls.map((r, i) => {
          const t = TIERS[r.tier];
          const name = r.userId === myId ? 'You' : (room.players.find((p) => p.userId === r.userId)?.username ?? 'Player');
          const bonus = r.modifier + r.starBonus;
          const show = timedOut || landed.has(r.userId);
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
                <div className="mt-1 text-xs text-mute">
                  {`Dice ${r.die}`}
                  {bonus !== 0 ? ` ${bonus > 0 ? '+' : '−'} ${Math.abs(bonus)} bonus` : ''}
                </div>
                <div className={cn('mt-2 rounded-full border px-3 py-0.5 text-xs font-extrabold', t.chip)}>
                  {t.emoji} {t.label}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      <motion.div
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, y: 8 }}
        animate={allLanded ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        className="min-h-[88px] text-center"
      >
        <div className="text-5xl">{v.emoji}</div>
        <div className={cn('font-display text-2xl font-extrabold', v.tone)}>{v.text}</div>
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