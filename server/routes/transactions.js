const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Hive = require('../models/Hive');
const User = require('../models/User');

// Get user's transactions
router.get('/my-transactions', auth, async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    
    const transactions = await Transaction.find({ user: req.userId })
      .populate('hive', 'name type')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Transaction.countDocuments({ user: req.userId });

    res.json({
      transactions,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
});

// Make a contribution
router.post('/contribute', auth, async (req, res) => {
  try {
    const { hiveId, paymentMethod, paymentReference } = req.body;

    const hive = await Hive.findById(hiveId);
    if (!hive) {
      return res.status(404).json({ message: 'Hive not found' });
    }

    // Check if user is a member
    const memberIndex = hive.members.findIndex(m => m.user.toString() === req.userId.toString());
    if (memberIndex === -1) {
      return res.status(403).json({ message: 'You are not a member of this hive' });
    }

    // Create transaction
    const transaction = new Transaction({
      user: req.userId,
      hive: hiveId,
      type: 'contribution',
      amount: hive.contributionAmount,
      currency: hive.currency,
      status: 'completed', // In production, this would be 'pending' until payment is verified
      paymentMethod,
      paymentReference: paymentReference || `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      description: `Contribution to ${hive.name}`
    });

    await transaction.save();

    // Update hive member contribution
    hive.members[memberIndex].totalContributed += hive.contributionAmount;
    hive.poolAmount += hive.contributionAmount;
    await hive.save();

    // Update user stats
    const user = await User.findById(req.userId);
    user.totalSaved += hive.contributionAmount;
    user.lastContributionDate = new Date();
    user.points += 10; // Award points for contribution
    await user.save();

    res.status(201).json({
      message: 'Contribution successful',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing contribution', error: error.message });
  }
});

// Get hive transactions
router.get('/hive/:hiveId', auth, async (req, res) => {
  try {
    const hive = await Hive.findById(req.params.hiveId);
    if (!hive) {
      return res.status(404).json({ message: 'Hive not found' });
    }

    // Check if user is a member
    const isMember = hive.members.some(m => m.user.toString() === req.userId.toString());
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this hive' });
    }

    const transactions = await Transaction.find({ hive: req.params.hiveId })
      .populate('user', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hive transactions', error: error.message });
  }
});

module.exports = router;
