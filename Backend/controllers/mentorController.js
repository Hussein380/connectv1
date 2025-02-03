import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Opportunity from '../models/Opportunity.js';

// @desc    Get mentor profile
// @route   GET /api/mentor/profile
// @access  Private
export const getMentorProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

// @desc    Update mentor profile
// @route   PUT /api/mentor/profile
// @access  Private
export const updateMentorProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    user.interests = req.body.interests || user.interests;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      bio: updatedUser.bio,
      interests: updatedUser.interests
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get mentor's posted opportunities
// @route   GET /api/mentor/opportunities
// @access  Private
export const getMentorOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await Opportunity.find({ postedBy: req.user._id });
  res.json(opportunities);
}); 