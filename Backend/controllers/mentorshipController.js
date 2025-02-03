import asyncHandler from 'express-async-handler';
import MentorshipRequest from '../models/MentorshipRequest.js';
import User from '../models/User.js';

// @desc    Send mentorship request
// @route   POST /api/mentorship/request/:mentorId
// @access  Private
export const sendRequest = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const mentorId = req.params.mentorId;
  const menteeId = req.user._id;

  const request = await MentorshipRequest.create({
    mentorId,
    menteeId,
    message,
    status: 'pending'
  });

  res.status(201).json(request);
});

// @desc    Get all mentorship requests (for mentors)
// @route   GET /api/mentorship/requests
// @access  Private
export const getRequests = asyncHandler(async (req, res) => {
  const requests = await MentorshipRequest.find({ mentorId: req.user._id })
    .populate('menteeId', 'name email')
    .sort('-createdAt');

  res.json(requests);
});

// @desc    Get my mentorship requests (for mentees)
// @route   GET /api/mentorship/my-requests
// @access  Private
export const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await MentorshipRequest.find({ menteeId: req.user._id })
    .populate('mentorId', 'name email')
    .sort('-createdAt');

  res.json(requests);
});

// @desc    Update mentorship request status
// @route   PUT /api/mentorship/request/:requestId
// @access  Private
export const updateRequest = asyncHandler(async (req, res) => {
  const request = await MentorshipRequest.findById(req.params.requestId);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  // Only mentor can update the request
  if (request.mentorId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this request');
  }

  request.status = req.body.status;
  const updatedRequest = await request.save();

  res.json(updatedRequest);
}); 