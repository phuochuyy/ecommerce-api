import { CartService } from '../services/cartService.js';
import { parseId } from '../utils/helpers.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class CartController {
  static async getCart(req, res, next) {
    try {
      const userId = req.user.id;
      const cart = await CartService.getCart(userId);
      res.status(HTTP_STATUS.OK).json(cart);
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req, res, next) {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;
      const cart = await CartService.addItem(userId, productId, quantity);
      res.status(HTTP_STATUS.OK).json({
        message: 'Item added to cart',
        cart
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateItemQuantity(req, res, next) {
    try {
      const userId = req.user.id;
      const productId = parseId(req.params.productId, 'Product');
      const { quantity } = req.body;
      const cart = await CartService.updateItemQuantity(userId, productId, quantity);
      res.status(HTTP_STATUS.OK).json({
        message: 'Cart updated',
        cart
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeItem(req, res, next) {
    try {
      const userId = req.user.id;
      const productId = parseId(req.params.productId, 'Product');
      const result = await CartService.removeItem(userId, productId);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await CartService.clearCart(userId);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}

