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

  // Dollar value in naira: the live market rate, or a fixed NGN_PER_USD if set
  NGN_PER_USD_OVERRIDE: num('NGN_PER_USD', null),

  // Our charge: naira added to every dollar. Customer rate = dollar value + charge
  // (e.g. market ₦1,323.80 + ₦60 = ₦1,383.80 per $1)
  NGN_CHARGE_PER_USD: num('NGN_CHARGE_PER_USD', 60),

  // Receipt uploads
  RECEIPT_MAX_BYTES: 5 * 1024 * 1024,
};
