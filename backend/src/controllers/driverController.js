import Parcel from '../models/Parcel.js';
import User from '../models/User.js';

// @desc    Get parcels assigned to the driver
// @route   GET /api/driver/deliveries
// @access  Private (Driver only)
export const getDriverDeliveries = async (req, res) => {
  try {
    const { filter } = req.query; // 'active', 'completed', or 'all'

    let statusCondition = {};
    if (filter === 'active') {
      statusCondition = {
        status: { $in: ['Driver Assigned', 'Picked Up', 'In Transit', 'Out for Delivery'] },
      };
    } else if (filter === 'completed') {
      statusCondition = {
        status: { $in: ['Delivered', 'Failed Delivery'] },
      };
    }

    const parcels = await Parcel.find({
      assignedDriver: req.user._id,
      ...statusCondition,
    })
      .populate('currentBranch', 'name code city address')
      .sort({ updatedAt: -1 });

    const totalActive = await Parcel.countDocuments({
      assignedDriver: req.user._id,
      status: { $in: ['Driver Assigned', 'Picked Up', 'In Transit', 'Out for Delivery'] },
    });

    const totalDelivered = await Parcel.countDocuments({
      assignedDriver: req.user._id,
      status: 'Delivered',
    });

    res.json({
      success: true,
      stats: {
        active: totalActive,
        delivered: totalDelivered,
        completedDeliveries: req.user.driverInfo?.completedDeliveries || totalDelivered,
        isAvailable: req.user.driverInfo?.isAvailable ?? true,
      },
      deliveries: parcels,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update delivery status by driver
// @route   PUT /api/driver/deliveries/:id/status
// @access  Private (Driver only)
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, location, notes, recipientSignature, photoUrl } = req.body;

    const allowedStatuses = [
      'Picked Up',
      'In Transit',
      'At Sorting Hub',
      'Out for Delivery',
      'Delivered',
      'Failed Delivery',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status update. Allowed: ${allowedStatuses.join(', ')}`,
      });
    }

    const parcel = await Parcel.findOne({
      _id: req.params.id,
      assignedDriver: req.user._id,
    });

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: 'Parcel not found or not assigned to you',
      });
    }

    parcel.status = status;

    // Custom titles based on status
    let title = `Shipment ${status}`;
    let description = notes || `Status updated to ${status} by driver ${req.user.name}.`;

    if (status === 'Picked Up') {
      title = 'Parcel Collected';
      description = notes || `Parcel has been collected by courier driver ${req.user.name}.`;
    } else if (status === 'In Transit') {
      title = 'In Transit';
      description = notes || 'Shipment is on its way to the destination hub or recipient address.';
    } else if (status === 'Out for Delivery') {
      title = 'Out for Delivery';
      description = notes || `Driver ${req.user.name} is out for final delivery.`;
    } else if (status === 'Delivered') {
      title = 'Delivered Successfully';
      description = notes || 'Package successfully handed over to recipient.';
      parcel.actualDeliveryDate = new Date();
      parcel.paymentStatus = 'Paid'; // mark paid upon delivery if COD
      parcel.proofOfDelivery = {
        recipientSignature: recipientSignature || 'Signed by recipient',
        photoUrl: photoUrl || '',
        deliveryNotes: notes || 'Delivered in good condition',
        deliveredAt: new Date(),
      };

      // Increment driver completed deliveries
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { 'driverInfo.completedDeliveries': 1 },
      });
    } else if (status === 'Failed Delivery') {
      title = 'Delivery Attempt Failed';
      description = notes || 'Recipient was unavailable. Another delivery attempt will be scheduled.';
    }

    parcel.trackingHistory.push({
      status,
      title,
      description,
      location: location || req.user.driverInfo?.currentCity || 'In Transit Area',
      timestamp: new Date(),
      updatedBy: req.user._id,
    });

    await parcel.save();

    res.json({
      success: true,
      message: `Shipment status updated to ${status}`,
      parcel,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle driver availability
// @route   PUT /api/driver/availability
// @access  Private (Driver only)
export const toggleAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    const currentStatus = user.driverInfo?.isAvailable ?? true;
    user.driverInfo = {
      ...user.driverInfo,
      isAvailable: !currentStatus,
    };

    await user.save();

    res.json({
      success: true,
      isAvailable: user.driverInfo.isAvailable,
      message: `Driver status set to ${user.driverInfo.isAvailable ? 'Available' : 'Offline'}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
