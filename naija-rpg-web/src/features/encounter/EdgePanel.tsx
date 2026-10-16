'use client';

import { useEffect, useState } from 'react';
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
import type { PrivateRoll, StarPlay } from '@/types';

export function EdgePanel() {
  const roll = useGame((s) => s.myRoll);
  const phase = useGame((s) => s.room?.phase);
  const round = useGame((s) => s.room?.round);
  const [pick, setPick] = useState<StarPlay | null>(null);
  const [busy, setBusy] = useState(false);
  // which dice have finished tumbling (keyed by round, position and value)
  const [landed, setLanded] = useState<Set<string>>(() => new Set());

  // Recovery: if the roll never arrived (refresh, reconnect, missed event), ask the server for it.
  // Must stay above the early return below so hook order never changes.
  useEffect(() => {
    if (roll || phase !== 'edge') return;
    let cancelled = false;
    emitAck<PrivateRoll>('roll:mine')
      .then((r) => {
        if (!cancelled && !useGame.getState().myRoll) useGame.getState().setMyRoll(r);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [roll, phase, round]);

  // AFK, or the private roll hasn't arrived yet
  if (!roll) {
    return (
      <Card className="py-8 text-center">
        <div className="animate-pulse font-semibold text-mute">Waiting for the others…</div>
      </Card>
    );
  }

  const keyOf = (d: number, k: number) => `${roll.round}-${k}-${d}`;
  const mark = (key: string) =>
    setLanded((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  // the question only appears once every die has stopped
  const settled = roll.dice.every((d, k) => landed.has(keyOf(d, k)));

  const tier = TIERS[roll.tier];
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
          {roll.dice.map((d, k) => {
            const key = keyOf(d, k);
            return (
              <div key={key} className={cn('flex flex-col items-center', dual && settled && k !== kept && 'opacity-45')}>
                <Dice value={d} delay={k * 200} size={size} onSettled={() => mark(key)} />
                {dual && settled && (
                  <span className={cn('text-[10px] font-extrabold uppercase', k === kept ? 'text-gold' : 'text-mute')}>
                    {k === kept ? 'kept' : 'dropped'}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {settled ? (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
            <div className="text-sm text-mute">
              {roll.die} {roll.modifier >= 0 ? '+' : '−'} {Math.abs(roll.modifier)}
              {roll.starBonus ? ` + ${roll.starBonus}★` : ''} = <span className="font-extrabold text-ink">{roll.total}</span>
            </div>
            <div className={cn('inline-block rounded-full border px-3 py-0.5 text-xs font-extrabold', tier.chip)}>
              {tier.emoji} {tier.label}
            </div>
            <p className="text-xs text-mute">The others can&apos;t see this until everyone has decided.</p>
          </motion.div>
        ) : (
          <div className="h-12 animate-pulse pt-3 text-sm font-semibold text-mute">Rolling…</div>
        )}
      </Card>

      {!settled ? null : roll.done ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border border-brand/30 bg-brand/5 p-4 text-center font-semibold text-brand">
          {roll.used === 'reroll' && `🎲 Reroll: ${roll.dice.join(' & ')}, kept ${roll.die}`}
          {roll.used === 'nudge' && `✨ Nudge: +${roll.starBonus} on your roll`}
          {!roll.used && 'You kept your roll'} <span className="animate-pulse text-mute">· waiting for the others…</span>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-mute">
              <span>Use a bonus? (one per scene)</span>
              <span className="text-gold">★ {roll.stars}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {roll.edges.map((e) => {
                const s = STAR_PLAYS[e.id];
                const on = pick === e.id;
                return (
                  <button
                    key={e.id}
                    type="button"
                    disabled={!e.usable || busy}
                    onClick={() => setPick(on ? null : e.id)}
                    className={cn('rounded-2xl border p-2 text-center transition', on ? 'border-gold bg-gold/10' : 'border-line bg-panel', !e.usable && 'opacity-40')}
                  >
                    <div className="font-display text-sm font-extrabold">{s.label}</div>
                    <div className="text-[11px] leading-tight text-mute">{s.blurb}</div>
                    <div className="mt-1 text-xs font-bold text-gold">★ {s.cost}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <Button size="lg" variant={pick ? 'gold' : 'primary'} className="w-full" loading={busy} onClick={confirm}>
            {pick ? `Use ${STAR_PLAYS[pick].label} · ★${STAR_PLAYS[pick].cost}` : 'Keep my roll'}
          </Button>
        </motion.div>
      )}
    </div>
  );
}