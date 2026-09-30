/**
 * Selling crypto for naira: which coins we accept, on which networks, and the
 * company deposit address customers send them to.
 *
 * ⚠️  The addresses below are PLACEHOLDERS. Replace each "REPLACE_WITH_…" value
 * with a real address you control before going live. While a placeholder is
 * in use the app shows a "test address" warning, and in production
 * (NODE_ENV=production) sell orders on that network are refused.
 *
 * To stop accepting a coin or network, remove it here.
 */
const { NETWORKS } = require('./coins');

// CoinGecko id → { network id → our deposit address }
const DEPOSIT_ADDRESSES = {
  bitcoin: { BTC: 'REPLACE_WITH_BTC_ADDRESS' },
  ethereum: { ERC20: 'REPLACE_WITH_ETH_ERC20_ADDRESS' },
  tether: {
    TRC20: 'REPLACE_WITH_USDT_TRC20_ADDRESS',
    ERC20: 'REPLACE_WITH_USDT_ERC20_ADDRESS',
    BEP20: 'REPLACE_WITH_USDT_BEP20_ADDRESS',
  },
  'usd-coin': {
    ERC20: 'REPLACE_WITH_USDC_ERC20_ADDRESS',
    BEP20: 'REPLACE_WITH_USDC_BEP20_ADDRESS',
    SOL: 'REPLACE_WITH_USDC_SOLANA_ADDRESS',
  },
  solana: { SOL: 'REPLACE_WITH_SOL_ADDRESS' },
  ripple: { XRP: 'REPLACE_WITH_XRP_ADDRESS' }, // each order gets its own destination tag
  sui: { SUI: 'REPLACE_WITH_SUI_ADDRESS' },
  binancecoin: { BEP20: 'REPLACE_WITH_BNB_BEP20_ADDRESS' },
  tron: { TRC20: 'REPLACE_WITH_TRX_ADDRESS' },
  litecoin: { LTC: 'REPLACE_WITH_LTC_ADDRESS' },
};

const SELLABLE_COIN_IDS = Object.keys(DEPOSIT_ADDRESSES);

const isPlaceholder = (address) => /^REPLACE_WITH_/.test(address);

// Public shape: networks a coin can be sold on (addresses are only shown on an order)
const getSellNetworks = (coinId) =>
  Object.keys(DEPOSIT_ADDRESSES[coinId] || {}).map((id) => ({
    id,
    name: NETWORKS[id].name,
    memo: NETWORKS[id].memo || null,
  }));

/** Our deposit address for a coin/network, or null if we don't accept it. */
const getDepositAddress = (coinId, networkId) => {
  const address = DEPOSIT_ADDRESSES[coinId]?.[networkId];
  if (!address) return null;
  const network = NETWORKS[networkId];
  return {
    network: { id: network.id, name: network.name },
    address,
    memoLabel: network.memo || null,
    placeholder: isPlaceholder(address),
  };
};

module.exports = { SELLABLE_COIN_IDS, getSellNetworks, getDepositAddress };
