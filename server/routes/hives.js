const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Hive = require('../models/Hive');
const User = require('../models/User');

// Get all available hives (forming status)
router.get('/available', auth, async (req, res) => {
  try {
    const { type, contributionAmount } = req.query;
    
    const query = { 
      status: 'forming',
      'members.user': { $ne: req.userId } // Exclude hives user is already in
    };
    
    if (type) query.type = type;
    if (contributionAmount) query.contributionAmount = Number(contributionAmount);

    const hives = await Hive.find(query)
      .populate('members.user', 'firstName lastName profilePicture country isVerified')
      .sort({ createdAt: -1 });

    res.json(hives);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hives', error: error.message });
  }
});

// Get user's current hives
router.get('/my-hives', auth, async (req, res) => {
  try {
    const hives = await Hive.find({
      'members.user': req.userId,
      status: { $in: ['forming', 'active'] }
    }).populate('members.user', 'firstName lastName profilePicture country isVerified');

    res.json(hives);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your hives', error: error.message });
  }
});

// Create new hive or join existing one
router.post('/join', auth, async (req, res) => {
  try {
    const { type, contributionAmount, currency } = req.body;

    const user = await User.findById(req.userId);

    // Check if user is verified (if required)
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your account before joining a hive' });
    }

    // Find or create a matching hive
    let hive = await Hive.findOne({
      type,
      contributionAmount,
      currency: currency || 'USD',
      status: 'forming',
      'members.user': { $ne: req.userId }
    });

    if (!hive) {
      // Create new hive
      hive = new Hive({
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Hive - ${contributionAmount} ${currency || 'USD'}`,
        type,
        contributionAmount,
        currency: currency || 'USD',
        members: []
      });
    }

    // Check if hive is full
    if (hive.isFull()) {
      return res.status(400).json({ message: 'This hive is already full' });
    }

    // Add user to hive
    const payoutOrder = hive.members.length + 1;
    hive.members.push({
      user: req.userId,
      payoutOrder
    });

    // If hive is now full, activate it
    if (hive.isFull()) {
      hive.status = 'active';
      hive.startDate = new Date();
      
      // Calculate end date based on type
      const endDate = new Date();
      if (type === 'daily') {
        endDate.setDate(endDate.getDate() + (hive.maxMembers * 1));
      } else if (type === 'weekly') {
        endDate.setDate(endDate.getDate() + (hive.maxMembers * 7));
      } else if (type === 'monthly') {
        endDate.setMonth(endDate.getMonth() + hive.maxMembers);
      }
      hive.endDate = endDate;
    }

    await hive.save();

    // Update user's current hives
    user.currentHives.push(hive._id);
    await user.save();

    await hive.populate('members.user', 'firstName lastName profilePicture country isVerified');

    res.status(201).json({ 
      message: 'Successfully joined hive',
      hive
    });
  } catch (error) {
    res.status(500).json({ message: 'Error joining hive', error: error.message });
  }
});

// Get hive details
router.get('/:hiveId', auth, async (req, res) => {
  try {
    const hive = await Hive.findById(req.params.hiveId)
      .populate('members.user', 'firstName lastName profilePicture country isVerified');

    if (!hive) {
      return res.status(404).json({ message: 'Hive not found' });
    }

    // Check if user is a member
    const isMember = hive.members.some(m => m.user._id.toString() === req.userId.toString());
    if (!isMember) {
      return res.status(403).json({ message: 'You are not a member of this hive' });
    }

    res.json(hive);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hive details', error: error.message });
  }
});

module.exports = router;
