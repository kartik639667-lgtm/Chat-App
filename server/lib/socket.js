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
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('User connected:', userId);

    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    // Emit updated online users list to everyone
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
      console.log('User disconnected:', userId);
      delete userSocketMap[userId];
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });

    // Handle reconnection — update socket id if user reconnects
    socket.on('reconnect', () => {
      if (userId) {
        userSocketMap[userId] = socket.id;
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
      }
    });
  });
};