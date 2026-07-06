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

export const createAppointmentValidator = [
  check('patient').isMongoId().withMessage('Valid patient id is required'),
  check('doctor').isMongoId().withMessage('Valid doctor id is required'),
  check('department').isString().trim().notEmpty().withMessage('Department is required'),
  check('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  check('appointmentTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Appointment time must be in HH:MM format'),
  check('appointmentType').isIn(['Online', 'Offline']).withMessage('Appointment type must be Online or Offline'),
  check('reasonForVisit').isString().trim().notEmpty().withMessage('Reason for visit is required'),
  check('status').optional().isIn(['Pending', 'Confirmed', 'Completed', 'Cancelled']).withMessage('Status must be valid'),
  check('notes').optional().isString().trim().withMessage('Notes must be a string'),
  handleValidationErrors
];

export const updateAppointmentValidator = [
  check('patient').optional({ checkFalsy: true }).isMongoId().withMessage('Valid patient id is required'),
  check('doctor').optional({ checkFalsy: true }).isMongoId().withMessage('Valid doctor id is required'),
  check('department').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Department cannot be empty'),
  check('appointmentDate').optional({ checkFalsy: true }).isISO8601().withMessage('Valid appointment date is required'),
  check('appointmentTime').optional({ checkFalsy: true }).matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Appointment time must be in HH:MM format'),
  check('appointmentType').optional().isIn(['Online', 'Offline']).withMessage('Appointment type must be Online or Offline'),
  check('reasonForVisit').optional({ checkFalsy: true }).isString().trim().notEmpty().withMessage('Reason for visit cannot be empty'),
  check('status').optional().isIn(['Pending', 'Confirmed', 'Completed', 'Cancelled']).withMessage('Status must be valid'),
  check('notes').optional().isString().trim().withMessage('Notes must be a string'),
  handleValidationErrors
];
