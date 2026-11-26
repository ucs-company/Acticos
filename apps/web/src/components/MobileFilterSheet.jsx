import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function MobileFilterSheet({ open, onClose, categories, applications, solutions, category, application, fn, sort, update, clear, categorySlug, activeCount }) {
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button type="button" aria-label="Close filters" onClick={onClose} className="fixed inset-0 z-[84] bg-black/50 sm:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div role="dialog" aria-modal="true" aria-label="Filter products" className="fixed inset-x-0 bottom-0 z-[85] max-h-[85svh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:hidden" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-electric">Refine</p>
                <h2 className="mt-1 font-display text-2xl font-semibold">Filters</h2>
              </div>
              <button type="button" onClick={onClose} aria-label="Close filters" className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 text-mist-600 hover:border-electric/40 hover:text-electric">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {!categorySlug && (
                <label className="grid gap-1.5 text-sm font-medium">Category<select className="field" value={category} onChange={(event) => update({ category: event.target.value })}><option value="">All categories</option>{categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
              )}
              <label className="grid gap-1.5 text-sm font-medium">Application<select className="field" value={application} onChange={(event) => update({ application: event.target.value })}><option value="">All applications</option>{applications.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
              <label className="grid gap-1.5 text-sm font-medium">Function<select className="field" value={fn} onChange={(event) => update({ fn: event.target.value })}><option value="">All functions</option>{solutions.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
              <label className="grid gap-1.5 text-sm font-medium">Sort<select className="field" value={sort} onChange={(event) => update({ sort: event.target.value })}><option value="name-asc">Name A to Z</option><option value="name-desc">Name Z to A</option></select></label>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={clear} className="min-h-[46px] flex-1 rounded-full border border-ink/15 px-4 text-sm font-medium text-ink">Clear all</button>
              <button type="button" onClick={onClose} className="min-h-[46px] flex-1 rounded-full bg-electric px-4 text-sm font-medium text-white">{activeCount ? `Show results (${activeCount})` : 'Show results'}</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
