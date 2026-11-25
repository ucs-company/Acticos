import { getEnv } from '../config/env.js';
import { getBody } from '../utils/body.js';
import { dbRun, newId, nowIso } from '../utils/db.js';
import { created } from '../utils/response.js';
import { getUploadedFile } from '../utils/upload.js';
import { uploadFile } from '../services/storage.service.js';

const text = (value) => {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'object' && 'name' in value) return null;
  return String(value);
};

const requiredText = (value) => text(value) || '';

const done = (c, message) => created(c, { message });

export async function quote(c) {
  const env = getEnv(c);
  const body = getBody(c);
  const id = newId();
  await dbRun(
    env.DB,
    `INSERT INTO quote_requests
      (id, name, company, email, phone, country, product, quantity, application, message, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW', ?)`,
    id,
    requiredText(body.name),
    requiredText(body.company),
    requiredText(body.email),
    text(body.phone),
    requiredText(body.country),
    requiredText(body.product),
    requiredText(body.quantity),
    text(body.application),
    text(body.message),
    nowIso(),
  );
  return done(c, 'Thank you. Your quote request has been received and our team will respond shortly.');
}

export async function sample(c) {
  const env = getEnv(c);
  const body = getBody(c);
  await dbRun(
    env.DB,
    `INSERT INTO sample_requests
      (id, name, company, email, phone, product, application, quantity, message, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW', ?)`,
    newId(),
    requiredText(body.name),
    requiredText(body.company),
    requiredText(body.email),
    text(body.phone),
    requiredText(body.product),
    text(body.application),
    requiredText(body.quantity),
    text(body.message),
    nowIso(),
  );
  return done(c, 'Thank you. Your sample request has been received.');
}

export async function technical(c) {
  const env = getEnv(c);
  const body = getBody(c);
  const file = body.attachment ? await getUploadedFile(c, 'attachment') : null;
  const uploaded = file ? await uploadFile(env, file, 'technical-enquiries') : null;

  await dbRun(
    env.DB,
    `INSERT INTO technical_enquiries
      (id, name, company, email, product, application, formulationRequirement, question, attachmentKey, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW', ?)`,
    newId(),
    requiredText(body.name),
    requiredText(body.company),
    requiredText(body.email),
    text(body.product),
    text(body.application),
    text(body.formulationRequirement),
    requiredText(body.question),
    uploaded?.key || null,
    nowIso(),
  );

  return done(c, 'Thank you. Your technical enquiry has been received and will be routed to our technical team.');
}

export async function contact(c) {
  const env = getEnv(c);
  const body = getBody(c);
  await dbRun(
    env.DB,
    `INSERT INTO contact_messages
      (id, name, company, email, phone, country, message, isRead, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)`,
    newId(),
    requiredText(body.name),
    text(body.company),
    requiredText(body.email),
    text(body.phone),
    text(body.country),
    requiredText(body.message),
    nowIso(),
  );
  return done(c, 'Thank you. Your message has been received.');
}
