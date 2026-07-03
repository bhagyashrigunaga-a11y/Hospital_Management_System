import { Router } from 'express';
import { register, login, profile } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/profile', authMiddleware, profile);

export default router;
