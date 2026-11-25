import multer from 'multer';
import { ApiError } from './error.js';

const ALLOWED = {
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/jpeg': [0xff, 0xd8, 0xff],
};

const base = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) =>
    ALLOWED[file.mimetype] ? cb(null, true) : cb(new ApiError(415, 'UNSUPPORTED_FILE', 'Only PDF, PNG or JPG files are accepted')),
});

// Checks magic bytes so a renamed file cannot pass on MIME type alone.
export const verifyFileSignature = (req, res, next) => {
  const f = req.file;
  if (!f) return next();
  const sig = ALLOWED[f.mimetype];
  const ok = sig && sig.every((b, i) => f.buffer[i] === b);
  if (!ok) return next(new ApiError(415, 'UNSUPPORTED_FILE', 'File content does not match its type'));
  next();
};

export const uploadSingle = (field) => [base.single(field), verifyFileSignature];
