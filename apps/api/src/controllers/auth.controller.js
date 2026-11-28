import { ok } from '../utils/response.js';
import { getBody } from '../utils/body.js';
import { changePassword, login } from '../services/auth.service.js';

export async function loginUser(c) {
  const body = getBody(c);
  return ok(c, await login(c.env, body.email, body.password));
}

export async function changeUserPassword(c) {
  const { currentPassword, newPassword } = getBody(c);
  return ok(c, await changePassword(c.env, c.get('user').id, currentPassword, newPassword));
}

export function me(c) {
  return ok(c, c.get('user'));
}
