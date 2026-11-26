import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const Ctx = createContext(null);
const COMPARE_KEY = 'acticos_compare_v1';

export const useProductActions = () => useContext(Ctx);

const readCompare = () => {
  try {
    const value = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
    return Array.isArray(value) ? value.slice(0, 3) : [];
  } catch {
    return [];
  }
};

export function ProductActionsProvider({ children }) {
  const [quickView, setQuickView] = useState(null);
  const [compare, setCompare] = useState(readCompare);
  const [compareOpen, setCompareOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
    if (compareOpen && compare.length < 2) setCompareOpen(false);
  }, [compare, compareOpen]);

  useEffect(() => {
    const open = Boolean(quickView) || compareOpen;
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      setQuickView(null);
      setCompareOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [quickView, compareOpen]);

  const value = useMemo(() => {
    const keyOf = (product) => product.id || product.slug;
    const isCompared = (product) => compare.some((item) => keyOf(item) === keyOf(product));
    return {
      quickView,
      openQuickView: setQuickView,
      closeQuickView: () => setQuickView(null),
      compare,
      canAddCompare: compare.length < 3,
      isCompared,
      toggleCompare: (product) => {
        setCompare((current) => {
          const exists = current.some((item) => keyOf(item) === keyOf(product));
          if (exists) return current.filter((item) => keyOf(item) !== keyOf(product));
          if (current.length >= 3) return current;
          return [...current, product];
        });
      },
      removeCompare: (product) => setCompare((current) => current.filter((item) => keyOf(item) !== keyOf(product))),
      clearCompare: () => setCompare([]),
      compareOpen,
      openCompare: () => setCompareOpen(true),
      closeCompare: () => setCompareOpen(false),
    };
  }, [quickView, compare, compareOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
