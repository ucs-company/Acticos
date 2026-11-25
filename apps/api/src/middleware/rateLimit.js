import { ApiError } from './error.js';

const buckets = new Map();

function clientKey(c, scope) {
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('x-forwarded-for') || 'unknown';
  return `${scope}:${ip}:${c.req.path}`;
}

export function createLimiter({ scope, windowMs, max, message }) {
  return async (c, next) => {
    const key = clientKey(c, scope);
    const now = Date.now();
    const current = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > current.resetAt) {
      current.count = 0;
      current.resetAt = now + windowMs;
    }

    current.count += 1;
    buckets.set(key, current);

    if (buckets.size > 5000) {
      for (const [entryKey, value] of buckets) {
        if (now > value.resetAt) buckets.delete(entryKey);
      }
    }

    if (current.count > max) {
      throw new ApiError(429, 'RATE_LIMITED', message);
    }

    c.header('X-RateLimit-Limit', String(max));
    c.header('X-RateLimit-Remaining', String(Math.max(0, max - current.count)));
    return next();
  };
}

export const apiLimiter = createLimiter({
  scope: 'api',
  windowMs: 60_000,
  max: 120,
  message: 'Too many requests. Please slow down.',
});

export const formLimiter = createLimiter({
  scope: 'form',
  windowMs: 15 * 60_000,
  max: 10,
  message: 'Too many submissions. Please try again later.',
});

export const loginLimiter = createLimiter({
  scope: 'login',
  windowMs: 15 * 60_000,
  max: 8,
  message: 'Too many sign-in attempts. Please try again later.',
});
