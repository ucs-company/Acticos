import { Link } from 'react-router-dom';

const ICONS = {
  preservation: <><path d="M12 3 5 6v5c0 4.2 2.7 7.4 7 9 4.3-1.6 7-4.8 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  moisturization: <><path d="M12 3s6 6.4 6 10.5A6 6 0 0 1 6 13.5C6 9.4 12 3 12 3Z" /><path d="M9.5 14.5c.5 1 1.4 1.7 2.5 1.9" /></>,
  brightening: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  'anti-aging': <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l2.5 2.5" /></>,
  'hair-scalp': <><path d="M7 20c0-5 2-9 5-9s5 4 5 9" /><path d="M9.5 20c0-4 1.1-7 2.5-7s2.5 3 2.5 7" /><path d="M6 7c3-3 9-3 12 0" /></>,
  'sun-care': <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  'texture-sensory': <><path d="m12 3 8 4-8 4-8-4 8-4Z" /><path d="m4 12 8 4 8-4" /><path d="m4 17 8 4 8-4" /></>,
};

export default function SolutionCard({ solution }) {
  const count = Number(solution._count?.products || 0);
  return (
    <Link to={`/products?fn=${solution.slug}`} className="js-gsap-item group flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-6 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-electric/40 hover:shadow-lift sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-electric/10 text-electric">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[solution.slug] || ICONS['texture-sensory']}</svg>
        </span>
        <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-mist-600">{count} {count === 1 ? 'ingredient' : 'ingredients'}</span>
      </div>
      <h2 className="mt-6 font-display text-2xl font-semibold leading-tight">{solution.name}</h2>
      {solution.description && <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-mist-600">{solution.description}</p>}
      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-electric">
        See ingredients
        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
      </span>
    </Link>
  );
}
