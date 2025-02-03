import asyncHandler from 'express-async-handler';
import Message from '../models/Message.js';
import { createNotification } from './notificationController.js';
import { getIO } from '../services/socketService.js';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  const { recipientId, content, attachments } = req.body;

  const message = await Message.create({
    sender: req.user._id,
    recipient: recipientId,
    content,
    attachments: attachments || []
  });

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name')
    .populate('recipient', 'name');

  // Emit to recipient
  getIO().to(recipientId).emit('new_message', populatedMessage);

  // Create notification
  await createNotification({
    recipient: recipientId,
    type: 'new_message',
    title: 'New Message',
    message: `${req.user.name} sent you a message`,
    relatedItem: message._id,
    itemModel: 'Message'
  });

  res.status(201).json(populatedMessage);
});

// @desc    Get conversation with a user
// @route   GET /api/messages/:userId
// @access  Private
export const getConversation = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user._id, recipient: req.params.userId },
      { sender: req.params.userId, recipient: req.user._id }
    ]
  })
    .sort('createdAt')
    .populate('sender', 'name')
    .populate('recipient', 'name');

  res.json(messages);
});

// @desc    Get all conversations
// @route   GET /api/messages
// @access  Private
export const getConversations = asyncHandler(async (req, res) => {
  const messages = await Message.aggregate([
    {
      $match: {
        $or: [
          { sender: req.user._id },
          { recipient: req.user._id }
        ]
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$sender', req.user._id] },
            '$recipient',
            '$sender'
          ]
        },
        lastMessage: { $first: '$$ROOT' }
      }
    }
  ]);

  await Message.populate(messages, {
    path: 'lastMessage.sender lastMessage.recipient',
    select: 'name'
  });

  res.json(messages);
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  if (message.recipient.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  message.read = true;
  await message.save();

  // Emit read receipt
  getIO().to(message.sender.toString()).emit('message_read', {
    messageId: message._id
  });

  res.json(message);
}); 