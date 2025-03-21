import express from 'express';
import { register, login, getCurrentUser, refreshToken } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/profile', protect, getCurrentUser);
router.get('/me', protect, getCurrentUser);
router.get('/current-user', protect, getCurrentUser);
router.post('/refresh-token', protect, refreshToken);

export default router; 