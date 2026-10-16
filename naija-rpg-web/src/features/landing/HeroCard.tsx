'use client';

import { motion } from 'framer-motion';

export function HeroCard() {
  return (
    <div className="relative">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="rounded-3xl border border-line bg-panel p-4 shadow-2xl"
      >
        <p className="text-xs font-bold uppercase tracking-wider text-mute">NEPA Match Night</p>
        <h3 className="mt-1 font-display text-xl font-extrabold">Light Don Go</h3>
        <p className="mt-2 text-sm text-ink/80">
          The Super Eagles are level in the 85th minute and NEPA chooses this exact moment to strike.
        </p>
        <div className="mt-3 space-y-2">
          {[
            ['😎', 'Sweet-talk the neighbour with the generator', '+2'],
            ['💪🏾', 'Run to the junction for fuel', '+1'],
            ['🧠', 'Check if it is just your fuse', '+3'],
          ].map(([e, t, m]) => (
            <div key={t} className="flex items-center gap-2 rounded-xl border border-line bg-panel-2 px-3 py-2 text-sm">
              <span>{e}</span>
              <span className="flex-1">{t}</span>
              <span className="font-bold text-brand">{m}</span>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div
        animate={{ rotate: [0, 14, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="absolute -right-3 -top-5 flex size-16 items-center justify-center rounded-2xl bg-gold font-display text-2xl font-extrabold text-[#241800] shadow-[0_5px_0_0_var(--color-gold-deep)]"
      >
        20
      </motion.div>
    </div>
  );
}