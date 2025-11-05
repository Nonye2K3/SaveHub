const mongoose = require('mongoose');

const hiveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  },
  contributionAmount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  maxMembers: {
    type: Number,
    default: 5
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    payoutOrder: {
      type: Number,
      required: true
    },
    totalContributed: {
      type: Number,
      default: 0
    },
    missedContributions: {
      type: Number,
      default: 0
    },
    hasPaidOut: {
      type: Boolean,
      default: false
    },
    payoutDate: Date,
    payoutAmount: Number
  }],
  status: {
    type: String,
    enum: ['forming', 'active', 'completed', 'cancelled'],
    default: 'forming'
  },
  startDate: Date,
  endDate: Date,
  currentCycle: {
    type: Number,
    default: 0
  },
  totalCycles: {
    type: Number,
    default: 5 // Equal to maxMembers
  },
  rules: {
    allowLateFees: {
      type: Boolean,
      default: true
    },
    lateFeePercentage: {
      type: Number,
      default: 5
    },
    maxMissedContributions: {
      type: Number,
      default: 2
    },
    requireVerifiedMembers: {
      type: Boolean,
      default: true
    }
  },
  poolAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total pool for each cycle
hiveSchema.methods.calculatePoolAmount = function() {
  return this.contributionAmount * this.members.length;
};

// Check if hive is full
hiveSchema.methods.isFull = function() {
  return this.members.length >= this.maxMembers;
};

// Get next payout recipient
hiveSchema.methods.getNextPayoutRecipient = function() {
  const unpaidMembers = this.members.filter(m => !m.hasPaidOut);
  if (unpaidMembers.length === 0) return null;
  return unpaidMembers.sort((a, b) => a.payoutOrder - b.payoutOrder)[0];
};

module.exports = mongoose.model('Hive', hiveSchema);
