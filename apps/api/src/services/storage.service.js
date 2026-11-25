import { ApiError } from '../middleware/error.js';
import { fileExtension } from '../utils/upload.js';

export async function uploadFile(env, file, folder) {
  if (!env.BUCKET) {
    throw new ApiError(503, 'STORAGE_NOT_CONFIGURED', 'File storage is not configured');
  }

  const key = `${folder}/${Date.now()}-${crypto.randomUUID()}.${fileExtension(file.mimetype)}`;
  await env.BUCKET.put(key, file.buffer, {
    httpMetadata: { contentType: file.mimetype },
  });

  const base = String(env.R2_PUBLIC_URL || '').replace(/\/$/, '');
  return { key, url: base ? `${base}/${key}` : null };
}

export async function deleteFile(env, key) {
  if (!env.BUCKET || !key) return;
  await env.BUCKET.delete(key);
}
