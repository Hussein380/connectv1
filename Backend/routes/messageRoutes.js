import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead
} from '../controllers/messageController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getConversations)
  .post(sendMessage);

router.get('/:userId', getConversation);
router.put('/:id/read', markAsRead);

export default router; 