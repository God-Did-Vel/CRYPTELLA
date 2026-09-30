/**
 * In-memory MarketSnapshot store.
 * Replaces MongoDB persistence — prices survive the request cycle but not
 * a process restart (CoinGecko will be called fresh on next boot).
 */

let _snapshot = null;

const MarketSnapshot = {
  async findById(_id) {
    // Return null so coinService treats every startup as a fresh fetch
    return _snapshot && _snapshot._id === _id ? { ..._snapshot } : null;
  },

  async updateOne(filter, update, opts = {}) {
    const id = filter._id;
    const data = update.$set || {};
    if (_snapshot && _snapshot._id === id) {
      Object.assign(_snapshot, data);
    } else if (opts.upsert) {
      _snapshot = { _id: id, ...data };
    }
    return { modifiedCount: 1 };
  },
};

module.exports = MarketSnapshot;
