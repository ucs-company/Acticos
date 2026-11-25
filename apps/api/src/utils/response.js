export const ok = (c, data, meta, status = 200) =>
  c.json({ success: true, data, ...(meta ? { meta } : {}) }, status);

export const created = (c, data) => ok(c, data, undefined, 201);

export const fail = (c, status, code, message, details) =>
  c.json({ success: false, error: { code, message, ...(details ? { details } : {}) } }, status);
