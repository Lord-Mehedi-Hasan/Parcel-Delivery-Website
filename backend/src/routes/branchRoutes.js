import express from 'express';
import { getBranches, createBranch } from '../controllers/branchController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBranches);
router.post('/', protect, authorize('admin'), createBranch);

export default router;
