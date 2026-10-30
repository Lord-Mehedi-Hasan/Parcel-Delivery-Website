import express from 'express';
import {
  getDriverDeliveries,
  updateDeliveryStatus,
  toggleAvailability,
} from '../controllers/driverController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('driver'));

router.get('/deliveries', getDriverDeliveries);
router.put('/deliveries/:id/status', updateDeliveryStatus);
router.put('/availability', toggleAvailability);

export default router;
