import Review from '../models/Review.js';

// @desc    Get customer reviews
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(10);
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review
// @route   POST /api/reviews
// @access  Public
export const addReview = async (req, res) => {
  try {
    const { name, role, comment, rating } = req.body;
    const review = await Review.create({
      name: name || (req.user ? req.user.name : 'Anonymous Client'),
      role: role || 'Business Customer',
      comment,
      rating: rating || 5,
    });
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
