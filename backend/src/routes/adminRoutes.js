import express from 'express';
import {
  getDashboardStats,
  getAllParcels,
  assignDriver,
  updateParcelAdmin,
  getAllDrivers,
  getAllUsers,
  deleteParcel,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/parcels', getAllParcels);
router.put('/parcels/:id/assign-driver', assignDriver);
router.put('/parcels/:id/update-status', updateParcelAdmin);
router.delete('/parcels/:id', deleteParcel);
router.get('/drivers', getAllDrivers);
router.get('/users', getAllUsers);

export default router;
