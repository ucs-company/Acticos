import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useMotionEnabled from '@/hooks/useMotionEnabled';
import { isMissing } from '@/utils/format';

const EASE = [0.22, 1, 0.36, 1];

export default function ProductCard({ product, index = 0 }) {
  const { slug, name, code, inci, applications, category, isSample } = product;
  const reduce = !useMotionEnabled();
  const sampleHref = `/request-sample?product=${encodeURIComponent(name)}`;

  return (
    <motion.article
      layout
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: EASE, layout: { duration: 0.4, ease: EASE } }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white p-6 transition-[border-color,box-shadow] duration-300 hover:border-electric/40 hover:shadow-lift"
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan to-electric opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />

      <div className="flex flex-wrap items-start justify-between gap-2">
        <span className="max-w-[72%] truncate rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-mist-600">{category.name}</span>
        <span className="text-xs font-medium uppercase tracking-wide text-mist-600">{code}</span>
      </div>

      <h3 className="mt-4 text-xl font-semibold leading-snug">
        <Link to={`/products/${slug}`} className="transition-colors hover:text-electric">{name}</Link>
      </h3>

      <dl className="mt-4 text-[15px]">
        <dt className="text-xs font-medium text-mist-600">INCI</dt>
        <dd className={`mt-1 line-clamp-3 ${isMissing(inci) ? 'text-amber-700' : 'text-ink'}`}>{inci}</dd>
      </dl>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {applications.slice(0, 3).map((application) => (
          <li key={application.slug} className="rounded-full border border-ink/10 px-2.5 py-1 text-xs font-medium text-mist-600 transition-colors group-hover:border-electric/20 group-hover:bg-mist">
            {application.name}
          </li>
        ))}
      </ul>

      {isSample && <span className="mt-4 w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">Sample data</span>}

      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <Link to={`/products/${slug}`} className="group/link inline-flex items-center gap-1.5 text-[15px] font-medium text-electric">
          View details
          <svg className="h-4 w-4 transition-transform group-hover/link:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </Link>
        <Link to={sampleHref} className="relative z-10 inline-flex min-h-[36px] items-center rounded-full border border-ink/15 px-3.5 text-xs font-medium text-ink transition-colors hover:border-electric hover:text-electric">
          Request sample
        </Link>
      </div>
    </motion.article>
  );
}
