import asyncHandler from 'express-async-handler';
import Opportunity from '../models/Opportunity.js';

// @desc    Create a new opportunity
// @route   POST /api/opportunities
// @access  Private (Mentors only)
export const createOpportunity = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    requirements,
    deadline,
    applicationLink,
    type
  } = req.body;

  // Create opportunity with mentor ID from authenticated user
  const opportunity = await Opportunity.create({
    title,
    description,
    requirements,
    deadline,
    applicationLink,
    type,
    mentor: req.user._id // Set the mentor field to the authenticated user's ID
  });

  if (opportunity) {
    res.status(201).json(opportunity);
  } else {
    res.status(400);
    throw new Error('Invalid opportunity data');
  }
});

// @desc    Get all opportunities
// @route   GET /api/opportunities
// @access  Public
export const getOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await Opportunity.find({})
    .populate('mentor', 'name email')
    .sort({ createdAt: -1 });
  res.json(opportunities);
});

// @desc    Get mentor's opportunities
// @route   GET /api/opportunities/mentor/:mentorId
// @access  Private
export const getMentorOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await Opportunity.find({ mentor: req.user._id })
    .sort({ createdAt: -1 });
  res.json(opportunities);
});

// @desc    Get single opportunity
// @route   GET /api/opportunities/:id
// @access  Public
export const getOpportunityById = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id)
    .populate('mentor', 'name email');

  if (opportunity) {
    res.json(opportunity);
  } else {
    res.status(404);
    throw new Error('Opportunity not found');
  }
});

// @desc    Update opportunity
// @route   PUT /api/opportunities/:id
// @access  Private (Mentor only)
export const updateOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);

  if (!opportunity) {
    res.status(404);
    throw new Error('Opportunity not found');
  }

  // Check if the logged-in user is the mentor who created this opportunity
  if (opportunity.mentor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this opportunity');
  }

  const updatedOpportunity = await Opportunity.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedOpportunity);
});

// @desc    Delete opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private (Mentor only)
export const deleteOpportunity = asyncHandler(async (req, res) => {
  const opportunity = await Opportunity.findById(req.params.id);

  if (!opportunity) {
    res.status(404);
    throw new Error('Opportunity not found');
  }

  // Check if the logged-in user is the mentor who created this opportunity
  if (opportunity.mentor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this opportunity');
  }

  await Opportunity.findByIdAndDelete(req.params.id);
  res.json({ message: 'Opportunity removed' });
}); 