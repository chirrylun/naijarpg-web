'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useMe } from '@/hooks/useMe';
import { APPROACHES } from '@/lib/constants';
import { errorText } from '@/lib/api';
import { fillNames } from '@/lib/narrative';
import { emitAck } from '@/lib/socket';
import { useToast } from '@/stores/toast';
import { cn } from '@/lib/utils';
import type { Approach, RoomState } from '@/types';

// Rendered with key={room.id:round}, so its state resets every new round
export function ChoicePanel({ room, acted }: { room: RoomState; acted: boolean }) {
  const { data: me } = useMe();
  const [approach, setApproach] = useState<Approach | null>(null);
  const [busy, setBusy] = useState(false);
  const locked = acted || busy;

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
        {room.scene?.choices.map((c) => {
          const a = APPROACHES[c.approach];
          const mod = Math.min(me?.stats?.[c.approach] ?? 0, 3);
          const on = approach === c.approach;
          return (
            <button
              key={c.approach}
              disabled={locked}
              onClick={() => setApproach(c.approach)}
              className={cn('flex items-center gap-3 rounded-2xl border p-3 text-left transition', on ? 'border-brand bg-brand/10' : 'border-line bg-panel hover:border-brand/50', locked && 'opacity-60')}
            >
              <span className="text-2xl">{a.emoji}</span>
              <span className="flex-1">
                <span className="block text-xs font-bold uppercase tracking-wide text-mute">{a.label}</span>
                <span className="block font-semibold">{fillNames(c.label, room, me?.id)}</span>
              </span>
              <span className="rounded-lg bg-panel-2 px-2 py-1 text-xs font-bold text-brand">
                {mod >= 0 ? '+' : ''}
                {mod}
              </span>
            </button>
          );
        })}
      </div>

      {locked ? (
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