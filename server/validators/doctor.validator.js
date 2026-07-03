import { check, validationResult } from 'express-validator';
import ApiError from '../utils/apiError.js';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return next(new ApiError(400, firstError.msg));
  }
  next();
};

export const createDoctorValidator = [
  check('fullName').isString().trim().notEmpty().withMessage('Full name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('phoneNumber').matches(/^\+?[0-9\s-]{7,15}$/).withMessage('Valid phone number is required'),
  check('department').isString().trim().notEmpty().withMessage('Department is required'),
  check('specialization').isString().trim().notEmpty().withMessage('Specialization is required'),
  check('qualification').isString().trim().notEmpty().withMessage('Qualification is required'),
  check('experience').isNumeric().withMessage('Experience must be a number'),
  check('consultationFee').isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number'),
  check('availableDays').optional().isArray().withMessage('Available days must be an array'),
  check('availableTime').optional().isArray().withMessage('Available time must be an array'),
  check('status').optional().isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),
  handleValidationErrors
];

export const updateDoctorValidator = [
  check('fullName').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Full name cannot be empty'),
  check('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email is required'),
  check('phoneNumber').optional({ checkFalsy: true }).matches(/^\+?[0-9\s-]{7,15}$/).withMessage('Valid phone number is required'),
  check('department').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Department cannot be empty'),
  check('specialization').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Specialization cannot be empty'),
  check('qualification').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Qualification cannot be empty'),
  check('experience').optional({ checkFalsy: true }).isNumeric().withMessage('Experience must be a number'),
  check('consultationFee').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number'),
  check('availableDays').optional().isArray().withMessage('Available days must be an array'),
  check('availableTime').optional().isArray().withMessage('Available time must be an array'),
  check('status').optional().isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),
  handleValidationErrors
];
