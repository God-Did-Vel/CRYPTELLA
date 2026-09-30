/**
 * In-memory Receipt store.
 * Stores binary file buffers in memory — fine for development / small scale.
 * For production, swap the _store array for S3/GridFS writes.
 */
const { v4: uuidv4 } = require('uuid');

const _receipts = [];

const Receipt = {
  async create({ orderId, userId, filename, mimeType, size, data }) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const receipt = { id, _id: id, orderId, userId, filename, mimeType, size, data, createdAt: now };
    _receipts.push(receipt);
    return receipt;
  },

  async findById(id) {
    return _receipts.find((r) => r.id === id || r._id === id) || null;
  },

  async deleteOne(filter) {
    const idx = _receipts.findIndex((r) => {
      if (filter._id) return r.id === filter._id || r._id === filter._id;
      return false;
    });
    if (idx !== -1) _receipts.splice(idx, 1);
    return { deletedCount: idx !== -1 ? 1 : 0 };
  },
};

module.exports = Receipt;
