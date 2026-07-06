import { Router } from 'express';
import {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointments,
  updateAppointment
} from '../controllers/appointment.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';
import { createAppointmentValidator, updateAppointmentValidator } from '../validators/appointment.validator.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.post('/', authorize('Admin', 'Receptionist'), createAppointmentValidator, createAppointment);
router.put('/:id', authorize('Admin', 'Receptionist'), updateAppointmentValidator, updateAppointment);
router.delete('/:id', authorize('Admin', 'Receptionist'), deleteAppointment);

export default router;
