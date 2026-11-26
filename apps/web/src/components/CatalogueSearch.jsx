import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { catalogue } from '@/services/catalogue';

export default function CatalogueSearch({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const root = useRef(null);
  const query = useDebounce(value.trim(), 260);

  useEffect(() => {
    if (!open || query.length < 2) {
      setItems([]);
      setLoading(false);
      return undefined;
    }
    let alive = true;
    setLoading(true);
    catalogue.products({ q: query, pageSize: 5 })
      .then((result) => { if (alive) setItems(result.data || []); })
      .catch(() => { if (alive) setItems([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [open, query]);

  useEffect(() => {
    const onClick = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onClick);
    return () => document.removeEventListener('pointerdown', onClick);
  }, []);

  const choose = (product) => {
    onChange(product.name);
    setOpen(false);
  };

  return (
    <div ref={root} className="relative sm:col-span-2 xl:col-span-4">
      <label htmlFor="cat-search" className="sr-only">Search by ingredient name, INCI or application</label>
      <input
        id="cat-search"
        type="search"
        value={value}
        onChange={(event) => { onChange(event.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Search ingredient name, INCI or application"
        className="field pr-12"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="catalogue-suggestions"
      />
      <AnimatePresence>
        {value && (
          <motion.button
            type="button"
            onClick={() => { onChange(''); setOpen(false); }}
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

      <AnimatePresence>
        {open && query.length >= 2 && (
          <motion.div id="catalogue-suggestions" role="listbox" aria-label="Product suggestions" className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-lift" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
            {loading ? (
              <div className="flex items-center gap-3 px-4 py-4 text-sm text-mist-600"><span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/15 border-t-electric" /> Searching ingredients</div>
            ) : items.length ? (
              <ul className="max-h-80 overflow-y-auto py-1">
                {items.map((product) => (
                  <li key={product.slug}>
                    <button type="button" role="option" onMouseDown={(event) => event.preventDefault()} onClick={() => choose(product)} className="flex w-full items-start justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-mist">
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-ink">{product.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-mist-600">{product.code} · {product.category?.name}</span>
                        <span className="mt-0.5 block truncate text-xs text-mist-600">{product.inci}</span>
                      </span>
                      <span className="mt-1 shrink-0 text-xs font-medium text-electric">Search</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-4 text-sm text-mist-600">No matching ingredients.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
