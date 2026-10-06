const mongoose = require('mongoose');

/**
 * Payment receipt uploaded by a customer. Stored in MongoDB (files are capped
 * at 5 MB, well under the 16 MB document limit) and only served through
 * authenticated endpoints — never publicly.
 */
const receiptSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Receipt', receiptSchema);
