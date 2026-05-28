import express from 'express';
import { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder, getOrderStats, deleteOrder } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);
router.get('/myorders', protect, getMyOrders);
router.get('/stats/summary', protect, admin, getOrderStats);
router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

export default router;
