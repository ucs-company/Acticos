import { fail } from '../utils/response.js';
import { isProduction } from '../config/env.js';

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const notFound = (c) => fail(c, 404, 'NOT_FOUND', `Route ${c.req.method} ${c.req.path} not found`);

export const onError = (err, c) => {
  if (err instanceof ApiError) {
    return fail(c, err.status, err.code, err.message, err.details);
  }

  const message = String(err?.message || '');
  if (/UNIQUE constraint failed/i.test(message)) {
    return fail(c, 409, 'CONFLICT', 'A record with this value already exists');
  }
  if (/FOREIGN KEY constraint failed/i.test(message)) {
    return fail(c, 409, 'IN_USE', 'Record is referenced by other data');
  }
  if (/too large|payload too large/i.test(message)) {
    return fail(c, 413, 'UPLOAD_ERROR', 'The uploaded file is too large');
  }

  console.error('Unhandled API error', err);
  return fail(c, 500, 'INTERNAL_ERROR', isProduction(c) ? 'Something went wrong' : message || 'Internal error');
};
