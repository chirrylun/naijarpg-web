'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { fillNames } from '@/lib/narrative';
import { useSession } from '@/stores/session';
import { Twists } from './StoryBits';
import type { RoomState } from '@/types';

export function ScenarioCard({ room }: { room: RoomState }) {
  const myId = useSession((s) => s.session?.user.id);
  const scene = room.scene;
  if (!scene) return null;
  return (
    <AnimatePresence mode="wait">
      <motion.div key={`${scene.key}:${room.round}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
        <Card>
          <p className="text-xs font-bold uppercase tracking-wider text-mute">{room.scenario.title}</p>
          <h2 className="mt-1 font-display text-2xl font-extrabold">{fillNames(scene.title, room, myId)}</h2>
          <p className="mt-2 leading-relaxed text-ink/90">{fillNames(scene.text, room, myId)}</p>
          {scene.stakes && <p className="mt-3 text-sm font-bold text-gold">At stake: {fillNames(scene.stakes, room, myId)}</p>}
          <Twists lines={(scene.twists ?? []).map((l) => fillNames(l, room, myId))} />
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}