import { SignJWT, jwtVerify } from 'jose';
import { ApiError } from '../middleware/error.js';

function keyFromSecret(secret) {
  if (!secret || secret.length < 32) {
    throw new ApiError(500, 'AUTH_NOT_CONFIGURED', 'JWT_SECRET is required');
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(env, user) {
  const key = keyFromSecret(env.JWT_SECRET);
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN || '8h')
    .sign(key);
}

export async function verifyToken(env, token) {
  const key = keyFromSecret(env.JWT_SECRET);
  const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
  return payload;
}
