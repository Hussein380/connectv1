import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    // Making it optional by removing required
  },
  deadline: {
    type: Date
  },
  applicationLink: {
    type: String
  },
  type: {
    type: String,
    enum: ['internship', 'job', 'project', 'other'],
    default: 'internship'
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  category: String,
  tags: [String]
}, {
  timestamps: true
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity; 