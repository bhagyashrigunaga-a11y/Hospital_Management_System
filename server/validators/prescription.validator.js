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

export const createPrescriptionValidator = [
  check('patient').isMongoId().withMessage('Valid patient id is required'),
  check('doctor').isMongoId().withMessage('Valid doctor id is required'),
  check('appointment').isMongoId().withMessage('Valid appointment id is required'),
  check('diagnosis').isString().trim().notEmpty().withMessage('Diagnosis is required'),
  check('medicines').isArray({ min: 1 }).withMessage('At least one medicine is required'),
  check('medicines.*.medicineName').isString().trim().notEmpty().withMessage('Medicine name is required'),
  check('medicines.*.dosage').isString().trim().notEmpty().withMessage('Dosage is required'),
  check('medicines.*.frequency').isString().trim().notEmpty().withMessage('Frequency is required'),
  check('medicines.*.duration').isString().trim().notEmpty().withMessage('Duration is required'),
  check('notes').optional().isString().trim().withMessage('Notes must be a string'),
  check('followUpDate').optional({ checkFalsy: true }).isISO8601().withMessage('Valid follow-up date is required'),
  check('status').optional().isIn(['Active', 'Completed']).withMessage('Status must be Active or Completed'),
  handleValidationErrors
];

export const updatePrescriptionValidator = [
  check('patient').optional({ checkFalsy: true }).isMongoId().withMessage('Valid patient id is required'),
  check('doctor').optional({ checkFalsy: true }).isMongoId().withMessage('Valid doctor id is required'),
  check('appointment').optional({ checkFalsy: true }).isMongoId().withMessage('Valid appointment id is required'),
  check('diagnosis').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Diagnosis cannot be empty'),
  check('medicines').optional().isArray({ min: 1 }).withMessage('At least one medicine is required'),
  check('medicines.*.medicineName').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Medicine name is required'),
  check('medicines.*.dosage').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Dosage is required'),
  check('medicines.*.frequency').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Frequency is required'),
  check('medicines.*.duration').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Duration is required'),
  check('notes').optional().isString().trim().withMessage('Notes must be a string'),
  check('followUpDate').optional({ checkFalsy: true }).isISO8601().withMessage('Valid follow-up date is required'),
  check('status').optional().isIn(['Active', 'Completed']).withMessage('Status must be Active or Completed'),
  handleValidationErrors
];
