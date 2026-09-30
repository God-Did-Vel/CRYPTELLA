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
        users:           allUsers.length,
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

    const allOrders = await Order.find({});
    const pending = Order.PENDING_STATUSES;
    const enrichedUsers = users.map((u) => {
      const uId = u.id || u._id;
      const userOrders = allOrders.filter((o) => o.userId === uId);
      const completedOrders = userOrders.filter((o) => o.status === 'completed');
      const spentNgn = completedOrders.filter((o) => o.type !== 'sell').reduce((s, o) => s + (o.amountNgn || 0), 0);
      const receivedNgn = completedOrders.filter((o) => o.type === 'sell').reduce((s, o) => s + (o.amountNgn || 0), 0);
      const lastOrderAt = userOrders.reduce((latest, o) => (!latest || (o.createdAt || '') > latest ? o.createdAt : latest), null);
      return {
        ...u,
        stats: {
          total: userOrders.length,
          pending: userOrders.filter((o) => pending.includes(o.status)).length,
          completed: completedOrders.length,
          spentNgn,
          receivedNgn,
          lastOrderAt,
        },
      };
    });

    const sortKey = req.query.sort || 'recent';
    if (sortKey === 'orders') enrichedUsers.sort((a, b) => b.stats.total - a.stats.total);
    else if (sortKey === 'spent') enrichedUsers.sort((a, b) => b.stats.spentNgn - a.stats.spentNgn);
    else if (sortKey === 'sold') enrichedUsers.sort((a, b) => b.stats.receivedNgn - a.stats.receivedNgn);
    else if (sortKey === 'active') enrichedUsers.sort((a, b) => (b.stats.lastOrderAt || '').localeCompare(a.stats.lastOrderAt || ''));
    else enrichedUsers.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

    const limit = 25;
    const page  = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const total = enrichedUsers.length;
    const data  = enrichedUsers.slice((page - 1) * limit, page * limit);

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
    if (['buy', 'sell'].includes(req.query.type)) allOrders = allOrders.filter((o) => (o.type || 'buy') === req.query.type);

    if (q && String(q).trim()) {
      const lq = String(q).trim().toLowerCase();
      allOrders = allOrders.filter((o) =>
        (o.reference || '').toLowerCase().includes(lq) ||
        (o.walletAddress || '').toLowerCase().includes(lq) ||
        (o.txHash || '').toLowerCase().includes(lq) ||
        (o.depositTxHash || '').toLowerCase().includes(lq) ||
        (o.payoutReference || '').toLowerCase().includes(lq) ||
        (o.payoutAccount?.accountNumber || '').toLowerCase().includes(lq) ||
        (o.payoutAccount?.accountName || '').toLowerCase().includes(lq)
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
// Buy: { txHash } of the crypto we sent. Sell: { payoutReference } of the naira transfer we made.
router.post('/orders/:id/complete', async (req, res) => {
  try {
    const order = await findOrder(req.params.id);
    const isSell = order.type === 'sell';
    const proof = String((isSell ? req.body.payoutReference : req.body.txHash) || '').trim();
    if (isSell ? proof.length < 4 || proof.length > 100 : proof.length < 8 || proof.length > 200) {
      throw new OrderError(isSell ? 'Enter the bank transfer reference for the payout.' : 'Enter the blockchain transaction hash.', 422);
    }
    const updated = await transition(
      { id: order.id },
      Order.PENDING_STATUSES,
      'completed',
      isSell
        ? `Deposit confirmed and ₦${Number(order.amountNgn).toLocaleString('en-NG')} paid to ${order.payoutAccount?.bankName || 'bank'}`
        : `Payment confirmed and ${order.cryptoAmount} ${order.symbol} sent`,
      { ...(isSell ? { payoutReference: proof } : { txHash: proof }), reviewedBy: req.user.id, completedAt: new Date().toISOString() }
    );
    if (!updated) throw new OrderError(`This order is already ${(order.status || '').replace(/_/g, ' ')}.`, 409);
    return res.json({ success: true, message: `Order ${order.reference} completed.`, data: updated });
  } catch (err) {
    return handleError(res, err, 'Could not complete the order.');
  }
});

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
