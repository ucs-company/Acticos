import { useEffect, useRef } from 'react';
import useMotionEnabled from '@/hooks/useMotionEnabled';
import { SCENES, STATIC_TIME } from './engine';

// Renders one scene. Pauses off-screen / hidden tab. Draws a single frame for reduced motion.
export default function SceneCanvas({ scene = 'hero', className = '', label }) {
  const ref = useRef(null);
  const reduce = !useMotionEnabled();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let raf = 0, visible = true, draw, start = performance.now();

    const setup = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw = SCENES[scene](width, height);
      frame(performance.now());
    };
    const frame = (now) => {
      if (!draw) return;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      draw(ctx, reduce ? STATIC_TIME : now - start);
      if (!reduce && visible) raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); setup(); });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [scene, reduce]);

  return <canvas ref={ref} className={`block h-full w-full ${className}`} role="img" aria-label={label || 'Decorative scientific animation'} />;
}
