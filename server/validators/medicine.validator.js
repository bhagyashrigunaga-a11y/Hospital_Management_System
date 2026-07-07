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

export const createMedicineValidator = [
  check('medicineName').isString().trim().notEmpty().withMessage('Medicine name is required'),
  check('manufacturer').isString().trim().notEmpty().withMessage('Manufacturer is required'),
  check('category').isString().trim().notEmpty().withMessage('Category is required'),
  check('batchNumber').isString().trim().notEmpty().withMessage('Batch number is required'),
  check('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
  check('stockQuantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
  check('unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  check('supplier').isString().trim().notEmpty().withMessage('Supplier is required'),
  check('description').optional().isString().trim().withMessage('Description must be a string'),
  check('status').optional().isIn(['Available', 'Out of Stock', 'Expired']).withMessage('Status must be valid'),
  handleValidationErrors
];

export const updateMedicineValidator = [
  check('medicineName').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Medicine name cannot be empty'),
  check('manufacturer').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Manufacturer cannot be empty'),
  check('category').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Category cannot be empty'),
  check('batchNumber').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Batch number cannot be empty'),
  check('expiryDate').optional({ checkFalsy: true }).isISO8601().withMessage('Valid expiry date is required'),
  check('stockQuantity').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
  check('unitPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
  check('supplier').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Supplier cannot be empty'),
  check('description').optional().isString().trim().withMessage('Description must be a string'),
  check('status').optional().isIn(['Available', 'Out of Stock', 'Expired']).withMessage('Status must be valid'),
  handleValidationErrors
];
