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

// @desc    Get mentor profile
// @route   GET /api/mentor/profile
// @access  Private/Mentor
export const getMentorProfileSelf = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      title: user.title,
      bio: user.bio,
      expertise: user.expertise,
      contact: user.contact,
      stats: user.stats
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update mentor profile
// @route   PUT /api/mentor/profile
// @access  Private/Mentor
export const updateMentorProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.name = req.body.name || user.name;
    user.title = req.body.title || user.title;
    user.bio = req.body.bio || user.bio;
    user.expertise = req.body.expertise || user.expertise;
    
    // Update contact information
    if (req.body.contact) {
      user.contact = {
        email: req.body.contact.email || user.contact?.email || user.email,
        phone: req.body.contact.phone || user.contact?.phone || ''
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      title: updatedUser.title,
      bio: updatedUser.bio,
      expertise: updatedUser.expertise,
      contact: updatedUser.contact,
      stats: updatedUser.stats
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

// @desc    Update mentor contact information
// @route   PUT /api/mentor/contact
// @access  Private (Mentors only)
export const updateContactInfo = asyncHandler(async (req, res) => {
  const mentor = await User.findById(req.user._id);

  if (!mentor) {
    res.status(404);
    throw new Error('Mentor not found');
  }

  if (mentor.role !== 'mentor') {
    res.status(403);
    throw new Error('Not authorized. Only mentors can update contact information');
  }

  const { email, phone, whatsapp, preferredMethod } = req.body;

  mentor.contact = {
    email: email || mentor.contact?.email || mentor.email,
    phone: phone || mentor.contact?.phone || '',
    whatsapp: whatsapp || mentor.contact?.whatsapp || '',
    preferredMethod: preferredMethod || mentor.contact?.preferredMethod || 'email'
  };

  // Check if profile is complete (has at least one contact method)
  mentor.isProfileComplete = !!(mentor.contact.email || mentor.contact.phone || mentor.contact.whatsapp);

  const updatedMentor = await mentor.save();

  res.json({
    _id: updatedMentor._id,
    name: updatedMentor.name,
    email: updatedMentor.email,
    contact: updatedMentor.contact,
    isProfileComplete: updatedMentor.isProfileComplete
  });
});

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

// @desc    Get all mentors
// @route   GET /api/mentor
// @access  Public
export const getAllMentors = asyncHandler(async (req, res) => {
  const mentors = await User.find({ role: 'mentor' })
    .select('name email bio expertise stats avatar title contact')
    .lean();

  res.json(mentors);
});

// @desc    Get all mentors
// @route   GET /api/mentor
// @access  Public
export const getAllMentorsNew = asyncHandler(async (req, res) => {
  const mentors = await User.find({ role: 'mentor' })
    .select('-password')
    .lean();
  res.json(mentors);
});

// @desc    Get mentor by ID
// @route   GET /api/mentor/:id
// @access  Public
export const getMentorById = asyncHandler(async (req, res) => {
  const mentor = await User.findOne({ _id: req.params.id, role: 'mentor' })
    .select('-password')
    .lean();

  if (!mentor) {
    res.status(404);
    throw new Error('Mentor not found');
  }

  res.json(mentor);
});

// @desc    Get mentor profile
// @route   GET /api/mentor/profile/me
// @access  Private/Mentor
export const getMentorProfileMe = asyncHandler(async (req, res) => {
  const mentor = await User.findById(req.user._id)
    .select('-password')
    .lean();

  if (!mentor) {
    res.status(404);
    throw new Error('Mentor not found');
  }

  res.json(mentor);
});

// @desc    Update mentor profile
// @route   PUT /api/mentor/profile
// @access  Private/Mentor
export const updateMentorProfileNew = asyncHandler(async (req, res) => {
  const mentor = await User.findById(req.user._id);

  if (!mentor) {
    res.status(404);
    throw new Error('Mentor not found');
  }

  const { name, email, bio, expertise, title } = req.body;

  mentor.name = name || mentor.name;
  mentor.email = email || mentor.email;
  mentor.bio = bio || mentor.bio;
  mentor.expertise = expertise || mentor.expertise;
  mentor.title = title || mentor.title;

  const updatedMentor = await mentor.save();

  res.json({
    _id: updatedMentor._id,
    name: updatedMentor.name,
    email: updatedMentor.email,
    bio: updatedMentor.bio,
    expertise: updatedMentor.expertise,
    title: updatedMentor.title
  });
});

// @desc    Update mentor contact information
// @route   PUT /api/mentor/contact
// @access  Private/Mentor
export const updateContactInfoNew = asyncHandler(async (req, res) => {
  const mentor = await User.findById(req.user._id);

  if (!mentor) {
    res.status(404);
    throw new Error('Mentor not found');
  }

  if (mentor.role !== 'mentor') {
    res.status(403);
    throw new Error('Not authorized. Only mentors can update contact information');
  }

  const { email, phone, whatsapp, preferredMethod } = req.body;

  mentor.contact = {
    email: email || mentor.contact?.email || mentor.email,
    phone: phone || mentor.contact?.phone || '',
    whatsapp: whatsapp || mentor.contact?.whatsapp || '',
    preferredMethod: preferredMethod || mentor.contact?.preferredMethod || 'email'
  };

  mentor.isProfileComplete = !!(mentor.contact.email || mentor.contact.phone || mentor.contact.whatsapp);

  const updatedMentor = await mentor.save();

  res.json({
    _id: updatedMentor._id,
    name: updatedMentor.name,
    email: updatedMentor.email,
    contact: updatedMentor.contact,
    isProfileComplete: updatedMentor.isProfileComplete
  });
});

// @desc    Get mentor opportunities
// @route   GET /api/mentor/opportunities/me
// @access  Private/Mentor
export const getMentorOpportunitiesMe = asyncHandler(async (req, res) => {
  const opportunities = await MentorshipRequest.find({ mentor: req.user._id })
    .populate('mentee', 'name email')
    .sort('-createdAt')
    .lean();

  res.json(opportunities);
});