'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dice } from './Dice';
import { APPROACHES, STAR_PLAYS, TIERS } from '@/lib/constants';
import { errorText } from '@/lib/api';
import { emitAck } from '@/lib/socket';
import { useGame } from '@/stores/game';
import { useToast } from '@/stores/toast';
import { cn } from '@/lib/utils';
import type { StarPlay } from '@/types';

export function EdgePanel() {
  const roll = useGame((s) => s.myRoll);
  const [pick, setPick] = useState<StarPlay | null>(null);
  const [busy, setBusy] = useState(false);

  // AFK, or the private roll hasn't arrived yet
  if (!roll) {
    return (
      <Card className="py-8 text-center">
        <div className="animate-pulse font-semibold text-mute">Waiting for the others…</div>
      </Card>
    );
  }

  const tier = TIERS[roll.tier];
  const landed = roll.tier === 'win' || roll.tier === 'legendary';
  const dual = roll.dice.length > 1;
  const kept = roll.dice.indexOf(Math.max(...roll.dice));
  const size = dual ? 76 : 100;

  async function confirm() {
    setBusy(true);
    try {
      await emitAck('edge:use', { edge: pick ?? 'skip' });
    } catch (e) {
      useToast.getState().push(errorText(e), 'bad');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="flex flex-col items-center gap-1 text-center">
        <div className="text-xs font-bold uppercase tracking-wider text-mute">
          Your roll · {APPROACHES[roll.approach].emoji} {APPROACHES[roll.approach].label}
        </div>
        <div className="flex items-start justify-center gap-2">
          {roll.dice.map((d, k) => (
            <div key={`${roll.round}-${k}-${d}`} className={cn('flex flex-col items-center', dual && k !== kept && 'opacity-45')}>
              <Dice value={d} delay={k * 200} size={size} />
              {dual && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }} className={cn('text-[10px] font-extrabold uppercase', k === kept ? 'text-gold' : 'text-mute')}>
                  {k === kept ? 'kept' : 'dropped'}
                </motion.span>
              )}
            </div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="space-y-1">
          <div className="text-sm text-mute">
            {roll.die} {roll.modifier >= 0 ? '+' : '−'} {Math.abs(roll.modifier)}
            {roll.starBonus ? ` + ${roll.starBonus}★` : ''} = <span className="font-extrabold text-ink">{roll.total}</span>
          </div>
          <div className={cn('inline-block rounded-full border px-3 py-0.5 text-xs font-extrabold', tier.chip)}>
            {tier.emoji} {tier.label}
          </div>
          <p className="text-xs text-mute">The others can&apos;t see this until everyone has decided.</p>
        </motion.div>
      </Card>

      {roll.done ? (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 text-center font-semibold text-brand">
          {roll.used === 'reroll' && `🎲 Reroll: ${roll.dice.join(' & ')}, kept ${roll.die}`}
          {roll.used === 'nudge' && `✨ Nudge: +${roll.starBonus} on your roll`}
          {roll.used === 'shield' && '🛡️ Shield up: a miss will not hurt you'}
          {!roll.used && 'You kept your roll'} <span className="animate-pulse text-mute">· waiting for the others…</span>
        </div>
      ) : (
        <>
          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-mute">
              <span>Use an edge? (one per scene)</span>
              <span className="text-gold">★ {roll.stars}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {roll.edges.map((e) => {
                const s = STAR_PLAYS[e.id];
                const on = pick === e.id;
                const needless = e.id === 'shield' && landed;
                return (
                  <button
                    key={e.id}
                    type="button"
                    disabled={!e.usable || busy}
                    onClick={() => setPick(on ? null : e.id)}
                    className={cn('rounded-2xl border p-2 text-center transition', on ? 'border-gold bg-gold/10' : 'border-line bg-panel', !e.usable && 'opacity-40')}
                  >
                    <div className="font-display text-sm font-extrabold">{s.label}</div>
                    <div className="text-[11px] leading-tight text-mute">{needless ? 'Not needed, you landed it' : s.blurb}</div>
                    <div className="mt-1 text-xs font-bold text-gold">★ {s.cost}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <Button size="lg" variant={pick ? 'gold' : 'primary'} className="w-full" loading={busy} onClick={confirm}>
            {pick ? `Use ${STAR_PLAYS[pick].label} · ★${STAR_PLAYS[pick].cost}` : 'Keep my roll'}
          </Button>
        </>
      )}
    </div>
  );
}