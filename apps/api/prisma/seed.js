import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const dataPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../data/products.json');
const data = JSON.parse(readFileSync(dataPath, 'utf8'));

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: {},
      create: { email: email.toLowerCase(), name: 'Super Admin', role: 'SUPER_ADMIN', passwordHash: await bcrypt.hash(password, 12) },
    });
    console.log('Admin user ready:', email);
  } else console.warn('SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set, skipping admin user');

  const catIds = {}, appIds = {}, solIds = {};
  for (const [i, c] of data.categories.entries()) {
    const row = await prisma.category.upsert({ where: { slug: c.slug }, update: { name: c.name, description: c.description, visual: c.visual, sortOrder: i }, create: { ...c, sortOrder: i } });
    catIds[c.slug] = row.id;
  }
  for (const a of data.applications) appIds[a.slug] = (await prisma.application.upsert({ where: { slug: a.slug }, update: a, create: a })).id;
  for (const s of data.solutions) solIds[s.slug] = (await prisma.solution.upsert({ where: { slug: s.slug }, update: s, create: s })).id;

  for (const p of data.products) {
    const { category, applications, functions, technicalInfo, ...rest } = p;
    const body = {
      ...rest, functions, technicalInfo: technicalInfo ?? undefined, status: 'PUBLISHED',
      categoryId: catIds[category],
      applications: { set: applications.map((s) => ({ id: appIds[s] })) },
      solutions: { set: functions.filter((f) => solIds[f]).map((s) => ({ id: solIds[s] })) },
    };
    await prisma.product.upsert({ where: { slug: p.slug }, update: body, create: { ...body, applications: { connect: body.applications.set }, solutions: { connect: body.solutions.set } } });
  }
  console.log(`Seeded ${data.products.length} products from data/products.json`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
