import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { UnauthorizedError, ValidationError } from '../utils/errors.js';
import { JWT_CONFIG } from '../utils/constants.js';

export class AuthService {
  static async register(userData) {
    const { name, email, password, phone } = userData;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new ValidationError('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      }
    }).catch((error) => {
      // Handle race condition
      if (error.code === 'P2002') {
        throw new ValidationError('Email already exists');
      }
      throw error;
    });

    // Generate token
    const token = this.generateToken(user.id);

    return { user, token };
  }

  static async login(email, password) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        phone: true,
        address: true
      }
    });
    
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }

  static generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || JWT_CONFIG.DEFAULT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || JWT_CONFIG.DEFAULT_EXPIRES_IN }
    );
  }
}

