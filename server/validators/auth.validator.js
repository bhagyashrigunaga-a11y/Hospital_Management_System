import { check, validationResult } from 'express-validator';
import ApiError from '../utils/apiError.js';
import { USER_ROLES } from '../models/user.model.js';

export const registerValidator = [
  check('name').isString().trim().notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  check('role')
    .optional()
    .isIn(USER_ROLES)
    .withMessage(`Role must be one of: ${USER_ROLES.join(', ')}`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const first = errors.array()[0];
      return next(new ApiError(400, first.msg));
    }
    next();
  }
];

export const loginValidator = [
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const first = errors.array()[0];
      return next(new ApiError(400, first.msg));
    }
    next();
  }
];
