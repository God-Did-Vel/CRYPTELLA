/**
 * In-memory database (no external DB required to run).
 * In production, swap this out for MongoDB/PostgreSQL.
 */
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Seed one admin/demo user
const demoPasswordHash = bcrypt.hashSync('Demo1234!', 10);

const db = {
  users: [
    {
      id: 'demo-user-001',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@cryptella.com',
      password: demoPasswordHash,
      createdAt: new Date().toISOString(),
      isVerified: true,
    },
  ],
  wallets: [
    {
      id: uuidv4(),
      userId: 'demo-user-001',
      // Balances in USD and coin holdings
      usdBalance: 10000.00,
      holdings: {
        BTC: 0.05,
        ETH: 1.2,
        SOL: 15,
        BNB: 2,
        ADA: 500,
        DOGE: 2000,
        XRP: 300,
        MATIC: 400,
        DOT: 50,
        AVAX: 10,
      },
    },
  ],
  orders: [], // { id, userId, coinId, symbol, type (buy/sell), amount, price, total, status, createdAt }
  transactions: [], // deposit/withdraw history
};

// Helper: find user by email
db.findUserByEmail = (email) =>
  db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

// Helper: find user by id
db.findUserById = (id) => db.users.find((u) => u.id === id);

// Helper: find wallet by userId
db.findWalletByUserId = (userId) => db.wallets.find((w) => w.userId === userId);

// Helper: create user
db.createUser = ({ firstName, lastName, email, password }) => {
  const user = {
    id: uuidv4(),
    firstName,
    lastName,
    email,
    password,
    createdAt: new Date().toISOString(),
    isVerified: true,
  };
  db.users.push(user);

  // Create wallet for new user
  db.wallets.push({
    id: uuidv4(),
    userId: user.id,
    usdBalance: 0,
    holdings: {},
  });

  return user;
};

module.exports = db;
