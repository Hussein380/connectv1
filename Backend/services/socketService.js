import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    socket.on('join_chat', async (mentorshipId) => {
      socket.join(mentorshipId);
      console.log(`User ${socket.userId} joined chat ${mentorshipId}`);
      
      // Send message history
      try {
        const messages = await Message.find({ mentorshipId })
          .sort({ createdAt: 1 })
          .limit(50);
        socket.emit('message_history', messages);
      } catch (error) {
        console.error('Error fetching message history:', error);
        socket.emit('error', { message: 'Failed to fetch message history' });
      }
    });

    socket.on('leave_chat', (mentorshipId) => {
      socket.leave(mentorshipId);
      console.log(`User ${socket.userId} left chat ${mentorshipId}`);
    });

    socket.on('send_message', async (messageData) => {
      try {
        const message = await Message.create({
          mentorshipId: messageData.mentorshipId,
          sender: socket.userId,
          content: messageData.content
        });

        io.to(messageData.mentorshipId).emit('new_message', message);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};