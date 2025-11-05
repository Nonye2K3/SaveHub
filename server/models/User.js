const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocument: {
    type: String // URL to ID document
  },
  // Gamification
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    icon: String,
    earnedAt: Date
  }],
  level: {
    type: Number,
    default: 1
  },
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Savings data
  currentHives: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hive'
  }],
  completedHives: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hive'
  }],
  totalSaved: {
    type: Number,
    default: 0
  },
  consistencyStreak: {
    type: Number,
    default: 0
  },
  lastContributionDate: Date,
  // Account status
  status: {
    type: String,
    enum: ['active', 'suspended', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate referral code before saving
userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = 'SH' + Math.random().toString(36).substr(2, 8).toUpperCase();
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
