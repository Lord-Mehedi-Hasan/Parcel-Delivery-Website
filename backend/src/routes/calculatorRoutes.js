import express from 'express';
import { estimateCost } from '../controllers/calculatorController.js';

const router = express.Router();

router.post('/estimate', estimateCost);

export default router;
