import { Router } from 'express';
import {
  createDoctor,
  deleteDoctor,
  getDoctorById,
  getDoctors,
  updateDoctor
} from '../controllers/doctor.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';
import { createDoctorValidator, updateDoctorValidator } from '../validators/doctor.validator.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/', authorize('Admin'), createDoctorValidator, createDoctor);
router.put('/:id', authorize('Admin'), updateDoctorValidator, updateDoctor);
router.delete('/:id', authorize('Admin'), deleteDoctor);

export default router;
