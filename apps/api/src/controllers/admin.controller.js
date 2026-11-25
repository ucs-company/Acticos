import { getEnv } from '../config/env.js';
import { getBody, getQuery } from '../utils/body.js';
import { dbAll, dbFirst, dbRun, newId, nowIso } from '../utils/db.js';
import { ok, created } from '../utils/response.js';
import { ApiError } from '../middleware/error.js';
import { slugify } from '../utils/slug.js';
import { stringifyJson } from '../utils/json.js';
import { listProducts, getProductById, getProductBySlug } from '../services/product.service.js';
import { getUploadedFile } from '../utils/upload.js';
import { uploadFile, deleteFile } from '../services/storage.service.js';

const nullable = (value) => {
  if (value === undefined || value === null || value === '') return null;
  return value;
};

const stringValue = (value) => {
  const result = nullable(value);
  return result === null ? null : String(result);
};

const arrayValue = (value) => stringifyJson(Array.isArray(value) ? value : []);

const CRUD = {
  categories: {
    table: 'categories',
    fields: ['slug', 'name', 'description', 'visual', 'sortOrder', 'seoTitle', 'seoDescription'],
    order: 'sortOrder ASC, name ASC',
    slugSource: 'name',
    defaults: { visual: 'active', sortOrder: 0 },
  },
  applications: {
    table: 'applications',
    fields: ['slug', 'name', 'description'],
    order: 'name ASC',
    slugSource: 'name',
  },
  solutions: {
    table: 'solutions',
    fields: ['slug', 'name', 'description'],
    order: 'name ASC',
    slugSource: 'name',
  },
  blog: {
    table: 'blog',
    fields: ['slug', 'title', 'excerpt', 'content', 'status', 'publishedAt'],
    order: 'createdAt DESC',
    slugSource: 'title',
    defaults: { status: 'DRAFT' },
    prepare: (body) => ({
      ...body,
      status: body.status || 'DRAFT',
      publishedAt: body.status === 'PUBLISHED' ? nowIso() : null,
    }),
  },
};

const INBOX_TABLES = {
  quotes: 'quote_requests',
  samples: 'sample_requests',
  technical: 'technical_enquiries',
  contact: 'contact_messages',
};

const DOCUMENT_TYPES = new Set(['TDS', 'SDS', 'CATALOGUE', 'APPLICATION_NOTE', 'FORMULATION_GUIDE', 'OTHER']);

export async function listAdminProducts(c) {
  const query = getQuery(c);
  const { items, total } = await listProducts(getEnv(c), query, false);
  return ok(c, items, {
    total,
    page: Number(query.page),
    pageSize: Number(query.pageSize),
    totalPages: Math.ceil(total / Number(query.pageSize)),
  });
}

export async function getAdminProduct(c) {
  const product = await getProductById(getEnv(c), c.req.param('id'));
  if (!product) throw new ApiError(404, 'NOT_FOUND', 'Product not found');
  return ok(c, product);
}

async function replaceProductLinks(env, id, applicationIds, solutionIds) {
  await dbRun(env.DB, 'DELETE FROM product_applications WHERE productId = ?', id);
  await dbRun(env.DB, 'DELETE FROM product_solutions WHERE productId = ?', id);

  for (const applicationId of applicationIds || []) {
    await dbRun(
      env.DB,
      'INSERT OR IGNORE INTO product_applications (productId, applicationId) VALUES (?, ?)',
      id,
      applicationId,
    );
  }
  for (const solutionId of solutionIds || []) {
    await dbRun(
      env.DB,
      'INSERT OR IGNORE INTO product_solutions (productId, solutionId) VALUES (?, ?)',
      id,
      solutionId,
    );
  }
}

