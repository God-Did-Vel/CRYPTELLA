const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, adminOnly }     = require('../middleware/auth');
const { Order, User }            = require('../models');
const {
  OrderError, transition, expireStaleOrders, isObjectId, sendReceipt,
} = require('../services/orderService');

const router = express.Router();
router.use(protect, adminOnly);

const handleError = (res, err, fallback) => {
  if (err instanceof OrderError) return res.status(err.status).json({ success: false, message: err.message });
  console.error(fallback, err);
  return res.status(500).json({ success: false, message: fallback });
};

const validate = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return true;
  res.status(422).json({ success: false, message: errors.array()[0].msg });
  return false;
};

const findOrder = async (id) => {
  if (!isObjectId(id)) throw new OrderError('Order not found.', 404);
  const order = await Order.findById(id);
  if (!order) throw new OrderError('Order not found.', 404);
  return order;
};

// GET /api/admin/overview
router.get('/overview', async (req, res) => {
  try {
    await expireStaleOrders();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [allUsers, allOrders] = await Promise.all([
      User.find({ role: { $ne: 'admin' } }),
      Order.find({}),
    ]);

    const newUsersThisWeek = allUsers.filter((u) => u.createdAt >= weekAgo).length;

    // Per-status counts
    const orders = Object.fromEntries(Order.STATUSES.map((s) => [s, 0]));
    allOrders.forEach((o) => { if (orders[o.status] !== undefined) orders[o.status]++; });

    const completed = allOrders.filter((o) => o.status === 'completed');
    const todayStr  = new Date().toISOString().slice(0, 10);
    const completedToday = completed.filter((o) => (o.completedAt || o.updatedAt || '').slice(0, 10) === todayStr);

    const sum = (arr, key) => arr.reduce((s, o) => s + (o[key] || 0), 0);

    return res.json({
      success: true,
      data: {
        users:           allUsers.length,
        newUsersThisWeek,
        orders,
        totalOrders:     Object.values(orders).reduce((a, b) => a + b, 0),
        completed: {
          volumeNgn:  sum(completed, 'amountNgn'),
          volumeUsd:  sum(completed, 'amountUsd'),
          chargesNgn: sum(completed, 'chargeNgn'),
        },
        today: {
          completed:  completedToday.length,
          volumeNgn:  sum(completedToday, 'amountNgn'),
          chargesNgn: sum(completedToday, 'chargeNgn'),
        },
        needsReview: allOrders
          .filter((o) => o.status === 'under_review')
          .sort((a, b) => (a.updatedAt || '') < (b.updatedAt || '') ? -1 : 1)
          .slice(0, 5),
      },
    });
  } catch (err) {
    return handleError(res, err, 'Failed to fetch the overview.');
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    await expireStaleOrders();
    let users = await User.find({ role: { $ne: 'admin' } });
    const { q } = req.query;
    if (q && String(q).trim()) {
      const lq = String(q).trim().toLowerCase();
      users = users.filter((u) =>
        (u.email || '').toLowerCase().includes(lq) ||
        (u.firstName || '').toLowerCase().includes(lq) ||
        (u.lastName || '').toLowerCase().includes(lq)
      );
    }

    const limit = 25;
    const page  = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const total = users.length;
    const data  = users.slice((page - 1) * limit, page * limit);

    return res.json({ success: true, data, page, pages: Math.max(Math.ceil(total / limit), 1), total });
  } catch (err) {
    return handleError(res, err, 'Failed to fetch users.');
  }
});

// GET /api/admin/users/:id
router.get('/users/:id', async (req, res) => {
  try {
    if (!isObjectId(req.params.id)) throw new OrderError('User not found.', 404);
    const user = await User.findById(req.params.id);
    if (!user) throw new OrderError('User not found.', 404);
    const orders = await Order.find({ userId: req.params.id }).sort({ createdAt: -1 }).limit(200);
    return res.json({ success: true, data: { user, orders } });
  } catch (err) {
    return handleError(res, err, 'Failed to fetch the user.');
  }
});

