import { STAR_PLAYS } from '@/lib/constants';

const STEPS = [
  { n: '1', t: 'Pick your move', d: 'Charm, Hustle, Lie or use Sense. Face every scenario with your best weapon.' },
  { n: '2', t: 'Roll the dice', d: 'Lock in to your choice and roll the dice. Nobody can cheat the game.' },
  { n: '3', t: 'Use a bonus', d: "If you don't like your roll, spend stars on a bonus if you want one. Or keep your roll." },
];

// the bonuses players can use right now
const BONUSES = (['reroll', 'nudge'] as const).map((id) => ({ id, ...STAR_PLAYS[id] }));

export function HowItWorks() {
  return (
    <section>
      <h2 className="font-display text-2xl font-extrabold">How it works</h2>
      <div className="ankara-strip mb-4 mt-2 h-1.5 w-16 rounded-full" aria-hidden />
      <div className="grid gap-3 sm:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n} className="ankara-dots relative overflow-hidden rounded-3xl border border-line bg-panel p-4 pt-6">
            <div className="ankara-strip absolute inset-x-0 top-0 h-1.5" aria-hidden />
            <div className="mb-2 flex size-9 items-center justify-center rounded-full bg-gold font-display font-extrabold text-[#241800] shadow-[0_3px_0_0_var(--color-gold-deep)]">
              {s.n}
            </div>
            <div className="font-display text-lg font-extrabold">{s.t}</div>
            <p className="mt-1 text-sm text-mute">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-3 overflow-hidden rounded-3xl border border-gold/40 bg-gold/10 p-4 pt-6">
        <div className="ankara-strip absolute inset-x-0 top-0 h-1.5" aria-hidden />
        <div className="font-display text-lg font-extrabold">Bonuses</div>
        <p className="mt-1 text-sm text-ink/70">
          Stars buy you a bonus after you see your roll. You can use one per scene. They help, but they never guarantee a win.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {BONUSES.map((b) => (
            <div key={b.id} className="rounded-2xl border border-line bg-panel p-3">
              <div className="flex items-center justify-between">
                <span className="font-display font-extrabold">{b.label}</span>
                <span className="rounded-full border border-gold/50 bg-gold/15 px-2 py-0.5 text-xs font-bold text-gold">★ {b.cost}</span>
              </div>
              <p className="mt-1 text-sm text-mute">{b.blurb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}