'use client';

import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [shown, setShown] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.8,
      ease: 'easeOut',
      onUpdate: (v) => setShown(Math.round(v)),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value]);
  return <span className={className}>{shown.toLocaleString('en-NG')}</span>;
}