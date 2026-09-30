/**
 * No-op database connector.
 * MongoDB has been replaced with an in-memory store (see src/models/index.js).
 * This file exists so nothing that requires it breaks.
 */
const connectDB = async () => {
  console.log('💾 Using in-memory database (no MongoDB required)');
};

module.exports = connectDB;
