import Branch from '../models/Branch.js';

// @desc    Get all branches / hubs
// @route   GET /api/branches
// @access  Public
export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ city: 1 });
    res.json({ success: true, count: branches.length, branches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create branch
// @route   POST /api/branches
// @access  Private (Admin only)
export const createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ success: true, branch });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
