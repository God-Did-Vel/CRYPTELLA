const express = require('express');
const { getFxStatus } = require('../services/coinService');
const { MIN_ORDER_NGN, MAX_ORDER_NGN, PAYMENT_WINDOW_MINUTES, SELL_DEPOSIT_WINDOW_MINUTES } = require('../config/orders');

const router = express.Router();

// GET /api/rates — naira rate and order limits for the buy form
router.get('/', (req, res) => {
  // Customers only see our buy and sell rates (our per-dollar charges are already in them)
  const { sellNgnPerUsd, ...fx } = getFxStatus();
  const toUsd = (ngn) => (fx.ngnPerUsd ? parseFloat((ngn / fx.ngnPerUsd).toFixed(2)) : null);
  return res.json({
    success: true,
    data: {
      ...fx,
      // Buying: minimum purchase in dollars, and what that costs in naira at our rate
      minOrderUsd: fx.buyMinUsd,
      minOrderNgn: fx.ngnPerUsd ? Math.ceil(fx.buyMinUsd * fx.ngnPerUsd) : null,
      maxOrderNgn: MAX_ORDER_NGN,
      maxOrderUsd: toUsd(MAX_ORDER_NGN),
      buyFeeTiers: fx.buyFeeTiers,
      paymentWindowMinutes: PAYMENT_WINDOW_MINUTES,
      sell: {
        ngnPerUsd: sellNgnPerUsd,
        minPayoutNgn: MIN_ORDER_NGN,
        maxPayoutNgn: MAX_ORDER_NGN,
        depositWindowMinutes: SELL_DEPOSIT_WINDOW_MINUTES,
      },
    },
  });
});

module.exports = router;
