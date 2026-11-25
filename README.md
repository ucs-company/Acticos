# Acticos International website

React (Vite, JS) + Tailwind + Framer Motion + GSAP · Node/Express · PostgreSQL/Prisma · Cloudflare R2 · Nginx + PM2.

## Run locally
```bash
npm install
cp .env.example apps/api/.env      # fill DATABASE_URL, JWT_SECRET (32+ chars), SEED_ADMIN_*
cp .env.example apps/web/.env      # set VITE_USE_LOCAL_DATA=true to run the site without the API
cd apps/api && npx prisma migrate dev --name init && cd ../..
npm run db:seed
npm run dev:api     # http://localhost:4000
npm run dev:web     # http://localhost:5173  (proxies /api)
```
Admin: `/admin/login` with the seeded SUPER_ADMIN.

## Deploy (one server)
`npm run build:web`, serve `apps/web/dist` with `deploy/nginx.conf`, run the API with `pm2 start deploy/ecosystem.config.cjs`, run `npm run db:migrate` on release. Cloudflare: proxy DNS, SSL Full (strict), WAF, rate-limit rules, Turnstile (set both site and secret keys).

## Before launch ([DATA REQUIRED])
- **Real product catalogue.** `data/products.json` is sample data. Replace it with the Acticos portfolio.
- Contact details (`apps/web/src/config/site.js`), About copy, certifications, category descriptions, solution-to-product mapping.
- TDS/SDS uploads and product images (need R2 credentials).
- Logo and brand assets (the current mark is a placeholder).
- Pre-rendering: this is a client-rendered SPA. For stronger SEO on product pages add prerendering (e.g. vite-plugin-prerender) or SSR.

## Not verified here
Prisma migrations and the API were not run against a live database (the sandbox blocked Prisma engine downloads). The API passes syntax checks and the web app builds, but run the migration, seed and an end-to-end test on your machine.
