'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { fillNames } from '@/lib/narrative';
import { useSession } from '@/stores/session';
import type { RoomState } from '@/types';

export function ScenarioCard({ room }: { room: RoomState }) {
  const myId = useSession((s) => s.session?.user.id);
  const scene = room.scene;
  if (!scene) return null;
  const fill = (t: string | null) => fillNames(t, room, myId);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={`${scene.key}:${room.round}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
        {room.recap && (
          <div className="rounded-2xl border border-gold/30 bg-gold/5 px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gold">Previously…</div>
            <p className="mt-0.5 text-sm leading-relaxed text-ink/90">{room.recap}</p>
          </div>
        )}
        <Card>
          <p className="text-xs font-bold uppercase tracking-wider text-mute">{room.scenario.title}</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold">{fill(scene.title)}</h2>
          <p className="mt-2 leading-relaxed text-ink/90">{fill(scene.text)}</p>
          {scene.stakes && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-danger/30 bg-danger/10 px-3 py-1 text-xs font-bold text-danger">
              ⚔️ At stake: {fill(scene.stakes)}
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}