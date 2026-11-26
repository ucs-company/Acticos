import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useProductActions } from '@/providers/ProductActionsProvider';

const list = (values) => (values?.length ? values.join(', ') : '—');

export default function CompareDialog() {
  const { compare, compareOpen, closeCompare, removeCompare, clearCompare } = useProductActions();
  const products = compare.slice(0, 3);
  const rows = [
    ['Category', (product) => product.category?.name || '—'],
    ['INCI', (product) => product.inci || '—'],
    ['Applications', (product) => list(product.applications?.map((item) => item.name))],
    ['Functions', (product) => list((product.solutions?.length ? product.solutions.map((item) => item.name) : product.functions?.map((item) => item.replace(/-/g, ' '))))],
    ['Recommended usage', (product) => product.technicalInfo?.['Recommended Usage'] || '—'],
    ['Solubility', (product) => product.technicalInfo?.Solubility || '—'],
  ];

  return (
    <AnimatePresence>
      {compareOpen && (
        <>
          <motion.button type="button" aria-label="Close compare" onClick={closeCompare} className="fixed inset-0 z-[94] bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div role="dialog" aria-modal="true" aria-label="Compare products" className="fixed inset-x-3 bottom-3 top-3 z-[95] mx-auto flex max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:inset-x-6 sm:bottom-6 sm:top-6" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-start justify-between gap-4 border-b border-ink/10 p-5 sm:p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-electric">Product comparison</p>
                <h2 className="mt-1 font-display text-2xl font-semibold">Compare ingredients</h2>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={clearCompare} className="hidden min-h-[40px] rounded-full px-3 text-sm font-medium text-mist-600 hover:text-ink sm:inline-flex">Clear all</button>
                <button type="button" onClick={closeCompare} aria-label="Close compare" className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 text-mist-600 hover:border-electric/40 hover:text-electric">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b border-ink/10">
                    <th className="w-36 bg-white p-4 text-xs font-medium uppercase tracking-wide text-mist-600">Attribute</th>
                    {products.map((product) => (
                      <th key={product.id || product.slug} className="border-l border-ink/10 p-4 align-top">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-mist-600">{product.code}</p>
                            <p className="mt-1 font-display text-lg font-semibold leading-tight">{product.name}</p>
                          </div>
                          <button type="button" onClick={() => removeCompare(product)} aria-label={`Remove ${product.name}`} className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-mist-600 hover:bg-mist hover:text-ink">
                            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
                          </button>
                        </div>
                        <Link to={`/request-sample?product=${encodeURIComponent(product.name)}`} className="mt-3 inline-flex min-h-[34px] items-center rounded-full border border-ink/15 px-3 text-xs font-medium text-electric hover:border-electric">Request sample</Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {rows.map(([label, render]) => (
                    <tr key={label}>
                      <th className="bg-mist/60 p-4 align-top text-xs font-medium text-mist-600">{label}</th>
                      {products.map((product) => <td key={product.id || product.slug} className="border-l border-ink/10 p-4 align-top leading-relaxed text-ink">{render(product)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
