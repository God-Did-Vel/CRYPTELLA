/**
 * Order helpers — pure functions, no database imports.
 * The in-memory Order model is used directly by the route handlers.
 */
const crypto = require('crypto');
const { Order, Receipt } = require('../models');

// Unambiguous characters (no 0/O, 1/I/L)
const REF_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const generateReference = () => {
  const bytes = crypto.randomBytes(8);
  let ref = 'CRY';
  for (const b of bytes) ref += REF_ALPHABET[b % REF_ALPHABET.length];
  return ref;
};

const round = (n, dp) => parseFloat(Number(n).toFixed(dp));

class OrderError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

/**
 * Atomically move an order from one of `fromStatuses` to `toStatus`.
 * Returns the updated order doc, or null if it wasn't in an allowed status.
 */
const transition = (filter, fromStatuses, toStatus, note, set = {}) =>
  Order.findOneAndUpdate(
    { ...filter, status: { $in: fromStatuses } },
    {
      $set: { ...set, status: toStatus },
      $push: { history: { status: toStatus, at: new Date().toISOString(), note } },
    },
    { new: true }
  );

/** Mark all awaiting_payment orders whose window has passed as expired. */
const expireStaleOrders = async () => {
  const now = new Date().toISOString();
  const result = await Order.updateMany(
    { status: 'awaiting_payment', expiresAt: { $lt: now } },
    {
      $set:  { status: 'expired' },
      $push: { history: { status: 'expired', at: now, note: 'Payment window ended' } },
    }
  );
  return result.modifiedCount;
};

// Simple timer — runs every 60 s
let expiryTimer = null;
const startExpiryJob = () => {
  const run = () => expireStaleOrders().catch((err) => console.warn('Order expiry job failed:', err.message));
  run();
  expiryTimer = setInterval(run, 60_000);
};
const stopExpiryJob = () => clearInterval(expiryTimer);

// UUID-shaped IDs are always "valid" for our in-memory store
const isObjectId = (id) => typeof id === 'string' && id.length > 0;

// Magic-byte file-type detection (the client's claimed MIME is never trusted)
const detectReceiptType = (buf) => {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)
    return { mime: 'image/jpeg', ext: 'jpg' };
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])))
    return { mime: 'image/png', ext: 'png' };
  if (buf.length >= 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP')
    return { mime: 'image/webp', ext: 'webp' };
  if (buf.length >= 5 && buf.toString('ascii', 0, 5) === '%PDF-')
    return { mime: 'application/pdf', ext: 'pdf' };
  return null;
};

// Fields only admins should see
const INTERNAL_FIELDS = ['baseNgnPerUsd', 'chargePerUsd', 'chargeNgn', 'reviewedBy'];

const customerView = (order) => {
  if (Array.isArray(order)) return order.map(customerView);
  const json = typeof order.toJSON === 'function' ? order.toJSON() : { ...order };
  INTERNAL_FIELDS.forEach((f) => delete json[f]);
  return json;
};

/** Stream a receipt file to the HTTP response. */
const sendReceipt = async (order, res) => {
  if (!order?.receipt?.id)
    return res.status(404).json({ success: false, message: 'No receipt uploaded.' });
  const receipt = await Receipt.findById(order.receipt.id);
  if (!receipt)
    return res.status(404).json({ success: false, message: 'Receipt not found.' });
  res.set({
    'Content-Type':        receipt.mimeType,
    'Content-Length':      receipt.size,
    'Content-Disposition': `inline; filename="${receipt.filename}"`,
    'Cache-Control':       'private, no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  return res.send(receipt.data);
};

module.exports = {
  generateReference,
  round,
  OrderError,
  transition,
  expireStaleOrders,
  startExpiryJob,
  stopExpiryJob,
  isObjectId,
  detectReceiptType,
  sendReceipt,
  customerView,
};
