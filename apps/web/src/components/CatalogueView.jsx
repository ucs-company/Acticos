import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useMotionEnabled from '@/hooks/useMotionEnabled';
import { catalogue } from '@/services/catalogue';
import { useAsync } from '@/hooks/useAsync';
import { useDebounce } from '@/hooks/useDebounce';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import { Loading, ErrorState, EmptyState } from './States';
import Reveal from '@/animations/Reveal';
import AnimatedNumber from '@/animations/AnimatedNumber';
import Button from './Button';
import CatalogueSearch from './CatalogueSearch';
import MobileFilterSheet from './MobileFilterSheet';

const PAGE_SIZE = 9;

// Reusable listing: used by /products (all) and each category page.
export default function CatalogueView({ categorySlug = null, categories, applications, solutions }) {
  const [params, setParams] = useSearchParams();
  const [qInput, setQInput] = useState(params.get('q') || '');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const q = useDebounce(qInput, 300);
  const application = params.get('application') || '';
  const fn = params.get('fn') || '';
  const sort = params.get('sort') || 'name-asc';
  const page = Number(params.get('page') || 1);
  const category = categorySlug || params.get('category') || '';
  const reduce = !useMotionEnabled();

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries({ page: undefined, ...patch }).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };
  useEffect(() => { if ((params.get('q') || '') !== q) update({ q }); /* eslint-disable-next-line */ }, [q]);

  const { data, meta, loading, error, reload } = useAsync(
    () => catalogue.products({ q, category, application, fn, sort, page, pageSize: PAGE_SIZE }),
    [q, category, application, fn, sort, page],
  );
  const hasFilters = Boolean(q || application || fn || (!categorySlug && category) || sort !== 'name-asc');
  const activeCount = [application, fn, !categorySlug && category, sort !== 'name-asc' && sort].filter(Boolean).length;
  const clear = () => { setQInput(''); setParams({}, { replace: true }); };
  const select = 'field !py-2.5 !text-[15px]';
  const sidebar = useMemo(() => [{ slug: '', name: 'All Products', to: '/products' }, ...categories.map((c) => ({ ...c, to: `/products/${c.slug}` }))], [categories]);

  return (
    <div className="container-page grid min-w-0 gap-10 py-14 lg:grid-cols-[260px_1fr]">
      <aside aria-label="Product categories" className="min-w-0">
        <Reveal as="nav" className="min-w-0 lg:sticky lg:top-28">
          <h2 className="mb-3 text-sm font-medium text-mist-600">Categories</h2>
          <ul className="flex flex-wrap gap-2 pb-2 lg:flex-col lg:gap-1">
            {sidebar.map((c) => {
              const active = (c.slug || null) === (categorySlug || null);
              return (
                <li key={c.slug || 'all'} className="shrink-0">
                  <Link to={c.to} aria-current={active ? 'page' : undefined} className={`relative block overflow-hidden rounded-xl border px-4 py-2.5 text-[15px] leading-snug transition-colors ${active ? 'border-navy-900 font-medium text-white' : 'border-ink/15 bg-white text-ink hover:border-electric/50 hover:bg-mist'}`}>
                    {active && <motion.span layoutId="cat-active" className="absolute inset-0 rounded-xl bg-navy-900" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                    <span className="relative z-10">{c.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </aside>

      <div className="min-w-0">
        <Reveal>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <CatalogueSearch value={qInput} onChange={setQInput} />
            <button type="button" onClick={() => setFiltersOpen(true)} className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-ink/15 bg-white px-4 text-sm font-medium text-ink sm:hidden">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 5h14M5.5 10h9M8 15h4" /></svg>
              Filters{activeCount ? ` (${activeCount})` : ''}
            </button>
            <div className="hidden gap-3 sm:col-span-2 sm:grid sm:grid-cols-2 xl:col-span-4 xl:grid-cols-4">
              {!categorySlug && (
                <select aria-label="Filter by category" className={select} value={category} onChange={(e) => update({ category: e.target.value })}>
                  <option value="">All categories</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              )}
              <select aria-label="Filter by application" className={select} value={application} onChange={(e) => update({ application: e.target.value })}>
                <option value="">All applications</option>{applications.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
              </select>
              <select aria-label="Filter by formulation goal" className={select} value={fn} onChange={(e) => update({ fn: e.target.value })}>
                <option value="">All formulation goals</option>{solutions.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
              <select aria-label="Sort products" className={select} value={sort} onChange={(e) => update({ sort: e.target.value })}>
                <option value="name-asc">Name A to Z</option><option value="name-desc">Name Z to A</option>
              </select>
            </div>
          </div>
        </Reveal>
        <MobileFilterSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} categories={categories} applications={applications} solutions={solutions} category={category} application={application} fn={fn} sort={sort} update={update} clear={clear} categorySlug={categorySlug} activeCount={activeCount} />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-mist-600" aria-live="polite">
            {loading ? 'Loading ingredients' : <><AnimatedNumber value={meta?.total ?? 0} className="font-semibold text-ink" /> {meta?.total === 1 ? 'ingredient' : 'ingredients'}</>}
          </p>
          <AnimatePresence>
            {hasFilters && !loading && (
              <motion.button
                type="button"
                onClick={clear}
                className="rounded-full border border-ink/15 px-3.5 py-1.5 text-sm font-medium transition-colors hover:border-electric hover:text-electric"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                Clear filters
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4">
          {loading ? <Loading label="Loading ingredients" />
            : error ? <ErrorState error={error} onRetry={reload} />
            : !data?.length ? <EmptyState action={hasFilters && <Button variant="outlineDark" className="mt-6" onClick={clear}>Clear filters</Button>} />
            : (
              <motion.div layout={!reduce} className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.map((p, i) => <ProductCard key={p.slug} product={p} index={i} />)}
              </motion.div>
            )}
        </div>
        {meta && <Pagination page={meta.page} totalPages={meta.totalPages} onChange={(n) => { update({ page: n === 1 ? '' : String(n) }); window.scrollTo({ top: 360, behavior: 'smooth' }); }} />}
      </div>
    </div>
  );
}
