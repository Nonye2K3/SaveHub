const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/savehub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/hives', require('./routes/hives'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/gamification', require('./routes/gamification'));
app.use('/api/admin', require('./routes/admin'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SaveHub API is running' });
});

// Automated contribution reminder - runs daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('🔔 Running daily contribution reminder...');
  // TODO: Send reminders to users with pending contributions
});

// Automated payout processor - runs daily at 10 PM
cron.schedule('0 22 * * *', async () => {
  console.log('💰 Processing scheduled payouts...');
  // TODO: Process pending payouts
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SaveHub server running on port ${PORT}`);
});
