import { HTTP_STATUS } from './constants.js';

export class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, error = 'Error') {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, errors = {}) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation error');
    this.errors = errors;
  }
}

export class NotFoundError extends AppError {
  constructor(resource, id) {
    const message = id 
      ? `${resource} with ID ${id} does not exist`
      : `${resource} not found`;
    super(message, HTTP_STATUS.NOT_FOUND, `${resource} not found`);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required or invalid token') {
    super(message, HTTP_STATUS.UNAUTHORIZED, 'Unauthorized');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, HTTP_STATUS.FORBIDDEN, 'Forbidden');
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Invalid request data') {
    super(message, HTTP_STATUS.BAD_REQUEST, 'Bad Request');
  }
}

