const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hive',
    required: true
  },
  type: {
    type: String,
    enum: ['contribution', 'payout', 'penalty', 'refund', 'bonus'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'mobile_money', 'wallet'],
    required: true
  },
  paymentReference: {
    type: String,
    unique: true
  },
  description: String,
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Index for faster queries
transactionSchema.index({ user: 1, hive: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
