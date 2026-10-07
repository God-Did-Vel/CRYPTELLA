/**
 * Coins that can be bought and sold on Cryptella, and the networks we send them on.
 *
 * Current list (Oct 2026): BTC, ETH, USDT, BNB, XRP, USDC, SOL, TRX.
 * Selling uses the same coins — see config/sell.js for our deposit addresses.
 *
 * To add or remove a coin, edit COIN_NETWORKS; the key is the last part of the
 * coin's CoinGecko URL (e.g. coingecko.com/en/coins/binancecoin).
 */

// Address formats. These catch typos and wrong-network addresses before an
// order is placed; they are format checks, not on-chain existence checks.
const BASE58 = '1-9A-HJ-NP-Za-km-z';
const NETWORKS = {
  BTC: { id: 'BTC', name: 'Bitcoin', address: new RegExp(`^(bc1[a-z0-9]{25,87}|[13][${BASE58}]{25,34})$`) },
  ERC20: { id: 'ERC20', name: 'Ethereum (ERC20)', address: /^0x[a-fA-F0-9]{40}$/ },
  BEP20: { id: 'BEP20', name: 'BNB Smart Chain (BEP20)', address: /^0x[a-fA-F0-9]{40}$/ },
  ARBITRUM: { id: 'ARBITRUM', name: 'Arbitrum One', address: /^0x[a-fA-F0-9]{40}$/ },
  BASE: { id: 'BASE', name: 'Base', address: /^0x[a-fA-F0-9]{40}$/ },
  TRC20: { id: 'TRC20', name: 'TRON (TRC20)', address: new RegExp(`^T[${BASE58}]{33}$`) },
  SOL: { id: 'SOL', name: 'Solana', address: new RegExp(`^[${BASE58}]{32,44}$`) },
  XRP: { id: 'XRP', name: 'XRP Ledger', address: new RegExp(`^r[${BASE58}]{24,34}$`), memo: 'Destination tag', memoPattern: /^\d{1,10}$/ },
  HYPEREVM: { id: 'HYPEREVM', name: 'HyperEVM', address: /^0x[a-fA-F0-9]{40}$/ },
  ADA: { id: 'ADA', name: 'Cardano', address: /^addr1[0-9a-z]{50,120}$/ },
  XLM: { id: 'XLM', name: 'Stellar', address: /^G[A-Z2-7]{55}$/, memo: 'Memo' },
  BCH: { id: 'BCH', name: 'Bitcoin Cash', address: new RegExp(`^((bitcoincash:)?[qp][a-z0-9]{41}|[13][${BASE58}]{25,34})$`) },
  NEAR: { id: 'NEAR', name: 'NEAR Protocol', address: /^(([a-z0-9_-]+\.)*[a-z0-9_-]+\.near|[a-f0-9]{64})$/ },
  LTC: { id: 'LTC', name: 'Litecoin', address: new RegExp(`^(ltc1[a-z0-9]{25,87}|[LM3][${BASE58}]{26,33})$`) },
  AVAXC: { id: 'AVAXC', name: 'Avalanche C-Chain', address: /^0x[a-fA-F0-9]{40}$/ },
  HBAR: { id: 'HBAR', name: 'Hedera', address: /^0\.0\.\d{1,12}(-[a-z]{5})?$/, memo: 'Memo' },
  SUI: { id: 'SUI', name: 'Sui', address: /^0x[a-fA-F0-9]{64}$/ },
};

// CoinGecko id → networks we deliver on (first one is the default)
const COIN_NETWORKS = {
  bitcoin: ['BTC'],
  ethereum: ['ERC20', 'ARBITRUM', 'BASE'],
  tether: ['TRC20', 'ERC20', 'BEP20', 'SOL'],
  binancecoin: ['BEP20'],
  ripple: ['XRP'],
  'usd-coin': ['ERC20', 'BEP20', 'SOL', 'BASE', 'ARBITRUM'],
  solana: ['SOL'],
  tron: ['TRC20'],
};

const LISTED_COIN_IDS = Object.keys(COIN_NETWORKS);

// Public shape (regexes stay on the server)
const getNetworksForCoin = (coinId) =>
  (COIN_NETWORKS[coinId] || []).map((id) => {
    const n = NETWORKS[id];
    return { id: n.id, name: n.name, memo: n.memo || null };
  });

/**
 * Validates a destination for a coin. Returns { network, address, memo } or
 * throws an Error with a user-facing message.
 */
const validateDestination = (coinId, networkId, address, memo) => {
  if (!(COIN_NETWORKS[coinId] || []).includes(networkId)) {
    throw new Error('This network is not supported for the selected coin.');
  }
  const network = NETWORKS[networkId];
  const cleanAddress = String(address || '').trim();
  if (!network.address.test(cleanAddress)) {
    throw new Error(`That doesn't look like a valid ${network.name} address. Please double-check it.`);
  }
  const cleanMemo = String(memo || '').trim();
  if (cleanMemo && !network.memo) throw new Error(`${network.name} does not use a memo.`);
  if (cleanMemo && network.memoPattern && !network.memoPattern.test(cleanMemo)) {
    throw new Error(`${network.memo} must be a number.`);
  }
  if (cleanMemo.length > 64) throw new Error('Memo is too long.');
  return { network: { id: network.id, name: network.name }, address: cleanAddress, memo: cleanMemo || null };
};

module.exports = { NETWORKS, LISTED_COIN_IDS, getNetworksForCoin, validateDestination };
