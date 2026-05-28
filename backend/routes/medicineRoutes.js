import express from 'express';
import { getMedicines, getMedicineById, getFeaturedMedicines, getBestSellers, getRelatedMedicines, getSearchSuggestions, createMedicine, updateMedicine, deleteMedicine, getAllMedicinesAdmin, getLowStockMedicines } from '../controllers/medicineController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search/suggestions', getSearchSuggestions);
router.get('/featured/list', getFeaturedMedicines);
router.get('/bestsellers/list', getBestSellers);
router.get('/related/:id', getRelatedMedicines);
router.get('/admin/all', protect, admin, getAllMedicinesAdmin);
router.get('/admin/low-stock', protect, admin, getLowStockMedicines);
router.route('/').get(getMedicines).post(protect, admin, createMedicine);
router.route('/:id').get(getMedicineById).put(protect, admin, updateMedicine).delete(protect, admin, deleteMedicine);

export default router;
