import { Server } from 'socket.io';

export let io;
export const userSocketMap = {}; // { userId: socketId }

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'https://chat-app-pi-three-44.vercel.app',
      ],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 10000,
    pingInterval: 5000,
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('User connected:', userId);

    if (userId) {
      // If user already has a socket, remove old one first
      userSocketMap[userId] = socket.id;
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', (reason) => {
      console.log('User disconnected:', userId, 'Reason:', reason);

      // Only remove if this is still the active socket for this user
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
      }

      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
  });
};