import express from 'express';
import { protect, isMentor } from '../middleware/authMiddleware.js';
import {
  sendMentorshipRequest,
  getMentorshipRequests,
  getMyRequests,
  acceptRequest,
  rejectRequest
} from '../controllers/mentorshipController.js';

const router = express.Router();

// Protected routes that both mentors and mentees can access
router.use(protect);
router.post('/request', sendMentorshipRequest);
router.get('/my-requests', getMyRequests);

// Mentor-only routes
router.get('/requests', isMentor, getMentorshipRequests);
router.put('/request/:id/accept', isMentor, acceptRequest);
router.put('/request/:id/reject', isMentor, rejectRequest);

export default router;