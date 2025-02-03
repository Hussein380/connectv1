import asyncHandler from 'express-async-handler';
import Opportunity from '../models/Opportunity.js';

// @desc    Create new opportunity
// @route   POST /api/opportunities
// @access  Private (Mentors only)
export const createOpportunity = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const opportunity = await Opportunity.create({
    title,
    description,
    mentor: req.user._id
  });

  res.status(201).json(opportunity);
});

// @desc    Get all opportunities
// @route   GET /api/opportunities
// @access  Private
export const getOpportunities = asyncHandler(async (req, res) => {
  const opportunities = await Opportunity.find({ status: 'open' })
    .populate('mentor', 'name email')
    .sort('-createdAt');

  res.json(opportunities);
});

// @desc    Get opportunity by ID
// @route   GET /api/opportunities/:id
// @access  Private
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

  // Check if user is the mentor who created the opportunity
  if (opportunity.mentor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  opportunity.title = req.body.title || opportunity.title;
  opportunity.description = req.body.description || opportunity.description;
  opportunity.status = req.body.status || opportunity.status;

  const updatedOpportunity = await opportunity.save();
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

  // Check if user is the mentor who created the opportunity
  if (opportunity.mentor.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await opportunity.deleteOne();
  res.json({ message: 'Opportunity removed' });
}); 