import { useState, useEffect, useRef } from 'react';

export function useTimer(deadline: number | null, onExpire?: () => void) {
  const [remaining, setRemaining] = useState(0);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (!deadline) {
      setRemaining(0);
      expiredRef.current = false;
      return;
    }

    expiredRef.current = false;

    const tick = () => {
      const now = Date.now();
      const left = Math.max(0, deadline - now);
      setRemaining(left);
      if (left <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire?.();
      }
    };

    tick();
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, [deadline, onExpire]);

  return remaining;
}
