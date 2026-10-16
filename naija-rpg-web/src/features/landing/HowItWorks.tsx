const STEPS = [
  { n: '1', t: 'Pick your move', d: 'Charm, Hustle, Gra-Gra or Wisdom. Every scene has its own odds.' },
  { n: '2', t: 'Roll the d20', d: 'The server rolls. Nobody can cheat the dice, not even you.' },
  { n: '3', t: 'Bend the odds', d: 'Spend stars to reroll, nudge or shield. Helpful, never a guaranteed win.' },
];

export function HowItWorks() {
  return (
    <section>
      <h2 className="mb-3 font-display text-2xl font-extrabold">How it works</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="rounded-3xl border border-line bg-panel p-4">
            <div className="mb-2 flex size-8 items-center justify-center rounded-xl bg-brand font-display font-extrabold text-[#04110b]">{s.n}</div>
            <div className="font-display text-lg font-extrabold">{s.t}</div>
            <p className="mt-1 text-sm text-mute">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}