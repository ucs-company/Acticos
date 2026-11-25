import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useMotionEnabled from '@/hooks/useMotionEnabled';
import { isMissing } from '@/utils/format';
import ProductThumb from './ProductThumb';

const EASE = [0.22, 1, 0.36, 1];

export default function ProductCard({ product, index = 0 }) {
  const { slug, name, code, inci, applications, category, isSample } = product;
  const reduce = !useMotionEnabled();
  const sampleHref = `/request-sample?product=${encodeURIComponent(name)}`;

  return (
    <motion.article
      layout
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.36), ease: EASE, layout: { duration: 0.45, ease: EASE } }}
      whileHover={reduce ? undefined : { y: -6, transition: { duration: 0.2 } }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-[box-shadow,border-color] duration-300 hover:border-electric/40 hover:shadow-lift"
    >
      <Link to={`/products/${slug}`} aria-label={`View ${name}`} className="relative block aspect-[16/10] overflow-hidden bg-navy-800">
        <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
          <ProductThumb product={product} />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-black/25 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">{category.name}</span>
        {isSample && <span className="absolute bottom-3 right-3 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">Sample data</span>}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-mist-600">{code}</p>
          {category.visual && <span className="h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden="true" />}
        </div>
        <h3 className="mt-2 text-xl font-semibold leading-snug">
          <Link to={`/products/${slug}`} className="transition-colors hover:text-electric">{name}</Link>
        </h3>

        <dl className="mt-4 text-[15px]">
          <dt className="text-xs font-medium text-mist-600">INCI</dt>
          <dd className={isMissing(inci) ? 'text-amber-700' : 'text-ink'}>{inci}</dd>
        </dl>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {applications.slice(0, 3).map((a) => (
            <li key={a.slug} className="rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-mist-600 transition-colors group-hover:bg-mist-200">{a.name}</li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <Link to={`/products/${slug}`} className="group/link inline-flex items-center gap-1.5 text-[15px] font-medium text-electric">
            View details
            <svg className="h-4 w-4 transition-transform group-hover/link:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          </Link>
          <Link to={sampleHref} className="relative z-10 inline-flex min-h-[36px] items-center rounded-full border border-ink/15 px-3.5 text-xs font-medium text-ink transition-colors hover:border-electric hover:text-electric">
            Request sample
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
