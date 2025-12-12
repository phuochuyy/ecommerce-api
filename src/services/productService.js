import prisma from '../config/database.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { formatProduct } from '../utils/helpers.js';
import { buildProductWhere, buildOrderBy } from '../utils/helpers.js';
import { PAGINATION, VALID_SORT_FIELDS } from '../utils/constants.js';

export class ProductService {
  static async getAllProducts(query) {
    const {
      category,
      search,
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      sort = 'id',
      order = 'asc'
    } = query;

    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), PAGINATION.MAX_LIMIT);
    const offset = (pageNum - 1) * limitNum;

    const where = buildProductWhere(category, search);
    const orderBy = buildOrderBy(sort, order, VALID_SORT_FIELDS);

    // Get total count and products
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip: offset,
        take: limitNum,
        orderBy
      })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return {
      products: products.map(formatProduct),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    };
  }

  static async getProductById(id) {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw new NotFoundError('Product', id);
    }

    return formatProduct(product);
  }

  static async createProduct(productData) {
    const {
      name,
      description,
      price,
      originalPrice,
      image,
      images,
      category,
      stock,
      brand,
      isPrime,
      discount,
      specifications
    } = productData;

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        originalPrice: originalPrice || null,
        image: image || null,
        images: images || [],
        category: category || null,
        stock: stock || 0,
        brand: brand || null,
        isPrime: isPrime || false,
        discount: discount || null,
        specifications: specifications || {}
      }
    });

    return formatProduct(product);
  }

  static async updateProduct(id, updateData) {
    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new NotFoundError('Product', id);
    }

    // Build update data object (only include defined fields)
    const data = {};
    const allowedFields = [
      'name', 'description', 'price', 'originalPrice', 'image', 'images',
      'category', 'stock', 'brand', 'isPrime', 'discount', 'specifications'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        data[field] = updateData[field];
      }
    });

    if (Object.keys(data).length === 0) {
      throw new BadRequestError('No fields to update');
    }

    const product = await prisma.product.update({
      where: { id },
      data
    });

    return formatProduct(product);
  }

  static async deleteProduct(id) {
    const product = await prisma.product.delete({
      where: { id }
    }).catch(() => null);

    if (!product) {
      throw new NotFoundError('Product', id);
    }

    return { message: 'Product deleted successfully' };
  }
}

