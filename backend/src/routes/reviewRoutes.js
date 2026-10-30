import express from 'express';
import { getReviews, addReview } from '../controllers/reviewController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', optionalAuth, addReview);

export default router;
