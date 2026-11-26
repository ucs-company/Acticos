import { useProductActions } from '@/providers/ProductActionsProvider';

export default function ProductActions({ product, className = '' }) {
  const { openQuickView, toggleCompare, isCompared, canAddCompare } = useProductActions();
  const compared = isCompared(product);
  const compareDisabled = !compared && !canAddCompare;

  return (
    <div className={`flex items-center gap-1 rounded-full border border-ink/10 bg-white/95 p-1 shadow-sm backdrop-blur-sm ${className}`}>
      <button type="button" onClick={() => openQuickView(product)} title="Quick view" aria-label={`Quick view ${product.name}`} className="grid h-8 w-8 place-items-center rounded-full text-mist-600 transition-colors hover:bg-mist hover:text-electric">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2.5 10s2.8-5 7.5-5 7.5 5 7.5 5-2.8 5-7.5 5-7.5-5-7.5-5Z" /><circle cx="10" cy="10" r="2.4" /></svg>
      </button>
      <button type="button" onClick={() => toggleCompare(product)} disabled={compareDisabled} title={compared ? 'Remove from compare' : compareDisabled ? 'Compare list is full' : 'Add to compare'} aria-label={compared ? `Remove ${product.name} from compare` : `Add ${product.name} to compare`} aria-pressed={compared} className={`grid h-8 w-8 place-items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${compared ? 'bg-electric text-white' : 'text-mist-600 hover:bg-mist hover:text-electric'}`}>
        {compared ? (
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m4 10 3.5 3.5L16 5" /></svg>
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M10 4v12M4 10h12" /></svg>
        )}
      </button>
    </div>
  );
}
