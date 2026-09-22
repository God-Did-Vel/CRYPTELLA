const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const coinsRoutes = require('./routes/coins');
const ordersRoutes = require('./routes/orders');
const walletRoutes = require('./routes/wallet');
const userRoutes = require('./routes/user');

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
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
app.use('/api/auth', authRoutes);
app.use('/api/coins', coinsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Cryptella API is running', timestamp: new Date() });
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
app.listen(PORT, () => {
  console.log(`🚀 Cryptella API running on http://localhost:${PORT}`);
});

module.exports = app;
