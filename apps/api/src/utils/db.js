export const nowIso = () => new Date().toISOString();

export const newId = () => crypto.randomUUID();

export async function dbAll(db, sql, ...params) {
  const result = await db.prepare(sql).bind(...params).all();
  return result.results || [];
}

export async function dbFirst(db, sql, ...params) {
  return db.prepare(sql).bind(...params).first();
}

export async function dbRun(db, sql, ...params) {
  return db.prepare(sql).bind(...params).run();
}
