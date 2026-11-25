import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const dataPath = process.env.DATA_FILE
  ? path.resolve(process.env.DATA_FILE)
  : path.resolve(scriptDir, '../../../data/products.json');
const configPath = path.resolve(scriptDir, '../wrangler.jsonc');
const args = process.argv.slice(2);
const remote = args.includes('--remote');
const force = args.includes('--force');
const catalogueOnly = args.includes('--catalogue-only');
const sqlOutArg = args.find((arg) => arg.startsWith('--sql-out='));
const sqlOut = sqlOutArg ? path.resolve(sqlOutArg.slice('--sql-out='.length)) : '';
const email = process.env.SEED_ADMIN_EMAIL || '';
const enc = new TextEncoder();
const now = new Date().toISOString();

if (remote && !force) {
  console.error('Remote seeding requires --force to confirm data replacement');
  process.exit(1);
}

const data = JSON.parse(readFileSync(dataPath, 'utf8'));

const quote = (value) => {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? '1' : '0';
  return `'${String(value).replace(/'/g, "''")}'`;
};

const hex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

async function derive(password, salt, iterations) {
  const key = await webcrypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await webcrypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    key,
    256,
  );
  return new Uint8Array(bits);
}

async function hashPassword(password, iterations = 100000) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, iterations);
  return `pbkdf2$${itersToString(iterations)}$${hex(salt)}$${hex(hash)}`;
}

function itersToString(value) {
  return String(value);
}

function insert(table, columns, values) {
  return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${values.map(quote).join(', ')});`;
}

async function buildSql() {
  const deletions = catalogueOnly
    ? [
        'DELETE FROM product_applications;',
        'DELETE FROM product_solutions;',
        'DELETE FROM documents;',
        'DELETE FROM products;',
        'DELETE FROM categories;',
        'DELETE FROM applications;',
        'DELETE FROM solutions;',
      ]
    : [
        'DELETE FROM product_applications;',
        'DELETE FROM product_solutions;',
        'DELETE FROM documents;',
        'DELETE FROM products;',
        'DELETE FROM categories;',
        'DELETE FROM applications;',
        'DELETE FROM solutions;',
        'DELETE FROM blog;',
        'DELETE FROM quote_requests;',
        'DELETE FROM sample_requests;',
        'DELETE FROM technical_enquiries;',
        'DELETE FROM contact_messages;',
        'DELETE FROM users;',
      ];
  const lines = [...deletions];

  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password && !catalogueOnly) {
    lines.push(insert('users',
      ['id', 'email', 'name', 'passwordHash', 'role', 'isActive', 'lastLoginAt', 'createdAt', 'updatedAt'],
      ['usr_super_admin', email.toLowerCase(), 'Super Admin', await hashPassword(password), 'SUPER_ADMIN', 1, null, now, now]));
  }

  for (const [index, category] of data.categories.entries()) {
    lines.push(insert('categories',
      ['id', 'slug', 'name', 'description', 'visual', 'sortOrder', 'seoTitle', 'seoDescription', 'createdAt', 'updatedAt'],
      [`cat_${category.slug}`, category.slug, category.name, category.description || null, category.visual || 'active', index, null, null, now, now]));
  }

  for (const application of data.applications) {
    lines.push(insert('applications',
      ['id', 'slug', 'name', 'description', 'createdAt', 'updatedAt'],
      [`app_${application.slug}`, application.slug, application.name, application.description || null, now, now]));
  }

  for (const solution of data.solutions) {
    lines.push(insert('solutions',
      ['id', 'slug', 'name', 'description', 'createdAt', 'updatedAt'],
      [`sol_${solution.slug}`, solution.slug, solution.name, solution.description || null, now, now]));
  }

  const solutionSlugs = new Set(data.solutions.map((solution) => solution.slug));

  for (const product of data.products) {
    lines.push(insert('products',
      ['id', 'slug', 'code', 'name', 'inci', 'description', 'benefits', 'functions', 'technicalInfo', 'imageUrl', 'seoTitle', 'seoDescription', 'status', 'isSample', 'categoryId', 'createdAt', 'updatedAt'],
      [
        `prod_${product.slug}`,
        product.slug,
        product.code || null,
        product.name,
        product.inci || '',
        product.description || null,
        JSON.stringify(product.benefits || []),
        JSON.stringify(product.functions || []),
        product.technicalInfo ? JSON.stringify(product.technicalInfo) : null,
        product.imageUrl || null,
        product.seoTitle || null,
        product.seoDescription || null,
        'PUBLISHED',
        product.isSample ? 1 : 0,
        `cat_${product.category}`,
        now,
        now,
      ]));

    for (const application of product.applications || []) {
      lines.push(insert('product_applications', ['productId', 'applicationId'], [`prod_${product.slug}`, `app_${application}`]));
    }
    for (const solution of product.functions || []) {
      if (solutionSlugs.has(solution)) {
        lines.push(insert('product_solutions', ['productId', 'solutionId'], [`prod_${product.slug}`, `sol_${solution}`]));
      }
    }
  }

  return lines.join('\n');
}

function execute(sqlFile) {
  return new Promise((resolve, reject) => {
    const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    let stdout = '';
    let stderr = '';
    const child = spawn(command, [
      'wrangler', 'd1', 'execute', 'acticos-prod',
      '--config', configPath,
      remote ? '--remote' : '--local',
      '--yes',
      '--file', sqlFile,
    ], { stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32' });

    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) return resolve();
      reject(new Error(stderr || stdout || `wrangler exited with ${code}`));
    });
  });
}

const sql = await buildSql();
const sqlFile = sqlOut || path.join(os.tmpdir(), `acticos-seed-${Date.now()}.sql`);
writeFileSync(sqlFile, sql, 'utf8');

if (sqlOut) {
  console.log(`Wrote SQL to ${sqlFile}`);
  process.exit(0);
}

try {
  await execute(sqlFile);
  console.log(`Seeded ${data.categories.length} categories, ${data.applications.length} applications, ${data.solutions.length} solutions and ${data.products.length} products${email ? ' with admin user' : ''}`);
} finally {
  unlinkSync(sqlFile);
}
