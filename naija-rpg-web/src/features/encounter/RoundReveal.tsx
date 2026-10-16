'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Dice } from './Dice';
import { APPROACHES, TIERS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { RoomState, RoundResult, Standing } from '@/types';

const STANDING: Record<Standing, { text: string; cls: string } | null> = {
  won: { text: 'Took the scene', cls: 'text-brand' },
  lost: { text: 'Lost the scene', cls: 'text-danger' },
  level: { text: 'Level', cls: 'text-sky' },
  crew: null,
};

export function RoundReveal({ room, result, myId }: { room: RoomState; result: RoundResult; myId?: string }) {
  const name = (id: string) => (id === myId ? 'You' : room.players.find((p) => p.userId === id)?.username ?? 'Player');
  const many = result.rolls.length > 2;

  return (
    <div className="space-y-4">
      <div className={cn('grid gap-3', many ? 'grid-cols-2' : 'grid-cols-1 min-[420px]:grid-cols-2')}>
        {result.rolls.map((r, i) => {
          const t = TIERS[r.tier];
          const st = STANDING[r.standing];
          const dice = r.dice?.length ? r.dice : [r.die];
          const dual = dice.length > 1;
          const kept = dice.indexOf(Math.max(...dice));
          const size = dual ? (many ? 56 : 72) : many ? 84 : 104;
          return (
            <Card key={r.userId} className="flex flex-col items-center gap-1 px-2 text-center">
              <div className="text-sm font-bold">{name(r.userId)}</div>
              <div className="text-xs text-mute">
                {APPROACHES[r.approach].emoji} {APPROACHES[r.approach].label}
              </div>

              <div className="flex items-start justify-center gap-1">
                {dice.map((d, k) => (
                  <div key={k} className={cn('flex flex-col items-center', dual && k !== kept && 'opacity-45')}>
                    <Dice value={d} delay={i * 250 + k * 150} size={size} />
                    {dual && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.9 }}
                        className={cn('text-[10px] font-extrabold uppercase', k === kept ? 'text-gold' : 'text-mute')}
                      >
                        {k === kept ? 'kept' : 'dropped'}
                      </motion.span>
                    )}
                  </div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 + i * 0.15 }} className="space-y-1">
                <div className="text-sm text-mute">
                  {r.die} {r.modifier >= 0 ? '+' : '−'} {Math.abs(r.modifier)}
                  {r.starBonus ? ` + ${r.starBonus}★` : ''} = <span className="font-extrabold text-ink">{r.total}</span>
                </div>
                {r.starPlay === 'reroll' && <div className="text-xs font-bold text-gold">🎲 Reroll: {dice.join(' & ')}, kept {r.die}</div>}
                {r.starPlay === 'nudge' && <div className="text-xs font-bold text-gold">✨ Nudge: +{r.starBonus}</div>}
                {r.starPlay === 'shield' && (
                  <div className="text-xs font-bold text-gold">{r.shielded ? '🛡️ Shield softened the miss' : '🛡️ Shield not needed'}</div>
                )}
                <div className={cn('inline-block rounded-full border px-3 py-0.5 text-xs font-extrabold', t.chip)}>
                  {t.emoji} {t.label}
                </div>
                {st && <div className={cn('text-xs font-extrabold uppercase tracking-wide', st.cls)}>{st.text}</div>}
              </motion.div>
            </Card>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }} className="text-center font-display text-lg font-extrabold leading-snug">
        {result.headline}
      </motion.div>

      {(result.effects.length > 0 || result.blocked?.length > 0) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6 }} className="flex flex-wrap justify-center gap-2">
          {result.effects.map((e) => (
            <span key={e.userId} className={cn('rounded-full border px-3 py-1 text-xs font-bold', e.mod > 0 ? 'border-brand/40 bg-brand/10 text-brand' : 'border-danger/40 bg-danger/10 text-danger')}>
              {name(e.userId)}: {e.label} {e.mod > 0 ? '+' : ''}
              {e.mod} next roll
            </span>
          ))}
          {(result.blocked ?? []).map((b) => (
            <span key={`b-${b.userId}`} className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-bold text-gold">
              🛡️ {name(b.userId)}&apos;s Shield blocked &quot;{b.label}&quot;
            </span>
          ))}
        </motion.div>
      )}

      <div className="space-y-1">
        <div className="h-2 overflow-hidden rounded-full bg-panel-2">
          <motion.div className="h-full rounded-full bg-brand" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: result.revealMs / 1000, ease: 'linear' }} />
        </div>
        <div className="text-center text-xs text-mute">{result.ends ? 'The story wraps up…' : 'Next scene loading…'}</div>
      </div>
    </div>
  );
}