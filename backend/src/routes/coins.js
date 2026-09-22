const express = require('express');
const { getAllCoins, getCoinById, getMarketStatus } = require('../services/coinService');

const router = express.Router();

// Served from the in-memory price cache — never calls CoinGecko directly.
const sendError = (res, err) =>
  res.status(err.status || 500).json({ success: false, message: err.status ? err.message : 'Failed to fetch coins.' });

// GET /api/coins — listed coins (config/coins.js) with live prices
router.get('/', (req, res) => {
  try {
    return res.json({ success: true, data: getAllCoins(), ...getMarketStatus() });
  } catch (err) {
    return sendError(res, err);
  }
});

// GET /api/coins/:coinId — single coin details
router.get('/:coinId', (req, res) => {
  try {
    const coin = getCoinById(req.params.coinId);
    if (!coin) {
      return res.status(404).json({ success: false, message: 'Coin not found.' });
    }
    return res.json({ success: true, data: coin, ...getMarketStatus() });
  } catch (err) {
    return sendError(res, err);
  }
});

module.exports = router;
