import { calculateShippingCost } from '../utils/pricing.js';

// @desc    Estimate shipping cost
// @route   POST /api/calculator/estimate
// @access  Public
export const estimateCost = (req, res) => {
  try {
    const { weight, deliveryType, category } = req.body;
    const cost = calculateShippingCost({ weight, deliveryType, category });
    res.json({ success: true, ...cost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