// GET /api/admin/orders/stats
router.get('/orders/stats', async (req, res) => {
  try {
    await expireStaleOrders();
    const allOrders = await Order.find({});
    const counts = Object.fromEntries(Order.STATUSES.map((s) => [s, 0]));
    allOrders.forEach((o) => { if (counts[o.status] !== undefined) counts[o.status]++; });
    return res.json({ success: true, data: counts });
  } catch (err) {
    return handleError(res, err, 'Failed to fetch stats.');
  }
});

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    await expireStaleOrders();
    let allOrders = await Order.find({});

    const { status, q } = req.query;
    if (status === 'pending')                  allOrders = allOrders.filter((o) => Order.PENDING_STATUSES.includes(o.status));
    else if (Order.STATUSES.includes(status))  allOrders = allOrders.filter((o) => o.status === status);
    if (req.query.user)                        allOrders = allOrders.filter((o) => o.userId === req.query.user);

    if (q && String(q).trim()) {
      const lq = String(q).trim().toLowerCase();
      allOrders = allOrders.filter((o) =>
        (o.reference || '').toLowerCase().includes(lq) ||
        (o.walletAddress || '').toLowerCase().includes(lq) ||
        (o.txHash || '').toLowerCase().includes(lq)
      );
    }

    // Review queues: oldest first; everything else: newest first
    const reviewMode = status === 'under_review' || status === 'pending';
    allOrders.sort((a, b) => {
      const av = a[reviewMode ? 'updatedAt' : 'createdAt'] || '';
      const bv = b[reviewMode ? 'updatedAt' : 'createdAt'] || '';
      return reviewMode ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1);
    });

    const limit = 25;
    const page  = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const total = allOrders.length;
    const data  = allOrders.slice((page - 1) * limit, page * limit);

    return res.json({ success: true, data, page, pages: Math.max(Math.ceil(total / limit), 1), total });
  } catch (err) {
    return handleError(res, err, 'Failed to fetch orders.');
  }
});

// GET /api/admin/orders/:id
router.get('/orders/:id', async (req, res) => {
  try {
    return res.json({ success: true, data: await findOrder(req.params.id) });
  } catch (err) {
    return handleError(res, err, 'Failed to fetch the order.');
  }
});

// GET /api/admin/orders/:id/receipt
router.get('/orders/:id/receipt', async (req, res) => {
  try {
    return await sendReceipt(await findOrder(req.params.id), res);
  } catch (err) {
    return handleError(res, err, 'Failed to fetch the receipt.');
  }
});

// POST /api/admin/orders/:id/complete
router.post(
  '/orders/:id/complete',
  [body('txHash').isString().trim().isLength({ min: 8, max: 200 }).withMessage('Enter the blockchain transaction hash.')],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const order   = await findOrder(req.params.id);
      const updated = await transition(
        { id: order.id },
        Order.PENDING_STATUSES,
        'completed',
        `Payment confirmed and ${order.cryptoAmount} ${order.symbol} sent`,
        { txHash: req.body.txHash, reviewedBy: req.user.id, completedAt: new Date().toISOString() }
      );
      if (!updated) throw new OrderError(`This order is already ${(order.status || '').replace(/_/g, ' ')}.`, 409);
      return res.json({ success: true, message: `Order ${order.reference} completed.`, data: updated });
    } catch (err) {
      return handleError(res, err, 'Could not complete the order.');
    }
  }
);

// POST /api/admin/orders/:id/reject
router.post(
  '/orders/:id/reject',
  [body('reason').isString().trim().isLength({ min: 3, max: 500 }).withMessage('Give the customer a reason.')],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const order   = await findOrder(req.params.id);
      const updated = await transition(
        { id: order.id },
        Order.PENDING_STATUSES,
        'rejected',
        req.body.reason,
        { rejectionReason: req.body.reason, reviewedBy: req.user.id }
      );
      if (!updated) throw new OrderError(`This order is already ${(order.status || '').replace(/_/g, ' ')}.`, 409);
      return res.json({ success: true, message: `Order ${order.reference} rejected.`, data: updated });
    } catch (err) {
      return handleError(res, err, 'Could not reject the order.');
    }
  }
);

module.exports = router;
