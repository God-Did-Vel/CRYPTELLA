const mongoose = require('mongoose');
const toJSON = require('./toJSON');

/**
 * A buy order (customer pays naira, we send crypto) or a sell order
 * (customer sends crypto, we pay naira).
 *
 * Buy lifecycle:
 *   awaiting_payment ─ user clicks "I have made payment" ─▶ awaiting_receipt
 *   awaiting_receipt ─ user uploads the transfer receipt ──▶ under_review
 *   under_review ───── admin sends the crypto ─────────────▶ completed
 *   under_review ───── admin can't confirm the payment ────▶ rejected
 *   awaiting_payment ─ user cancels / payment window ends ─▶ cancelled / expired
 *
 * Sell lifecycle (awaiting_payment = waiting for the customer's crypto deposit):
 *   awaiting_payment ─ user submits the deposit tx hash ───▶ under_review
 *   under_review ───── admin confirms deposit, pays naira ─▶ completed
 *   under_review ───── deposit not found / wrong amount ───▶ rejected
 */
const STATUSES = ['awaiting_payment', 'awaiting_receipt', 'under_review', 'completed', 'rejected', 'cancelled', 'expired'];
const PENDING_STATUSES = ['awaiting_payment', 'awaiting_receipt', 'under_review'];

const orderSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    type: { type: String, enum: ['buy', 'sell'], default: 'buy', index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    // The coin being bought or sold
    coinId: { type: String, required: true },
    symbol: { type: String, required: true },
    name: String,
    image: String,

    // Buy: the customer's wallet we send to. Sell: the network they deposit on.
    network: { id: { type: String, required: true }, name: { type: String, required: true } },
    walletAddress: { type: String, required() { return this.type !== 'sell'; } },
    memo: { type: String, default: null },

    // Sell: our deposit address, the customer's proof, and where we pay them
    deposit: {
      address: String,
      memo: String, // destination tag / memo that identifies this order
      memoLabel: String,
    },
    depositTxHash: { type: String, default: null },
    payoutAccount: {
      bankName: String,
      accountNumber: String,
      accountName: String,
    },
    grossNgn: Number, // sell: market value of the crypto before our charge
    payoutReference: { type: String, default: null }, // sell: our bank transfer reference

    // Quote, locked when the order is created
    amountNgn: { type: Number, required: true }, // buy: naira paid in; sell: naira paid out (after charge)
    ngnPerUsd: { type: Number, required: true }, // customer rate: buy = dollar value + charge, sell = dollar value − charge
    baseNgnPerUsd: Number, // dollar value in naira before our charge
    chargePerUsd: Number, // our charge per dollar (₦)
    chargeNgn: Number, // our total charge on this order (₦)
    amountUsd: { type: Number, required: true },
    priceUsd: { type: Number, required: true },
    cryptoAmount: { type: Number, required: true },

    // Naira account the customer transfers to
    paymentAccount: {
      provider: String,
      bankName: String,
      accountNumber: String,
      accountName: String,
      narration: String,
    },
    expiresAt: { type: Date, required: true },

    status: { type: String, enum: STATUSES, default: 'awaiting_payment', index: true },
    paymentMarkedAt: Date,
    receipt: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Receipt' },
      filename: String,
      mimeType: String,
      size: Number,
      uploadedAt: Date,
    },
    customerNote: { type: String, default: null },

    // Admin outcome
    txHash: { type: String, default: null },
    rejectionReason: { type: String, default: null },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completedAt: Date,

    history: [
      {
        _id: false,
        status: { type: String, enum: STATUSES },
        at: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true, toJSON }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, expiresAt: 1 });

orderSchema.methods.setStatus = function setStatus(status, note) {
  this.status = status;
  this.history.push({ status, at: new Date(), note });
};

orderSchema.statics.STATUSES = STATUSES;
orderSchema.statics.PENDING_STATUSES = PENDING_STATUSES;

module.exports = mongoose.model('Order', orderSchema);
