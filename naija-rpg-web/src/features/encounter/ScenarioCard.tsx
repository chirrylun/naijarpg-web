'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import type { RoomState } from '@/types';

export function ScenarioCard({ room }: { room: RoomState }) {
  const scene = room.scene;
  if (!scene) return null;
  return (
    <AnimatePresence mode="wait">
      <motion.div key={`${scene.key}:${room.round}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
        <Card>
          <p className="text-xs font-bold uppercase tracking-wider text-mute">{room.scenario.title}</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold">{scene.title}</h2>
          <p className="mt-2 leading-relaxed text-ink/90">{scene.text}</p>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}