export async function createProduct(c) {
  const env = getEnv(c);
  const body = getBody(c);
  const id = newId();
  const timestamp = nowIso();

  await dbRun(
    env.DB,
    `INSERT INTO products
      (id, slug, code, name, inci, description, benefits, functions, technicalInfo, imageUrl, seoTitle, seoDescription, status, isSample, categoryId, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    body.slug || slugify(body.name),
    stringValue(body.code),
    body.name,
    body.inci || '',
    stringValue(body.description),
    arrayValue(body.benefits),
    arrayValue(body.functions),
    stringifyJson(body.technicalInfo ?? null),
    stringValue(body.imageUrl),
    stringValue(body.seoTitle),
    stringValue(body.seoDescription),
    body.status || 'DRAFT',
    body.isSample ? 1 : 0,
    body.categoryId,
    timestamp,
    timestamp,
  );

  await replaceProductLinks(env, id, body.applicationIds, body.solutionIds);
  return created(c, await getProductById(env, id));
}

export async function updateProduct(c) {
  const env = getEnv(c);
  const body = getBody(c);
  const id = c.req.param('id');
  const existing = await dbFirst(env.DB, 'SELECT id, slug FROM products WHERE id = ?', id);
  if (!existing) throw new ApiError(404, 'NOT_FOUND', 'Product not found');

  await dbRun(
    env.DB,
    `UPDATE products SET
      slug = ?, code = ?, name = ?, inci = ?, description = ?, benefits = ?, functions = ?,
      technicalInfo = ?, imageUrl = ?, seoTitle = ?, seoDescription = ?, status = ?,
      isSample = ?, categoryId = ?, updatedAt = ?
     WHERE id = ?`,
    body.slug || existing.slug,
    stringValue(body.code),
    body.name,
    body.inci || '',
    stringValue(body.description),
    arrayValue(body.benefits),
    arrayValue(body.functions),
    stringifyJson(body.technicalInfo ?? null),
    stringValue(body.imageUrl),
    stringValue(body.seoTitle),
    stringValue(body.seoDescription),
    body.status || 'DRAFT',
    body.isSample ? 1 : 0,
    body.categoryId,
    nowIso(),
    id,
  );

  await replaceProductLinks(env, id, body.applicationIds, body.solutionIds);
  return ok(c, await getProductById(env, id));
}

export function setProductStatus(status) {
  return async (c) => {
    const id = c.req.param('id');
    const result = await dbRun(
      getEnv(c).DB,
      'UPDATE products SET status = ?, updatedAt = ? WHERE id = ?',
      status,
      nowIso(),
      id,
    );
    if (!result.meta?.changes) throw new ApiError(404, 'NOT_FOUND', 'Product not found');
    return ok(c, { id, status });
  };
}

export async function deleteProduct(c) {
  const result = await dbRun(getEnv(c).DB, 'DELETE FROM products WHERE id = ?', c.req.param('id'));
  if (!result.meta?.changes) throw new ApiError(404, 'NOT_FOUND', 'Product not found');
  return ok(c, { id: c.req.param('id') });
}

export async function uploadProductImage(c) {
  const env = getEnv(c);
  const file = await getUploadedFile(c, 'image');
  if (file.mimetype === 'application/pdf') {
    throw new ApiError(415, 'UNSUPPORTED_FILE', 'Product images must be PNG or JPG');
  }

  const uploaded = await uploadFile(env, file, 'products');
  const result = await dbRun(
    env.DB,
    'UPDATE products SET imageUrl = ?, updatedAt = ? WHERE id = ?',
    uploaded.url,
    nowIso(),
    c.req.param('id'),
  );
  if (!result.meta?.changes) throw new ApiError(404, 'NOT_FOUND', 'Product not found');
  return ok(c, { id: c.req.param('id'), imageUrl: uploaded.url });
}

function crud(resource) {
  const config = CRUD[resource];

  return {
    list: async (c) => {
      const rows = await dbAll(getEnv(c).DB, `SELECT * FROM ${config.table} ORDER BY ${config.order}`);
      return ok(c, rows);
    },
    create: async (c) => {
      const body = config.prepare ? config.prepare(getBody(c)) : getBody(c);
      const id = newId();
      const timestamp = nowIso();
      const slug = body.slug || slugify(body[config.slugSource] || '');
      const values = config.fields.map((field) => {
        if (field === 'slug') return slug;
        if (config.defaults && field in config.defaults && body[field] === undefined) return config.defaults[field];
        const value = body[field];
        if (field === 'sortOrder') return Number(value) || 0;
        return nullable(value);
      });

      await dbRun(
        getEnv(c).DB,
        `INSERT INTO ${config.table} (id, ${config.fields.join(', ')}, createdAt, updatedAt) VALUES (?, ${config.fields.map(() => '?').join(', ')}, ?, ?)`,
        id,
        ...values,
        timestamp,
        timestamp,
      );

      const row = await dbFirst(getEnv(c).DB, `SELECT * FROM ${config.table} WHERE id = ?`, id);
      return created(c, row);
    },
    update: async (c) => {
      const id = c.req.param('id');
      const body = config.prepare ? config.prepare(getBody(c)) : getBody(c);
      const existing = await dbFirst(getEnv(c).DB, `SELECT * FROM ${config.table} WHERE id = ?`, id);
      if (!existing) throw new ApiError(404, 'NOT_FOUND', 'Record not found');

      const values = config.fields.map((field) => {
        if (field === 'slug') return body.slug || existing.slug;
        if (field === 'sortOrder') return Number(body[field]) || 0;
        return nullable(body[field]);
      });

      const result = await dbRun(
        getEnv(c).DB,
        `UPDATE ${config.table} SET ${config.fields.map((field) => `${field} = ?`).join(', ')}, updatedAt = ? WHERE id = ?`,
        ...values,
        nowIso(),
        id,
      );
      if (!result.meta?.changes) throw new ApiError(404, 'NOT_FOUND', 'Record not found');

      const row = await dbFirst(getEnv(c).DB, `SELECT * FROM ${config.table} WHERE id = ?`, id);
      return ok(c, row);
    },
    remove: async (c) => {
      const result = await dbRun(getEnv(c).DB, `DELETE FROM ${config.table} WHERE id = ?`, c.req.param('id'));
      if (!result.meta?.changes) throw new ApiError(404, 'NOT_FOUND', 'Record not found');
      return ok(c, { id: c.req.param('id') });
    },
  };
}

export const categoryCrud = crud('categories');
export const applicationCrud = crud('applications');
export const solutionCrud = crud('solutions');
export const blogCrud = crud('blog');

export async function listDocuments(c) {
  const rows = await dbAll(getEnv(c).DB, `
    SELECT d.*, p.name AS productName
    FROM documents d
    LEFT JOIN products p ON p.id = d.productId
    ORDER BY d.createdAt DESC
  `);
  return ok(c, rows);
}

export async function createDocument(c) {
  const env = getEnv(c);
  const body = getBody(c);
  const title = stringValue(body.title);
  if (!title) throw new ApiError(422, 'VALIDATION_ERROR', 'Title is required', { title: ['Title is required'] });

  const type = DOCUMENT_TYPES.has(body.type) ? body.type : 'OTHER';
  const file = await getUploadedFile(c, 'file');
  const uploaded = await uploadFile(env, file, 'documents');
  const id = newId();

  await dbRun(
    env.DB,
    'INSERT INTO documents (id, title, type, fileKey, fileUrl, productId, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    id,
    title,
    type,
    uploaded.key,
    uploaded.url,
    stringValue(body.productId),
    nowIso(),
  );

  const row = await dbFirst(env.DB, 'SELECT * FROM documents WHERE id = ?', id);
  return created(c, row);
}

export async function deleteDocument(c) {
  const env = getEnv(c);
  const id = c.req.param('id');
  const document = await dbFirst(env.DB, 'SELECT id, fileKey FROM documents WHERE id = ?', id);
  if (!document) throw new ApiError(404, 'NOT_FOUND', 'Document not found');

  await dbRun(env.DB, 'DELETE FROM documents WHERE id = ?', id);
  await deleteFile(env, document.fileKey);
  return ok(c, { id });
}

export async function listInbox(c) {
  const table = INBOX_TABLES[c.req.param('type')];
  if (!table) throw new ApiError(404, 'NOT_FOUND', 'Unknown inbox');

  const rows = await dbAll(getEnv(c).DB, `SELECT * FROM ${table} ORDER BY createdAt DESC LIMIT 200`);
  return ok(c, rows.map((row) => (row.isRead !== undefined ? { ...row, isRead: Boolean(row.isRead) } : row)));
}

export async function updateInboxItem(c) {
  const table = INBOX_TABLES[c.req.param('type')];
  if (!table) throw new ApiError(404, 'NOT_FOUND', 'Unknown inbox');

  const id = c.req.param('id');
  const body = getBody(c);

  if (table === 'contact_messages') {
    const result = await dbRun(getEnv(c).DB, 'UPDATE contact_messages SET isRead = 1 WHERE id = ?', id);
    if (!result.meta?.changes) throw new ApiError(404, 'NOT_FOUND', 'Record not found');
  } else if (body.status) {
    const result = await dbRun(getEnv(c).DB, `UPDATE ${table} SET status = ? WHERE id = ?`, body.status, id);
    if (!result.meta?.changes) throw new ApiError(404, 'NOT_FOUND', 'Record not found');
  }

  const row = await dbFirst(getEnv(c).DB, `SELECT * FROM ${table} WHERE id = ?`, id);
  if (!row) throw new ApiError(404, 'NOT_FOUND', 'Record not found');
  return ok(c, row.isRead !== undefined ? { ...row, isRead: Boolean(row.isRead) } : row);
}

const tally = (values) =>
  Object.entries(
    values.reduce((acc, value) => {
      if (!value) return acc;
      return { ...acc, [value]: (acc[value] || 0) + 1 };
    }, {}),
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

export async function stats(c) {
  const env = getEnv(c);
  const since = new Date(Date.now() - 180 * 864e5).toISOString();

  const [productCount, quoteCount, sampleCount, technicalCount, unreadCount, quotes, samples, technical, categoryRows, applicationRows] = await Promise.all([
    dbFirst(env.DB, 'SELECT COUNT(*) AS value FROM products'),
    dbFirst(env.DB, 'SELECT COUNT(*) AS value FROM quote_requests'),
    dbFirst(env.DB, 'SELECT COUNT(*) AS value FROM sample_requests'),
    dbFirst(env.DB, 'SELECT COUNT(*) AS value FROM technical_enquiries'),
    dbFirst(env.DB, 'SELECT COUNT(*) AS value FROM contact_messages WHERE isRead = 0'),
    dbAll(env.DB, 'SELECT createdAt, product, application FROM quote_requests WHERE createdAt >= ?', since),
    dbAll(env.DB, 'SELECT createdAt, product, application FROM sample_requests WHERE createdAt >= ?', since),
    dbAll(env.DB, 'SELECT createdAt, product, application FROM technical_enquiries WHERE createdAt >= ?', since),
    dbAll(env.DB, 'SELECT c.name AS category, p.name AS product FROM products p JOIN categories c ON c.id = p.categoryId'),
    dbAll(env.DB, 'SELECT name FROM applications'),
  ]);

  const rows = [...quotes, ...samples, ...technical];
  const productCategory = Object.fromEntries(categoryRows.map((row) => [row.product.toLowerCase(), row.category]));
  const applicationNames = new Set(applicationRows.map((row) => row.name));
  const overTime = tally(rows.map((row) => String(row.createdAt).slice(0, 7)))
    .sort((a, b) => a.label.localeCompare(b.label));

  return ok(c, {
    totals: {
      products: Number(productCount?.value || 0),
      quotes: Number(quoteCount?.value || 0),
      samples: Number(sampleCount?.value || 0),
      technical: Number(technicalCount?.value || 0),
      unread: Number(unreadCount?.value || 0),
    },
    enquiriesOverTime: overTime,
    requestsByCategory: tally(rows.map((row) => productCategory[String(row.product || '').toLowerCase()])),
    popularProducts: tally(rows.map((row) => row.product)).slice(0, 5),
    applicationInterest: tally(rows.map((row) => row.application))
      .filter((item) => applicationNames.has(item.label))
      .slice(0, 6),
  });
}

export async function getPublicProductPreview(c) {
  const product = await getProductBySlug(getEnv(c), c.req.param('slug'), false);
  if (!product) throw new ApiError(404, 'NOT_FOUND', 'Product not found');
  return ok(c, product);
}
