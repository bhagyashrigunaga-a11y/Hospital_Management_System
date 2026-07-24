import { Router } from 'express';
import {
  createBill,
  deleteBill,
  getBillById,
  getBills,
  updateBill
} from '../controllers/bill.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';
import { createBillValidator, updateBillValidator } from '../validators/bill.validator.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getBills);
router.get('/:id', getBillById);
router.post('/', authorize('Admin', 'Receptionist', 'Doctor'), createBillValidator, createBill);
router.put('/:id',authorize('Admin', 'Receptionist', 'Doctor'), updateBillValidator, updateBill);
router.delete('/:id', authorize('Admin', 'Receptionist', 'Doctor'), deleteBill);

export default router;
