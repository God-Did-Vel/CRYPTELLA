const mongoose = require('mongoose');

/**
 * Last known market data from CoinGecko. Persisted so server restarts
 * (e.g. nodemon reloads) reuse it instead of calling CoinGecko again.
 */
const marketSnapshotSchema = new mongoose.Schema({
  _id: { type: String, default: 'coingecko' },
  coins: { type: [mongoose.Schema.Types.Mixed], default: [] },
  fetchedAt: Date,
  ngnPerUsd: Number,
  fxFetchedAt: Date,
  blockedUntil: Date, // set when CoinGecko rate-limits us
});

module.exports = mongoose.model('MarketSnapshot', marketSnapshotSchema);
