import { motion, useScroll, useSpring } from 'framer-motion';
import useMotionEnabled from '@/hooks/useMotionEnabled';

export default function ScrollProgress() {
  const reduce = !useMotionEnabled();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-cyan to-electric"
      style={{ scaleX }}
    />
  );
}
