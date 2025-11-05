# SaveHub Setup Guide

This guide will help you get SaveHub up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (version 14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB**
   - Option A: Install locally from https://www.mongodb.com/try/download/community
   - Option B: Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- dotenv - Environment variables
- cors - Cross-origin resource sharing
- express-validator - Input validation
- node-cron - Scheduled tasks

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/savehub
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/savehub

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Payment Gateway (Optional for now)
PAYMENT_PUBLIC_KEY=your_payment_public_key
PAYMENT_SECRET_KEY=your_payment_secret_key

# Email Service (Optional for now)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
```

**Important:** Change the `JWT_SECRET` to a random, secure string in production!

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# On macOS/Linux
mongod

# On Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

**Option B: MongoDB Atlas**
- No local installation needed
- Just use the connection string in your `.env` file

### 4. Start the Application

**Development Mode (with auto-restart):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### 5. Access the Application

- **Main App**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin.html
- **API Health Check**: http://localhost:5000/api/health

## Testing the Application

### Create a Test User

1. Open http://localhost:5000
2. Click "Get Started"
3. Click "Sign Up"
4. Fill in the registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: +2341234567890
   - Country: Nigeria
   - Password: password123

5. Click "Create Account"

### Test the Flow

1. **Dashboard**: View your stats and referral code
2. **Join a Hive**: 
   - Navigate to "Join Hive"
   - Select a plan (Daily/Weekly/Monthly)
   - Choose contribution amount
   - Click "Find & Join Hive"
3. **Make Contributions**: Once your hive is active (needs 5 members)
4. **Check Leaderboard**: See top savers
5. **View Profile**: Check your profile details

### Create Multiple Test Users

To test the hive matching system, create at least 5 users with the same plan and contribution amount. They will automatically be grouped into a hive!

## Admin Panel Access

The admin panel is accessible at: http://localhost:5000/admin.html

**Default Admin Access:**
- You need to create a user with email: `admin@savehub.com`
- Or modify the `isAdmin` middleware in `server/routes/admin.js`

**Admin Features:**
- View platform statistics
- Manage users (verify, suspend)
- Monitor hives
- Track all transactions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/leaderboard` - Get leaderboard

### Hives
- `GET /api/hives/available` - Get available hives
- `GET /api/hives/my-hives` - Get user's hives
- `POST /api/hives/join` - Join or create hive
- `GET /api/hives/:id` - Get hive details

### Transactions
- `GET /api/transactions/my-transactions` - Get user transactions
- `POST /api/transactions/contribute` - Make contribution
- `GET /api/transactions/hive/:id` - Get hive transactions

### Gamification
- `GET /api/gamification/badges` - Get all badges
- `POST /api/gamification/award-badge` - Award badge
- `POST /api/gamification/update-level` - Update level

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/verify` - Verify user
- `PUT /api/admin/users/:id/suspend` - Suspend user
- `GET /api/admin/hives` - Get all hives
- `GET /api/admin/transactions` - Get all transactions

## Troubleshooting

### MongoDB Connection Error

**Problem:** Can't connect to MongoDB

**Solutions:**
1. Ensure MongoDB is running: `mongod`
2. Check your `MONGODB_URI` in `.env`
3. For Atlas: Whitelist your IP address in MongoDB Atlas dashboard

### Port Already in Use

**Problem:** Port 5000 is already in use

**Solution:** Change the port in `.env`:
```env
PORT=3000
```

### JWT Authentication Error

**Problem:** "Token is not valid" error

**Solution:**
1. Make sure `JWT_SECRET` is set in `.env`
2. Clear localStorage in browser: `localStorage.clear()`
3. Login again

### CORS Error

**Problem:** CORS policy blocking requests

**Solution:** The server is already configured with CORS. Ensure you're accessing from the correct origin.

## Development Tips

### Database Inspection

Use MongoDB Compass to visually inspect your database:
1. Download from: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. View SaveHub database and collections

### API Testing

Use Postman or Thunder Client to test API endpoints:
1. Set `Authorization` header: `Bearer YOUR_JWT_TOKEN`
2. Set `Content-Type` header: `application/json`

### Hot Reloading

The app uses `nodemon` for development, which automatically restarts the server when you make changes to files.

## Next Steps

### Payment Integration

To integrate real payments:

1. **Sign up for a payment gateway:**
   - Paystack (https://paystack.com/) - Popular in Africa
   - Flutterwave (https://flutterwave.com/) - Multi-currency

2. **Add credentials to `.env`:**
```env
PAYMENT_PUBLIC_KEY=pk_test_xxxxx
PAYMENT_SECRET_KEY=sk_test_xxxxx
```

3. **Update `server/routes/transactions.js`:**
   - Add payment verification logic
   - Handle webhooks for payment confirmation

### Email Notifications

To enable email notifications:

1. **Configure email service in `.env`:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

2. **Install nodemailer:**
```bash
npm install nodemailer
```

3. **Create email service in `server/services/email.js`**

### SMS Notifications

For SMS notifications (important for African markets):

1. **Sign up for SMS provider:**
   - Twilio (https://www.twilio.com/)
   - Africa's Talking (https://africastalking.com/)

2. **Add SMS reminders for contributions**

## Production Deployment

### Recommended Platforms

1. **Backend:**
   - Heroku
   - Railway
   - DigitalOcean App Platform
   - AWS Elastic Beanstalk

2. **Database:**
   - MongoDB Atlas (recommended)
   - DigitalOcean Managed MongoDB

3. **Frontend:**
   - Netlify
   - Vercel
   - GitHub Pages

### Environment Variables

Make sure to set all environment variables in your hosting platform:
- `NODE_ENV=production`
- `MONGODB_URI` (use production database)
- `JWT_SECRET` (use strong secret)
- Payment and email credentials

### Security Checklist

- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Enable MongoDB authentication
- [ ] Regular security audits

## Support

For issues or questions:
- Check the README.md file
- Review the code comments
- Open an issue on GitHub
- Contact: savehub@gmail.com

---

**Happy Building! 🚀**
