import { Hono } from 'hono';
import { securityHeaders, cors } from './middleware/cors.js';
import { parseBody } from './utils/body.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { onError, notFound } from './middleware/error.js';
import { ok, fail } from './utils/response.js';
import { getEnv } from './config/env.js';
import { sitemap } from './controllers/public.controller.js';
import publicRoutes from './routes/public.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = new Hono();

app.use('*', securityHeaders);
app.use('/api/*', cors);
app.use('/api/*', parseBody);

app.get('/api/health', async (c) => {
  try {
    await getEnv(c).DB.prepare('SELECT 1').first();
    return ok(c, { status: 'ok' });
  } catch {
    return fail(c, 503, 'DB_DOWN', 'Database is unavailable');
  }
});

app.use('/api/*', apiLimiter);
app.get('/sitemap.xml', sitemap);
app.route('/api/admin', adminRoutes);
app.route('/api', publicRoutes);

app.get('*', (c) => {
  if (c.req.path.startsWith('/api/')) return notFound(c);
  const index = new URL('/index.html', c.req.url);
  return c.env.ASSETS.fetch(new Request(index.toString(), { headers: c.req.raw.headers }));
});

app.notFound(notFound);
app.onError(onError);

export { app };
