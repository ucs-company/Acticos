import { ApiError } from '../middleware/error.js';

const SIGNATURES = {
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/jpeg': [0xff, 0xd8, 0xff],
};

const EXTENSIONS = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpg',
};

const MAX_FILE = 10 * 1024 * 1024;

function detectType(bytes, declaredType) {
  const match = Object.entries(SIGNATURES).find(([, signature]) =>
    signature.every((byte, index) => bytes[index] === byte),
  );
  const detected = match?.[0];
  if (declaredType && declaredType !== 'application/octet-stream') {
    if (!SIGNATURES[declaredType] || detected !== declaredType) return null;
    return declaredType;
  }
  return detected || null;
}

export async function getUploadedFile(c, field) {
  const body = c.get('body') || {};
  const file = body[field];

  if (!file || typeof file !== 'object' || typeof file.arrayBuffer !== 'function') {
    throw new ApiError(400, 'NO_FILE', `Choose a file for ${field}`);
  }

  const buffer = new Uint8Array(await file.arrayBuffer());
  if (!buffer.length) {
    throw new ApiError(400, 'NO_FILE', 'The uploaded file is empty');
  }
  if (buffer.length > MAX_FILE) {
    throw new ApiError(413, 'UPLOAD_ERROR', 'Files must be 10 MB or smaller');
  }

  const mimetype = detectType(buffer, file.type);
  if (!mimetype) {
    throw new ApiError(415, 'UNSUPPORTED_FILE', 'Only PDF, PNG or JPG files are accepted');
  }

  return {
    buffer,
    mimetype,
    filename: file.name || `upload.${EXTENSIONS[mimetype]}`,
  };
}

export const fileExtension = (mimetype) => EXTENSIONS[mimetype] || 'bin';
