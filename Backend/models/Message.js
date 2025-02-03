import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  attachments: [{
    type: String // URLs to attached files
  }]
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
export default Message; 