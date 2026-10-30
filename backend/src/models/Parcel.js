import mongoose from 'mongoose';

const trackingHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const parcelSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    sender: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pickupInstructions: { type: String, default: '' },
    },
    recipient: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: '' },
      address: { type: String, required: true },
      city: { type: String, required: true },
      deliveryInstructions: { type: String, default: '' },
    },
    parcelDetails: {
      category: {
        type: String,
        enum: ['Document', 'Parcel', 'Electronics', 'Fragile', 'Clothing', 'Perishable', 'Heavy Goods'],
        default: 'Parcel',
      },
      weight: {
        type: Number,
        required: true,
        min: 0.1,
      },
      dimensions: {
        length: { type: Number, default: 10 },
        width: { type: Number, default: 10 },
        height: { type: Number, default: 10 },
      },
      declaredValue: {
        type: Number,
        default: 0,
      },
      description: {
        type: String,
        default: '',
      },
    },
    deliveryType: {
      type: String,
      enum: ['Standard', 'Express', 'Same Day', 'Overnight'],
      default: 'Standard',
    },
    cost: {
      basePrice: { type: Number, default: 5 },
      weightSurcharge: { type: Number, default: 0 },
      expressSurcharge: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Cash on Delivery'],
      default: 'Cash on Delivery',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Online Payment', 'Mobile Wallet'],
      default: 'Cash',
    },
    status: {
      type: String,
      enum: [
        'Order Placed',
        'Driver Assigned',
        'Picked Up',
        'In Transit',
        'At Sorting Hub',
        'Out for Delivery',
        'Delivered',
        'Failed Delivery',
        'Cancelled',
      ],
      default: 'Order Placed',
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    currentBranch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    actualDeliveryDate: {
      type: Date,
    },
    proofOfDelivery: {
      recipientSignature: { type: String, default: '' },
      photoUrl: { type: String, default: '' },
      deliveryNotes: { type: String, default: '' },
      deliveredAt: { type: Date },
    },
    trackingHistory: [trackingHistorySchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Parcel', parcelSchema);
