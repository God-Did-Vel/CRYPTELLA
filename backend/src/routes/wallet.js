const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { protect } = require('../middleware/auth');
const db = require('../models/db');

const router = express.Router();

router.use(protect);

// GET /api/wallet — get wallet balance and holdings
router.get('/', (req, res) => {
  const wallet = db.findWalletByUserId(req.user.id);
  if (!wallet) {
    return res.status(404).json({ success: false, message: 'Wallet not found.' });
  }
  return res.json({ success: true, data: wallet });
});

// POST /api/wallet/deposit — add USD to wallet (simulated)
router.post(
  '/deposit',
  [body('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive')],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { amount } = req.body;
    const wallet = db.findWalletByUserId(req.user.id);
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found.' });
    }

    const depositAmount = parseFloat(parseFloat(amount).toFixed(2));
    wallet.usdBalance = parseFloat((wallet.usdBalance + depositAmount).toFixed(2));

    const tx = {
      id: uuidv4(),
      userId: req.user.id,
      type: 'deposit',
      amount: depositAmount,
      currency: 'USD',
      status: 'completed',
      createdAt: new Date().toISOString(),
    };
    db.transactions.push(tx);

    return res.json({
      success: true,
      message: `$${depositAmount.toFixed(2)} deposited successfully.`,
      newBalance: wallet.usdBalance,
    });
  }
);

// POST /api/wallet/withdraw — withdraw USD from wallet (simulated)
router.post(
  '/withdraw',
  [body('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive')],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { amount } = req.body;
    const wallet = db.findWalletByUserId(req.user.id);
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found.' });
    }

    const withdrawAmount = parseFloat(parseFloat(amount).toFixed(2));
    if (wallet.usdBalance < withdrawAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: $${wallet.usdBalance.toFixed(2)}.`,
      });
    }

    wallet.usdBalance = parseFloat((wallet.usdBalance - withdrawAmount).toFixed(2));

    const tx = {
      id: uuidv4(),
      userId: req.user.id,
      type: 'withdraw',
      amount: withdrawAmount,
      currency: 'USD',
      status: 'completed',
      createdAt: new Date().toISOString(),
    };
    db.transactions.push(tx);

    return res.json({
      success: true,
      message: `$${withdrawAmount.toFixed(2)} withdrawn successfully.`,
      newBalance: wallet.usdBalance,
    });
  }
);

module.exports = router;
