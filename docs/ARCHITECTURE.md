# Acticos: architecture notes

## Catalogue data (single source of truth)
`data/products.json` feeds both the seed script and the frontend fallback.
**It currently contains 16 SAMPLE products** (`isSample: true`). Real Acticos product names are not present:
the Product Portfolio PDF was not available when this was built. Fields that need real data are marked `[DATA REQUIRED]`.

Record shape: `slug, code, name, inci, category, applications[], functions[], description, benefits[], technicalInfo, isSample`.
To load the real catalogue: replace the `products` array (and set `isSample` to false), then `npm run db:seed`.

Category labels are kept exactly as specified: "Emmolient & Esters", "Proprietery Blend Actives".
Category URL slugs: `preservatives-speciality-ingredients`, `active-ingredients`, `emmolient-esters`, `proprietery-blend-actives`.

## Sitemap
/ · /products · /products/:category · /products/:slug · /applications · /applications/:slug · /solutions · /about · /resources · /contact · /request-quote · /request-sample · /technical-enquiry · /admin/*

## Database
PostgreSQL via Prisma (`apps/api/prisma/schema.prisma`). Product → Category (many-to-one); Product ↔ Application, Product ↔ Solution (many-to-many); Product → Document (one-to-many). Enquiry tables: QuoteRequest, SampleRequest, TechnicalEnquiry, ContactMessage.

## API
Envelope: `{ success, data, meta? }` or `{ success:false, error:{ code, message, details? } }`.
Public: `GET /api/products|products/:slug|categories|applications|solutions|blog|documents`, `POST /api/enquiries/{quote|sample|technical}`, `POST /api/contact`, `GET /sitemap.xml`.
Admin (JWT): `/api/admin/auth/login`, `/auth/me`, `/stats`, `/products` CRUD + `publish|unpublish|image`, `/categories|applications|solutions|blog` CRUD, `/documents`, `/inbox/:type`.
RBAC: EDITOR can create/edit/publish; delete and inbox access need ADMIN or SUPER_ADMIN.

## Animation
`animations/engine.js` holds canvas scenes (hero: ingredients → formulation → performance; preservative shell; active molecules; emollient droplets; blend convergence). Pauses off-screen; single static frame under `prefers-reduced-motion`. GSAP ScrollTrigger drives the process line and counters; Framer Motion handles page transitions, nav indicator and mobile drawer.

## Known gaps
See README "Before launch".
