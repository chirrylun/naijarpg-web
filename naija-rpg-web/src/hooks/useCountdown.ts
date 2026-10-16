import { useEffect, useState } from 'react';

export function useCountdown(deadline: number | null, totalMs = 40_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!deadline) return;
    const iv = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(iv);
  }, [deadline]);
  const ms = deadline ? Math.max(0, deadline - now) : 0;
  return { secs: Math.ceil(ms / 1000), frac: totalMs ? Math.min(1, ms / totalMs) : 0 };
}