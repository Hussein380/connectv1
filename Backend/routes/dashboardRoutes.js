import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getDashboardStats,
    getSessions,
    createSession,
    getGoals,
    createGoal,
    updateGoal
} from '../controllers/dashboardController.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/sessions', getSessions);
router.post('/sessions', createSession);
router.get('/goals', getGoals);
router.post('/goals', createGoal);
router.put('/goals/:id', updateGoal);

export default router; 