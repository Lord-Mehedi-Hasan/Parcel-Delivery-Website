import Parcel from '../models/Parcel.js';
import User from '../models/User.js';
import Branch from '../models/Branch.js';

// @desc    Get dashboard high-level analytics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getDashboardStats = async (req, res) => {
  try {
    const totalParcels = await Parcel.countDocuments();
    const deliveredCount = await Parcel.countDocuments({ status: 'Delivered' });
    const inTransitCount = await Parcel.countDocuments({
      status: { $in: ['Driver Assigned', 'Picked Up', 'In Transit', 'At Sorting Hub', 'Out for Delivery'] },
    });
    const pendingCount = await Parcel.countDocuments({ status: 'Order Placed' });
    const cancelledCount = await Parcel.countDocuments({ status: 'Cancelled' });

    // Revenue calculation
    const revenueAgg = await Parcel.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$cost.totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? Math.round(revenueAgg[0].total * 100) / 100 : 0;

    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalDrivers = await User.countDocuments({ role: 'driver' });
    const activeDrivers = await User.countDocuments({
      role: 'driver',
      'driverInfo.isAvailable': true,
    });

    const recentParcels = await Parcel.find()
      .populate('assignedDriver', 'name phone')
      .populate('currentBranch', 'name code city')
      .sort({ createdAt: -1 })
      .limit(6);

    // Group parcels by delivery status for chart
    const statusBreakdown = await Parcel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Group parcels by category
    const categoryBreakdown = await Parcel.aggregate([
      { $group: { _id: '$parcelDetails.category', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalParcels,
        deliveredCount,
        inTransitCount,
        pendingCount,
        cancelledCount,
        totalRevenue,
        totalUsers,
        totalDrivers,
        activeDrivers,
        statusBreakdown,
        categoryBreakdown,
      },
      recentParcels,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all parcels with search and filters
// @route   GET /api/admin/parcels
// @access  Private (Admin only)
export const getAllParcels = async (req, res) => {
  try {
    const { status, search, deliveryType } = req.query;

    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (deliveryType && deliveryType !== 'All') {
      query.deliveryType = deliveryType;
    }

    if (search) {
      query.$or = [
        { trackingNumber: { $regex: search, $options: 'i' } },
        { 'sender.name': { $regex: search, $options: 'i' } },
        { 'sender.phone': { $regex: search, $options: 'i' } },
        { 'recipient.name': { $regex: search, $options: 'i' } },
        { 'recipient.phone': { $regex: search, $options: 'i' } },
        { 'recipient.city': { $regex: search, $options: 'i' } },
      ];
    }

    const parcels = await Parcel.find(query)
      .populate('assignedDriver', 'name phone driverInfo email')
      .populate('currentBranch', 'name code city')
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

// @desc    Assign driver to a parcel
// @route   PUT /api/admin/parcels/:id/assign-driver
// @access  Private (Admin only)
export const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    const parcel = await Parcel.findById(req.params.id);

    if (!parcel) {
      return res.status(404).json({ success: false, message: 'Parcel not found' });
    }

    const driver = await User.findOne({ _id: driverId, role: 'driver' });
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    parcel.assignedDriver = driver._id;
    if (parcel.status === 'Order Placed') {
      parcel.status = 'Driver Assigned';
    }

    parcel.trackingHistory.push({
      status: parcel.status,
      title: 'Driver Assigned',
      description: `Assigned to courier partner: ${driver.name} (${driver.driverInfo?.vehicleType || 'Courier'}). Contact: ${driver.phone}`,
      location: parcel.sender.city,
      timestamp: new Date(),
      updatedBy: req.user._id,
    });

    await parcel.save();

    const updated = await Parcel.findById(parcel._id)
      .populate('assignedDriver', 'name phone driverInfo')
      .populate('currentBranch', 'name code city');

    res.json({
      success: true,
      message: `Driver ${driver.name} assigned successfully`,
      parcel: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin manual status & hub override
// @route   PUT /api/admin/parcels/:id/update-status
// @access  Private (Admin only)
export const updateParcelAdmin = async (req, res) => {
  try {
    const { status, currentBranchId, paymentStatus, notes, location } = req.body;
    const parcel = await Parcel.findById(req.params.id);

    if (!parcel) {
      return res.status(404).json({ success: false, message: 'Parcel not found' });
    }

    if (status) {
      parcel.status = status;
      if (status === 'Delivered') {
        parcel.actualDeliveryDate = new Date();
        parcel.paymentStatus = 'Paid';
      }
    }

    if (currentBranchId) {
      parcel.currentBranch = currentBranchId;
    }

    if (paymentStatus) {
      parcel.paymentStatus = paymentStatus;
    }

    parcel.trackingHistory.push({
      status: status || parcel.status,
      title: `Status update: ${status || parcel.status}`,
      description: notes || `Shipment updated by operations admin ${req.user.name}`,
      location: location || 'Central Operations Hub',
      timestamp: new Date(),
      updatedBy: req.user._id,
    });

    await parcel.save();

    const updated = await Parcel.findById(parcel._id)
      .populate('assignedDriver', 'name phone driverInfo')
      .populate('currentBranch', 'name code city');

    res.json({
      success: true,
      message: 'Shipment updated successfully',
      parcel: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all drivers with their active load
// @route   GET /api/admin/drivers
// @access  Private (Admin only)
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' }).select('-password').sort({ name: 1 });

    // Attach active task count for each driver
    const driverListWithCount = await Promise.all(
      drivers.map(async (driver) => {
        const activeCount = await Parcel.countDocuments({
          assignedDriver: driver._id,
          status: { $in: ['Driver Assigned', 'Picked Up', 'In Transit', 'Out for Delivery'] },
        });
        return {
          ...driver.toObject(),
          activeTasks: activeCount,
        };
      })
    );

    res.json({
      success: true,
      drivers: driverListWithCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete parcel
// @route   DELETE /api/admin/parcels/:id
// @access  Private (Admin only)
export const deleteParcel = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) {
      return res.status(404).json({ success: false, message: 'Parcel not found' });
    }

    await Parcel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Parcel removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
