import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, toggleWishlist } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest, registerValidation, loginValidation } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', registerValidation, validateRequest, registerUser);
router.post('/login', loginValidation, validateRequest, loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/wishlist/:medicineId', protect, toggleWishlist);

export default router;
