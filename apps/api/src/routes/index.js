import { Router } from 'express';
import publicRoutes from './public.routes.js';
import adminRoutes from './admin.routes.js';
import { prisma } from '../config/prisma.js';

const r = Router();
r.get('/health', async (req, res) => {
  try { await prisma.$queryRaw`SELECT 1`; res.json({ success: true, data: { status: 'ok' } }); }
  catch { res.status(503).json({ success: false, error: { code: 'DB_DOWN', message: 'Database unavailable' } }); }
});
r.use('/admin', adminRoutes);
r.use('/', publicRoutes);
export default r;
