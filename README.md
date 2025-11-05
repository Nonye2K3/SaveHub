# SaveHub - PanAfrican Social Savings Platform

SaveHub is a modern digital platform that revolutionizes traditional African savings methods like Ajoo, Akawo, Esusu, and Osusu by bringing them into the digital age with trust, automation, and social features.

## 🌟 Features

### Core Functionality
- **Digital Savings Groups (Hives)**: Create or join savings groups with verified members
- **Flexible Plans**: Daily, weekly, or monthly contribution schedules
- **Automated Matching**: Smart algorithm matches you with 4 other savers
- **Secure Contributions**: Automated payment processing and tracking
- **Transparent Payouts**: Fair, ordered distribution system

### Gamification
- **Points System**: Earn points for contributions and consistency
- **Badges & Achievements**: Unlock badges for milestones
- **Leaderboard**: Compete with savers across Africa
- **Referral Program**: Earn rewards for inviting friends
- **Level Progression**: Level up as you save more

### Social Features
- **Community Building**: Connect with savers across Africa
- **Verified Members**: Trust through identity verification
- **Group Transparency**: See all contributions in real-time
- **Profile Customization**: Showcase your savings journey

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/savehub.git
cd savehub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
- MongoDB connection string
- JWT secret key
- Payment gateway credentials (Paystack/Flutterwave)
- Email service credentials

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

6. **Access the application**
- Frontend: http://localhost:5000
- API: http://localhost:5000/api

## 📁 Project Structure

```
savehub/
├── server/
│   ├── server.js           # Express server setup
│   ├── models/             # Database models
│   │   ├── User.js         # User schema
│   │   ├── Hive.js         # Savings group schema
│   │   └── Transaction.js  # Transaction schema
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── users.js        # User management
│   │   ├── hives.js        # Hive management
│   │   ├── transactions.js # Payment processing
│   │   └── gamification.js # Points & badges
│   └── middleware/
│       └── auth.js         # JWT authentication
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Application styles
│   └── app.js              # Frontend JavaScript
├── package.json
├── .env.example
└── README.md
```

## 🎯 How SaveHub Works

### 1. Sign Up & Verify
Users create an account and verify their identity for trust and security.

### 2. Choose a Savings Plan
Select your preferred contribution frequency:
- **Daily**: Save small amounts every day
- **Weekly**: Weekly contributions
- **Monthly**: Monthly savings

### 3. Join or Create a Hive
Get automatically matched with 4 other verified savers who have the same plan.

### 4. Automated Contributions
Set up automated payments. Contributions are tracked transparently.

### 5. Receive Payouts
Members take turns receiving the pooled contributions in a fair, predetermined order.

## 💡 Traditional Methods Modernized

SaveHub digitizes these traditional African savings systems:

- **Ajoo** (Nigeria)
- **Akawo** (Nigeria)
- **Esusu** (Nigeria/West Africa)
- **Osusu** (Nigeria)
- **Chama** (Kenya/East Africa)
- **Tontine** (Cameroon/Central Africa)
- **Stokvels** (South Africa)

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: BCrypt hashing for password security
- **Identity Verification**: Document verification for trust
- **Transaction Logging**: Complete audit trail
- **Automated Processing**: Removes human error and bias

## 🎮 Gamification System

### Points
- **10 points** per contribution
- **100 points** for referrals
- **50 points** for earning badges
- **25 points** for leveling up

### Badges
- 🎯 First Step - First contribution
- ⭐ Steady Saver - 5 consecutive contributions
- 🏆 Saving Champion - 10 consecutive contributions
- 👥 Community Builder - 5 referrals
- 🎓 Hive Graduate - Complete first hive
- 💯 Century - 100 points
- 🔥 Point Master - 1000 points

### Levels
Level up every 100 points earned!

## 🌍 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/leaderboard` - Get leaderboard

### Hives (Savings Groups)
- `GET /api/hives/available` - Get available hives
- `GET /api/hives/my-hives` - Get user's hives
- `POST /api/hives/join` - Join or create hive
- `GET /api/hives/:hiveId` - Get hive details

### Transactions
- `GET /api/transactions/my-transactions` - Get user transactions
- `POST /api/transactions/contribute` - Make contribution
- `GET /api/transactions/hive/:hiveId` - Get hive transactions

### Gamification
- `GET /api/gamification/badges` - Get all badges
- `POST /api/gamification/award-badge` - Award badge to user
- `POST /api/gamification/update-level` - Update user level

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Core savings group functionality
- ✅ User authentication and profiles
- ✅ Basic gamification
- ✅ Transaction tracking

### Phase 2 (Upcoming)
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration (Paystack/Flutterwave)
- [ ] SMS notifications
- [ ] Multi-currency support
- [ ] Advanced analytics dashboard

### Phase 3 (Future)
- [ ] AI-powered savings recommendations
- [ ] Investment options
- [ ] Insurance integration
- [ ] Merchant partnerships
- [ ] Blockchain integration for transparency

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

SaveHub is built by Africans, for Africans, and for the world.

## 📧 Contact

For questions or support, reach out to us at:
- Email: savehub@gmail.com
- Website: [Coming Soon]

## 🙏 Acknowledgments

Special thanks to all the communities across Africa who have kept these traditional savings methods alive for generations. SaveHub honors this legacy by bringing it into the digital age.

---

**Built with ❤️ for Africa**
