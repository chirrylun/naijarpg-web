import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

export function StatsStrip({ live, visits, topScore }: { live: number; visits: number; topScore: number }) {
  const tiles = [
    { label: 'Playing now', value: live, pulse: true },
    { label: 'Total visits', value: visits, pulse: false },
    { label: 'Top score', value: topScore, pulse: false },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-2xl border border-line bg-panel p-3 text-center sm:p-4">
          <div className="flex items-center justify-center gap-2 font-display text-2xl font-extrabold sm:text-3xl">
            {t.pulse && (
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70" />
                <span className="relative inline-flex size-2.5 rounded-full bg-brand" />
              </span>
            )}
            <AnimatedNumber value={t.value} />
          </div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-mute sm:text-xs">{t.label}</div>
        </div>
      ))}
    </div>
  );
}