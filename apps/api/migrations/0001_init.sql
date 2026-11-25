CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  passwordHash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'EDITOR' CHECK (role IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR')),
  isActive INTEGER NOT NULL DEFAULT 1,
  lastLoginAt TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  visual TEXT NOT NULL DEFAULT 'active',
  sortOrder INTEGER NOT NULL DEFAULT 0,
  seoTitle TEXT,
  seoDescription TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS solutions (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  name TEXT NOT NULL,
  inci TEXT NOT NULL DEFAULT '',
  description TEXT,
  benefits TEXT NOT NULL DEFAULT '[]',
  functions TEXT NOT NULL DEFAULT '[]',
  technicalInfo TEXT,
  imageUrl TEXT,
  seoTitle TEXT,
  seoDescription TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
  isSample INTEGER NOT NULL DEFAULT 0,
  categoryId TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS product_applications (
  productId TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  applicationId TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  PRIMARY KEY (productId, applicationId)
);

CREATE TABLE IF NOT EXISTS product_solutions (
  productId TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  solutionId TEXT NOT NULL REFERENCES solutions(id) ON DELETE CASCADE,
  PRIMARY KEY (productId, solutionId)
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'OTHER' CHECK (type IN ('TDS', 'SDS', 'CATALOGUE', 'APPLICATION_NOTE', 'FORMULATION_GUIDE', 'OTHER')),
  fileKey TEXT NOT NULL,
  fileUrl TEXT,
  productId TEXT REFERENCES products(id) ON DELETE SET NULL,
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS blog (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
  publishedAt TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quote_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,
  product TEXT NOT NULL,
  quantity TEXT NOT NULL,
  application TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'IN_PROGRESS', 'CLOSED')),
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sample_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  product TEXT NOT NULL,
  application TEXT,
  quantity TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'IN_PROGRESS', 'CLOSED')),
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS technical_enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT NOT NULL,
  product TEXT,
  application TEXT,
  formulationRequirement TEXT,
  question TEXT NOT NULL,
  attachmentKey TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'IN_PROGRESS', 'CLOSED')),
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  message TEXT NOT NULL,
  isRead INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(categoryId);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_documents_product ON documents(productId);
CREATE INDEX IF NOT EXISTS idx_product_applications_application ON product_applications(applicationId);
CREATE INDEX IF NOT EXISTS idx_product_solutions_solution ON product_solutions(solutionId);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created ON quote_requests(createdAt);
CREATE INDEX IF NOT EXISTS idx_sample_requests_created ON sample_requests(createdAt);
CREATE INDEX IF NOT EXISTS idx_technical_enquiries_created ON technical_enquiries(createdAt);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(createdAt);
