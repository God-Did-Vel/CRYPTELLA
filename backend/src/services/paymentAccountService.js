/**
 * Naira payment accounts for buy orders.
 *
 * Provider "manual" (default): assigns one of the company's collection
 * accounts from PAYMENT_ACCOUNTS (round-robin), and gives every order a
 * unique reference the customer puts in the transfer narration so the
 * payment can be matched to the order.
 *
 * To issue a dedicated virtual account per order instead (Paystack
 * Dedicated Virtual Accounts, Monnify Reserved Accounts, Flutterwave
 * Virtual Accounts), add a provider below that returns the same shape.
 */

class PaymentSetupError extends Error {
  constructor(message) {
    super(message);
    this.status = 503;
  }
}

const loadManualAccounts = () => {
  const raw = process.env.PAYMENT_ACCOUNTS;
  if (raw) {
    let accounts;
    try {
      accounts = JSON.parse(raw);
    } catch {
      throw new Error('PAYMENT_ACCOUNTS must be a JSON array of { bankName, accountNumber, accountName }');
    }
    const valid = Array.isArray(accounts) && accounts.length &&
      accounts.every((a) => a.bankName && /^\d{10}$/.test(String(a.accountNumber)) && a.accountName);
    if (!valid) throw new Error('Each PAYMENT_ACCOUNTS entry needs bankName, a 10-digit accountNumber and accountName');
    return accounts.map((a) => ({ ...a, accountNumber: String(a.accountNumber) }));
  }

  if (process.env.NODE_ENV === 'production') return [];

  // Development only: a clearly fake account so the flow can be tested
  console.warn('⚠️  PAYMENT_ACCOUNTS is not set — using a TEST bank account. Do not use in production.');
  return [{ bankName: 'TEST BANK (configure PAYMENT_ACCOUNTS)', accountNumber: '0000000000', accountName: 'Cryptella Test Collections' }];
};

let accounts = null;
let nextIndex = 0;

const providers = {
  manual: async (order) => {
    if (!accounts) accounts = loadManualAccounts();
    if (!accounts.length) throw new PaymentSetupError('Naira payments are not available right now. Please try again later.');
    const account = accounts[nextIndex % accounts.length];
    nextIndex += 1;
    return {
      provider: 'manual',
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountName: account.accountName,
      narration: order.reference,
    };
  },
};

const PROVIDER = process.env.PAYMENT_PROVIDER || 'manual';

/** Returns { provider, bankName, accountNumber, accountName, narration } */
const createPaymentAccount = (order, user) => {
  const provider = providers[PROVIDER];
  if (!provider) throw new Error(`Unknown PAYMENT_PROVIDER "${PROVIDER}"`);
  return provider(order, user);
};

// Fail fast at startup on a bad PAYMENT_ACCOUNTS value
const checkPaymentConfig = () => {
  if (PROVIDER === 'manual') accounts = loadManualAccounts();
};

module.exports = { createPaymentAccount, checkPaymentConfig, PaymentSetupError };
