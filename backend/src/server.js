require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const { seedAccounts } = require('./seed/demo');
const { startPriceFeed } = require('./services/coinService');
const { startExpiryJob } = require('./services/orderService');
const { checkPaymentConfig } = require('./services/paymentAccountService');

const authRoutes = require('./routes/auth');
const coinsRoutes = require('./routes/coins');
const ratesRoutes = require('./routes/rates');
const ordersRoutes = require('./routes/orders');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const app = express();

// Rate limiting. Price/rate endpoints are served from memory and polled by
// every open page, so they are exempt; everything else gets a generous cap.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'GET' && (req.path.startsWith('/coins') || req.path.startsWith('/rates')),
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Brute-force protection for login/signup: only failed attempts count
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many failed attempts. Please try again in a few minutes.' },
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', limiter);

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/coins', coinsRoutes);
app.use('/api/rates', ratesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Cryptella API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    checkPaymentConfig();
    await connectDB();
    await seedAccounts();
    await startPriceFeed();
    startExpiryJob();
    app.listen(PORT, () => {
      console.log(`🚀 Cryptella API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

start();

module.exports = app;
