import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getMenteeProfile, 
  updateMenteeProfile,
  searchOpportunities 
} from '../controllers/menteeController.js';

const router = express.Router();

router.use(protect); // All mentee routes require authentication

router.route('/profile')
  .get(getMenteeProfile)
  .put(updateMenteeProfile);

router.get('/search', searchOpportunities);

export default router; 