const express = require('express');
const { protect, customerOnly } = require('../middleware/auth');
const { Order } = require('../models');
const { expireStaleOrders, customerView } = require('../services/orderService');

const router = express.Router();

router.use(protect);

// GET /api/user/me — get current user profile
router.get('/me', (req, res) => {
  return res.json({ success: true, data: req.user });
});

// GET /api/user/dashboard — recent orders and counts
router.get('/dashboard', customerOnly, async (req, res) => {
  try {
    await expireStaleOrders();
    const userId = req.user.id;
    const [recentOrders, pendingCount, completedCount] = await Promise.all([
      Order.find({ userId }).sort({ createdAt: -1 }).limit(5),
      Order.countDocuments({ userId, status: { $in: Order.PENDING_STATUSES } }),
      Order.countDocuments({ userId, status: 'completed' }),
    ]);
    return res.json({ success: true, data: { user: req.user, recentOrders: customerView(recentOrders), pendingCount, completedCount } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard data.' });
  }
});

module.exports = router;
