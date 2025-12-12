import { ProductService } from '../services/productService.js';
import { parseId } from '../utils/helpers.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class ProductController {
  static async getAllProducts(req, res, next) {
    try {
      const result = await ProductService.getAllProducts(req.query);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const id = parseId(req.params.id, 'Product');
      const product = await ProductService.getProductById(id);
      res.status(HTTP_STATUS.OK).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req, res, next) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(HTTP_STATUS.CREATED).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const id = parseId(req.params.id, 'Product');
      const product = await ProductService.updateProduct(id, req.body);
      res.status(HTTP_STATUS.OK).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const id = parseId(req.params.id, 'Product');
      const result = await ProductService.deleteProduct(id);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}

