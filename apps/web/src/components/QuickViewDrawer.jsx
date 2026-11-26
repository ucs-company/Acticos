import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useProductActions } from '@/providers/ProductActionsProvider';
import CopyButton from './CopyButton';

export default function QuickViewDrawer() {
  const { quickView, closeQuickView, toggleCompare, isCompared, canAddCompare } = useProductActions();
  const closeRef = useRef(null);
  const product = quickView;

  useEffect(() => {
    if (product) closeRef.current?.focus();
  }, [product]);

  const tech = product?.technicalInfo && Object.keys(product.technicalInfo).length ? Object.entries(product.technicalInfo).slice(0, 5) : [];
  const compared = product ? isCompared(product) : false;
  const compareDisabled = product ? !compared && !canAddCompare : true;

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.button type="button" aria-label="Close quick view" onClick={closeQuickView} className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view: ${product.name}`}
            className="fixed inset-x-0 bottom-0 z-[91] max-h-[88svh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:inset-y-0 sm:bottom-auto sm:left-auto sm:right-0 sm:h-full sm:max-h-none sm:w-[480px] sm:rounded-none sm:rounded-l-3xl sm:p-7"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-electric">{product.category?.name}</p>
                <p className="mt-1 text-xs text-mist-600">{product.code}</p>
              </div>
              <button ref={closeRef} type="button" onClick={closeQuickView} aria-label="Close quick view" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/10 text-mist-600 transition-colors hover:border-electric/40 hover:text-electric">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
              </button>
            </div>

            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight">{product.name}</h2>

            <div className="mt-5 rounded-2xl bg-mist p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-mist-600">INCI</p>
                <CopyButton value={product.inci} label="Copy" />
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-ink">{product.inci || '—'}</p>
            </div>

            {product.applications?.length ? (
              <div className="mt-5">
                <p className="text-xs font-medium text-mist-600">Applications</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {product.applications.map((application) => (
                    <li key={application.slug}><Link to={`/applications/${application.slug}`} onClick={closeQuickView} className="inline-flex rounded-full border border-ink/15 px-3 py-1.5 text-sm text-mist-600 transition-colors hover:border-electric/40 hover:text-electric">{application.name}</Link></li>
                  ))}
                </ul>
              </div>
            ) : null}

            {tech.length ? (
              <div className="mt-5">
                <p className="text-xs font-medium text-mist-600">Technical highlights</p>
                <dl className="mt-2 divide-y divide-ink/10 rounded-2xl border border-ink/10">
                  {tech.map(([label, value]) => <div key={label} className="flex gap-3 px-4 py-2.5 text-sm"><dt className="w-2/5 shrink-0 text-mist-600">{label}</dt><dd className="min-w-0 text-ink">{String(value)}</dd></div>)}
                </dl>
              </div>
            ) : null}

            {product.benefits?.length ? (
              <div className="mt-5">
                <p className="text-xs font-medium text-mist-600">Key features</p>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink">
                  {product.benefits.slice(0, 3).map((benefit) => <li key={benefit} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-electric" aria-hidden="true" />{benefit}</li>)}
                </ul>
              </div>
            ) : null}

            <div className="mt-6 grid gap-2">
              <Link to={`/products/${product.slug}`} onClick={closeQuickView} className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-electric px-5 text-[15px] font-medium text-white transition-colors hover:bg-electric-600">View full details</Link>
              <Link to={`/request-sample?product=${encodeURIComponent(product.name)}`} onClick={closeQuickView} className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-ink/15 px-5 text-[15px] font-medium text-ink transition-colors hover:border-electric hover:text-electric">Request a sample</Link>
              <button type="button" onClick={() => toggleCompare(product)} disabled={compareDisabled} className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border px-5 text-[15px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${compared ? 'border-electric bg-electric/10 text-electric' : 'border-ink/15 text-ink hover:border-electric hover:text-electric'}`}>
                {compared ? 'Remove from compare' : compareDisabled ? 'Compare list is full' : 'Add to compare'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
