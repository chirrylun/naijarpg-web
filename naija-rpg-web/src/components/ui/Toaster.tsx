'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/stores/toast';
import { cn } from '@/lib/utils';

const TONE = {
  good: 'border-brand/50 bg-brand/15 text-brand',
  bad: 'border-danger/50 bg-danger/15 text-danger',
  info: 'border-line bg-panel-2 text-ink',
};

export function Toaster() {
  const items = useToast((s) => s.items);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn('pointer-events-auto rounded-2xl border px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur', TONE[t.tone])}
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}