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

export const createPatientValidator = [
  check('fullName').isString().trim().notEmpty().withMessage('Full name is required'),
  check('age').isInt({ min: 0 }).withMessage('Age must be a non-negative integer'),
  check('gender').isIn(['Male', 'Female', 'Other', 'Prefer not to say']).withMessage('Gender is required'),
  check('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  check('bloodGroup').optional().isString().trim().notEmpty().withMessage('Blood group cannot be empty'),
  check('phoneNumber').matches(/^\+?[0-9\s-]{7,15}$/).withMessage('Valid phone number is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('address').optional().isString().trim().notEmpty().withMessage('Address cannot be empty'),
  check('emergencyContact').optional().isString().trim().notEmpty().withMessage('Emergency contact cannot be empty'),
  check('medicalHistory').optional().isArray().withMessage('Medical history must be an array'),
  check('allergies').optional().isArray().withMessage('Allergies must be an array'),
  check('currentMedications').optional().isArray().withMessage('Current medications must be an array'),
  check('assignedDoctor').optional({ checkFalsy: true }).isMongoId().withMessage('Assigned doctor must be a valid id'),
  check('status').optional().isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),
  handleValidationErrors
];

export const updatePatientValidator = [
  check('fullName').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Full name cannot be empty'),
  check('age').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('Age must be a non-negative integer'),
  check('gender').optional().isIn(['Male', 'Female', 'Other', 'Prefer not to say']).withMessage('Gender must be valid'),
  check('dateOfBirth').optional({ checkFalsy: true }).isISO8601().withMessage('Valid date of birth is required'),
  check('bloodGroup').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Blood group cannot be empty'),
  check('phoneNumber').optional({ checkFalsy: true }).matches(/^\+?[0-9\s-]{7,15}$/).withMessage('Valid phone number is required'),
  check('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email is required'),
  check('address').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Address cannot be empty'),
  check('emergencyContact').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Emergency contact cannot be empty'),
  check('medicalHistory').optional().isArray().withMessage('Medical history must be an array'),
  check('allergies').optional().isArray().withMessage('Allergies must be an array'),
  check('currentMedications').optional().isArray().withMessage('Current medications must be an array'),
  check('assignedDoctor').optional({ checkFalsy: true }).isMongoId().withMessage('Assigned doctor must be a valid id'),
  check('status').optional().isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),
  handleValidationErrors
];
