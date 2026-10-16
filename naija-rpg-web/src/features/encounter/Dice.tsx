'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const rand = () => 1 + Math.floor(Math.random() * 20);

export function Dice({ value, delay = 0 }: { value: number; delay?: number }) {
  const [shown, setShown] = useState(rand);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let iv: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      let n = 0;
      iv = setInterval(() => {
        n += 1;
        if (n > 12) {
          if (iv) clearInterval(iv);
          setShown(value);
          setDone(true);
        } else setShown(rand());
      }, 75);
    }, delay);
    return () => {
      clearTimeout(start);
      if (iv) clearInterval(iv);
    };
  }, [value, delay]);

  const crit = done && value === 20;
  const fumble = done && value === 1;
  return (
    <motion.div
      animate={done ? { rotate: 0, scale: [1.3, 1] } : { rotate: 360 }}
      transition={done ? { type: 'spring', stiffness: 300 } : { repeat: Infinity, duration: 0.6, ease: 'linear' }}
      className="relative size-20"
    >
      <svg viewBox="0 0 100 100" className="size-full">
        <polygon
          points="50,4 93,28 93,72 50,96 7,72 7,28"
          className={cn('transition-colors', crit ? 'fill-gold' : fumble ? 'fill-danger' : 'fill-panel-2')}
          stroke={crit ? '#c78f00' : fumble ? '#b03a3a' : 'var(--color-brand)'}
          strokeWidth="4"
        />
        <text x="50" y="62" textAnchor="middle" fontSize="36" fontWeight="800" className={cn(crit || fumble ? 'fill-[#1a1100]' : 'fill-ink')}>
          {shown}
        </text>
      </svg>
    </motion.div>
  );
}