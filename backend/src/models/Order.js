/**
 * In-memory Order store.
 * Exposes the same async API the routes expect from the Mongoose model.
 */
const { v4: uuidv4 } = require('uuid');

const STATUSES = ['awaiting_payment', 'awaiting_receipt', 'under_review', 'completed', 'rejected', 'cancelled', 'expired'];
const PENDING_STATUSES = ['awaiting_payment', 'awaiting_receipt', 'under_review'];

const _orders = [];

// ── helpers ──────────────────────────────────────────────────────────────────
const _toDoc = (o) => ({
  ...o,
  toJSON: () => {
    const { toJSON, ...rest } = o;
    return rest;
  },
});

const _matchField = (docVal, filterVal) => {
  if (filterVal === null || filterVal === undefined) return docVal == null;
  if (filterVal instanceof RegExp) return filterVal.test(docVal ?? '');
  if (typeof filterVal === 'object') {
    if ('$in'  in filterVal) return filterVal.$in.includes(docVal);
    if ('$nin' in filterVal) return !filterVal.$nin.includes(docVal);
    if ('$ne'  in filterVal) return docVal !== filterVal.$ne;
    if ('$lt'  in filterVal) return docVal < filterVal.$lt;
    if ('$lte' in filterVal) return docVal <= filterVal.$lte;
    if ('$gt'  in filterVal) return docVal > filterVal.$gt;
    if ('$gte' in filterVal) return docVal >= filterVal.$gte;
  }
  return docVal === filterVal;
};

const _match = (doc, filter) =>
  Object.entries(filter).every(([k, v]) => {
    if (k === '$or') return v.some((cond) => _match(doc, cond));
    return _matchField(doc[k], v);
  });

const _sort = (arr, sortObj) => {
  const entries = Object.entries(sortObj || {});
  if (!entries.length) return arr;
  return [...arr].sort((a, b) => {
    for (const [k, dir] of entries) {
      const av = a[k], bv = b[k];
      if (av < bv) return dir === 1 ? -1 : 1;
      if (av > bv) return dir === 1 ? 1 : -1;
    }
    return 0;
  });
};

// ── Chainable query builder (mirrors mongoose Query) ─────────────────────────
class Query {
  constructor(docs) { this._docs = docs; this._sortObj = null; this._skip = 0; this._limit = Infinity; }
  sort(s)  { this._sortObj = s; return this; }
  skip(n)  { this._skip = n;   return this; }
  limit(n) { this._limit = n;  return this; }
  populate() { return this; } // no-op: we embed what we need
  select()   { return this; }

  then(res, rej) {
    try {
      let docs = _sort(this._docs, this._sortObj);
      docs = docs.slice(this._skip, this._skip + this._limit);
      res(docs.map(_toDoc));
    } catch (e) { rej(e); }
  }
}

// ── model API ─────────────────────────────────────────────────────────────────
const Order = {
  STATUSES,
  PENDING_STATUSES,

  find(filter = {}) {
    return new Query(_orders.filter((o) => _match(o, filter)));
  },

  async findOne(filter = {}) {
    const o = _orders.find((o) => _match(o, filter));
    return o ? _toDoc(o) : null;
  },

  async findById(id) {
    const o = _orders.find((o) => o.id === id || o._id === id);
    return o ? _toDoc(o) : null;
  },

  async findOneAndUpdate(filter, update, opts = {}) {
    const idx = _orders.findIndex((o) => _match(o, filter));
    if (idx === -1) return null;

    const order = { ..._orders[idx] };

    if (update.$set) Object.assign(order, update.$set);
    if (update.$push) {
      const [field, val] = Object.entries(update.$push)[0];
      if (!Array.isArray(order[field])) order[field] = [];
      order[field] = [...order[field], val];
    }

    order.updatedAt = new Date().toISOString();
    _orders[idx] = order;
    return opts.new ? _toDoc(order) : _toDoc(_orders[idx]);
  },

  async updateMany(filter, update) {
    let modifiedCount = 0;
    _orders.forEach((o, idx) => {
      if (!_match(o, filter)) return;
      const order = { ..._orders[idx] };
      if (update.$set) Object.assign(order, update.$set);
      if (update.$push) {
        const [field, val] = Object.entries(update.$push)[0];
        if (!Array.isArray(order[field])) order[field] = [];
        order[field] = [...order[field], val];
      }
      order.updatedAt = new Date().toISOString();
      _orders[idx] = order;
      modifiedCount++;
    });
    return { modifiedCount };
  },

  async create(data) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const order = {
      id,
      _id: id,
      ...data,
      userId: data.userId,
      createdAt: now,
      updatedAt: now,
    };
    // Ensure history array exists
    if (!Array.isArray(order.history)) order.history = [];
    _orders.push(order);
    return _toDoc(order);
  },

  async countDocuments(filter = {}) {
    return _orders.filter((o) => _match(o, filter)).length;
  },

  // Stub for admin aggregate — returns flat counts
  async aggregate(pipeline) {
    // Only the $group stage is used in admin routes
    const groupStage = pipeline.find((s) => s.$group)?.$group;
    if (!groupStage) return [];
    if (groupStage._id === '$status') {
      const counts = {};
      _orders.forEach((o) => { counts[o.status] = (counts[o.status] || 0) + 1; });
      return Object.entries(counts).map(([_id, count]) => ({ _id, count }));
    }
    return [];
  },
};

module.exports = Order;
