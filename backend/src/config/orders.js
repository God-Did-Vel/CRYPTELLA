/**
 * Buy-order settings. All values can be overridden in .env.
 */
const num = (name, fallback) => {
  const v = parseFloat(process.env[name]);
  return Number.isFinite(v) ? v : fallback;
};

// "0:2,200:2.5,300:3" → [{ fromUsd: 0, feeUsd: 2 }, …] sorted by threshold
const parseTiers = (spec) => {
  const tiers = spec.split(',').map((pair) => {
    const [fromUsd, feeUsd] = pair.split(':').map((v) => parseFloat(v));
    if (!Number.isFinite(fromUsd) || !Number.isFinite(feeUsd) || fromUsd < 0 || feeUsd < 0) {
      throw new Error(`Invalid BUY_FEE_TIERS entry "${pair}" (expected from:fee, e.g. 200:2.5)`);
    }
    return { fromUsd, feeUsd };
  });
  return tiers.sort((a, b) => a.fromUsd - b.fromUsd);
};

module.exports = {
  // Per-order limits in naira
  MIN_ORDER_NGN: num('MIN_ORDER_NGN', 5000),
  MAX_ORDER_NGN: num('MAX_ORDER_NGN', 4500000),

  // How long the customer has to transfer and click "I have made payment"
  PAYMENT_WINDOW_MINUTES: num('PAYMENT_WINDOW_MINUTES', 30),

  // Unpaid orders a customer may have open at once (limits spam)
  MAX_OPEN_UNPAID_ORDERS: num('MAX_OPEN_UNPAID_ORDERS', 3),

  // ---- Naira pricing (based on USDT/NGN P2P prices, see services/p2pService.js)
  // Buying:  customer rate = P2P buy price + BUY_CHARGE_NGN_PER_USD (e.g. ₦1,650 + ₦7 = ₦1,657 per $1),
  //          minus a fee by purchase amount (BUY_FEE_TIERS), with a BUY_MIN_USD minimum
  // Selling: customer rate = P2P sell price − SELL_CHARGE_NGN_PER_USD
  BUY_CHARGE_NGN_PER_USD: num('BUY_CHARGE_NGN_PER_USD', 7),
  BUY_MIN_USD: num('BUY_MIN_USD', 5),
  // "from:fee" pairs in USD, by the purchase amount (what the customer pays, in $):
  BUY_FEE_TIERS: parseTiers(process.env.BUY_FEE_TIERS),
  SELL_CHARGE_NGN_PER_USD: num('SELL_CHARGE_NGN_PER_USD', 30),

  // P2P price feed: sources tried in order, refresh interval, and how old a
  // price may be before orders are paused
  P2P_SOURCES: (process.env.P2P_SOURCES || 'bybit').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
  P2P_REFRESH_SECONDS: Math.max(num('P2P_REFRESH_SECONDS', 120), 30),
  P2P_MAX_AGE_MINUTES: num('P2P_MAX_AGE_MINUTES', 15),

  // How long a seller has to send the crypto and submit the transaction hash
  SELL_DEPOSIT_WINDOW_MINUTES: num('SELL_DEPOSIT_WINDOW_MINUTES', 60),

  // Receipt uploads
  RECEIPT_MAX_BYTES: 5 * 1024 * 1024,
};
