import asyncHandler from 'express-async-handler';
import MentorshipRequest from '../models/MentorshipRequest.js';
import User from '../models/User.js';

// @desc    Send mentorship request
// @route   POST /api/mentorship/request/:mentorId
// @access  Private (Mentee only)
export const sendMentorshipRequest = asyncHandler(async (req, res) => {
    const mentorId = req.params.mentorId;
    const menteeId = req.user._id;
    const { message } = req.body;

    // Check if mentor exists
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== 'mentor') {
        res.status(404);
        throw new Error('Mentor not found');
    }

    // Check if request already exists
    const existingRequest = await MentorshipRequest.findOne({
        mentorId,
        menteeId,
        status: 'pending'
    });

    if (existingRequest) {
        res.status(400);
        throw new Error('A pending request already exists');
    }

    const request = await MentorshipRequest.create({
        mentorId,
        menteeId,
        message
    });

    res.status(201).json(request);
});

// @desc    Get all mentorship requests for a mentor
// @route   GET /api/mentorship/requests
// @access  Private (Mentor only)
export const getMentorshipRequests = asyncHandler(async (req, res) => {
    if (req.user.role !== 'mentor') {
        res.status(403);
        throw new Error('Only mentors can access this route');
    }

    const requests = await MentorshipRequest.find({ mentorId: req.user._id })
        .populate('menteeId', 'name email')
        .sort('-createdAt');

    res.json(requests);
});

// @desc    Get mentee's own requests
// @route   GET /api/mentorship/my-requests
// @access  Private (Mentee only)
export const getMyMentorshipRequests = asyncHandler(async (req, res) => {
    if (req.user.role !== 'mentee') {
        res.status(403);
        throw new Error('Only mentees can access this route');
    }

    const requests = await MentorshipRequest.find({ menteeId: req.user._id })
        .populate('mentorId', 'name email contactInfo')
        .sort('-createdAt');

    res.json(requests);
});

// @desc    Update mentorship request status
// @route   PUT /api/mentorship/request/:requestId
// @access  Private (Mentor only)
export const updateMentorshipRequest = asyncHandler(async (req, res) => {
    const request = await MentorshipRequest.findById(req.params.requestId);

    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    // Ensure the mentor owns this request
    if (request.mentorId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this request');
    }

    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status');
    }

    request.status = status;
    const updatedRequest = await request.save();

    // Populate mentor and mentee info before sending response
    const populatedRequest = await MentorshipRequest.findById(updatedRequest._id)
        .populate('mentorId', 'name email contactInfo')
        .populate('menteeId', 'name email');

    res.json(populatedRequest);
}); 