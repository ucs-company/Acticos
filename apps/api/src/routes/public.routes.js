import { Hono } from 'hono';
import { validate } from '../middleware/validate.js';
import { formLimiter } from '../middleware/rateLimit.js';
import { verifyTurnstile } from '../middleware/turnstile.js';
import {
  quoteSchema, sampleSchema, technicalSchema, contactSchema, productListQuery,
} from '../validators/index.js';
import * as pub from '../controllers/public.controller.js';
import * as enq from '../controllers/enquiry.controller.js';

const router = new Hono();

router.get('/products', validate(productListQuery, 'query'), pub.products);
router.get('/products/:slug', pub.productBySlug);
router.get('/categories', pub.categories);
router.get('/categories/:slug', pub.categoryBySlug);
router.get('/applications', pub.applications);
router.get('/applications/:slug', pub.applicationBySlug);
router.get('/solutions', pub.solutions);
router.get('/blog', pub.blogPosts);
router.get('/documents', pub.documents);

router.post('/enquiries/quote', formLimiter, verifyTurnstile, validate(quoteSchema), enq.quote);
router.post('/enquiries/sample', formLimiter, verifyTurnstile, validate(sampleSchema), enq.sample);
router.post('/enquiries/technical', formLimiter, verifyTurnstile, validate(technicalSchema), enq.technical);
router.post('/contact', formLimiter, verifyTurnstile, validate(contactSchema), enq.contact);

export default router;
