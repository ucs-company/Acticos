export function getEnv(c) {
  const env = c.env || {};
  return {
    DB: env.DB,
    BUCKET: env.BUCKET,
    JWT_SECRET: env.JWT_SECRET || '',
    JWT_EXPIRES_IN: env.JWT_EXPIRES_IN || '8h',
    TURNSTILE_SECRET_KEY: env.TURNSTILE_SECRET_KEY || '',
    CORS_ORIGINS: env.CORS_ORIGINS || '',
    PUBLIC_SITE_URL: env.PUBLIC_SITE_URL || '',
    R2_PUBLIC_URL: env.R2_PUBLIC_URL || '',
    CLOUDINARY_CLOUD_NAME: env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: env.CLOUDINARY_API_SECRET || '',
    CLOUDINARY_FOLDER: env.CLOUDINARY_FOLDER || 'acticos',
  };
}

export function isProduction(c) {
  return (c.env && c.env.ENVIRONMENT) === 'production';
}
