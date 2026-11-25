import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useMotionEnabled from '@/hooks/useMotionEnabled';

gsap.registerPlugin(ScrollTrigger);

// GSAP scroll parallax. Returns a ref to attach to the element that should drift.
// The trigger is the element's parent by default so it scrubs against its section.
export default function useParallax({ from = -8, to = 8, trigger, scrub = true } = {}) {
  const ref = useRef(null);
  const reduce = !useMotionEnabled();

  useLayoutEffect(() => {
    const el = ref.current;
    if (reduce || !el) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: from },
        {
          yPercent: to,
          ease: 'none',
          scrollTrigger: {
            trigger: trigger || el.parentElement || el,
            start: 'top bottom',
            end: 'bottom top',
            scrub,
          },
        },
      );
    });
    return () => ctx.revert();
  }, [reduce, from, to, trigger, scrub]);

  return ref;
}
