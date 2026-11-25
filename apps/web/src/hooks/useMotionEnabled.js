import { useSyncExternalStore } from 'react';

// App-level motion preference. Defaults to ON and deliberately ignores the OS
// `prefers-reduced-motion` setting so the site's animations always play.
// A code/localStorage opt-out is still available via setMotionEnabled(false).
const KEY = 'acticos_motion';
const listeners = new Set();

function read() {
  if (typeof window === 'undefined') return true;
  try { return window.localStorage.getItem(KEY) !== 'off'; } catch { return true; }
}

function apply() {
  if (typeof document !== 'undefined') document.documentElement.dataset.motion = enabled ? 'on' : 'off';
}

let enabled = read();
apply();

function subscribe(cb) {
  listeners.add(cb);
  const onStorage = (e) => {
    if (e.key !== KEY) return;
    enabled = read();
    apply();
    cb();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot() {
  return enabled;
}

export function setMotionEnabled(value) {
  enabled = Boolean(value);
  try { window.localStorage.setItem(KEY, enabled ? 'on' : 'off'); } catch { /* ignore */ }
  apply();
  listeners.forEach((cb) => cb());
}

export default function useMotionEnabled() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
