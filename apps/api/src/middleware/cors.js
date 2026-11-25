import { getEnv } from '../config/env.js';

const parseOrigins = (value) =>
  String(value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

export const securityHeaders = async (c, next) => {
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'SAMEORIGIN');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return next();
};

export const cors = async (c, next) => {
  const env = getEnv(c);
  const origin = c.req.header('Origin');
  const allowed = parseOrigins(env.CORS_ORIGINS);

  c.header('Vary', 'Origin');
  if (origin && (allowed.includes(origin) || allowed.includes('*'))) {
    c.header('Access-Control-Allow-Origin', origin === allowed[0] ? origin : origin);
    c.header('Access-Control-Allow-Credentials', 'true');
    c.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    c.header('Access-Control-Max-Age', '600');
  }

  if (c.req.method === 'OPTIONS') {
    return c.body(null, 204);
  }

  return next();
};
