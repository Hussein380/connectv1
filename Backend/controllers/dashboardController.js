import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Opportunity from '../models/Opportunity.js';
import MentorshipRequest from '../models/MentorshipRequest.js';
import Message from '../models/Message.js';
import Session from '../models/Session.js';
import Goal from '../models/Goal.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const userRole = req.user.role;

    const [opportunities, mentors, messages] = await Promise.all([
        Opportunity.countDocuments(userRole === 'mentor' ? { mentor: userId } : {}),
        User.countDocuments({ role: 'mentor', active: true }),
        Message.countDocuments({
            $or: [{ sender: userId }, { recipient: userId }]
        })
    ]);

    res.json({
        activeMentors: mentors,
        opportunities,
        messages
    });
});

// @desc    Get mentorship sessions
// @route   GET /api/dashboard/sessions
// @access  Private
export const getSessions = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const sessions = await Session.find({
        $or: [{ mentor: userId }, { mentee: userId }],
        status: 'scheduled',
        startTime: { $gte: new Date() }
    })
        .populate('mentor', 'name email')
        .populate('mentee', 'name email')
        .sort('startTime');

    res.json(sessions);
});

// @desc    Create mentorship session
// @route   POST /api/dashboard/sessions
// @access  Private
export const createSession = asyncHandler(async (req, res) => {
    const { mentorId, menteeId, topic, startTime, endTime, meetingLink } = req.body;

    const session = await Session.create({
        mentor: mentorId,
        mentee: menteeId,
        topic,
        startTime,
        endTime,
        meetingLink
    });

    res.status(201).json(session);
});

// @desc    Get mentorship goals
// @route   GET /api/dashboard/goals
// @access  Private
export const getGoals = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const mentorships = await MentorshipRequest.find({
        $or: [{ mentorId: userId }, { menteeId: userId }],
        status: 'accepted'
    }).select('_id');

    const goals = await Goal.find({
        mentorship: { $in: mentorships.map(m => m._id) }
    }).sort('-createdAt');

    res.json(goals);
});

// @desc    Create mentorship goal
// @route   POST /api/dashboard/goals
// @access  Private
export const createGoal = asyncHandler(async (req, res) => {
    const { mentorshipId, title, description, deadline } = req.body;

    const goal = await Goal.create({
        mentorship: mentorshipId,
        title,
        description,
        deadline
    });

    res.status(201).json(goal);
});

// @desc    Update goal progress
// @route   PUT /api/dashboard/goals/:id
// @access  Private
export const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
        res.status(404);
        throw new Error('Goal not found');
    }

    goal.status = req.body.status || goal.status;
    goal.progress = req.body.progress || goal.progress;

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
}); 