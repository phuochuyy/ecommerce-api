import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { validateLogin, validateRegister } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.post('/logout', authenticate, AuthController.logout);

export default router;

