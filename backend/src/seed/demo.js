/**
 * Ensures the demo account (shown on the login page) and, if configured,
 * the admin account exist. Runs on every server start and only creates
 * what is missing.
 */
const bcrypt = require('bcryptjs');
const { User } = require('../models');

const DEMO_EMAIL = 'demo@cryptella.com';
const DEMO_PASSWORD = 'Demo1234!';

const seedDemoAccount = async () => {
  const user = await User.findOne({ email: DEMO_EMAIL }).select('+password');

  if (!user) {
    await User.create({
      firstName: 'Demo',
      lastName: 'User',
      email: DEMO_EMAIL,
      password: await bcrypt.hash(DEMO_PASSWORD, 10),
    });
    console.log(`👤 Demo account created: ${DEMO_EMAIL}`);
  } else if (!(await bcrypt.compare(DEMO_PASSWORD, user.password))) {
    // Keep the advertised demo credentials working
    user.password = await bcrypt.hash(DEMO_PASSWORD, 10);
    await user.save();
  }
};

/**
 * Admin account from ADMIN_EMAIL / ADMIN_PASSWORD. Creates it if missing,
 * or grants the admin role to an existing user with that email. An existing
 * user's password is never changed here.
 */
const seedAdminAccount = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email) return;

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== 'admin') {
      existing.role = 'admin';
      await existing.save();
      console.log(`🛡️  Granted admin role to ${email}`);
    }
    return;
  }

  if (!password || password.length < 12) {
    console.warn('⚠️  ADMIN_PASSWORD must be at least 12 characters; admin account not created.');
    return;
  }
  await User.create({
    firstName: 'Cryptella',
    lastName: 'Admin',
    email,
    password: await bcrypt.hash(password, 10),
    role: 'admin',
  });
  console.log(`🛡️  Admin account created: ${email}`);
};

const seedAccounts = async () => {
  await seedDemoAccount();
  await seedAdminAccount();
};

module.exports = { seedAccounts, seedDemoAccount, DEMO_EMAIL, DEMO_PASSWORD };
