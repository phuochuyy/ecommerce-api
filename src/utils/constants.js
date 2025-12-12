// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};

// Prisma Error Codes
export const PRISMA_ERROR_CODES = {
  UNIQUE_CONSTRAINT: 'P2002',
  FOREIGN_KEY_CONSTRAINT: 'P2003',
  RECORD_NOT_FOUND: 'P2025'
};

// Default Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

// Valid Sort Fields
export const VALID_SORT_FIELDS = ['id', 'name', 'price', 'rating', 'createdAt'];

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// JWT Configuration
export const JWT_CONFIG = {
  DEFAULT_EXPIRES_IN: '7d',
  DEFAULT_SECRET: 'your-super-secret-jwt-key-change-this-in-production'
};

