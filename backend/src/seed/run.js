// Standalone: `npm run seed` — creates the demo (and admin) accounts without starting the API
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { seedAccounts, DEMO_EMAIL, DEMO_PASSWORD } = require('./demo');

connectDB()
  .then(seedAccounts)
  .then(() => console.log(`Demo account ready: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`))
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
