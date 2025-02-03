import mongoose from 'mongoose';

const opportunitySchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  applicationLink: {
    type: String,
    required: false // Optional field
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, {
  timestamps: true
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity; 