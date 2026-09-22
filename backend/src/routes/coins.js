const express = require('express');
const { getAllCoins, getCoinById } = require('../services/coinService');

const router = express.Router();

// GET /api/coins — list all supported altcoins with live prices
router.get('/', async (req, res) => {
  try {
    const coins = await getAllCoins();
    return res.json({ success: true, data: coins });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch coins.' });
  }
});

// GET /api/coins/:coinId — single coin details
router.get('/:coinId', async (req, res) => {
  try {
    const coin = await getCoinById(req.params.coinId);
    if (!coin) {
      return res.status(404).json({ success: false, message: 'Coin not found.' });
    }
    return res.json({ success: true, data: coin });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch coin.' });
  }
});

module.exports = router;
