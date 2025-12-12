import express from 'express';
import { ProductController } from '../controllers/productController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { validateProduct } from '../middleware/validation.js';

const router = express.Router();

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.post('/', authenticate, isAdmin, validateProduct, ProductController.createProduct);
router.put('/:id', authenticate, isAdmin, validateProduct, ProductController.updateProduct);
router.delete('/:id', authenticate, isAdmin, ProductController.deleteProduct);

export default router;

