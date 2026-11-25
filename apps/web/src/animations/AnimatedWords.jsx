import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import useMotionEnabled from '@/hooks/useMotionEnabled';

// GSAP word-by-word reveal. Each line is masked so words rise into place.
export default function AnimatedWords({ lines, className = '', as: Tag = 'h1' }) {
  const ref = useRef(null);
  const reduce = !useMotionEnabled();

  useLayoutEffect(() => {
    if (reduce || !ref.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.from('.word', { yPercent: 120, opacity: 0, duration: 0.9, ease: 'power4.out', stagger: 0.07 });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          {line.split(' ').map((word, j, arr) => (
            <span key={j} className="word inline-block will-change-transform">{word}{j < arr.length - 1 ? '\u00A0' : ''}</span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
