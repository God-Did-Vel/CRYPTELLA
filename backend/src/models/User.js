const mongoose = require('mongoose');
const toJSON = require('./toJSON');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    isVerified: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    // Last bank account used to receive naira from a sell order (pre-fills the form)
    payoutAccount: {
      bankName: String,
      accountNumber: String,
      accountName: String,
    },
  },
  { timestamps: true, toJSON }
);

module.exports = mongoose.model('User', userSchema);
