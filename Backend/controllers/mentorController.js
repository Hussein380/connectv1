import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Opportunity from '../models/Opportunity.js';
import MentorshipRequest from '../models/MentorshipRequest.js';

// @desc    Get mentor profile with contact info
// @route   GET /api/mentors/:id
// @access  Private
export const getMentorProfile = asyncHandler(async (req, res) => {
  const mentor = await User.findById(req.params.id).select('-password');
  
  if (!mentor || mentor.role !== 'mentor') {
    res.status(404);
    throw new Error('Mentor not found');
  }

  // Check if the requesting user has an approved mentorship
  const hasApprovedMentorship = await MentorshipRequest.findOne({
    mentorId: mentor._id,
    menteeId: req.user._id,
    status: 'accepted'
  });

  // Only show private contact info if there's an approved mentorship
  const profileData = {
    ...mentor.toObject(),
    contactInfo: {
      email: {
        address: mentor.contactInfo.email.isVisible || hasApprovedMentorship ? 
          mentor.contactInfo.email.address : null,
        isVisible: mentor.contactInfo.email.isVisible
      },
      whatsapp: {
        number: mentor.contactInfo.whatsapp.isVisible || hasApprovedMentorship ? 
          mentor.contactInfo.whatsapp.number : null,
        isVisible: mentor.contactInfo.whatsapp.isVisible
      },
      preferredContact: mentor.contactInfo.preferredContact
    }
  };

  res.json(profileData);
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

// @desc    Update mentor contact info
// @route   PUT /api/mentors/contact-info
// @access  Private (Mentor only)
export const updateContactInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { whatsapp, email, preferredContact } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can update contact settings' });
    }

    user.contactInfo = {
      whatsapp,
      email,
      preferredContact
    };

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update mentor contact settings
// @route   PUT /api/mentor/contact-settings
// @access  Private (Mentor only)
export const updateContactSettings = asyncHandler(async (req, res) => {
  const mentor = await User.findById(req.user._id);

  if (!mentor) {
    res.status(404);
    throw new Error('Mentor not found');
  }

  const { whatsapp, email, preferredContact } = req.body;

  mentor.contactInfo = {
    whatsapp: whatsapp || '',
    email: email || mentor.email,
    preferredContact: preferredContact || 'email'
  };

  const updatedMentor = await mentor.save();
  res.json({
    _id: updatedMentor._id,
    contactInfo: updatedMentor.contactInfo
  });
}); 