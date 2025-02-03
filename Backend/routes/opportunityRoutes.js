import express from 'express';
import { protect, isMentor } from '../middleware/authMiddleware.js';
import {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getOpportunityById
} from '../controllers/opportunityController.js';

const router = express.Router();

router.route('/')
  .get(protect, getOpportunities)
  .post(protect, isMentor, createOpportunity);

router.route('/:id')
  .get(protect, getOpportunityById)
  .put(protect, isMentor, updateOpportunity)
  .delete(protect, isMentor, deleteOpportunity);

export default router; 