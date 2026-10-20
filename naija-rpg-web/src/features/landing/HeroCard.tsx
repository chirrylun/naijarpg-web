'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { APPROACHES, MODE_CARDS, STAR_PLAYS } from '@/lib/constants';

// Everything below reads from constants, so move names, mode names and star prices stay correct if you change them.
const MOVES = ['charm', 'hustle', 'gragra', 'wisdom'] as const;
const BOOSTS = (['reroll', 'nudge'] as const).map((id) => ({ id, ...STAR_PLAYS[id] }));
const MODE_NOTE: Record<string, string> = { rival: 'You vs a friend', coop: 'Team up' };

function Chip({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'gold' }) {
  return (
    <span
      className={
        tone === 'gold'
          ? 'inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold'
          : 'inline-flex items-center gap-1 rounded-full border border-line bg-panel-2 px-2.5 py-1 text-xs font-semibold'
      }
    >
      {children}
    </span>
  );
}

const STEPS: { title: string; text: string; extra: ReactNode }[] = [
  {
    title: 'Pick how to play',
    text: 'Play against a friend, or team up with one.',
    extra: MODE_CARDS.map((m) => (
      <Chip key={m.id}>
        <b>{m.name}</b>
        <span className="text-mute">· {MODE_NOTE[m.mode] ?? m.tag}</span>
      </Chip>
    )),
  },
  {
    title: 'Read the scene, pick a move',
    text: 'Every story throws a problem at you. Choose how you want to handle it.',
    extra: MOVES.map((m) => (
      <Chip key={m}>
        <span aria-hidden>{APPROACHES[m].emoji}</span>
        {APPROACHES[m].label}
      </Chip>
    )),
  },
  {
    title: 'Roll the dice',
    text: 'Face Off: the higher roll wins the scene, and a tie rolls again. Link Up: beat the challenge together.',
    extra: null,
  },
  {
    title: 'Boost it, then win',
    text: 'Not happy with your roll? Spend stars to fix it. Win the most scenes to win the game.',
    extra: BOOSTS.map((b) => (
      <Chip key={b.id} tone="gold">
        {b.label} <span>★ {b.cost}</span>
      </Chip>
    )),
  },
];

export function HeroCard() {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-3xl border border-line bg-panel/95 p-4 pt-6 shadow-2xl backdrop-blur sm:p-5 sm:pt-7">
        <div className="ankara-strip absolute inset-x-0 top-0" aria-hidden />
        <p className="text-xs font-bold uppercase tracking-wider text-mute">New here?</p>
        <h3 className="mt-1 font-display text-2xl font-extrabold">How to play</h3>

        <ol className="mt-4 space-y-4">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i, duration: 0.35 }}
              className="relative pl-12"
            >
              {i < STEPS.length - 1 && <span className="absolute bottom-[-1rem] left-[1.05rem] top-9 w-px bg-line" aria-hidden />}
              <span className="absolute left-0 top-0 flex size-9 items-center justify-center rounded-full bg-gold font-display font-extrabold text-[#241800] shadow-[0_3px_0_0_var(--color-gold-deep)]">
                {i + 1}
              </span>
              <div className="font-display text-base font-extrabold leading-tight">{s.title}</div>
              <p className="mt-0.5 text-sm text-mute">{s.text}</p>
              {s.extra && <div className="mt-2 flex flex-wrap gap-1.5">{s.extra}</div>}
            </motion.li>
          ))}
        </ol>

        <p className="mt-5 rounded-2xl bg-brand/10 px-3 py-2 text-center text-xs font-semibold text-brand">
          Takes about 2 minutes. No sign-up needed.
        </p>
      </div>

      <div className="absolute -right-3 -top-5 flex size-16 rotate-6 flex-col items-center justify-center rounded-2xl bg-gold font-display font-extrabold leading-none text-[#241800] shadow-[0_5px_0_0_var(--color-gold-deep)]">
        <span className="text-2xl">4</span>
        <span className="mt-0.5 text-[10px] uppercase tracking-wide">steps</span>
      </div>
    </div>
  );
}