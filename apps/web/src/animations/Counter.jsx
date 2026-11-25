import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useMotionEnabled from '@/hooks/useMotionEnabled';

gsap.registerPlugin(ScrollTrigger);

export default function Counter({ to, suffix = '', className = '' }) {
  const ref = useRef(null);
  const reduce = !useMotionEnabled();
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    el.textContent = `${reduce ? to : 0}${suffix}`;
    if (reduce) return undefined;
    const obj = { v: 0 };
    const tween = gsap.to(obj, { v: to, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true }, onUpdate: () => { el.textContent = `${Math.round(obj.v)}${suffix}`; } });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [to, suffix, reduce]);
  return <span ref={ref} className={className}>{to}{suffix}</span>;
}
