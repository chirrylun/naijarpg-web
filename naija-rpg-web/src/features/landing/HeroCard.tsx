'use client';

import { motion } from 'framer-motion';
import { APPROACHES } from '@/lib/constants';

const MOVES = [
  { approach: 'charm', text: 'Smile and greet them like an old friend' },
  { approach: 'gragra', text: 'Give him a resounding slap' },
  { approach: 'hustle', text: 'Lie to him. You already paid to the area chairman' },
  { approach: 'wisdom', text: 'Say you know the area chairman' },
] as const;

export function HeroCard() {
  return (
    <div className="relative">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="relative overflow-hidden rounded-3xl border border-line bg-panel/95 p-4 pt-6 shadow-2xl backdrop-blur"
      >
        <div className="ankara-strip absolute inset-x-0 top-0" aria-hidden />
        <p className="text-xs font-bold uppercase tracking-wider text-mute">Market street</p>
        <h3 className="mt-1 font-display text-xl font-extrabold">The agbero wants his money</h3>
        <p className="mt-2 text-sm text-ink/80">
          You just parked your car at your junction. A group of agberos walks up and says you must them first. What do you do?
        </p>
        <div className="mt-3 space-y-2">
          {MOVES.map((m) => (
            <div key={m.approach} className="flex items-center gap-2 rounded-xl border border-line bg-panel-2 px-3 py-2 text-sm">
              <span>{APPROACHES[m.approach].emoji}</span>
              <span className="flex-1">{m.text}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs font-semibold text-mute">Pick a move, then roll the dice.</p>
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 14, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute -right-3 -top-5 flex size-16 items-center justify-center rounded-2xl bg-gold font-display text-2xl font-extrabold text-[#241800] shadow-[0_5px_0_0_var(--color-gold-deep)]"
      >
        +20
      </motion.div>
    </div>
  );
}