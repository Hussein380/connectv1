import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import MentorshipRequest from '../models/MentorshipRequest.js';

// @desc    Send a mentorship request
// @route   POST /api/mentorship/request
// @access  Private (Mentees only)
export const sendMentorshipRequest = asyncHandler(async (req, res) => {
  const { mentorId, message } = req.body;
  const menteeId = req.user._id;

  // Verify that the user is not a mentor trying to send a request
  if (req.user.role === 'mentor') {
    res.status(400);
    throw new Error('Mentors cannot send mentorship requests');
  }

  // Check if mentor exists and is actually a mentor
  const mentor = await User.findById(mentorId);
  if (!mentor || mentor.role !== 'mentor') {
    res.status(404);
    throw new Error('Mentor not found');
  }

  try {
    const request = await MentorshipRequest.create({
      mentor: mentorId,
      mentee: menteeId,
      message,
      status: 'pending'
    });

    // Populate mentee info for the response
    const populatedRequest = await request.populate('mentee', 'name email');
    res.status(201).json(populatedRequest);
  } catch (error) {
    // Handle duplicate request error
    if (error.code === 11000) {
      res.status(400);
      throw new Error('You already have a request with this mentor');
    }
    throw error;
  }
});

// @desc    Get all mentorship requests for a mentor
// @route   GET /api/mentorship/requests
// @access  Private (Mentors only)
export const getMentorshipRequests = asyncHandler(async (req, res) => {
  const requests = await MentorshipRequest.find({ mentor: req.user._id })
    .populate('mentee', 'name email bio interests')
    .sort('-createdAt');

  res.json(requests);
});

// @desc    Get mentee's sent requests
// @route   GET /api/mentorship/my-requests
// @access  Private
export const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await MentorshipRequest.find({ mentee: req.user._id })
    .populate('mentor', 'name email title')
    .sort('-createdAt');

  res.json(requests);
});

// @desc    Accept a mentorship request
// @route   PUT /api/mentorship/request/:id/accept
// @access  Private (Mentors only)
export const acceptRequest = asyncHandler(async (req, res) => {
  try {
    console.log('Starting acceptRequest with ID:', req.params.id);
    console.log('User ID:', req.user._id);

    const request = await MentorshipRequest.findById(req.params.id);
    console.log('Found request:', request);

    if (!request) {
      console.log('Request not found for ID:', req.params.id);
      res.status(404);
      throw new Error('Request not found');
    }

    // Verify the mentor is the one accepting
    console.log('Comparing mentor IDs:', {
      requestMentorId: request.mentor.toString(),
      currentUserId: req.user._id.toString()
    });

    if (request.mentor.toString() !== req.user._id.toString()) {
      console.log('Authorization failed - IDs do not match');
      res.status(403);
      throw new Error('Not authorized to accept this request');
    }

    // Check if request is already accepted or rejected
    console.log('Current request status:', request.status);
    if (request.status !== 'pending') {
      console.log('Request already processed');
      res.status(400);
      throw new Error(`Request has already been ${request.status}`);
    }

    // Get mentor's contact information
    console.log('Fetching mentor info for ID:', req.user._id);
    const mentor = await User.findById(req.user._id).select('name email contact');
    console.log('Found mentor:', {
      id: mentor._id,
      name: mentor.name,
      hasContact: !!mentor.contact
    });

    if (!mentor) {
      console.log('Mentor not found for ID:', req.user._id);
      res.status(404);
      throw new Error('Mentor not found');
    }

    // Create contact message
    console.log('Creating contact message');
    let contactMessage = `Hello! I (${mentor.name}) have accepted your mentorship request. `;

    // Add contact information based on availability and preference
    const contact = mentor.contact || {};
    const preferredMethod = contact.preferredMethod || 'email';
    
    let contactMethods = [];
    
    if (contact.whatsapp) {
      contactMethods.push(`WhatsApp: ${contact.whatsapp}`);
    }
    if (contact.email || mentor.email) {
      contactMethods.push(`Email: ${contact.email || mentor.email}`);
    }
    if (contact.phone) {
      contactMethods.push(`Phone: ${contact.phone}`);
    }

    console.log('Available contact methods:', contactMethods);

    if (contactMethods.length > 0) {
      contactMessage += `\nYou can reach me through:\n${contactMethods.join('\n')}`;
      if (preferredMethod && contact[preferredMethod]) {
        contactMessage += `\n\nPreferred contact method: ${preferredMethod}`;
      }
    } else {
      contactMessage += `\nYou can reach me at: ${mentor.email}`;
    }

    console.log('Final contact message created');

    // Update request status and notes
    console.log('Updating request status and notes');
    request.status = 'accepted';
    request.notes = contactMessage;
    await request.save();
    console.log('Request updated successfully');

    // Populate the response with mentor and mentee info
    console.log('Populating response data');
    const populatedRequest = await MentorshipRequest.findById(request._id)
      .populate('mentee', 'name email')
      .populate('mentor', 'name email contact');

    console.log('Sending response');
    res.json(populatedRequest);
  } catch (error) {
    console.error('Error in acceptRequest:', {
      message: error.message,
      stack: error.stack,
      requestId: req.params.id,
      userId: req.user?._id
    });
    
    if (!res.headersSent) {
      res.status(error.status || 500);
      throw new Error(error.message || 'Error accepting mentorship request');
    }
  }
});

// @desc    Reject a mentorship request
// @route   PUT /api/mentorship/request/:id/reject
// @access  Private (Mentors only)
export const rejectRequest = asyncHandler(async (req, res) => {
  const request = await MentorshipRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  // Verify the mentor is the one rejecting
  if (request.mentor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  request.status = 'rejected';
  await request.save();

  // Populate the response
  const populatedRequest = await request
    .populate('mentee', 'name email')
    .populate('mentor', 'name email');

  res.json(populatedRequest);
});