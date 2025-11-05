# SaveHub Deployment Guide

This guide covers deploying SaveHub to production environments.

## Deployment Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production` in environment variables
- [ ] Use strong, unique `JWT_SECRET`
- [ ] Configure production MongoDB (MongoDB Atlas recommended)
- [ ] Set up payment gateway credentials
- [ ] Configure email service
- [ ] Enable HTTPS/SSL
- [ ] Set up domain name
- [ ] Configure CORS for production URLs
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all features thoroughly

## Option 1: Deploy to Heroku

### Prerequisites
- Heroku account (free tier available)
- Heroku CLI installed

### Steps

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
heroku create savehub-app
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_secret
heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
heroku config:set PAYMENT_PUBLIC_KEY=your_key
heroku config:set PAYMENT_SECRET_KEY=your_secret
```

5. **Add MongoDB Atlas**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a cluster (free tier available)
- Get connection string
- Whitelist all IPs (0.0.0.0/0) for Heroku

6. **Deploy**
```bash
git push heroku main
```

7. **Open App**
```bash
heroku open
```

### Heroku-Specific Files

Create `Procfile` in root:
```
web: node server/server.js
```

## Option 2: Deploy to Railway

### Steps

1. **Visit Railway**
- Go to https://railway.app/
- Sign up with GitHub

2. **New Project**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your SaveHub repository

3. **Configure Environment Variables**
Add all variables from `.env.example`:
- `NODE_ENV=production`
- `JWT_SECRET`
- `MONGODB_URI`
- Payment credentials
- Email credentials

4. **Deploy**
- Railway automatically deploys on git push
- Get your deployed URL

## Option 3: Deploy to DigitalOcean

### Using DigitalOcean App Platform

1. **Create App**
- Go to https://cloud.digitalocean.com/apps
- Click "Create App"
- Connect to GitHub repository

2. **Configure**
- Choose branch: `main`
- Build command: `npm install`
- Run command: `npm start`

3. **Environment Variables**
Add all environment variables

4. **Database**
- Create DigitalOcean Managed MongoDB
- Or use MongoDB Atlas

5. **Deploy**
- Click "Deploy"
- App will be live at provided URL

## Option 4: Deploy to AWS (EC2)

### Steps

1. **Launch EC2 Instance**
- Ubuntu Server 20.04 LTS
- t2.micro for testing (free tier)

2. **Connect to Instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install MongoDB** (or use Atlas)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

5. **Clone Repository**
```bash
git clone https://github.com/your-username/savehub.git
cd savehub
```

6. **Install Dependencies**
```bash
npm install
```

7. **Create .env File**
```bash
nano .env
# Add your production environment variables
```

8. **Install PM2 (Process Manager)**
```bash
sudo npm install -g pm2
```

9. **Start Application**
```bash
pm2 start server/server.js --name savehub
pm2 save
pm2 startup
```

10. **Configure Nginx (Reverse Proxy)**
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/savehub
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/savehub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

11. **Set Up SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## MongoDB Atlas Setup

### For Production Database

1. **Create Atlas Account**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create organization and project

2. **Create Cluster**
- Choose provider (AWS/GCP/Azure)
- Select region closest to your users
- Choose tier (M0 Free for testing)

3. **Configure Security**
- Database Access: Create user with password
- Network Access: Whitelist IPs or 0.0.0.0/0 for cloud platforms

4. **Get Connection String**
```
mongodb+srv://username:password@cluster.mongodb.net/savehub?retryWrites=true&w=majority
```

5. **Add to Environment Variables**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/savehub
```

## Payment Gateway Integration

### Paystack Setup

1. **Sign Up**
- Visit https://paystack.com/
- Create account

2. **Get API Keys**
- Dashboard → Settings → API Keys & Webhooks
- Copy Public Key and Secret Key

3. **Add to Environment**
```bash
PAYMENT_PUBLIC_KEY=pk_live_xxxxx
PAYMENT_SECRET_KEY=sk_live_xxxxx
```

4. **Update Code**
In `server/routes/transactions.js`, integrate Paystack:

```javascript
const axios = require('axios');

// Initialize payment
async function initializePayment(email, amount) {
  const response = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    {
      email,
      amount: amount * 100, // Convert to kobo
      currency: 'NGN'
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYMENT_SECRET_KEY}`
      }
    }
  );
  return response.data;
}

// Verify payment
async function verifyPayment(reference) {
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYMENT_SECRET_KEY}`
      }
    }
  );
  return response.data;
}
```

### Flutterwave Setup

Similar process:
1. Sign up at https://flutterwave.com/
2. Get API keys
3. Integrate using their SDK

## Domain Configuration

### Add Custom Domain

1. **Purchase Domain**
- Namecheap, GoDaddy, or Google Domains

2. **Configure DNS**
For Heroku:
```
Type: CNAME
Name: www
Value: your-app.herokuapp.com
```

For custom server:
```
Type: A
Name: @
Value: your-server-ip
```

3. **Update Environment**
```bash
FRONTEND_URL=https://your-domain.com
```

## Monitoring and Logging

### Set Up Monitoring

1. **Heroku**
- Use Heroku Metrics (built-in)
- Add Papertrail for logs

2. **Custom Server**
- Install monitoring tools:
```bash
# PM2 monitoring
pm2 install pm2-logrotate

# Server monitoring
sudo apt-get install htop
```

### Error Tracking

Use Sentry for error tracking:

```bash
npm install @sentry/node
```

In `server/server.js`:
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

## Backup Strategy

### Database Backups

1. **MongoDB Atlas**
- Automatic backups enabled by default
- Configure backup schedule in dashboard

2. **Custom MongoDB**
```bash
# Daily backup cron job
0 2 * * * mongodump --uri="mongodb://localhost:27017/savehub" --out=/backups/$(date +\%Y\%m\%d)
```

### Code Backups

- Use Git and GitHub
- Tag releases: `git tag v1.0.0`
- Push tags: `git push --tags`

## Performance Optimization

### Enable Compression

In `server/server.js`:
```javascript
const compression = require('compression');
app.use(compression());
```

### Add Caching

Install Redis:
```bash
npm install redis
```

### Database Indexing

Add indexes to MongoDB collections for better performance.

## Security Best Practices

### Rate Limiting

```bash
npm install express-rate-limit
```

In `server/server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Helmet for Security Headers

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### Input Sanitization

Already included with `express-validator`

## Post-Deployment Testing

Test all features:
- [ ] User registration and login
- [ ] Joining hives
- [ ] Making contributions
- [ ] Viewing transactions
- [ ] Leaderboard
- [ ] Admin panel
- [ ] Email notifications
- [ ] Payment processing

## Maintenance

### Regular Tasks

- Monitor logs daily
- Check database performance weekly
- Update dependencies monthly
- Security audits quarterly
- Backup verification monthly

### Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit
npm audit fix
```

---

**Your SaveHub app is now live! 🎉**
