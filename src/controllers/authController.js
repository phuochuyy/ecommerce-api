import { AuthService } from '../services/authService.js';
import { HTTP_STATUS } from '../utils/constants.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      res.status(HTTP_STATUS.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res) {
    res.status(HTTP_STATUS.OK).json({
      message: 'Logged out successfully'
    });
  }
}

