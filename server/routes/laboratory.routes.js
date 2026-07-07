import { Router } from 'express';
import {
  createLaboratoryTest,
  deleteLaboratoryTest,
  getLaboratoryTestById,
  getLaboratoryTests,
  updateLaboratoryTest
} from '../controllers/laboratory.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';
import { createLaboratoryValidator, updateLaboratoryValidator } from '../validators/laboratory.validator.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getLaboratoryTests);
router.get('/:id', getLaboratoryTestById);
router.post('/', authorize('Admin', 'Doctor', 'Lab Technician'), createLaboratoryValidator, createLaboratoryTest);
router.put('/:id', authorize('Admin', 'Doctor', 'Lab Technician'), updateLaboratoryValidator, updateLaboratoryTest);
router.delete('/:id', authorize('Admin', 'Doctor', 'Lab Technician'), deleteLaboratoryTest);

export default router;
