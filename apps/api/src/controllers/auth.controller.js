import { ok } from '../utils/response.js';
import { getBody } from '../utils/body.js';
import { login } from '../services/auth.service.js';

export async function loginUser(c) {
  const body = getBody(c);
  return ok(c, await login(c.env, body.email, body.password));
}

export function me(c) {
  return ok(c, c.get('user'));
}
