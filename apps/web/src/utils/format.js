export const isMissing = (v) => !v || String(v).includes('[DATA REQUIRED]');
export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
