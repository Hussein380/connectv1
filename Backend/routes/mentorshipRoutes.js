import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  sendMentorshipRequest,
  getMentorshipRequests,
  getMyMentorshipRequests,
  updateMentorshipRequest
} from '../controllers/mentorshipController.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/requests', getMentorshipRequests);
router.get('/my-requests', getMyMentorshipRequests);
router.post('/request/:mentorId', sendMentorshipRequest);
router.put('/request/:requestId', updateMentorshipRequest);

export default router; 