import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorObj = {};
    errors.array().forEach(error => {
      if (!errorObj[error.path]) {
        errorObj[error.path] = [];
      }
      errorObj[error.path].push(error.msg);
    });

    return res.status(422).json({
      error: 'Validation error',
      message: 'The request contains invalid data',
      errors: errorObj
    });
  }
  next();
};

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Email must be valid')
    .notEmpty()
    .withMessage('Email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

export const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters')
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Email must be valid')
    .notEmpty()
    .withMessage('Email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .notEmpty()
    .withMessage('Password is required'),
  body('phone')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Phone must be a valid phone number'),
  handleValidationErrors
];

export const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
  body('description')
    .optional(),
  body('price')
    .isInt({ min: 0 })
    .withMessage('Price must be a positive integer')
    .notEmpty()
    .withMessage('Price is required'),
  body('originalPrice')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Original price must be a positive integer'),
  body('image')
    .optional(),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  body('category')
    .optional(),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('brand')
    .optional(),
  body('isPrime')
    .optional()
    .isBoolean()
    .withMessage('isPrime must be a boolean'),
  body('discount')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),
  body('specifications')
    .optional()
    .isObject()
    .withMessage('Specifications must be an object'),
  handleValidationErrors
];

export const validateCartItem = [
  body('productId')
    .isInt({ min: 1 })
    .withMessage('Product ID must be a positive integer')
    .notEmpty()
    .withMessage('Product ID is required'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
    .notEmpty()
    .withMessage('Quantity is required'),
  handleValidationErrors
];

export const validateUpdateCartItem = [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
    .notEmpty()
    .withMessage('Quantity is required'),
  handleValidationErrors
];

