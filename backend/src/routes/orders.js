const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { protect } = require('../middleware/auth');
const db = require('../models/db');
const { getCoinById } = require('../services/coinService');

const router = express.Router();

// All order routes require authentication
router.use(protect);

// GET /api/orders — get user's order history
router.get('/', (req, res) => {
  const userOrders = db.orders
    .filter((o) => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.json({ success: true, data: userOrders });
});

// POST /api/orders/buy — buy a coin
router.post(
  '/buy',
  [
    body('coinId').notEmpty().withMessage('Coin ID is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { coinId, amount } = req.body;

    try {
      const coin = await getCoinById(coinId);
      if (!coin) {
        return res.status(404).json({ success: false, message: 'Coin not found.' });
      }

      const wallet = db.findWalletByUserId(req.user.id);
      if (!wallet) {
        return res.status(404).json({ success: false, message: 'Wallet not found.' });
      }

      const totalCost = parseFloat((coin.price * amount).toFixed(2));

      if (wallet.usdBalance < totalCost) {
        return res.status(400).json({
          success: false,
          message: `Insufficient balance. You need $${totalCost.toFixed(2)} but have $${wallet.usdBalance.toFixed(2)}.`,
        });
      }

      // Deduct USD and add coin
      wallet.usdBalance = parseFloat((wallet.usdBalance - totalCost).toFixed(2));
      wallet.holdings[coin.symbol] = parseFloat(
        ((wallet.holdings[coin.symbol] || 0) + parseFloat(amount)).toFixed(8)
      );

      const order = {
        id: uuidv4(),
        userId: req.user.id,
        coinId,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        type: 'buy',
        amount: parseFloat(amount),
        price: coin.price,
        total: totalCost,
        status: 'completed',
        createdAt: new Date().toISOString(),
      };

      db.orders.push(order);

      return res.status(201).json({
        success: true,
        message: `Successfully bought ${amount} ${coin.symbol} for $${totalCost.toFixed(2)}.`,
        data: order,
        newBalance: wallet.usdBalance,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Order failed.' });
    }
  }
);

// POST /api/orders/sell — sell a coin
router.post(
  '/sell',
  [
    body('coinId').notEmpty().withMessage('Coin ID is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { coinId, amount } = req.body;

    try {
      const coin = await getCoinById(coinId);
      if (!coin) {
        return res.status(404).json({ success: false, message: 'Coin not found.' });
      }

      const wallet = db.findWalletByUserId(req.user.id);
      if (!wallet) {
        return res.status(404).json({ success: false, message: 'Wallet not found.' });
      }

      const currentHolding = wallet.holdings[coin.symbol] || 0;
      if (currentHolding < parseFloat(amount)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient ${coin.symbol}. You have ${currentHolding} but tried to sell ${amount}.`,
        });
      }

      const totalReceived = parseFloat((coin.price * amount).toFixed(2));

      // Deduct coin and add USD
      wallet.holdings[coin.symbol] = parseFloat((currentHolding - parseFloat(amount)).toFixed(8));
      wallet.usdBalance = parseFloat((wallet.usdBalance + totalReceived).toFixed(2));

      const order = {
        id: uuidv4(),
        userId: req.user.id,
        coinId,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        type: 'sell',
        amount: parseFloat(amount),
        price: coin.price,
        total: totalReceived,
        status: 'completed',
        createdAt: new Date().toISOString(),
      };

      db.orders.push(order);

      return res.status(201).json({
        success: true,
        message: `Successfully sold ${amount} ${coin.symbol} for $${totalReceived.toFixed(2)}.`,
        data: order,
        newBalance: wallet.usdBalance,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Order failed.' });
    }
  }
);

module.exports = router;
