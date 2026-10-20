import { cn } from '@/lib/utils';

// Small, dependency-free charts for the /stats page.

export type Series = { name: string; bar: string; stroke: string }; // bar: tailwind bg class, stroke: css colour

const shortDay = (d: string) => {
  const [, m, day] = d.split('-');
  return `${Number(day)}/${Number(m)}`;
};

function XLabels({ labels }: { labels: string[] }) {
  if (labels.length === 0) return null;
  const mid = labels[Math.floor(labels.length / 2)];
  return (
    <div className="mt-1 flex justify-between text-[10px] text-mute">
      <span>{labels[0]}</span>
      {labels.length > 2 && <span>{mid}</span>}
      <span>{labels[labels.length - 1]}</span>
    </div>
  );
}

export function Legend({ series }: { series: Series[] }) {
  return (
    <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-mute">
      {series.map((s) => (
        <span key={s.name} className="flex items-center gap-1">
          <span className={cn('h-2 w-2 rounded-full', s.bar)} />
          {s.name}
        </span>
      ))}
    </div>
  );
}

/** One column per day, stacked by series */
export function StackBars({ days, series, values, height = 150 }: { days: string[]; series: Series[]; values: number[][]; height?: number }) {
  const totals = days.map((_, i) => series.reduce((s, _x, k) => s + (values[k]?.[i] ?? 0), 0));
  const max = Math.max(1, ...totals);
  return (
    <div>
      <div className="relative flex items-end gap-[2px]" style={{ height }}>
        <span className="absolute left-0 top-0 text-[10px] text-mute">{max}</span>
        {days.map((d, i) => (
          <div
            key={d}
            className="flex h-full flex-1 flex-col justify-end"
            title={`${shortDay(d)}: ${series.map((s, k) => `${s.name} ${values[k]?.[i] ?? 0}`).join(', ')}`}
          >
            {series.map((s, k) => {
              const v = values[k]?.[i] ?? 0;
              return v > 0 ? <div key={s.name} className={cn('w-full first:rounded-t-sm', s.bar)} style={{ height: `${(v / max) * 100}%` }} /> : null;
            })}
          </div>
        ))}
      </div>
      <XLabels labels={days.map(shortDay)} />
    </div>
  );
}

export function LineChart({ days, series, values, height = 150 }: { days: string[]; series: Series[]; values: number[][]; height?: number }) {
  const max = Math.max(1, ...values.flat());
  const n = Math.max(1, days.length - 1);
  const pts = (arr: number[]) => arr.map((v, i) => `${(i / n) * 100},${100 - (v / max) * 100}`).join(' ');
  return (
    <div>
      <div className="relative" style={{ height }}>
        <span className="absolute left-0 top-0 text-[10px] text-mute">{max}</span>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          {[25, 50, 75].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="currentColor" className="text-line" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          ))}
          {series.map((s, k) => (
            <polyline key={s.name} points={pts(values[k] ?? [])} fill="none" stroke={s.stroke} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      </div>
      <XLabels labels={days.map(shortDay)} />
    </div>
  );
}

/** A row per item with a bar sized against the biggest value */
export function BarList({ rows, color = 'bg-brand' }: { rows: { label: string; value: number; note?: string }[]; color?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  if (rows.length === 0) return <Empty />;
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="truncate font-semibold">{r.label}</span>
            <span className="shrink-0 text-xs text-mute">
              <b className="text-ink">{r.value.toLocaleString()}</b>
              {r.note ? ` · ${r.note}` : ''}
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-panel-2">
            <div className={cn('h-full rounded-full', color)} style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Evenly spaced columns, for hours of the day and days of the week */
export function Columns({ values, labels, color = 'bg-sky', height = 110 }: { values: number[]; labels: string[]; color?: string; height?: number }) {
  const max = Math.max(1, ...values);
  return (
    <div>
      <div className="flex items-end gap-[3px]" style={{ height }}>
        {values.map((v, i) => (
          <div key={i} className="flex h-full flex-1 items-end" title={`${labels[i]}: ${v}`}>
            <div className={cn('w-full rounded-t-sm', color)} style={{ height: v ? `${Math.max(4, (v / max) * 100)}%` : '2px', opacity: v ? 1 : 0.25 }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-[3px] text-[9px] text-mute">
        {labels.map((l, i) => (
          <span key={i} className="flex-1 text-center">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Empty({ text = 'Nothing yet' }: { text?: string }) {
  return <p className="py-4 text-center text-sm text-mute">{text}</p>;
}

export function Section({ title, hint, children, className }: { title: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-3xl border border-line bg-panel p-4', className)}>
      <h2 className="font-display text-lg font-extrabold">{title}</h2>
      {hint && <p className="mb-3 text-xs text-mute">{hint}</p>}
      {!hint && <div className="mb-3" />}
      {children}
    </section>
  );
}

export function Stat({ label, value, sub, tone }: { label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: 'brand' | 'gold' | 'sky' | 'danger' }) {
  const color = { brand: 'text-brand', gold: 'text-gold', sky: 'text-sky', danger: 'text-danger' }[tone ?? 'brand'];
  return (
    <div className="rounded-2xl border border-line bg-panel p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-mute">{label}</div>
      <div className={cn('font-display text-3xl font-extrabold leading-tight', color)}>{value}</div>
      {sub && <div className="text-xs text-mute">{sub}</div>}
    </div>
  );
}

export function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  if (rows.length === 0) return <Empty />;
  return (
    <div className="-mx-1 overflow-x-auto">
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-mute">
            {head.map((h, i) => (
              <th key={h} className={cn('px-1 py-1.5 font-semibold', i > 0 && 'text-right')}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line/60">
              {r.map((c, j) => (
                <td key={j} className={cn('px-1 py-2', j > 0 && 'text-right tabular-nums')}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
