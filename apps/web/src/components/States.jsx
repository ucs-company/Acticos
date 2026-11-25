import Button from './Button';

export const Loading = ({ label = 'Loading', count = 6 }) => (
  <div role="status" aria-live="polite" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
    <span className="sr-only">{label}</span>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <div className="skeleton aspect-[16/10] w-full" />
        <div className="space-y-3 p-6">
          <div className="skeleton h-3 w-24 rounded-full" />
          <div className="skeleton h-5 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
          <div className="flex gap-2 pt-1"><div className="skeleton h-6 w-16 rounded-full" /><div className="skeleton h-6 w-20 rounded-full" /></div>
          <div className="skeleton mt-2 h-9 w-full rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

export const ErrorState = ({ error, onRetry }) => (
  <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
    <h3 className="text-xl font-semibold text-red-900">Could not load this content</h3>
    <p className="mx-auto mt-2 max-w-md text-red-800/80">{error?.message || 'Something went wrong.'}</p>
    {onRetry && <Button variant="outlineDark" className="mt-5" onClick={onRetry}>Try again</Button>}
  </div>
);

export const EmptyState = ({ title = 'No products match your search', text = 'Clear a filter or try a different INCI name, product name or application.', action }) => (
  <div className="rounded-2xl border border-dashed border-ink/20 p-12 text-center">
    <svg className="mx-auto h-12 w-12 text-mist-400" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="21" cy="21" r="12" /><path d="m30 30 10 10" /></svg>
    <h3 className="mt-4 text-xl font-semibold">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-mist-600">{text}</p>
    {action}
  </div>
);
