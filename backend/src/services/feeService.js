/**
 * Buy fee by purchase amount (BUY_FEE_TIERS), in USD.
 *
 * The purchase amount is what the customer pays, in dollars at our buy rate.
 * The fee is taken from it, and the rest is the crypto they receive:
 *   pay $150 → fee $2   → $148 of crypto
 *   pay $250 → fee $2.5 → $247.50 of crypto
 *   pay $500 → fee $3   → $497 of crypto
 * The BUY_MIN_USD minimum applies to that same amount.
 *
 * The frontend mirrors this logic in src/utils/fees.js — keep them in sync.
 */
const { BUY_FEE_TIERS } = require('../config/orders');

/** Fee for a purchase of `paidUsd`. */
const buyFeeFor = (paidUsd, tiers = BUY_FEE_TIERS) => {
  let fee = tiers[0].feeUsd;
  for (const t of tiers) if (paidUsd >= t.fromUsd) fee = t.feeUsd;
  return fee;
};

/** Split a purchase amount into crypto value + fee. */
const splitPaidUsd = (paidUsd, tiers = BUY_FEE_TIERS) => {
  const feeUsd = buyFeeFor(paidUsd, tiers);
  return { valueUsd: paidUsd - feeUsd, feeUsd };
};

module.exports = { buyFeeFor, splitPaidUsd, BUY_FEE_TIERS };
