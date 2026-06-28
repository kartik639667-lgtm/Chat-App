import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import { initSocket } from './lib/socket.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// FIX: Initialize Socket.io from separate module
initSocket(server);

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://chat-app-pi-three-44.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '4mb' }));

app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

app.get('/api/status', (req, res) => {
  res.send('Server is live');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  await connectDB();
  console.log('Server is running on port ' + PORT);
});

export default server;