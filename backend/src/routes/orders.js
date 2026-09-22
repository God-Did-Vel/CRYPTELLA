const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { protect, customerOnly } = require('../middleware/auth');
const { Order, Receipt } = require('../models');
const { getBuyQuote, PricesUnavailableError } = require('../services/coinService');
const { createPaymentAccount, PaymentSetupError } = require('../services/paymentAccountService');
const { validateDestination } = require('../config/coins');
const {
  MIN_ORDER_NGN,
  MAX_ORDER_NGN,
  PAYMENT_WINDOW_MINUTES,
  MAX_OPEN_UNPAID_ORDERS,
  RECEIPT_MAX_BYTES,
} = require('../config/orders');
const {
  generateReference,
  round,
  OrderError,
  transition,
  expireStaleOrders,
  isObjectId,
  detectReceiptType,
  sendReceipt,
  customerView,
} = require('../services/orderService');

const router = express.Router();
router.use(protect, customerOnly);

const formatNgn = (n) => `₦${Number(n).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;

const handleError = (res, err, fallback) => {
  if (err instanceof OrderError || err instanceof PricesUnavailableError || err instanceof PaymentSetupError) {
    return res.status(err.status).json({ success: false, message: err.message });
  }
  console.error(fallback, err);
  return res.status(500).json({ success: false, message: fallback });
};

// Loads one of the current user's orders, expiring it first if its window ended
const findOwnOrder = async (req) => {
  if (!isObjectId(req.params.id)) throw new OrderError('Order not found.', 404);
  await expireStaleOrders();
  const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
  if (!order) throw new OrderError('Order not found.', 404);
  return order;
};

// GET /api/orders?status=pending|completed|...&limit=50 — the user's orders, newest first
router.get('/', async (req, res) => {
  try {
    await expireStaleOrders();
    const filter = { userId: req.user.id };
    const { status } = req.query;
    if (status === 'pending') filter.status = { $in: Order.PENDING_STATUSES };
    else if (Order.STATUSES.includes(status)) filter.status = status;

    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(limit);
    return res.json({ success: true, data: customerView(orders) });
  } catch (err) {
    return handleError(res, err, 'Failed to fetch orders.');
  }
});

// POST /api/orders — create a buy order (starts as awaiting_payment)
router.post(
  '/',
  [
    body('coinId').isString().notEmpty().withMessage('Choose a coin.'),
    body('amountNgn').isFloat({ gt: 0 }).withMessage('Enter the amount in naira.').toFloat(),
    body('networkId').isString().notEmpty().withMessage('Choose a network.'),
    body('walletAddress').isString().trim().notEmpty().withMessage('Enter your wallet address.'),
    body('memo').optional({ values: 'falsy' }).isString().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: errors.array()[0].msg, errors: errors.array() });
    }

    try {
      const amountNgn = round(req.body.amountNgn, 2);
      if (amountNgn < MIN_ORDER_NGN) throw new OrderError(`The minimum order is ${formatNgn(MIN_ORDER_NGN)}.`);
      if (amountNgn > MAX_ORDER_NGN) throw new OrderError(`The maximum per order is ${formatNgn(MAX_ORDER_NGN)}.`);

      const quote = getBuyQuote(req.body.coinId);
      if (!quote) throw new OrderError('This coin is not available to buy.', 404);
      const { coin, ngnPerUsd, baseNgnPerUsd, chargePerUsd } = quote;

      let destination;
      try {
        destination = validateDestination(coin.id, req.body.networkId, req.body.walletAddress, req.body.memo);
      } catch (err) {
        throw new OrderError(err.message, 422);
      }

      await expireStaleOrders();
      const openUnpaid = await Order.countDocuments({ userId: req.user.id, status: 'awaiting_payment' });
      if (openUnpaid >= MAX_OPEN_UNPAID_ORDERS) {
        throw new OrderError(
          `You already have ${openUnpaid} unpaid orders. Pay for or cancel one before creating another.`,
          429
        );
      }

      const amountUsd = round(amountNgn / ngnPerUsd, 2);
      const cryptoAmount = round(amountNgn / ngnPerUsd / coin.price, 8);
      const chargeNgn = round((amountNgn / ngnPerUsd) * chargePerUsd, 2);
      if (cryptoAmount <= 0) throw new OrderError('Amount is too small.');

      // Retry on the (very unlikely) chance of a duplicate reference
      for (let attempt = 0; attempt < 3; attempt++) {
        const reference = generateReference();
        const paymentAccount = await createPaymentAccount({ reference, amountNgn }, req.user);
        try {
          const order = await Order.create({
            reference,
            userId: req.user.id,
            coinId: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            image: coin.image,
            network: destination.network,
            walletAddress: destination.address,
            memo: destination.memo,
            amountNgn,
            ngnPerUsd,
            baseNgnPerUsd,
            chargePerUsd,
            chargeNgn,
            amountUsd,
            priceUsd: coin.price,
            cryptoAmount,
            paymentAccount,
            expiresAt: new Date(Date.now() + PAYMENT_WINDOW_MINUTES * 60 * 1000),
            status: 'awaiting_payment',
            history: [{ status: 'awaiting_payment', note: 'Order created' }],
          });
          return res.status(201).json({ success: true, message: 'Order created. Complete your payment to continue.', data: customerView(order) });
        } catch (err) {
          if (err.code === 11000 && attempt < 2) continue;
          throw err;
        }
      }
    } catch (err) {
      return handleError(res, err, 'Could not create the order.');
    }
  }
);

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    return res.json({ success: true, data: customerView(await findOwnOrder(req)) });
  } catch (err) {
    return handleError(res, err, 'Failed to fetch the order.');
  }
});

// POST /api/orders/:id/mark-paid — "I have made payment" (stops the payment timer)
router.post('/:id/mark-paid', async (req, res) => {
  try {
    const order = await findOwnOrder(req);
    if (order.status === 'awaiting_receipt') return res.json({ success: true, data: customerView(order) });
    if (order.status === 'expired') {
      throw new OrderError('This order expired before payment was confirmed. If you already paid, contact support with your reference.');
    }
    const updated = await transition(
      { _id: order._id, expiresAt: { $gte: new Date() } },
      ['awaiting_payment'],
      'awaiting_receipt',
      'Customer marked the transfer as sent',
      { paymentMarkedAt: new Date() }
    );
    if (!updated) throw new OrderError('This order can no longer be marked as paid.', 409);
    return res.json({ success: true, message: 'Thanks! Now upload your transfer receipt.', data: customerView(updated) });
  } catch (err) {
    return handleError(res, err, 'Could not update the order.');
  }
});

// Receipt upload: kept in memory (≤5 MB) and stored in MongoDB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: RECEIPT_MAX_BYTES, files: 1, fields: 5 },
});

const receiptUpload = (req, res, next) =>
  upload.single('receipt')(req, res, (err) => {
    if (!err) return next();
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Receipt must be 5 MB or smaller.' : 'Could not read the uploaded file.';
    return res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ success: false, message });
  });

// POST /api/orders/:id/receipt — multipart: receipt (jpg/png/webp/pdf), note (optional)
router.post('/:id/receipt', receiptUpload, async (req, res) => {
  let receipt;
  try {
    const order = await findOwnOrder(req);
    if (!req.file) throw new OrderError('Attach your payment receipt.');

    const type = detectReceiptType(req.file.buffer);
    if (!type) throw new OrderError('Receipt must be a JPG, PNG, WEBP image or a PDF.');

    const note = typeof req.body.note === 'string' ? req.body.note.trim().slice(0, 500) : '';

    // Allowed: after "I have made payment", directly within the window, or replacing a receipt under review
    const allowed = ['awaiting_receipt', 'under_review'];
    if (order.status === 'awaiting_payment' && order.expiresAt >= new Date()) allowed.push('awaiting_payment');
    if (!allowed.includes(order.status)) {
      throw new OrderError(
        order.status === 'expired'
          ? 'This order expired before payment was confirmed. If you already paid, contact support with your reference.'
          : 'A receipt can no longer be submitted for this order.',
        409
      );
    }

    receipt = await Receipt.create({
      orderId: order._id,
      userId: req.user.id,
      filename: `${order.reference}-receipt.${type.ext}`,
      mimeType: type.mime,
      size: req.file.size,
      data: req.file.buffer,
    });

    const previousReceiptId = order.receipt?.id;
    const set = {
      receipt: { id: receipt._id, filename: receipt.filename, mimeType: type.mime, size: req.file.size, uploadedAt: new Date() },
      paymentMarkedAt: order.paymentMarkedAt || new Date(),
    };
    if (note) set.customerNote = note;

    const updated = await transition(
      { _id: order._id },
      allowed,
      'under_review',
      order.status === 'under_review' ? 'Receipt replaced' : 'Receipt submitted',
      set
    );
    if (!updated) throw new OrderError('This order changed while uploading. Please refresh and try again.', 409);

    if (previousReceiptId) await Receipt.deleteOne({ _id: previousReceiptId });
    return res.json({ success: true, message: "Receipt received. We'll confirm your payment and send your crypto shortly.", data: customerView(updated) });
  } catch (err) {
    if (receipt) await Receipt.deleteOne({ _id: receipt._id }).catch(() => {});
    return handleError(res, err, 'Could not upload the receipt.');
  }
});

// GET /api/orders/:id/receipt — the user's own receipt file
router.get('/:id/receipt', async (req, res) => {
  try {
    return await sendReceipt(await findOwnOrder(req), res);
  } catch (err) {
    return handleError(res, err, 'Failed to fetch the receipt.');
  }
});

// POST /api/orders/:id/cancel — only before payment is marked as sent
router.post('/:id/cancel', async (req, res) => {
  try {
    const order = await findOwnOrder(req);
    const updated = await transition({ _id: order._id }, ['awaiting_payment'], 'cancelled', 'Cancelled by customer');
    if (!updated) throw new OrderError('Only unpaid orders can be cancelled.', 409);
    return res.json({ success: true, message: 'Order cancelled.', data: customerView(updated) });
  } catch (err) {
    return handleError(res, err, 'Could not cancel the order.');
  }
});

module.exports = router;
