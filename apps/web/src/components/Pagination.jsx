import { motion } from 'framer-motion';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const btn = 'relative min-h-[44px] min-w-[44px] overflow-hidden rounded-full px-4 text-[15px] font-medium transition-colors';
  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
      <button className={`${btn} border border-ink/15 hover:border-electric disabled:opacity-40`} disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button key={n} aria-current={n === page ? 'page' : undefined} className={`${btn} ${n === page ? 'text-white' : 'hover:bg-mist'}`} onClick={() => onChange(n)}>
          {n === page && <motion.span layoutId="page-pill" className="absolute inset-0 rounded-full bg-navy-900" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span className="relative z-10">{n}</span>
        </button>
      ))}
      <button className={`${btn} border border-ink/15 hover:border-electric disabled:opacity-40`} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </nav>
  );
}
