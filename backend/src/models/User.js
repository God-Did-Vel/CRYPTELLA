/**
 * In-memory User store.
 * Exposes the same async API as the Mongoose model so no route code changes.
 */
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// ── seed data ────────────────────────────────────────────────────────────────
const _users = [
  {
    id: 'demo-user-001',
    _id: 'demo-user-001',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@cryptella.com',
    // Demo1234!  (pre-hashed so startup is instant)
    password: bcrypt.hashSync('Demo1234!', 10),
    role: 'user',
    isVerified: true,
    createdAt: new Date('2026-01-01').toISOString(),
    updatedAt: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'admin-user-001',
    _id: 'admin-user-001',
    firstName: 'Admin',
    lastName: 'Cryptella',
    email: 'admin@cryptella.com',
    password: bcrypt.hashSync('Admin1234!', 10),
    role: 'admin',
    isVerified: true,
    createdAt: new Date('2026-01-01').toISOString(),
    updatedAt: new Date('2026-01-01').toISOString(),
  },
];

// ── helpers ──────────────────────────────────────────────────────────────────
const _safeUser = (u, includePassword = false) => {
  if (!u) return null;
  const { password, ...rest } = u;
  const out = { ...rest, toJSON: () => _safeUser(u) };
  if (includePassword) out.password = password;
  return out;
};

const _match = (doc, filter) =>
  Object.entries(filter).every(([k, v]) => {
    if (k === '$ne') return true; // handled per-field below
    if (k === 'role') {
      if (v && typeof v === 'object' && '$ne' in v) return doc.role !== v.$ne;
      return doc.role === v;
    }
    if (k === '$or') return v.some((cond) => _match(doc, cond));
    if (v instanceof RegExp) return v.test(doc[k] ?? '');
    return doc[k] === v;
  });

// ── model API (all async to match Mongoose) ──────────────────────────────────
const User = {
  STATUSES: [],

  async findOne(filter, opts) {
    const includePassword = opts?.select?.includes('+password') ?? false;
    const u = _users.find((u) => _match(u, filter));
    return u ? _safeUser(u, includePassword) : null;
  },

  async findById(id) {
    const u = _users.find((u) => u.id === id || u._id === id);
    return u ? _safeUser(u) : null;
  },

  async exists(filter) {
    return !!_users.find((u) => _match(u, filter));
  },

  async create({ firstName, lastName, email, password, role = 'user' }) {
    const id = uuidv4();
    const now = new Date().toISOString();
    const user = {
      id,
      _id: id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      isVerified: true,
      createdAt: now,
      updatedAt: now,
    };
    _users.push(user);
    return _safeUser(user);
  },

  async countDocuments(filter = {}) {
    return _users.filter((u) => _match(u, filter)).length;
  },

  async find(filter = {}) {
    return _users.filter((u) => _match(u, filter)).map((u) => _safeUser(u));
  },

  // Admin: paginated user list with order stats injected by admin route
  async aggregate(_pipeline) {
    // Minimal stub — the admin route calls this but the frontend we're
    // building doesn't render the admin panel, so returning a flat list is fine.
    return _users
      .filter((u) => u.role !== 'admin')
      .map((u) => _safeUser(u));
  },
};

module.exports = User;
