const express = require('express');
const { getFxStatus } = require('../services/coinService');
const { MIN_ORDER_NGN, MAX_ORDER_NGN, PAYMENT_WINDOW_MINUTES } = require('../config/orders');

const router = express.Router();

// GET /api/rates — naira rate and order limits for the buy form
router.get('/', (req, res) => {
  // Customers only see the rate they pay (our charge is already in it)
  const { baseNgnPerUsd, chargePerUsd, ...fx } = getFxStatus();
  const toUsd = (ngn) => (fx.ngnPerUsd ? parseFloat((ngn / fx.ngnPerUsd).toFixed(2)) : null);
  return res.json({
    success: true,
    data: {
      ...fx,
      minOrderNgn: MIN_ORDER_NGN,
      maxOrderNgn: MAX_ORDER_NGN,
      minOrderUsd: toUsd(MIN_ORDER_NGN),
      maxOrderUsd: toUsd(MAX_ORDER_NGN),
      paymentWindowMinutes: PAYMENT_WINDOW_MINUTES,
    },
  });
});

module.exports = router;
