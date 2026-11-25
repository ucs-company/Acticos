import { ApiError } from './error.js';
import { verifyToken } from '../services/token.service.js';
import { currentUser } from '../services/auth.service.js';

export const authenticate = async (c, next) => {
  const header = c.req.header('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) throw new ApiError(401, 'UNAUTHENTICATED', 'Authentication required');

  let payload;
  try {
    payload = await verifyToken(c.env, token);
  } catch {
    throw new ApiError(401, 'INVALID_TOKEN', 'Session expired. Please sign in again.');
  }

  const user = await currentUser(c.env, payload.sub);
  if (!user || !user.isActive) {
    throw new ApiError(401, 'INVALID_TOKEN', 'Account not available');
  }

  c.set('user', { id: user.id, email: user.email, name: user.name, role: user.role });
  return next();
};

export const authorize = (...roles) => async (c, next) => {
  const user = c.get('user');
  if (!user || !roles.includes(user.role)) {
    throw new ApiError(403, 'FORBIDDEN', 'You do not have permission to do this');
  }
  return next();
};

export const ROLES = {
  ALL: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
  MANAGE: ['SUPER_ADMIN', 'ADMIN'],
  OWNER: ['SUPER_ADMIN'],
};
