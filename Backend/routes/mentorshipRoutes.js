import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  sendRequest,
  getRequests,
  updateRequest,
  getMyRequests
} from '../controllers/mentorshipController.js';

const router = express.Router();

router.use(protect);

router.post('/request/:mentorId', sendRequest);
router.get('/requests', getRequests);
router.get('/my-requests', getMyRequests);
router.put('/request/:requestId', updateRequest);

export default router; 