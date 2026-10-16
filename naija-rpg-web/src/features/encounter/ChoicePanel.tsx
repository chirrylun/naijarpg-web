'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useMe } from '@/hooks/useMe';
import { APPROACHES } from '@/lib/constants';
import { errorText } from '@/lib/api';
import { fillNames } from '@/lib/narrative';
import { emitAck } from '@/lib/socket';
import { openMoves } from '@/lib/storyFx';
import { useToast } from '@/stores/toast';
import { cn } from '@/lib/utils';
import type { Approach, RoomState } from '@/types';

// Rendered with key={room.id:round}, so its state resets every new round
export function ChoicePanel({ room, acted }: { room: RoomState; acted: boolean }) {
  const { data: me } = useMe();
  const [approach, setApproach] = useState<Approach | null>(null);
  const [busy, setBusy] = useState(false);
  const done = acted || busy;
  const moves = openMoves(room, me?.id);

  async function lock() {
    if (!approach) return;
    setBusy(true);
    try {
      await emitAck('round:submit', { approach });
    } catch (e) {
      useToast.getState().push(errorText(e), 'bad');
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        {moves.map(({ c, tags, locked }) => {
          const a = APPROACHES[c.approach];
          const mod = Math.min(me?.stats?.[c.approach] ?? 0, 3);
          const on = approach === c.approach;
          const blocked = locked !== null;
          return (
            <button
              key={c.approach}
              type="button"
              disabled={done || blocked}
              aria-pressed={on}
              onClick={() => setApproach(c.approach)}
              className={cn(
                'flex items-center gap-3 rounded-2xl border p-3 text-left transition',
                blocked
                  ? 'cursor-not-allowed border-line bg-panel/40'
                  : on
                    ? 'border-brand bg-brand/10'
                    : 'border-line bg-panel hover:border-brand/50',
                done && !blocked && 'opacity-60',
              )}
            >
              <span className={cn('text-2xl', blocked && 'opacity-40 grayscale')}>{a.emoji}</span>
              <span className="flex-1">
                <span className="block text-xs font-bold uppercase tracking-wide text-mute">{a.label}</span>
                <span className={cn('block font-semibold', blocked && 'text-mute')}>{fillNames(c.label, room, me?.id)}</span>

                {blocked ? (
                  <span className="mt-1 block text-xs font-bold text-danger">🔒 {locked}</span>
                ) : (
                  tags.length > 0 && (
                    <span className="mt-1 flex flex-wrap gap-1">
                      {tags.map((t, i) => (
                        <span
                          key={i}
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[11px] font-bold',
                            t.delta < 0 ? 'bg-brand/15 text-brand' : 'bg-orange-400/15 text-orange-300',
                          )}
                        >
                          {t.delta < 0 ? '👍 Easier' : '⚠️ Harder'} · {t.label}
                        </span>
                      ))}
                    </span>
                  )
                )}
              </span>
              {!blocked && (
                <span className="rounded-lg bg-panel-2 px-2 py-1 text-xs font-bold text-brand">
                  {mod >= 0 ? '+' : ''}
                  {mod}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {done ? (
        <div className="rounded-2xl border border-brand/30 bg-brand/5 p-4 text-center font-semibold text-brand">
          Locked in ✓ <span className="animate-pulse text-mute">waiting for the others…</span>
        </div>
      ) : (
        <Button size="lg" className="w-full" disabled={!approach} onClick={lock}>
          Lock it in
        </Button>
      )}
    </div>
  );
}