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

export const createLaboratoryValidator = [
  check('patient').isMongoId().withMessage('Valid patient id is required'),
  check('doctor').isMongoId().withMessage('Valid doctor id is required'),
  check('appointment').isMongoId().withMessage('Valid appointment id is required'),
  check('testName').isString().trim().notEmpty().withMessage('Test name is required'),
  check('testCategory').isString().trim().notEmpty().withMessage('Test category is required'),
  check('sampleType').isString().trim().notEmpty().withMessage('Sample type is required'),
  check('testStatus').optional().isIn(['Pending', 'In Progress', 'Completed', 'Cancelled']).withMessage('Test status must be valid'),
  check('result').optional().isString().trim().withMessage('Result must be a string'),
  check('normalRange').optional().isString().trim().withMessage('Normal range must be a string'),
  check('reportFile').optional().isString().trim().withMessage('Report file must be a string'),
  check('requestedDate').optional({ checkFalsy: true }).isISO8601().withMessage('Valid requested date is required'),
  check('completedDate').optional({ checkFalsy: true }).isISO8601().withMessage('Valid completed date is required'),
  check('remarks').optional().isString().trim().withMessage('Remarks must be a string'),
  handleValidationErrors
];

export const updateLaboratoryValidator = [
  check('patient').optional({ checkFalsy: true }).isMongoId().withMessage('Valid patient id is required'),
  check('doctor').optional({ checkFalsy: true }).isMongoId().withMessage('Valid doctor id is required'),
  check('appointment').optional({ checkFalsy: true }).isMongoId().withMessage('Valid appointment id is required'),
  check('testName').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Test name cannot be empty'),
  check('testCategory').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Test category cannot be empty'),
  check('sampleType').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Sample type cannot be empty'),
  check('testStatus').optional().isIn(['Pending', 'In Progress', 'Completed', 'Cancelled']).withMessage('Test status must be valid'),
  check('result').optional().isString().trim().withMessage('Result must be a string'),
  check('normalRange').optional().isString().trim().withMessage('Normal range must be a string'),
  check('reportFile').optional().isString().trim().withMessage('Report file must be a string'),
  check('requestedDate').optional({ checkFalsy: true }).isISO8601().withMessage('Valid requested date is required'),
  check('completedDate').optional({ checkFalsy: true }).isISO8601().withMessage('Valid completed date is required'),
  check('remarks').optional().isString().trim().withMessage('Remarks must be a string'),
  handleValidationErrors
];
