import { ApiError } from '../middleware/error.js';

const MAX_BODY = 12 * 1024 * 1024;

export function getBody(c) {
  const body = c.get('body');
  return body && typeof body === 'object' ? body : {};
}

export function getQuery(c) {
  const query = c.get('query');
  if (query && typeof query === 'object') return query;
  return Object.fromEntries(new URL(c.req.url).searchParams.entries());
}

export async function parseBody(c, next) {
  const method = c.req.method;
  if (!['POST', 'PUT', 'PATCH'].includes(method)) return next();

  const contentLength = Number(c.req.header('content-length') || 0);
  if (contentLength > MAX_BODY) {
    throw new ApiError(413, 'UPLOAD_ERROR', 'The request body is too large');
  }

  const contentType = c.req.header('content-type') || '';
  let body = {};

  try {
    if (contentType.includes('application/json')) {
      body = await c.req.json();
    } else if (
      contentType.includes('multipart/form-data') ||
      contentType.includes('application/x-www-form-urlencoded')
    ) {
      body = await c.req.parseBody();
    }
  } catch {
    throw new ApiError(400, 'INVALID_BODY', 'Request body could not be read');
  }

  c.set('body', body && typeof body === 'object' ? body : {});
  return next();
}
