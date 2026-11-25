import { useEffect, useState, useCallback } from 'react';

// Runs an async loader whenever deps change. Returns { data, meta, loading, error, reload }.
export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ data: null, meta: null, loading: true, error: null });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    Promise.resolve(loader())
      .then((res) => alive && setState({ data: res?.meta !== undefined && res?.data !== undefined ? res.data : res, meta: res?.meta ?? null, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, meta: null, loading: false, error }));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);
  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, reload };
}
