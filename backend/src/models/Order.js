const mongoose = require('mongoose');
const toJSON = require('./toJSON');

/**
 * A naira → crypto buy order.
 *
 * Lifecycle:
 *   awaiting_payment ─ user clicks "I have made payment" ─▶ awaiting_receipt
 *   awaiting_receipt ─ user uploads the transfer receipt ──▶ under_review
 *   under_review ───── admin sends the crypto ─────────────▶ completed
 *   under_review ───── admin can't confirm the payment ────▶ rejected
 *   awaiting_payment ─ user cancels / payment window ends ─▶ cancelled / expired
 */
const STATUSES = ['awaiting_payment', 'awaiting_receipt', 'under_review', 'completed', 'rejected', 'cancelled', 'expired'];
const PENDING_STATUSES = ['awaiting_payment', 'awaiting_receipt', 'under_review'];

const orderSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    // What is being bought
    coinId: { type: String, required: true },
    symbol: { type: String, required: true },
    name: String,
    image: String,

    // Where to send it
    network: { id: { type: String, required: true }, name: { type: String, required: true } },
    walletAddress: { type: String, required: true },
    memo: { type: String, default: null },

    // Quote, locked when the order is created
    amountNgn: { type: Number, required: true },
    ngnPerUsd: { type: Number, required: true }, // customer rate = dollar value + charge
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
