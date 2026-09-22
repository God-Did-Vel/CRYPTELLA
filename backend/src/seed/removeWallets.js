/**
 * One-off migration: `npm run migrate:remove-wallets`
 *
 * Cryptella no longer keeps customer balances. This drops the old simulated
 * wallets/transactions collections and removes orders from the old
 * instant-trade model (they have no order reference).
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const run = async () => {
  await connectDB();
  const db = mongoose.connection.db;
  const existing = new Set((await db.listCollections().toArray()).map((c) => c.name));

  for (const name of ['wallets', 'transactions']) {
    if (existing.has(name)) {
      await db.dropCollection(name);
      console.log(`Dropped collection: ${name}`);
    }
  }

  if (existing.has('orders')) {
    const { deletedCount } = await db.collection('orders').deleteMany({ reference: { $exists: false } });
    console.log(`Removed ${deletedCount} old instant-trade order(s)`);
  }
};

run()
  .catch((err) => {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
