import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);

    socket.on('join_chat', async (mentorshipId) => {
      socket.join(mentorshipId);
      
      // Send message history
      const messages = await Message.find({ mentorshipId })
        .sort({ createdAt: 1 })
        .limit(50);
      socket.emit('message_history', messages);
    });

    socket.on('leave_chat', (mentorshipId) => {
      socket.leave(mentorshipId);
    });

    socket.on('send_message', async (messageData) => {
      try {
        const message = await Message.create({
          ...messageData,
          sender: socket.userId
        });

        io.to(messageData.mentorshipId).emit('receive_message', message);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
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