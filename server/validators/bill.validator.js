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

export const createBillValidator = [
  check('patient').isMongoId().withMessage('Valid patient id is required'),
  check('appointment').isMongoId().withMessage('Valid appointment id is required'),
  check('doctor').isMongoId().withMessage('Valid doctor id is required'),
  check('consultationFee').optional().isFloat({ min: 0 }).withMessage('Consultation fee must be a non-negative number'),
  check('medicineCharges').optional().isFloat({ min: 0 }).withMessage('Medicine charges must be a non-negative number'),
  check('laboratoryCharges').optional().isFloat({ min: 0 }).withMessage('Laboratory charges must be a non-negative number'),
  check('roomCharges').optional().isFloat({ min: 0 }).withMessage('Room charges must be a non-negative number'),
  check('miscellaneousCharges').optional().isFloat({ min: 0 }).withMessage('Miscellaneous charges must be a non-negative number'),
  check('discount').optional().isFloat({ min: 0 }).withMessage('Discount must be a non-negative number'),
  check('paymentMethod').optional().isIn(['Cash', 'Card', 'UPI', 'Insurance']).withMessage('Payment method must be valid'),
  check('paymentStatus').optional().isIn(['Pending', 'Paid', 'Failed']).withMessage('Payment status must be valid'),
  check('paymentDate').optional({ checkFalsy: true }).isISO8601().withMessage('Valid payment date is required'),
  check('remarks').optional().isString().trim().withMessage('Remarks must be a string'),
  handleValidationErrors
];

export const updateBillValidator = [
  check('patient').optional({ checkFalsy: true }).isMongoId().withMessage('Valid patient id is required'),
  check('appointment').optional({ checkFalsy: true }).isMongoId().withMessage('Valid appointment id is required'),
  check('doctor').optional({ checkFalsy: true }).isMongoId().withMessage('Valid doctor id is required'),
  check('consultationFee').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Consultation fee must be a non-negative number'),
  check('medicineCharges').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Medicine charges must be a non-negative number'),
  check('laboratoryCharges').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Laboratory charges must be a non-negative number'),
  check('roomCharges').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Room charges must be a non-negative number'),
  check('miscellaneousCharges').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Miscellaneous charges must be a non-negative number'),
  check('discount').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Discount must be a non-negative number'),
  check('paymentMethod').optional().isIn(['Cash', 'Card', 'UPI', 'Insurance']).withMessage('Payment method must be valid'),
  check('paymentStatus').optional().isIn(['Pending', 'Paid', 'Failed']).withMessage('Payment status must be valid'),
  check('paymentDate').optional({ checkFalsy: true }).isISO8601().withMessage('Valid payment date is required'),
  check('remarks').optional().isString().trim().withMessage('Remarks must be a string'),
  handleValidationErrors
];
