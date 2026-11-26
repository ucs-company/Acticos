import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useMotionEnabled from '@/hooks/useMotionEnabled';

gsap.registerPlugin(ScrollTrigger);

export default function GsapRevealGrid({ children, className = '', count = 0, selector = '.js-gsap-item', y = 26, stagger = 0.07 }) {
  const root = useRef(null);
  const reduce = !useMotionEnabled();

  useLayoutEffect(() => {
    if (reduce || !root.current || !count) return undefined;
    const ctx = gsap.context(() => {
      gsap.from(selector, {
        opacity: 0,
        y,
        duration: 0.65,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: root.current, start: 'top 82%', once: true },
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, root);
    return () => ctx.revert();
  }, [reduce, count, selector, y, stagger]);

  return <div ref={root} className={className}>{children}</div>;
}
