import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['mentor', 'mentee'],
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  interests: [{
    type: String
  }],
  contactInfo: {
    whatsapp: String,
    linkedin: String,
    twitter: String,
    preferredContact: {
      type: String,
      enum: ['whatsapp', 'email', 'linkedin', 'twitter'],
      default: 'email'
    }
  },
}, {
  timestamps: true
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User; 