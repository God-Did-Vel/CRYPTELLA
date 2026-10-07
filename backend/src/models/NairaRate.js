const mongoose = require('mongoose');

/**
 * Naira pricing state (single document, _id 'p2p'):
 *  - the last live USDT/NGN P2P prices we fetched (so restarts reuse them)
 *  - the admin's choice of automatic (live P2P) or manual rates
 */
const nairaRateSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'p2p' },
    mode: { type: String, enum: ['auto', 'manual'], default: 'auto' },

    // Live P2P prices (naira per 1 USDT)
    live: {
      buy: Number, // price to buy USDT on P2P (advertisers selling)
      sell: Number, // price to sell USDT on P2P (advertisers buying)
      source: String, // 'binance' | 'bybit'
      sampleSize: Number,
      fetchedAt: Date,
    },
    lastError: String,
    lastErrorAt: Date,

    // Prices entered by an admin, used in manual mode
    manual: {
      buy: Number,
      sell: Number,
      updatedAt: Date,
      updatedBy: String, // admin email
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NairaRate', nairaRateSchema);
