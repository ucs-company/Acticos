import pino from 'pino';
import { isProd } from './env.js';

export const logger = pino({
  level: isProd ? 'info' : 'debug',
  redact: ['req.headers.authorization', 'req.headers.cookie', 'password', 'currentPassword', 'newPassword', 'confirmPassword', 'passwordHash'],
});
