import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import { formatCart } from '../utils/helpers.js';

export class CartService {
  static async getCart(userId) {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return formatCart(cartItems);
  }

  static async addItem(userId, productId, quantity) {
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        price: true,
        image: true
      }
    });

    if (!product) {
      throw new NotFoundError('Product', productId);
    }

    // Check if item already exists in cart
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existing) {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity }
      });
    } else {
      // Insert new item
      await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity
        }
      });
    }

    // Get updated cart
    return this.getCart(userId);
  }

  static async updateItemQuantity(userId, productId, quantity) {
    const cartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true
          }
        }
      }
    }).catch(() => null);

    if (!cartItem) {
      throw new NotFoundError('Cart item');
    }

    // Get updated cart
    return this.getCart(userId);
  }

  static async removeItem(userId, productId) {
    const cartItem = await prisma.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    }).catch(() => null);

    if (!cartItem) {
      throw new NotFoundError('Cart item');
    }

    return { message: 'Item removed from cart' };
  }

  static async clearCart(userId) {
    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    return { message: 'Cart cleared' };
  }
}

