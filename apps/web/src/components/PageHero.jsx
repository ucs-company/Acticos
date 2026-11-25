import { motion } from 'framer-motion';
import useMotionEnabled from '@/hooks/useMotionEnabled';
import Breadcrumb from './Breadcrumb';

const EASE = [0.22, 1, 0.36, 1];

// Every public page opens with this dark band so the transparent header always sits on navy.
export default function PageHero({ title, text, crumbs, children, visual, badge }) {
  const reduce = !useMotionEnabled();
  const up = (d) => (reduce ? {} : { initial: { opacity: 0, y: 26 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.65, delay: d, ease: EASE } });
  return (
    <section className="relative overflow-hidden bg-navy-900 pt-32 text-white md:pt-40">
      <div className="grid-bg absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true" />
      {visual && (
        <motion.div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block"
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE }}
        >
          {visual}
        </motion.div>
      )}
      <div className="container-page relative pb-16 md:pb-24">
        {crumbs && <motion.div {...up(0)}><Breadcrumb items={crumbs} dark /></motion.div>}
        {badge && (
          <motion.div {...up(0.04)} className="mt-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm text-white/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden="true" />
              {badge}
            </span>
          </motion.div>
        )}
        <motion.h1 {...up(0.08)} className={`${badge ? 'mt-4' : 'mt-5'} max-w-3xl font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl`}>{title}</motion.h1>
        {text && <motion.p {...up(0.16)} className="lead-dark mt-5">{text}</motion.p>}
        {children && <motion.div {...up(0.24)} className="mt-8 flex flex-wrap gap-3">{children}</motion.div>}
      </div>
    </section>
  );
}
