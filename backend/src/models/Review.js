import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: 'Customer' },
    avatar: { type: String, default: '' },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    comment: { type: String, required: true },
    isFeatured: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Review', reviewSchema);
