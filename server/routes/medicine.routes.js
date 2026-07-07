import { Router } from 'express';
import {
  createMedicine,
  deleteMedicine,
  dispenseMedicine,
  getMedicineById,
  getMedicines,
  updateMedicine
} from '../controllers/medicine.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';
import { createMedicineValidator, updateMedicineValidator } from '../validators/medicine.validator.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getMedicines);
router.get('/:id', getMedicineById);
router.post('/', authorize('Admin', 'Pharmacist'), createMedicineValidator, createMedicine);
router.put('/:id', authorize('Admin', 'Pharmacist'), updateMedicineValidator, updateMedicine);
router.delete('/:id', authorize('Admin'), deleteMedicine);
router.post('/:id/dispense', authorize('Admin', 'Pharmacist', 'Doctor'), dispenseMedicine);

export default router;
