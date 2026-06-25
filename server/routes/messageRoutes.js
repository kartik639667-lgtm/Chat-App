import express from 'express';
import authUser from '../middleware/auth.js';
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/messageController.js';

const router = express.Router();

// Apply authUser middleware to all routes in this file
router.get('/users', authUser, getUsersForSidebar);
router.get('/:id', authUser, getMessages);
router.post('/send/:id', authUser, sendMessage);

export default router;