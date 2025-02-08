import { io } from 'socket.io-client';

let socket;

export const initializeSocket = (token) => {
  if (!token) return null;

  // Close existing connection if any
  if (socket) {
    socket.close();
  }

  const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    withCredentials: true,
    autoConnect: true
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('connect', () => {
    console.log('Socket connected successfully');
  });

  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
