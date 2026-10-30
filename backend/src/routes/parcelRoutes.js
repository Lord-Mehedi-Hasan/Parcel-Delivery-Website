import express from 'express';
import {
  trackParcel,
  createParcel,
  getMyParcels,
  getParcelById,
  cancelParcel,
} from '../controllers/parcelController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/track/:trackingNumber', trackParcel);
router.post('/', optionalAuth, createParcel);
router.get('/my-parcels', protect, getMyParcels);
router.get('/:id', optionalAuth, getParcelById);
router.put('/:id/cancel', protect, cancelParcel);

export default router;
