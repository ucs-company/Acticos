import { motion } from 'framer-motion';
import { useProductActions } from '@/providers/ProductActionsProvider';

export default function CompareBar() {
  const { compare, removeCompare, clearCompare, openCompare } = useProductActions();
  if (!compare.length) return null;

  return (
    <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed inset-x-3 bottom-3 z-[65] mx-auto max-w-3xl rounded-2xl border border-ink/10 bg-white/95 p-3 shadow-lift backdrop-blur-md sm:bottom-4 sm:inset-x-auto sm:left-1/2 sm:w-[min(92vw,760px)] sm:-translate-x-1/2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-mist-600">Compare</span>
          {compare.map((product) => (
            <span key={product.id || product.slug} className="inline-flex shrink-0 items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-ink">
              <span className="max-w-[10rem] truncate">{product.name}</span>
              <button type="button" onClick={() => removeCompare(product)} aria-label={`Remove ${product.name} from compare`} className="grid h-5 w-5 place-items-center rounded-full text-mist-600 hover:bg-white hover:text-ink">
                <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
              </button>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2">
          <button type="button" onClick={clearCompare} className="min-h-[36px] rounded-full px-3 text-sm font-medium text-mist-600 hover:text-ink">Clear</button>
          <button type="button" onClick={openCompare} disabled={compare.length < 2} className="min-h-[36px] rounded-full bg-electric px-4 text-sm font-medium text-white transition-colors hover:bg-electric-600 disabled:cursor-not-allowed disabled:opacity-40">Compare ({compare.length})</button>
        </div>
      </div>
    </motion.div>
  );
}
