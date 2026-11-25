import { ApiError } from './error.js';

export const validate = (schema, source = 'body') => async (c, next) => {
  const data = source === 'query'
    ? Object.fromEntries(new URL(c.req.url).searchParams.entries())
    : (c.get('body') || {});

  const result = schema.safeParse(data);
  if (!result.success) {
    const details = result.error.flatten().fieldErrors;
    throw new ApiError(422, 'VALIDATION_ERROR', 'Please check the highlighted fields', details);
  }

  c.set(source, result.data);
  return next();
};
