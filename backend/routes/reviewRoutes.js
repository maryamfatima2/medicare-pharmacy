import express from 'express';
import { getReviewsByMedicine, createReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/medicine/:medicineId', getReviewsByMedicine);
router.delete('/:id', protect, deleteReview);

export default router;
