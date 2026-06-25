import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';

dotenv.config();

// Create express app using HTTP server
const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Socket.io connection handler
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User connected", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit online users to all connected clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('disconnect', () => {
    console.log("User disconnected", userId);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Route setup
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

app.get('/api/status', (req, res) => {
  res.send('Server is live');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, async () => {
    await connectDB();
    console.log("Server is running on port " + PORT);
  });
}

// Export server for vercel
export default server;