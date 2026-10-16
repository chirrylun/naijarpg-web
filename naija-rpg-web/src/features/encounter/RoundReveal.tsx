'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Dice } from './Dice';
import { APPROACHES, RESULT_DELAY_MS, TIERS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { RoomState, RoundResult } from '@/types';

export function RoundReveal({ room, result, myId }: { room: RoomState; result: RoundResult; myId?: string }) {
  const myTeam = room.players.find((p) => p.userId === myId)?.team;
  const name = (id: string) => (id === myId ? 'You' : room.players.find((p) => p.userId === id)?.username ?? 'Player');
  const tier = TIERS[result.tier];

  const headline =
    room.mode === 'coop'
      ? `The crew's result: ${tier.label} ${tier.emoji}`
      : result.winnerTeam === null
        ? 'Dead heat. Nobody blinked.'
        : result.winnerTeam === myTeam
          ? 'Your side takes the scene! 🔥'
          : 'They take this scene 😤';

  return (
    <div className="space-y-4">
      <div className={cn('grid gap-3', result.rolls.length > 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2')}>
        {result.rolls.map((r, i) => {
          const t = TIERS[r.tier];
          return (
            <Card key={r.userId} className="flex flex-col items-center gap-1 text-center">
              <div className="text-sm font-bold">{name(r.userId)}</div>
              <div className="text-xs text-mute">
                {APPROACHES[r.approach].emoji} {APPROACHES[r.approach].label}
              </div>
              <Dice value={r.die} delay={i * 250} />
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 + i * 0.15 }} className="space-y-1">
                <div className="text-sm text-mute">
                  {r.die} + {r.modifier}
                  {r.starBonus ? ` + ${r.starBonus}★` : ''} = <span className="font-extrabold text-ink">{r.total}</span>
                </div>
                {r.starPlay && <div className="text-xs font-bold text-gold">★ {r.starPlay}</div>}
                <div className={cn('inline-block rounded-full border px-3 py-0.5 text-xs font-extrabold', t.chip)}>
                  {t.emoji} {t.label}
                </div>
              </motion.div>
            </Card>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 }} className="text-center font-display text-xl font-extrabold">
        {headline}
      </motion.div>

      <div className="space-y-1">
        <div className="h-1.5 overflow-hidden rounded-full bg-panel-2">
          <motion.div className="h-full bg-brand" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: RESULT_DELAY_MS / 1000, ease: 'linear' }} />
        </div>
        <div className="text-center text-xs text-mute">{result.ends ? 'Final result coming…' : 'Next scene coming…'}</div>
      </div>
    </div>
  );
}