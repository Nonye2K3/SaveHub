const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('currentHives')
      .populate('completedHives');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update user profile
router.put('/me', auth, async (req, res) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'profilePicture'];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const stats = {
      totalSaved: user.totalSaved,
      currentHives: user.currentHives.length,
      completedHives: user.completedHives.length,
      points: user.points,
      level: user.level,
      badges: user.badges.length,
      consistencyStreak: user.consistencyStreak,
      referralCode: user.referralCode
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const leaderboard = await User.find({ status: 'active' })
      .select('firstName lastName points level badges profilePicture country')
      .sort({ points: -1 })
      .limit(50);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
});

module.exports = router;
