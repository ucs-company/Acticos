import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useMotionEnabled from '@/hooks/useMotionEnabled';
import { getCategoryAccent } from '@/config/categoryAccents';
import { cloudinaryImage } from '@/utils/images';
import ProductActions from './ProductActions';

const EASE = [0.22, 1, 0.36, 1];
const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

export default function ProductCard({ product, index = 0 }) {
  const { slug, name, code, applications, solutions, category, isSample, imageUrl } = product;
  const reduce = !useMotionEnabled();
  const accent = getCategoryAccent(category.slug);
  const primaryGoal = solutions?.[0]?.name;
  const sampleHref = `/request-sample?product=${encodeURIComponent(name)}`;
  const showCode = normalize(code) && normalize(code) !== normalize(name);

  const seen = new Set();
  const chips = [];
  for (const label of [primaryGoal, ...applications.map((application) => application.name)]) {
    const key = normalize(label);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    chips.push({ label, primary: label === primaryGoal });
  }

  return (
    <motion.article
      layout
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: EASE, layout: { duration: 0.4, ease: EASE } }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-[border-color,box-shadow] duration-300 hover:border-electric/40 hover:shadow-lift"
    >
      <span className={`absolute inset-x-0 top-0 z-20 h-1 ${accent.bar} opacity-80 transition-opacity duration-300 group-hover:opacity-100`} aria-hidden="true" />

      {imageUrl && (
        <Link to={`/products/${slug}`} aria-label={`View ${name}`} className="relative block aspect-[16/10] overflow-hidden bg-navy-900">
          <img src={cloudinaryImage(imageUrl, 800, 500)} alt={name} loading={index < 4 ? 'eager' : 'lazy'} decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className={`inline-block max-w-full truncate rounded-full border px-2.5 py-1 text-xs font-medium ${accent.soft} ${accent.border} ${accent.text}`}>{category.name}</span>
            {showCode && <p className="mt-2 text-xs font-medium uppercase tracking-wide text-mist-600">{code}</p>}
          </div>
          <ProductActions product={product} className="shrink-0" />
        </div>
        <h3 className="mt-4 text-xl font-semibold leading-snug">
          <Link to={`/products/${slug}`} className="transition-colors hover:text-electric">{name}</Link>
        </h3>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {chips.slice(0, 3).map((chip) => (
            <li key={chip.label} className={chip.primary ? 'rounded-full border border-electric/20 bg-electric/10 px-2.5 py-1 text-xs font-medium text-electric' : 'rounded-full border border-ink/10 px-2.5 py-1 text-xs font-medium text-mist-600 transition-colors group-hover:border-electric/20 group-hover:bg-mist'}>{chip.label}</li>
          ))}
        </ul>

        {isSample && <span className="mt-3 w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">Sample data</span>}

        <div className="mt-auto flex items-center justify-between gap-2 pt-6">
          <Link to={`/products/${slug}`} className="group/link inline-flex min-h-[36px] items-center gap-1.5 whitespace-nowrap text-sm font-medium text-electric">
            View details
            <svg className="h-4 w-4 shrink-0 transition-transform group-hover/link:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          </Link>
          <Link to={sampleHref} className="relative z-10 inline-flex min-h-[34px] shrink-0 items-center whitespace-nowrap rounded-full border border-ink/15 px-3 text-xs font-medium text-ink transition-colors hover:border-electric hover:text-electric" title="Request sample">
            Sample
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
