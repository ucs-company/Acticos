import { getEnv } from '../config/env.js';
import { getQuery } from '../utils/body.js';
import { dbAll } from '../utils/db.js';
import { ok } from '../utils/response.js';
import { ApiError } from '../middleware/error.js';
import { listProducts, getProductBySlug } from '../services/product.service.js';

const escapeXml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const withProductCount = (row) => ({
  ...row,
  isActive: Boolean(row.isActive),
  _count: { products: Number(row.productCount || 0) },
});

export async function products(c) {
  const query = getQuery(c);
  const { items, total } = await listProducts(getEnv(c), query, true);
  return ok(c, items, {
    total,
    page: Number(query.page),
    pageSize: Number(query.pageSize),
    totalPages: Math.ceil(total / Number(query.pageSize)),
  });
}

export async function productBySlug(c) {
  const product = await getProductBySlug(getEnv(c), c.req.param('slug'), true);
  if (!product) throw new ApiError(404, 'NOT_FOUND', 'Product not found');
  return ok(c, product);
}

export async function categories(c) {
  const rows = await dbAll(getEnv(c).DB, `
    SELECT c.*, (
      SELECT COUNT(*) FROM products p
      WHERE p.categoryId = c.id AND p.status = 'PUBLISHED'
    ) AS productCount
    FROM categories c
    ORDER BY c.sortOrder ASC, c.name ASC
  `);
  return ok(c, rows.map(withProductCount));
}

export async function categoryBySlug(c) {
  const rows = await dbAll(getEnv(c).DB, `
    SELECT c.*, (
      SELECT COUNT(*) FROM products p
      WHERE p.categoryId = c.id AND p.status = 'PUBLISHED'
    ) AS productCount
    FROM categories c
    WHERE c.slug = ?
  `, c.req.param('slug'));
  if (!rows.length) throw new ApiError(404, 'NOT_FOUND', 'Category not found');
  return ok(c, withProductCount(rows[0]));
}

export async function applications(c) {
  const rows = await dbAll(getEnv(c).DB, `
    SELECT a.*, (
      SELECT COUNT(*) FROM product_applications pa
      JOIN products p ON p.id = pa.productId
      WHERE pa.applicationId = a.id AND p.status = 'PUBLISHED'
    ) AS productCount
    FROM applications a
    ORDER BY a.name ASC
  `);
  return ok(c, rows.map(withProductCount));
}

export async function applicationBySlug(c) {
  const rows = await dbAll(getEnv(c).DB, 'SELECT * FROM applications WHERE slug = ?', c.req.param('slug'));
  if (!rows.length) throw new ApiError(404, 'NOT_FOUND', 'Application not found');
  return ok(c, rows[0]);
}

export async function solutions(c) {
  const rows = await dbAll(getEnv(c).DB, `
    SELECT s.*, (
      SELECT COUNT(*) FROM product_solutions ps
      JOIN products p ON p.id = ps.productId
      WHERE ps.solutionId = s.id AND p.status = 'PUBLISHED'
    ) AS productCount
    FROM solutions s
    ORDER BY s.name ASC
  `);
  return ok(c, rows.map(withProductCount));
}

export async function blogPosts(c) {
  const rows = await dbAll(
    getEnv(c).DB,
    "SELECT slug, title, excerpt, publishedAt FROM blog WHERE status = 'PUBLISHED' ORDER BY publishedAt DESC",
  );
  return ok(c, rows);
}

export async function documents(c) {
  const rows = await dbAll(getEnv(c).DB, `
    SELECT d.id, d.title, d.type, d.fileUrl, p.name AS productName, p.slug AS productSlug
    FROM documents d
    JOIN products p ON p.id = d.productId
    WHERE p.status = 'PUBLISHED'
    ORDER BY d.createdAt DESC
  `);
  return ok(c, rows.map((row) => ({
    id: row.id,
    title: row.title,
    type: row.type,
    fileUrl: row.fileUrl,
    product: { name: row.productName, slug: row.productSlug },
  })));
}

export async function sitemap(c) {
  const env = getEnv(c);
  const [categories, products, applications] = await Promise.all([
    dbAll(env.DB, 'SELECT slug FROM categories ORDER BY slug ASC'),
    dbAll(env.DB, "SELECT slug, updatedAt FROM products WHERE status = 'PUBLISHED' ORDER BY slug ASC"),
    dbAll(env.DB, 'SELECT slug FROM applications ORDER BY slug ASC'),
  ]);

  const staticPaths = [
    '', '/products', '/applications', '/solutions', '/about', '/resources', '/contact',
    '/request-quote', '/request-sample', '/technical-enquiry',
  ];

  const urls = [
    ...staticPaths.map((path) => ({ loc: path })),
    ...categories.map((row) => ({ loc: `/products/${row.slug}` })),
    ...applications.map((row) => ({ loc: `/applications/${row.slug}` })),
    ...products.map((row) => ({ loc: `/products/${row.slug}`, lastmod: row.updatedAt })),
  ];

  const base = env.PUBLIC_SITE_URL.replace(/\/$/, '');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${escapeXml(`${base}${url.loc}`)}</loc>${url.lastmod ? `<lastmod>${escapeXml(url.lastmod)}</lastmod>` : ''}</url>`)
    .join('\n')}\n</urlset>`;

  return c.body(body, 200, { 'Content-Type': 'application/xml; charset=utf-8' });
}
