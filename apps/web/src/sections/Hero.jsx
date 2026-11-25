import { motion } from 'framer-motion';
import useMotionEnabled from '@/hooks/useMotionEnabled';
import SceneCanvas from '@/animations/SceneCanvas';
import AnimatedWords from '@/animations/AnimatedWords';
import useParallax from '@/animations/useParallax';
import Button from '@/components/Button';

export default function Hero() {
  const reduce = !useMotionEnabled();
  const gridRef = useParallax({ from: -6, to: 6 });
  const up = (d) => (reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] } });
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-navy-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_75%_45%,rgba(78,138,46,.35),transparent_70%)]" aria-hidden="true" />
      <div ref={gridRef} className="grid-bg absolute -inset-y-[8%] inset-x-0 opacity-70 [mask-image:radial-gradient(70%_70%_at_70%_50%,black,transparent)]" aria-hidden="true" />
      <div className="absolute inset-0"><SceneCanvas scene="hero" label="Animation: ingredients combine into a formulation, which spreads into a performing texture" /></div>
      <div className="container-page relative flex min-h-[100svh] items-center pb-20 pt-32">
        <div className="max-w-2xl">
          <AnimatedWords lines={['Advanced Ingredients.', 'Better Formulations.']} className="h-display" />
          <motion.p {...up(0.3)} className="lead-dark mt-7">High-performance specialty ingredients for innovative personal care and cosmetic formulations.</motion.p>
          <motion.div {...up(0.5)} className="mt-10 flex flex-wrap gap-3">
            <Button to="/products" size="lg">Explore Products</Button>
            <Button to="/technical-enquiry" variant="outline" size="lg">Talk to Our Experts</Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
