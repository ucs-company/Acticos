import { dbAll, dbFirst } from '../utils/db.js';
import { parseArray, parseObject } from '../utils/json.js';

const PRODUCT_SELECT = `
SELECT p.*,
       c.slug AS categorySlug,
       c.name AS categoryName,
       c.visual AS categoryVisual,
       COALESCE((
         SELECT json_group_array(json_object('id', a.id, 'slug', a.slug, 'name', a.name))
         FROM product_applications pa
         JOIN applications a ON a.id = pa.applicationId
         WHERE pa.productId = p.id
       ), '[]') AS applicationsJson,
       COALESCE((
         SELECT json_group_array(json_object('id', s.id, 'slug', s.slug, 'name', s.name))
         FROM product_solutions ps
         JOIN solutions s ON s.id = ps.solutionId
         WHERE ps.productId = p.id
       ), '[]') AS solutionsJson
FROM products p
JOIN categories c ON c.id = p.categoryId
`;

export function mapProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    code: row.code,
    categoryId: row.categoryId,
    name: row.name,
    inci: row.inci,
    description: row.description,
    benefits: parseArray(row.benefits),
    functions: parseArray(row.functions),
    technicalInfo: parseObject(row.technicalInfo),
    imageUrl: row.imageUrl,
    imagePublicId: row.imagePublicId,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    status: row.status,
    isSample: Boolean(row.isSample),
    category: row.categorySlug
      ? { slug: row.categorySlug, name: row.categoryName, visual: row.categoryVisual }
      : null,
    applications: parseArray(row.applicationsJson),
    solutions: parseArray(row.solutionsJson),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function buildWhere(params, publishedOnly) {
  const where = [];
  const values = [];

  if (publishedOnly) {
    where.push("p.status = 'PUBLISHED'");
  } else if (params.status) {
    where.push('p.status = ?');
    values.push(params.status);
  }

  if (params.category) {
    where.push('c.slug = ?');
    values.push(params.category);
  }

  if (params.application) {
    where.push(`EXISTS (
      SELECT 1 FROM product_applications pa
      JOIN applications a ON a.id = pa.applicationId
      WHERE pa.productId = p.id AND a.slug = ?
    )`);
    values.push(params.application);
  }

  if (params.fn) {
    where.push(`EXISTS (
      SELECT 1 FROM product_solutions ps
      JOIN solutions s ON s.id = ps.solutionId
      WHERE ps.productId = p.id AND s.slug = ?
    )`);
    values.push(params.fn);
  }

  if (params.q) {
    const needle = `%${String(params.q).toLowerCase()}%`;
    where.push(`(
      LOWER(p.name) LIKE ?
      OR LOWER(p.inci) LIKE ?
      OR EXISTS (
        SELECT 1 FROM product_applications pa
        JOIN applications a ON a.id = pa.applicationId
        WHERE pa.productId = p.id AND LOWER(a.name) LIKE ?
      )
    )`);
    values.push(needle, needle, needle);
  }

  return { sql: where.length ? `WHERE ${where.join(' AND ')}` : '', values };
}

function orderClause(sort) {
  if (sort === 'name-desc') return 'ORDER BY p.name COLLATE NOCASE DESC';
  if (sort === 'newest') return 'ORDER BY p.createdAt DESC';
  return 'ORDER BY p.name COLLATE NOCASE ASC';
}

export async function listProducts(env, params = {}, publishedOnly = true) {
  const page = Number(params.page) || 1;
  const pageSize = Number(params.pageSize) || 12;
  const { sql: where, values } = buildWhere(params, publishedOnly);
  const offset = (page - 1) * pageSize;

  const [rows, countRow] = await Promise.all([
    dbAll(env.DB, `${PRODUCT_SELECT} ${where} ${orderClause(params.sort)} LIMIT ? OFFSET ?`, ...values, pageSize, offset),
    dbFirst(env.DB, `SELECT COUNT(*) AS total FROM products p JOIN categories c ON c.id = p.categoryId ${where}`, ...values),
  ]);

  return {
    items: rows.map(mapProduct),
    total: Number(countRow?.total || 0),
  };
}

async function attachDocuments(env, product) {
  const documents = await dbAll(
    env.DB,
    'SELECT id, title, type, fileUrl FROM documents WHERE productId = ? ORDER BY createdAt DESC',
    product.id,
  );
  return { ...product, documents };
}

export async function getProductBySlug(env, slug, publishedOnly = true) {
  const row = await dbFirst(
    env.DB,
    `${PRODUCT_SELECT} WHERE p.slug = ?${publishedOnly ? " AND p.status = 'PUBLISHED'" : ''}`,
    slug,
  );
  if (!row) return null;

  const product = await attachDocuments(env, mapProduct(row));
  const relatedRows = await dbAll(
    env.DB,
    `${PRODUCT_SELECT} WHERE p.categoryId = ? AND p.id != ? AND p.status = 'PUBLISHED' ORDER BY p.name COLLATE NOCASE ASC LIMIT 4`,
    row.categoryId,
    row.id,
  );

  return { ...product, related: relatedRows.map(mapProduct) };
}

export async function getProductById(env, id) {
  const row = await dbFirst(env.DB, `${PRODUCT_SELECT} WHERE p.id = ?`, id);
  if (!row) return null;
  return attachDocuments(env, mapProduct(row));
}
