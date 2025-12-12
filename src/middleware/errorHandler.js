import { PRISMA_ERROR_CODES, HTTP_STATUS } from '../utils/constants.js';
import { ValidationError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle custom AppError
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.error,
      message: err.message,
      ...(err.errors && { errors: err.errors })
    });
  }

  // Handle Prisma errors
  if (err.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Validation error',
      message: 'Duplicate entry'
    });
  }

  if (err.code === PRISMA_ERROR_CODES.FOREIGN_KEY_CONSTRAINT) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: 'Validation error',
      message: 'Invalid reference'
    });
  }

  if (err.code === PRISMA_ERROR_CODES.RECORD_NOT_FOUND) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      error: 'Not found',
      message: 'The requested record does not exist'
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }

  // Default error
  res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: err.error || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred'
  });
};

export const notFoundHandler = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
};

