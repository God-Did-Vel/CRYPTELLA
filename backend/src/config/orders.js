/**
 * Buy-order settings. All values can be overridden in .env.
 */
const num = (name, fallback) => {
  const v = parseFloat(process.env[name]);
  return Number.isFinite(v) ? v : fallback;
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
  // Buying:  customer rate = P2P buy price + BUY_CHARGE_NGN_PER_USD, plus a flat
  //          BUY_FEE_USD per order (e.g. P2P ₦1,650 + ₦20 = ₦1,670 per $1, then $2 fee)
  // Selling: customer rate = P2P sell price − SELL_CHARGE_NGN_PER_USD
  BUY_CHARGE_NGN_PER_USD: num('BUY_CHARGE_NGN_PER_USD', 20),
  BUY_FEE_USD: num('BUY_FEE_USD', 2),
  SELL_CHARGE_NGN_PER_USD: num('SELL_CHARGE_NGN_PER_USD', 30),

  // P2P price feed: sources tried in order, refresh interval, and how old a
  // price may be before orders are paused
  P2P_SOURCES: (process.env.P2P_SOURCES || 'binance,bybit,quidax').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
  P2P_REFRESH_SECONDS: Math.max(num('P2P_REFRESH_SECONDS', 120), 30),
  P2P_MAX_AGE_MINUTES: num('P2P_MAX_AGE_MINUTES', 15),

  // How long a seller has to send the crypto and submit the transaction hash
  SELL_DEPOSIT_WINDOW_MINUTES: num('SELL_DEPOSIT_WINDOW_MINUTES', 60),

  // Receipt uploads
  RECEIPT_MAX_BYTES: 5 * 1024 * 1024,
};
