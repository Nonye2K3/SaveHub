const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Hive = require('../models/Hive');
const Transaction = require('../models/Transaction');

// Admin middleware - check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.email !== 'admin@savehub.com') { // In production, add proper admin role
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin status' });
  }
};

// Get platform statistics
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const activeHives = await Hive.countDocuments({ status: 'active' });
    const completedHives = await Hive.countDocuments({ status: 'completed' });
    
    const transactions = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalVolume: { $sum: '$amount' },
          totalTransactions: { $sum: 1 }
        }
      }
    ]);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('firstName lastName email country createdAt isVerified');

    res.json({
      users: {
        total: totalUsers,
        verified: verifiedUsers,
        recent: recentUsers
      },
      hives: {
        active: activeHives,
        completed: completedHives,
        total: activeHives + completedHives
      },
      transactions: {
        volume: transactions[0]?.totalVolume || 0,
        count: transactions[0]?.totalTransactions || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Get all users with pagination
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    
    const query = search 
      ? {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Verify user
router.put('/users/:userId/verify', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isVerified: true },
      { new: true }
    ).select('-password');

    res.json({ message: 'User verified successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying user', error: error.message });
  }
});

// Suspend user
router.put('/users/:userId/suspend', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'suspended' },
      { new: true }
    ).select('-password');

    res.json({ message: 'User suspended successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error suspending user', error: error.message });
  }
});

// Get all hives
router.get('/hives', auth, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const query = status ? { status } : {};

    const hives = await Hive.find(query)
      .populate('members.user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Hive.countDocuments(query);

    res.json({
      hives,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hives', error: error.message });
  }
});

// Cancel hive
router.put('/hives/:hiveId/cancel', auth, isAdmin, async (req, res) => {
  try {
    const hive = await Hive.findByIdAndUpdate(
      req.params.hiveId,
      { status: 'cancelled' },
      { new: true }
    );

    res.json({ message: 'Hive cancelled successfully', hive });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling hive', error: error.message });
  }
});

// Get all transactions
router.get('/transactions', auth, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, status, type } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .populate('user', 'firstName lastName email')
      .populate('hive', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Transaction.countDocuments(query);

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

module.exports = router;
