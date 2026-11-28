import { ApiError } from '../middleware/error.js';
import { fileExtension } from '../utils/upload.js';

const encoder = new TextEncoder();

const hex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

const cloudinaryConfig = (env) => {
  const cloudName = env.CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new ApiError(503, 'STORAGE_NOT_CONFIGURED', 'Image storage is not configured');
  }
  return { cloudName, apiKey, apiSecret };
};

const signParams = async (params, secret) => {
  const value = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  const digest = await crypto.subtle.digest('SHA-1', encoder.encode(`${value}${secret}`));
  return hex(new Uint8Array(digest));
};

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

export async function uploadImage(env, file, folder, publicId) {
  const { cloudName, apiKey, apiSecret } = cloudinaryConfig(env);
  const timestamp = Math.floor(Date.now() / 1000);
  const baseFolder = String(env.CLOUDINARY_FOLDER || 'acticos').replace(/^\/+|\/+$/g, '');
  const cloudFolder = `${baseFolder}/${folder}`.replace(/\/+/g, '/');
  const safeId = String(publicId || `image-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '-');
  const params = {
    folder: cloudFolder,
    public_id: safeId,
    overwrite: 'true',
    invalidate: 'true',
    timestamp,
  };
  const signature = await signParams(params, apiSecret);

  const body = new FormData();
  body.append('file', new Blob([file.buffer], { type: file.mimetype }), file.filename || `image.${fileExtension(file.mimetype)}`);
  body.append('api_key', apiKey);
  body.append('timestamp', String(timestamp));
  body.append('signature', signature);
  body.append('folder', params.folder);
  body.append('public_id', params.public_id);
  body.append('overwrite', params.overwrite);
  body.append('invalidate', params.invalidate);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.secure_url) {
    throw new ApiError(502, 'UPLOAD_FAILED', result?.error?.message || 'Cloudinary upload failed');
  }

  return {
    key: result.public_id,
    publicId: result.public_id,
    url: result.secure_url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

export async function deleteImage(env, publicId) {
  if (!publicId) return;
  const { cloudName, apiKey, apiSecret } = cloudinaryConfig(env);
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { public_id: publicId, invalidate: 'true', timestamp };
  const signature = await signParams(params, apiSecret);
  const body = new FormData();
  body.append('api_key', apiKey);
  body.append('timestamp', String(timestamp));
  body.append('signature', signature);
  body.append('public_id', publicId);
  body.append('invalidate', 'true');
  await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, { method: 'POST', body }).catch(() => null);
}
