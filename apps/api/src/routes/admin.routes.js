import { Hono } from 'hono';
import { authenticate, authorize, ROLES } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import {
  loginSchema, productSchema, productListQuery, categorySchema, taxonomySchema, blogSchema, statusSchema,
} from '../validators/index.js';
import * as authController from '../controllers/auth.controller.js';
import * as admin from '../controllers/admin.controller.js';

const router = new Hono();

router.post('/auth/login', loginLimiter, validate(loginSchema), authController.loginUser);

router.use('*', authenticate);
router.get('/auth/me', authController.me);
router.get('/stats', admin.stats);

router.get('/products', validate(productListQuery, 'query'), admin.listAdminProducts);
router.get('/products/:id', admin.getAdminProduct);
router.post('/products', validate(productSchema), admin.createProduct);
router.put('/products/:id', validate(productSchema), admin.updateProduct);
router.patch('/products/:id/publish', admin.setProductStatus('PUBLISHED'));
router.patch('/products/:id/unpublish', admin.setProductStatus('DRAFT'));
router.post('/products/:id/image', admin.uploadProductImage);
router.delete('/products/:id', authorize(...ROLES.MANAGE), admin.deleteProduct);

router.get('/categories', admin.categoryCrud.list);
router.post('/categories', validate(categorySchema), admin.categoryCrud.create);
router.put('/categories/:id', validate(categorySchema), admin.categoryCrud.update);
router.delete('/categories/:id', authorize(...ROLES.MANAGE), admin.categoryCrud.remove);

router.get('/applications', admin.applicationCrud.list);
router.post('/applications', validate(taxonomySchema), admin.applicationCrud.create);
router.put('/applications/:id', validate(taxonomySchema), admin.applicationCrud.update);
router.delete('/applications/:id', authorize(...ROLES.MANAGE), admin.applicationCrud.remove);

router.get('/solutions', admin.solutionCrud.list);
router.post('/solutions', validate(taxonomySchema), admin.solutionCrud.create);
router.put('/solutions/:id', validate(taxonomySchema), admin.solutionCrud.update);
router.delete('/solutions/:id', authorize(...ROLES.MANAGE), admin.solutionCrud.remove);

router.get('/blog', admin.blogCrud.list);
router.post('/blog', validate(blogSchema), admin.blogCrud.create);
router.put('/blog/:id', validate(blogSchema), admin.blogCrud.update);
router.delete('/blog/:id', authorize(...ROLES.MANAGE), admin.blogCrud.remove);

router.get('/documents', admin.listDocuments);
router.post('/documents', admin.createDocument);
router.delete('/documents/:id', authorize(...ROLES.MANAGE), admin.deleteDocument);

router.get('/inbox/:type', authorize(...ROLES.MANAGE), admin.listInbox);
router.patch('/inbox/:type/:id', authorize(...ROLES.MANAGE), validate(statusSchema.partial()), admin.updateInboxItem);
router.get('/preview/:slug', admin.getPublicProductPreview);

export default router;
