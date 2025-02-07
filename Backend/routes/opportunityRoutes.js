import express from 'express';
import { protect, isMentor } from '../middleware/authMiddleware.js';
import {
  createOpportunity,
  getOpportunities,
  getMentorOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
} from '../controllers/opportunityController.js';

const router = express.Router();

// Public routes
router.get('/', getOpportunities);
router.get('/:id', getOpportunityById);

// Protected routes (require authentication)
router.use(protect);

// Get mentor's opportunities
router.get('/mentor/me', getMentorOpportunities);

// Mentor-only routes
router.post('/', isMentor, createOpportunity);
router.put('/:id', isMentor, updateOpportunity);
router.delete('/:id', isMentor, deleteOpportunity);

export default router; 