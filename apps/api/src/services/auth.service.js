import { ApiError } from '../middleware/error.js';
import { dbFirst, dbRun, nowIso } from '../utils/db.js';
import { hashPassword, verifyPassword } from './password.service.js';
import { signToken } from './token.service.js';

export async function login(env, email, password) {
  const user = await dbFirst(
    env.DB,
    'SELECT id, email, name, role, isActive, passwordHash FROM users WHERE email = ?',
    String(email).trim().toLowerCase(),
  );

  const valid = await verifyPassword(password, user?.passwordHash);
  if (!user || !valid || !user.isActive) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
  }

  const timestamp = nowIso();
  await dbRun(env.DB, 'UPDATE users SET lastLoginAt = ?, updatedAt = ? WHERE id = ?', timestamp, timestamp, user.id);

  const token = await signToken(env, user);
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export async function changePassword(env, userId, currentPassword, newPassword) {
  const user = await dbFirst(
    env.DB,
    'SELECT id, passwordHash FROM users WHERE id = ?',
    userId,
  );

  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    throw new ApiError(401, 'INVALID_CURRENT_PASSWORD', 'Current password is incorrect');
  }

  if (await verifyPassword(newPassword, user.passwordHash)) {
    throw new ApiError(422, 'SAME_PASSWORD', 'Choose a different password');
  }

  const timestamp = nowIso();
  await dbRun(
    env.DB,
    'UPDATE users SET passwordHash = ?, updatedAt = ? WHERE id = ?',
    await hashPassword(newPassword),
    timestamp,
    userId,
  );

  return { updated: true };
}

export async function currentUser(env, id) {
  return dbFirst(
    env.DB,
    'SELECT id, email, name, role, isActive FROM users WHERE id = ?',
    id,
  );
}
