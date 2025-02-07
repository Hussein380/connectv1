import mongoose from 'mongoose';

const goalSchema = mongoose.Schema({
    mentorship: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MentorshipRequest',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    deadline: Date,
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    }
}, {
    timestamps: true
});

const Goal = mongoose.model('Goal', goalSchema);
export default Goal; 