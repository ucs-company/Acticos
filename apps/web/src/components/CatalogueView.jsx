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

const PAGE_SIZE = 9;

// Reusable listing: used by /products (all) and each category page.
export default function CatalogueView({ categorySlug = null, categories, applications, solutions }) {
  const [params, setParams] = useSearchParams();
  const [qInput, setQInput] = useState(params.get('q') || '');
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
  const hasFilters = Boolean(q || application || fn || (!categorySlug && category));
  const clear = () => { setQInput(''); setParams({}, { replace: true }); };
  const select = 'field !py-2.5 !text-[15px]';
  const sidebar = useMemo(() => [{ slug: '', name: 'All Products', to: '/products' }, ...categories.map((c) => ({ ...c, to: `/products/${c.slug}` }))], [categories]);

  return (
    <div className="container-page grid gap-10 py-14 lg:grid-cols-[260px_1fr]">
      <aside aria-label="Product categories">
        <Reveal as="nav" className="lg:sticky lg:top-28">
          <h2 className="mb-3 text-sm font-medium text-mist-600">Categories</h2>
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible">
            {sidebar.map((c) => {
              const active = (c.slug || null) === (categorySlug || null);
              return (
                <li key={c.slug || 'all'} className="shrink-0">
                  <Link to={c.to} aria-current={active ? 'page' : undefined} className={`relative block overflow-hidden rounded-xl px-4 py-3 text-[15px] leading-snug transition-colors ${active ? 'font-medium text-white' : 'hover:bg-mist'}`}>
                    {active && <motion.span layoutId="cat-active" className="absolute inset-0 rounded-xl bg-navy-900" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                    <span className="relative z-10">{c.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </aside>

      <div>
        <Reveal>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative sm:col-span-2 xl:col-span-4">
              <label htmlFor="cat-search" className="sr-only">Search by product name, INCI or application</label>
              <input id="cat-search" type="search" value={qInput} onChange={(e) => setQInput(e.target.value)} placeholder="Search product name, INCI or application" className="field pr-12" />
              <AnimatePresence>
                {qInput && (
                  <motion.button
                    type="button"
                    onClick={() => setQInput('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-mist-600 hover:bg-mist hover:text-ink"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.18 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            {!categorySlug && (
              <select aria-label="Filter by category" className={select} value={category} onChange={(e) => update({ category: e.target.value })}>
                <option value="">All categories</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            )}
            <select aria-label="Filter by application" className={select} value={application} onChange={(e) => update({ application: e.target.value })}>
              <option value="">All applications</option>{applications.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
            </select>
            <select aria-label="Filter by function" className={select} value={fn} onChange={(e) => update({ fn: e.target.value })}>
              <option value="">All functions</option>{solutions.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select>
            <select aria-label="Sort products" className={select} value={sort} onChange={(e) => update({ sort: e.target.value })}>
              <option value="name-asc">Name A to Z</option><option value="name-desc">Name Z to A</option>
            </select>
          </div>
        </Reveal>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-mist-600" aria-live="polite">
            {loading ? 'Loading products' : <><AnimatedNumber value={meta?.total ?? 0} className="font-semibold text-ink" /> {meta?.total === 1 ? 'product' : 'products'}</>}
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
          {loading ? <Loading label="Loading products" />
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
