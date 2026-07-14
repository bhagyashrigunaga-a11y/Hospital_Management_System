  import { Router } from 'express';
  import {
    createPatient,
    deletePatient,
    getPatientById,
    getPatients,
    updatePatient
  } from '../controllers/patient.controller.js';
  import authMiddleware from '../middleware/auth.middleware.js';
  import authorize from '../middleware/role.middleware.js';
  import { createPatientValidator, updatePatientValidator } from '../validators/patient.validator.js';

  const router = Router();

  router.use(authMiddleware);
  router.get('/', getPatients);
  router.get('/:id', getPatientById);
router.post('/', authorize('Admin', 'Receptionist', 'Doctor'), createPatientValidator, createPatient);
router.put('/:id', authorize('Admin', 'Receptionist', 'Doctor'), updatePatientValidator, updatePatient);
router.delete('/:id', authorize('Admin', 'Receptionist', 'Doctor'), deletePatient);

  export default router;
