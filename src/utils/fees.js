// Buy fee by purchase amount — mirrors backend/src/services/feeService.js.
// The purchase amount is what the customer pays in dollars (at our buy rate);
// the fee comes off it and the rest is the crypto they receive.
// tiers: [{ fromUsd, feeUsd }] sorted by fromUsd, from GET /api/rates

export const buyFeeFor = (paidUsd, tiers) => {
  if (!tiers?.length) return 0
  let fee = tiers[0].feeUsd
  for (const t of tiers) if (paidUsd >= t.fromUsd) fee = t.feeUsd
  return fee
}

// Purchase amount needed so that, after its fee, `valueUsd` of crypto is left
export const paidForValue = (valueUsd, tiers) => {
  if (!tiers?.length) return valueUsd
  for (const t of tiers) {
    const paid = valueUsd + t.feeUsd
    if (buyFeeFor(paid, tiers) === t.feeUsd) return paid
  }
  return valueUsd + tiers[tiers.length - 1].feeUsd
}

// "$2 under $200 · $2.50 for $200–$299.99 · $3 from $300"
export const describeFeeTiers = (tiers, fmt) =>
  (tiers || []).map((t, i) => {
    const next = tiers[i + 1]
    if (i === 0) return next ? `${fmt(t.feeUsd)} under ${fmt(next.fromUsd)}` : `${fmt(t.feeUsd)}`
    return next ? `${fmt(t.feeUsd)} for ${fmt(t.fromUsd)}–${fmt(next.fromUsd - 0.01)}` : `${fmt(t.feeUsd)} from ${fmt(t.fromUsd)}`
  }).join(' · ')
