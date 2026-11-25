import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useMotionEnabled from '@/hooks/useMotionEnabled';
import SceneCanvas from '@/animations/SceneCanvas';

const EASE = [0.22, 1, 0.36, 1];

export default function CategoryCard({ category, index = 0 }) {
  const reduce = !useMotionEnabled();
  return (
    <motion.div
      className="h-full"
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.09, 0.4), ease: EASE }}
      whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.25 } }}
    >
      <Link to={`/products/${category.slug}`} className="group relative flex h-full min-h-[26rem] flex-col justify-between overflow-hidden rounded-3xl bg-navy-800 p-7 text-white transition-shadow duration-500 hover:shadow-glow">
        <div className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"><SceneCanvas scene={category.visual} label={`${category.name} visual`} /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" aria-hidden="true" />
        <span className="relative text-sm text-white/60">{category._count?.products ?? ''} {category._count ? 'products' : ''}</span>
        <div className="relative">
          <h3 className="text-2xl font-semibold leading-tight">{category.name}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-white/70">{category.description?.replace(/\s*\[DATA REQUIRED[^\]]*\]/, '')}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-medium text-cyan">
            Explore category
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
