import { Router } from 'express';
import {
  createPrescription,
  deletePrescription,
  getPrescriptionById,
  getPrescriptions,
  updatePrescription
} from '../controllers/prescription.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';
import { createPrescriptionValidator, updatePrescriptionValidator } from '../validators/prescription.validator.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getPrescriptions);
router.get('/:id', getPrescriptionById);
router.post('/', authorize('Admin', 'Doctor'), createPrescriptionValidator, createPrescription);
router.put('/:id', authorize('Admin', 'Doctor'), updatePrescriptionValidator, updatePrescription);
router.delete('/:id', authorize('Admin', 'Doctor'), deletePrescription);

export default router;
