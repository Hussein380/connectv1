import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Opportunity from '../models/Opportunity.js';

// @desc    Get mentee profile
// @route   GET /api/mentee/profile
// @access  Private
export const getMenteeProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

// @desc    Update mentee profile
// @route   PUT /api/mentee/profile
// @access  Private
export const updateMenteeProfile = asyncHandler(async (req, res) => {
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

// @desc    Search opportunities
// @route   GET /api/mentee/search
// @access  Private
export const searchOpportunities = asyncHandler(async (req, res) => {
  const { title, eligibility, deadline } = req.query;
  
  const query = {};
  
  if (title) {
    query.title = { $regex: title, $options: 'i' };
  }
  if (eligibility) {
    query.eligibility = { $regex: eligibility, $options: 'i' };
  }
  if (deadline) {
    query.deadline = { $gte: new Date(deadline) };
  }

  const opportunities = await Opportunity.find(query).populate('postedBy', 'name email');
  res.json(opportunities);
}); 