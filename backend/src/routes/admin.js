const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, adminOnly } = require('../middleware/auth');
const { Order, User } = require('../models');
const { OrderError, transition, expireStaleOrders, isObjectId, sendReceipt } = require('../services/orderService');

const router = express.Router();
router.use(protect, adminOnly);

const handleError = (res, err, fallback) => {
  if (err instanceof OrderError) return res.status(err.status).json({ success: false, message: err.message });
  console.error(fallback, err);
  return res.status(500).json({ success: false, message: fallback });
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const findOrder = async (id) => {
  if (!isObjectId(id)) throw new OrderError('Order not found.', 404);
  const order = await Order.findById(id).populate('userId', 'firstName lastName email');
  if (!order) throw new OrderError('Order not found.', 404);
  return order;
};

const validate = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return true;
  res.status(422).json({ success: false, message: errors.array()[0].msg });
  return false;
};

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// GET /api/admin/overview — headline numbers for the admin dashboard
router.get('/overview', async (req, res) => {
  try {
    await expireStaleOrders();
    const today = startOfToday();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [users, newUsersThisWeek, statusRows, completedTotals, completedToday, needsReview] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ role: { $ne: 'admin' }, createdAt: { $gte: weekAgo } }),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, volumeNgn: { $sum: '$amountNgn' }, volumeUsd: { $sum: '$amountUsd' }, chargesNgn: { $sum: { $ifNull: ['$chargeNgn', 0] } } } },
      ]),
      Order.aggregate([
        { $match: { status: 'completed', completedAt: { $gte: today } } },
        { $group: { _id: null, count: { $sum: 1 }, volumeNgn: { $sum: '$amountNgn' }, chargesNgn: { $sum: { $ifNull: ['$chargeNgn', 0] } } } },
      ]),
      Order.find({ status: 'under_review' }).sort({ updatedAt: 1 }).limit(5).populate('userId', 'firstName lastName email'),
    ]);

    const orders = Object.fromEntries(Order.STATUSES.map((s) => [s, 0]));
    statusRows.forEach((r) => {
      orders[r._id] = r.count;
    });
    const all = completedTotals[0] || {};
    const day = completedToday[0] || {};

    return res.json({
      success: true,
      data: {
        users,
        newUsersThisWeek,
        orders,
        totalOrders: Object.values(orders).reduce((a, b) => a + b, 0),
        completed: { volumeNgn: all.volumeNgn || 0, volumeUsd: all.volumeUsd || 0, chargesNgn: all.chargesNgn || 0 },
        today: { completed: day.count || 0, volumeNgn: day.volumeNgn || 0, chargesNgn: day.chargesNgn || 0 },
        needsReview,
      },
    });
  } catch (err) {
    return handleError(res, err, 'Failed to fetch the overview.');
  }
});

// GET /api/admin/users?q=&sort=recent|orders|spent&page= — customers with their order counts
router.get('/users', async (req, res) => {
  try {
    await expireStaleOrders();
    const match = { role: { $ne: 'admin' } };
    const { q } = req.query;
    if (q && String(q).trim()) {
      const rx = new RegExp(escapeRegex(String(q).trim()), 'i');
      match.$or = [{ email: rx }, { firstName: rx }, { lastName: rx }];
    }

    const sorts = {
      recent: { createdAt: -1 },
      orders: { 'stats.total': -1, createdAt: -1 },
      spent: { 'stats.spentNgn': -1, createdAt: -1 },
      active: { 'stats.lastOrderAt': -1, createdAt: -1 },
    };
    const sort = sorts[req.query.sort] || sorts.recent;
    const limit = 25;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const pending = Order.PENDING_STATUSES;
    const [rows, total] = await Promise.all([
      User.aggregate([
        { $match: match },
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'userId',
            as: 'orders',
            pipeline: [{ $project: { status: 1, amountNgn: 1, createdAt: 1 } }],
          },
        },
        {
          $addFields: {
            stats: {
              total: { $size: '$orders' },
              pending: { $size: { $filter: { input: '$orders', cond: { $in: ['$$this.status', pending] } } } },
              completed: { $size: { $filter: { input: '$orders', cond: { $eq: ['$$this.status', 'completed'] } } } },
              spentNgn: {
                $sum: { $map: { input: { $filter: { input: '$orders', cond: { $eq: ['$$this.status', 'completed'] } } }, in: '$$this.amountNgn' } },
              },
              lastOrderAt: { $max: '$orders.createdAt' },
            },
          },
        },
        { $project: { orders: 0, password: 0, __v: 0 } },
        { $sort: sort },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ]),
      User.countDocuments(match),
    ]);

    const data = rows.map(({ _id, ...u }) => ({ id: _id.toString(), ...u }));
    return res.json({ success: true, data, page, pages: Math.max(Math.ceil(total / limit), 1), total });
  } catch (err) {
    return handleError(res, err, 'Failed to fetch users.');
  }
});

