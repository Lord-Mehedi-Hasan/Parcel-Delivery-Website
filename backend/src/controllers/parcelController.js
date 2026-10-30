import Parcel from '../models/Parcel.js';
import Branch from '../models/Branch.js';
import { calculateShippingCost } from '../utils/pricing.js';

// Helper to generate unique tracking number
const generateTrackingNumber = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 7; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TRK-${randomStr}`;
};

// @desc    Track parcel publicly by tracking number
// @route   GET /api/parcels/track/:trackingNumber
// @access  Public
export const trackParcel = async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const parcel = await Parcel.findOne({
      trackingNumber: trackingNumber.trim().toUpperCase(),
    })
      .populate('assignedDriver', 'name phone driverInfo')
      .populate('currentBranch', 'name code city address');

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: `No parcel found with tracking code: ${trackingNumber}`,
      });
    }

    res.json({
      success: true,
      parcel,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Book / create a new parcel
// @route   POST /api/parcels
// @access  Public (guest or authenticated)
export const createParcel = async (req, res) => {
  try {
    const {
      sender,
      recipient,
      parcelDetails,
      deliveryType = 'Standard',
      paymentMethod = 'Cash',
      paymentStatus = 'Pending',
    } = req.body;

    if (!sender?.name || !sender?.phone || !sender?.address || !sender?.city) {
      return res.status(400).json({ success: false, message: 'Incomplete sender information' });
    }
    if (!recipient?.name || !recipient?.phone || !recipient?.address || !recipient?.city) {
      return res.status(400).json({ success: false, message: 'Incomplete recipient information' });
    }

    // Calculate shipping rates
    const cost = calculateShippingCost({
      weight: parcelDetails?.weight || 1,
      deliveryType,
      category: parcelDetails?.category || 'Parcel',
    });

    let trackingNumber = generateTrackingNumber();
    // Ensure uniqueness
    let existing = await Parcel.findOne({ trackingNumber });
    while (existing) {
      trackingNumber = generateTrackingNumber();
      existing = await Parcel.findOne({ trackingNumber });
    }

    // Estimate delivery date
    const estDate = new Date();
    if (deliveryType === 'Same Day') {
      estDate.setHours(20, 0, 0, 0);
    } else if (deliveryType === 'Overnight') {
      estDate.setDate(estDate.getDate() + 1);
      estDate.setHours(10, 30, 0, 0);
    } else if (deliveryType === 'Express') {
      estDate.setDate(estDate.getDate() + 2);
    } else {
      estDate.setDate(estDate.getDate() + 4);
    }

    // Default branch assignment if any exists
    const defaultBranch = await Branch.findOne({ isActive: true });

    const initialHistory = [
      {
        status: 'Order Placed',
        title: 'Shipment Order Created',
        description: `Shipment order created by sender. Delivery method: ${deliveryType}. Ready for dispatch assignment.`,
        location: sender.city,
        timestamp: new Date(),
        updatedBy: req.user ? req.user._id : null,
      },
    ];

    const parcel = await Parcel.create({
      trackingNumber,
      sender: {
        ...sender,
        userId: req.user ? req.user._id : undefined,
      },
      recipient,
      parcelDetails: {
        category: parcelDetails?.category || 'Parcel',
        weight: Number(parcelDetails?.weight) || 1,
        dimensions: parcelDetails?.dimensions || { length: 10, width: 10, height: 10 },
        declaredValue: Number(parcelDetails?.declaredValue) || 0,
        description: parcelDetails?.description || '',
      },
      deliveryType,
      cost,
      paymentStatus: paymentMethod === 'Credit Card' || paymentMethod === 'Online Payment' ? 'Paid' : paymentStatus,
      paymentMethod,
      status: 'Order Placed',
      currentBranch: defaultBranch ? defaultBranch._id : null,
      estimatedDeliveryDate: estDate,
      trackingHistory: initialHistory,
    });

    res.status(201).json({
      success: true,
      message: 'Parcel booked successfully!',
      parcel,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's parcels
// @route   GET /api/parcels/my-parcels
// @access  Private (Customer)
export const getMyParcels = async (req, res) => {
  try {
    const query = {
      $or: [
        { 'sender.userId': req.user._id },
        { 'sender.email': req.user.email },
        { 'recipient.email': req.user.email },
      ],
    };

    const parcels = await Parcel.find(query)
      .populate('assignedDriver', 'name phone driverInfo')
      .populate('currentBranch', 'name city')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: parcels.length,
      parcels,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single parcel by ID
// @route   GET /api/parcels/:id
// @access  Private or Public with matching email/tracking
export const getParcelById = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id)
      .populate('assignedDriver', 'name phone driverInfo')
      .populate('currentBranch', 'name code city address')
      .populate('trackingHistory.updatedBy', 'name role');

    if (!parcel) {
      return res.status(404).json({ success: false, message: 'Parcel not found' });
    }

    res.json({ success: true, parcel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel parcel
// @route   PUT /api/parcels/:id/cancel
// @access  Private (Customer owner or Admin)
export const cancelParcel = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) {
      return res.status(404).json({ success: false, message: 'Parcel not found' });
    }

    // Check authorization: customer can only cancel their own parcel
    if (
      req.user.role === 'customer' &&
      parcel.sender.userId &&
      parcel.sender.userId.toString() !== req.user._id.toString() &&
      parcel.sender.email !== req.user.email
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this parcel' });
    }

    // Only allow cancelling if not yet out for delivery or delivered
    if (['In Transit', 'Out for Delivery', 'Delivered'].includes(parcel.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel shipment that is already ${parcel.status}`,
      });
    }

    parcel.status = 'Cancelled';
    parcel.trackingHistory.push({
      status: 'Cancelled',
      title: 'Shipment Cancelled',
      description: `Order cancelled by ${req.user.name} (${req.user.role}). Reason: ${req.body.reason || 'Requested by sender'}`,
      location: parcel.sender.city,
      timestamp: new Date(),
      updatedBy: req.user._id,
    });

    await parcel.save();

    res.json({
      success: true,
      message: 'Parcel cancelled successfully',
      parcel,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
