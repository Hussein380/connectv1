import express from 'express';
import {
  getAllMentors,
  getMentorById,
  getMentorProfileMe,
  updateMentorProfileNew as updateMentorProfile,
  updateContactInfoNew as updateContactInfo,
  getMentorOpportunitiesMe as getMentorOpportunities
} from '../controllers/mentorController.js';
import { protect, isMentor } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (require authentication)
router.use(protect);

// Mentor-only routes - adding '/profile' route that maps to the same handler as '/profile/me'
router.get('/profile', isMentor, getMentorProfileMe);
router.get('/profile/me', isMentor, getMentorProfileMe);
router.put('/profile', isMentor, updateMentorProfile);
router.put('/contact', isMentor, updateContactInfo);

// Opportunity routes
router.get('/opportunities/me', isMentor, getMentorOpportunities);

// Public routes - these need to come after the specific routes to avoid parameter collision
router.get('/', getAllMentors);
router.get('/:id', getMentorById);

export default router;