// GET /api/admin/users/:id — one customer and all their orders
router.get('/users/:id', async (req, res) => {
  try {
    if (!isObjectId(req.params.id)) throw new OrderError('User not found.', 404);
    const user = await User.findById(req.params.id);
    if (!user) throw new OrderError('User not found.', 404);
    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, data: { user, orders } });
  } catch (err) {
    return handleError(res, err, 'Failed to fetch the user.');
  }
});

// GET /api/admin/orders/stats — order counts per status
router.get('/orders/stats', async (req, res) => {
  try {
    await expireStaleOrders();
    const rows = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
    const counts = Object.fromEntries(Order.STATUSES.map((s) => [s, 0]));
    rows.forEach((r) => {
      counts[r._id] = r.count;
    });
    return res.json({ success: true, data: counts });
  } catch (err) {
    return handleError(res, err, 'Failed to fetch stats.');
  }
});

// GET /api/admin/orders?status=under_review&q=search&page=1
router.get('/orders', async (req, res) => {
  try {
    await expireStaleOrders();
    const filter = {};
    const { status, q } = req.query;
    if (status === 'pending') filter.status = { $in: Order.PENDING_STATUSES };
    else if (Order.STATUSES.includes(status)) filter.status = status;
    if (req.query.user && isObjectId(req.query.user)) filter.userId = req.query.user;

    if (q && String(q).trim()) {
      const rx = new RegExp(escapeRegex(String(q).trim()), 'i');
      const users = await User.find({ $or: [{ email: rx }, { firstName: rx }, { lastName: rx }] })
        .select('_id')
        .limit(200);
      filter.$or = [{ reference: rx }, { walletAddress: rx }, { txHash: rx }, { userId: { $in: users.map((u) => u._id) } }];
    }

    const limit = 25;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    // Review queues are oldest first (first come, first served); everything else newest first
    const sort = status === 'under_review' || status === 'pending' ? { updatedAt: 1 } : { createdAt: -1 };
    const [orders, total] = await Promise.all([
      Order.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).populate('userId', 'firstName lastName email'),
      Order.countDocuments(filter),
    ]);
    return res.json({ success: true, data: orders, page, pages: Math.max(Math.ceil(total / limit), 1), total });
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

// POST /api/admin/orders/:id/complete { txHash } — naira received and crypto sent
router.post(
  '/orders/:id/complete',
  [body('txHash').isString().trim().isLength({ min: 8, max: 200 }).withMessage('Enter the blockchain transaction hash.')],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const order = await findOrder(req.params.id);
      const updated = await transition(
        { _id: order._id },
        Order.PENDING_STATUSES,
        'completed',
        `Payment confirmed and ${order.cryptoAmount} ${order.symbol} sent`,
        { txHash: req.body.txHash, reviewedBy: req.user.id, completedAt: new Date() }
      );
      if (!updated) throw new OrderError(`This order is already ${order.status.replace(/_/g, ' ')}.`, 409);
      return res.json({ success: true, message: `Order ${order.reference} completed.`, data: updated });
    } catch (err) {
      return handleError(res, err, 'Could not complete the order.');
    }
  }
);

// POST /api/admin/orders/:id/reject { reason }
router.post(
  '/orders/:id/reject',
  [body('reason').isString().trim().isLength({ min: 3, max: 500 }).withMessage('Give the customer a reason.')],
  async (req, res) => {
    if (!validate(req, res)) return;
    try {
      const order = await findOrder(req.params.id);
      const updated = await transition({ _id: order._id }, Order.PENDING_STATUSES, 'rejected', req.body.reason, {
        rejectionReason: req.body.reason,
        reviewedBy: req.user.id,
      });
      if (!updated) throw new OrderError(`This order is already ${order.status.replace(/_/g, ' ')}.`, 409);
      return res.json({ success: true, message: `Order ${order.reference} rejected.`, data: updated });
    } catch (err) {
      return handleError(res, err, 'Could not reject the order.');
    }
  }
);

module.exports = router;
