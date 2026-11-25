import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';
import useMotionEnabled from '@/hooks/useMotionEnabled';

// Smoothly animates between numeric values (result counts, stats).
export default function AnimatedNumber({ value = 0, className = '' }) {
  const reduce = !useMotionEnabled();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    prev.current = value;
    if (reduce || from === value) { setDisplay(value); return undefined; }
    const controls = animate(from, value, { duration: 0.5, ease: 'easeOut', onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [value, reduce]);

  return <span className={className}>{display}</span>;
}
