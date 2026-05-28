import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { createData, getAllData, updateData, deleteData } from '../controllers/dynamicController.js';

const router = express.Router();

router.use(protect, admin);

router.route('/')
  .post(createData)
  .get(getAllData);

router.route('/:id')
  .put(updateData)
  .delete(deleteData);

export default router;
