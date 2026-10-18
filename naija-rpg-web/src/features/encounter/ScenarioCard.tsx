'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { fillNames } from '@/lib/narrative';
import { useSession } from '@/stores/session';
import type { RoomState } from '../../types';

/** `ready` is false while the stage plays its opening, so the text lands after the scene is set. */
export function ScenarioCard({ room, ready = true }: { room: RoomState; ready?: boolean }) {
  const myId = useSession((s) => s.session?.user.id);
  const scene = room.scene;
  if (!scene) return null;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${scene.key}:${room.round}`}
        initial={{ opacity: 0, y: 12 }}
        animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        exit={{ opacity: 0, y: -8 }}
      >
        {room.recap && (
          <div className="mb-3 rounded-2xl border border-gold/30 bg-gold/5 px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gold">What just happened</div>
            <p className="mt-0.5 text-sm leading-relaxed text-ink/90">{fillNames(room.recap, room, myId)}</p>
          </div>
        )}
        <Card>
          <p className="text-xs font-bold uppercase tracking-wider text-mute">{room.scenario.title}</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold">{fillNames(scene.title, room, myId)}</h2>
          <p className="mt-2 leading-relaxed text-ink/90">{fillNames(scene.text, room, myId)}</p>
          {scene.stakes && (
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-brand/20 bg-gradient-to-r from-brand/10 to-sky/10 px-3 py-2.5">
              <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand/20 text-[11px] text-brand">✦</span>
              <p className="text-sm leading-snug text-ink/90">{fillNames(scene.stakes, room, myId)}</p>
            </div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}