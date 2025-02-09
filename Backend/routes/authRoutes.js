import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// These routes will be prefixed with /api/auth
router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getCurrentUser);

export default router; 