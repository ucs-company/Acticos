import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useMotionEnabled from '@/hooks/useMotionEnabled';

gsap.registerPlugin(ScrollTrigger);

export default function GsapImageParallax({ children, className = '', amount = 4, scale = 1.08 }) {
  const root = useRef(null);
  const reduce = !useMotionEnabled();

  useLayoutEffect(() => {
    if (reduce || !root.current) return undefined;
    const target = root.current.querySelector('img') || root.current.firstElementChild;
    if (!target) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(target, { yPercent: -amount, scale }, {
        yPercent: amount,
        scale,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduce, amount, scale]);

  return <div ref={root} className={`overflow-hidden ${className}`}>{children}</div>;
}
