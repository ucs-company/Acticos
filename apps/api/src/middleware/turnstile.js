import { getEnv } from '../config/env.js';
import { ApiError } from './error.js';

export const verifyTurnstile = async (c, next) => {
  const env = getEnv(c);
  if (!env.TURNSTILE_SECRET_KEY) return next();

  const body = c.get('body') || {};
  const token = body.turnstileToken;
  if (!token) {
    throw new ApiError(400, 'CAPTCHA_REQUIRED', 'Please complete the verification');
  }

  const remoteip = c.req.header('CF-Connecting-IP') || c.req.header('x-forwarded-for') || '';

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: String(token),
        remoteip,
      }),
    });
    const data = await response.json();
    if (!data.success) {
      throw new ApiError(400, 'CAPTCHA_FAILED', 'Verification failed. Please try again.');
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, 'CAPTCHA_UNAVAILABLE', 'Verification service unavailable');
  }

  return next();
};
