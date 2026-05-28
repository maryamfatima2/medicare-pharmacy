import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, getUserStats } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getAllUsers);
router.get('/stats', protect, admin, getUserStats);
router.route('/:id').get(protect, admin, getUserById).put(protect, admin, updateUser).delete(protect, admin, deleteUser);

export default router;
