import express from 'express';
import { protect, isMentor } from '../middleware/authMiddleware.js';
import { 
  getMentorProfile, 
  updateMentorProfile,
  getMentorOpportunities 
} from '../controllers/mentorController.js';

const router = express.Router();

router.use(protect); // All mentor routes require authentication
router.use(isMentor); // All mentor routes require mentor role

router.route('/profile')
  .get(getMentorProfile)
  .put(updateMentorProfile);

router.get('/opportunities', getMentorOpportunities);

export default router; 