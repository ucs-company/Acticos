import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useMotionEnabled from '@/hooks/useMotionEnabled';

gsap.registerPlugin(ScrollTrigger);

// Four sequential steps joined by a line that draws as you scroll. The content really is a sequence.
export default function ProcessSteps({ steps }) {
  const root = useRef(null);
  const reduce = !useMotionEnabled();
  useEffect(() => {
    if (reduce) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('.proc-line', { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom 65%', scrub: true } });
      gsap.utils.toArray('.proc-node').forEach((n, i) => gsap.fromTo(n, { opacity: 0.35 }, { opacity: 1, scrollTrigger: { trigger: root.current, start: `top ${75 - i * 6}%`, toggleActions: 'play none none reverse' } }));
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <ol ref={root} className="relative grid gap-10 md:grid-cols-4 md:gap-6">
      <div aria-hidden className="absolute left-[1.15rem] top-3 hidden h-px w-[calc(100%-2.3rem)] bg-white/15 md:block" />
      <div aria-hidden className="proc-line absolute left-[1.15rem] top-3 hidden h-px w-[calc(100%-2.3rem)] bg-gradient-to-r from-cyan to-electric md:block" />
      {steps.map((s, i) => (
        <li key={s.title} className="proc-node relative pl-12 md:pl-0 md:pt-12">
          <span className="absolute left-0 top-0 grid h-9 w-9 place-items-center rounded-full border border-cyan/60 bg-navy-900 font-display text-sm font-semibold text-cyan md:left-0">{String(i + 1).padStart(2, '0')}</span>
          <h3 className="text-xl font-semibold text-white">{s.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-white/65">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
