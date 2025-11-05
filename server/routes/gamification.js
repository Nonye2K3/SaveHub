const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Badge definitions
const BADGES = {
  FIRST_CONTRIBUTION: {
    name: 'First Step',
    icon: '🎯',
    description: 'Made your first contribution'
  },
  CONSISTENT_5: {
    name: 'Steady Saver',
    icon: '⭐',
    description: '5 consecutive contributions'
  },
  CONSISTENT_10: {
    name: 'Saving Champion',
    icon: '🏆',
    description: '10 consecutive contributions'
  },
  REFERRAL_5: {
    name: 'Community Builder',
    icon: '👥',
    description: 'Referred 5 users'
  },
  COMPLETE_HIVE: {
    name: 'Hive Graduate',
    icon: '🎓',
    description: 'Completed your first hive'
  },
  POINTS_100: {
    name: 'Century',
    icon: '💯',
    description: 'Earned 100 points'
  },
  POINTS_1000: {
    name: 'Point Master',
    icon: '🔥',
    description: 'Earned 1000 points'
  }
};

// Award badge to user
router.post('/award-badge', auth, async (req, res) => {
  try {
    const { badgeKey } = req.body;
    
    const badge = BADGES[badgeKey];
    if (!badge) {
      return res.status(400).json({ message: 'Invalid badge' });
    }

    const user = await User.findById(req.userId);
    
    // Check if user already has this badge
    const hasBadge = user.badges.some(b => b.name === badge.name);
    if (hasBadge) {
      return res.status(400).json({ message: 'User already has this badge' });
    }

    // Award badge
    user.badges.push({
      name: badge.name,
      icon: badge.icon,
      earnedAt: new Date()
    });

    // Award bonus points
    user.points += 50;

    await user.save();

    res.json({
      message: 'Badge awarded!',
      badge,
      user: {
        points: user.points,
        badges: user.badges
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error awarding badge', error: error.message });
  }
});

// Get all available badges
router.get('/badges', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const earnedBadges = user.badges.map(b => b.name);

    const allBadges = Object.entries(BADGES).map(([key, badge]) => ({
      key,
      ...badge,
      earned: earnedBadges.includes(badge.name)
    }));

    res.json(allBadges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching badges', error: error.message });
  }
});

// Check and update user level
router.post('/update-level', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Level calculation: 100 points per level
    const newLevel = Math.floor(user.points / 100) + 1;
    
    if (newLevel > user.level) {
      user.level = newLevel;
      user.points += 25; // Bonus points for leveling up
      await user.save();

      res.json({
        message: `Congratulations! You've reached level ${newLevel}!`,
        level: user.level,
        points: user.points
      });
    } else {
      res.json({
        message: 'No level change',
        level: user.level,
        points: user.points,
        pointsToNextLevel: (user.level * 100) - user.points
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating level', error: error.message });
  }
});

module.exports = router;
