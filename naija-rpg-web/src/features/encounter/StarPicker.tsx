import { STAR_PLAYS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { StarPlay } from '../../types';

export function StarPicker({ value, onChange, balance }: { value: StarPlay | null; onChange: (v: StarPlay | null) => void; balance: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-mute">
        <span>Boost your roll (optional)</span>
        <span className="text-gold">★ {balance}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(STAR_PLAYS) as StarPlay[]).map((k) => {
          const s = STAR_PLAYS[k];
          const off = balance < s.cost;
          const on = value === k;
          return (
            <button
              key={k}
              type="button"
              disabled={off}
              onClick={() => onChange(on ? null : k)}
              className={cn('rounded-2xl border p-2 text-center transition', on ? 'border-gold bg-gold/10' : 'border-line bg-panel', off && 'opacity-40')}
            >
              <div className="font-display text-sm font-extrabold">{s.label}</div>
              <div className="text-[11px] leading-tight text-mute">{s.blurb}</div>
              <div className="mt-1 text-xs font-bold text-gold">★ {s.cost}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}