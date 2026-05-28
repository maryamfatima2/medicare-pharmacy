import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  submitContact,
  getContacts,
  updateContactStatus,
  deleteContact,
} from '../controllers/contactController.js';

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
    validateRequest,
  ],
  submitContact
);

router.get('/', protect, admin, getContacts);
router.put('/:id', protect, admin, updateContactStatus);
router.delete('/:id', protect, admin, deleteContact);

export default router;
