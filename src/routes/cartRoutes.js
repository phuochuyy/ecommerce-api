import express from 'express';
import { CartController } from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';
import { validateCartItem, validateUpdateCartItem } from '../middleware/validation.js';

const router = express.Router();

router.get('/', authenticate, CartController.getCart);
router.post('/items', authenticate, validateCartItem, CartController.addItem);
router.put('/items/:productId', authenticate, validateUpdateCartItem, CartController.updateItemQuantity);
router.delete('/items/:productId', authenticate, CartController.removeItem);
router.delete('/', authenticate, CartController.clearCart);

export default router;

