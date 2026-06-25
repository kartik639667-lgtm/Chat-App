import express from 'express';
import { signup, login, checkAuth, updateProfile } from '../controllers/userController.js';
import authUser from '../middleware/auth.js';

const router = express.Router();

// Public routes (No authentication required)
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (Requires valid JWT token)
router.post('/update-profile', authUser, updateProfile);
router.get('/check-auth', authUser, checkAuth);

export default router;