import { API_URL } from '@/config/site';

export class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const TOKEN_KEY = 'acticos_admin_token';
export const tokenStore = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (t) => sessionStorage.setItem(TOKEN_KEY, t),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

export async function request(path, { method = 'GET', body, auth = false, signal } = {}) {
  const headers = {};
  const isForm = body instanceof FormData;
  if (body && !isForm) headers['Content-Type'] = 'application/json';
  if (auth) headers.Authorization = `Bearer ${tokenStore.get()}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body: body ? (isForm ? body : JSON.stringify(body)) : undefined, signal });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0, 'NETWORK');
  }
  let json = null;
  try { json = await res.json(); } catch { /* non-JSON response */ }
  if (!res.ok || !json?.success) {
    if (res.status === 401 && auth && json?.error?.code !== 'INVALID_CURRENT_PASSWORD') tokenStore.clear();
    throw new ApiError(json?.error?.message || 'Something went wrong', res.status, json?.error?.code, json?.error?.details);
  }
  return json;
}

export const get = (path, opts) => request(path, opts).then((j) => j.data);
export const qs = (params) => {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v !== undefined && v !== '' && v !== null && p.set(k, v));
  const s = p.toString();
  return s ? `?${s}` : '';
};
