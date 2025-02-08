import express from 'express';
import {
  getAllMentors,
  getMentorById,
  getMentorProfileMe as getMentorProfile,
  updateMentorProfileNew as updateMentorProfile,
  updateContactInfoNew as updateContactInfo,
  getMentorOpportunitiesMe as getMentorOpportunities
} from '../controllers/mentorController.js';
import { protect, isMentor } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllMentors);
router.get('/:id', getMentorById);

// Protected routes (require authentication)
router.use(protect);

// Mentor-only routes
router.get('/profile/me', isMentor, getMentorProfile);
router.put('/profile', isMentor, updateMentorProfile);
router.put('/contact', isMentor, updateContactInfo);

// Opportunity routes
router.get('/opportunities/me', isMentor, getMentorOpportunities);

export default router;