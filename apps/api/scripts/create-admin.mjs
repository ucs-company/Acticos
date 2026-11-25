import { writeFileSync, unlinkSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.resolve(scriptDir, '../wrangler.jsonc');
const args = process.argv.slice(2);
const remote = args.includes('--remote');
const email = (process.env.ADMIN_EMAIL || args.find((arg) => arg.startsWith('--email='))?.slice('--email='.length) || '').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || args.find((arg) => arg.startsWith('--password='))?.slice('--password='.length) || '';
const name = process.env.ADMIN_NAME || args.find((arg) => arg.startsWith('--name='))?.slice('--name='.length) || 'Super Admin';
const enc = new TextEncoder();
const now = new Date().toISOString();

if (!email || !password) {
  console.error('Usage: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=strong-password npm run admin:create:local');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Password must be at least 8 characters');
  process.exit(1);
}
if (remote && !args.includes('--force')) {
  console.error('Remote admin creation requires --force');
  process.exit(1);
}

const hex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
const quote = (value) => `'${String(value).replace(/'/g, "''")}'`;

const key = await webcrypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
const salt = webcrypto.getRandomValues(new Uint8Array(16));
const bits = await webcrypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100000 }, key, 256);
const passwordHash = `pbkdf2$100000$${hex(salt)}$${hex(new Uint8Array(bits))}`;
const id = `usr_${Date.now().toString(36)}`;

const sql = `INSERT INTO users (id, email, name, passwordHash, role, isActive, lastLoginAt, createdAt, updatedAt)
VALUES (${quote(id)}, ${quote(email)}, ${quote(name)}, ${quote(passwordHash)}, 'SUPER_ADMIN', 1, NULL, ${quote(now)}, ${quote(now)})
ON CONFLICT(email) DO UPDATE SET name = excluded.name, passwordHash = excluded.passwordHash, role = excluded.role, isActive = 1, updatedAt = excluded.updatedAt;`;
const sqlFile = path.join(os.tmpdir(), `acticos-admin-${Date.now()}.sql`);
writeFileSync(sqlFile, sql, 'utf8');

const execute = () => new Promise((resolve, reject) => {
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  let stdout = '';
  let stderr = '';
  const child = spawn(command, [
    '-y', 'wrangler@4.167.0', 'd1', 'execute', 'acticos-prod',
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

try {
  await execute();
  console.log(`Admin user saved: ${email}`);
} finally {
  unlinkSync(sqlFile);
}
