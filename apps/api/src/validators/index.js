import { z } from 'zod';

const str = (max = 200) => z.string().trim().max(max);
const required = (label, max = 200) => str(max).min(1, `${label} is required`);
const optional = (max = 200) => z.union([str(max), z.literal(''), z.null()]).optional().transform((v) => (v === '' || v == null ? undefined : v));
const email = z.string().trim().toLowerCase().email('Enter a valid email address').max(200);
const captcha = { turnstileToken: z.string().optional() };

export const quoteSchema = z.object({
  name: required('Name', 120), company: required('Company', 160), email,
  phone: optional(40), country: required('Country', 80), product: required('Product', 200),
  quantity: required('Quantity / requirement', 200), application: optional(200), message: optional(3000), ...captcha,
});

export const sampleSchema = z.object({
  name: required('Name', 120), company: required('Company', 160), email, phone: optional(40),
  product: required('Product', 200), application: optional(200),
  quantity: required('Sample requirement', 200), message: optional(3000), ...captcha,
});

export const technicalSchema = z.object({
  name: required('Name', 120), company: required('Company', 160), email,
  product: optional(200), application: optional(200), formulationRequirement: optional(3000),
  question: required('Technical question', 4000), ...captcha,
});

export const contactSchema = z.object({
  name: required('Name', 120), company: optional(160), email, phone: optional(40),
  country: optional(80), message: required('Message', 4000), ...captcha,
});

export const loginSchema = z.object({ email, password: z.string().min(1).max(200) });

export const productListQuery = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.string().max(100).optional(),
  application: z.string().max(100).optional(),
  fn: z.string().max(100).optional(),
  sort: z.enum(['name-asc', 'name-desc', 'newest']).default('name-asc'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(60).default(12),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});

export const productSchema = z.object({
  name: required('Name'), slug: optional(200), code: optional(60), inci: required('INCI', 2000),
  categoryId: required('Category'), description: optional(5000),
  benefits: z.array(str(300)).default([]), functions: z.array(str(100)).default([]),
  technicalInfo: z.record(z.any()).nullable().optional(),
  applicationIds: z.array(z.string()).default([]), solutionIds: z.array(z.string()).default([]),
  imageUrl: optional(500), seoTitle: optional(200), seoDescription: optional(300),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'), isSample: z.boolean().default(false),
});

export const categorySchema = z.object({
  name: required('Name'), slug: optional(200), description: optional(2000),
  visual: z.enum(['preservative', 'active', 'emollient', 'blend']).default('active'),
  sortOrder: z.coerce.number().int().default(0), seoTitle: optional(200), seoDescription: optional(300),
});

export const taxonomySchema = z.object({ name: required('Name'), slug: optional(200), description: optional(2000), imageUrl: optional(500) });

export const blogSchema = z.object({
  title: required('Title'), slug: optional(200), excerpt: optional(500), content: required('Content', 50000),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
});

export const statusSchema = z.object({ status: z.enum(['NEW', 'IN_PROGRESS', 'CLOSED']) });
