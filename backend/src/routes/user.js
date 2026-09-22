const express = require('express');
const { protect } = require('../middleware/auth');
const db = require('../models/db');

const router = express.Router();

router.use(protect);

// GET /api/user/me — get current user profile
router.get('/me', (req, res) => {
  return res.json({ success: true, data: req.user });
});

// GET /api/user/dashboard — get dashboard summary
router.get('/dashboard', async (req, res) => {
  try {
    const wallet = db.findWalletByUserId(req.user.id);
    const orders = db.orders
      .filter((o) => o.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5); // last 5 orders

    return res.json({
      success: true,
      data: {
        user: req.user,
        wallet,
        recentOrders: orders,
        totalOrders: db.orders.filter((o) => o.userId === req.user.id).length,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard data.' });
  }
});

module.exports = router;
