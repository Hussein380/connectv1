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
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['mentor', 'mentee', 'admin'],
    default: 'mentee'
  },
  title: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  expertise: [{
    type: String,
    trim: true
  }],
  interests: [{
    type: String,
    trim: true
  }],
  contact: {
    email: {
      type: String,
      default: function() {
        return this.email;
      }
    },
    phone: {
      type: String,
      default: ''
    },
    whatsapp: {
      type: String,
      default: ''
    },
    preferredMethod: {
      type: String,
      enum: ['email', 'phone', 'whatsapp'],
      default: 'email'
    }
  },
  stats: {
    activeMentees: {
      type: Number,
      default: 0
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    }
  },
  isProfileComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;