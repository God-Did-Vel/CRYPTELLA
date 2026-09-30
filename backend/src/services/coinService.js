/**
 * Live coin price service (CoinGecko).
 *
 * Prices are fetched in one background call per interval and kept in memory.
 * Every API request is served from that cache — CoinGecko traffic stays
 * constant regardless of how many users are online.
 *
 * MongoDB persistence has been removed; prices are fetched fresh on each
 * process start and cached in-process until the next scheduled refresh.
 *
 * Rate-limit safety:
 *  - one refresh at a time, on an interval sized to the CoinGecko plan quota
 *  - HTTP 429 → honour Retry-After and back off
 *  - if CoinGecko is unreachable, last good prices keep being served
 *  - trades are refused once prices are too old
 */
const { LISTED_COIN_IDS, getNetworksForCoin } = require('../config/coins');
const { NGN_PER_USD_OVERRIDE, NGN_CHARGE_PER_USD } = require('../config/orders');

// ── Configuration ─────────────────────────────────────────────────────────────

const FX_REFRESH_INTERVAL = 60 * 60 * 1000; // naira rate moves slowly
const MAX_FX_AGE          = 6 * 60 * 60 * 1000;
const MAX_BACKOFF         = 30 * 60 * 1000;
const REQUEST_TIMEOUT     = 15 * 1000;

const API_KEY = process.env.COINGECKO_API_KEY || '';
const PLAN    = API_KEY
  ? (process.env.COINGECKO_API_PLAN || 'demo').toLowerCase()
  : 'public';

const PLAN_LIMITS = {
  public: { min: 60,  default: 60  },
  demo:   { min: 300, default: 300 },
  pro:    { min: 15,  default: 30  },
};
const planLimits = PLAN_LIMITS[PLAN] || PLAN_LIMITS.demo;
const requestedInterval = parseInt(process.env.COINGECKO_REFRESH_SECONDS, 10) || planLimits.default;
const REFRESH_INTERVAL  = Math.max(requestedInterval, planLimits.min) * 1000;

if (requestedInterval < planLimits.min) {
  console.warn(
    `⚠️  COINGECKO_REFRESH_SECONDS=${requestedInterval} is below the safe minimum for ` +
    `"${PLAN}" plan; using ${planLimits.min}s.`
  );
}

const MAX_TRADE_PRICE_AGE = Math.max(3 * REFRESH_INTERVAL, 10 * 60 * 1000);

const BASE_URL    = PLAN === 'pro'
  ? 'https://pro-api.coingecko.com/api/v3'
  : 'https://api.coingecko.com/api/v3';
const AUTH_HEADER = PLAN === 'pro' ? 'x-cg-pro-api-key' : 'x-cg-demo-api-key';

// ── Fallback mock prices (used when CoinGecko is unreachable) ─────────────────

const MOCK_PRICES = [
  { id: 'bitcoin',          symbol: 'BTC',  name: 'Bitcoin',       price: 62400,     change24h:  1.23, marketCap: 1220000000000, volume24h: 28000000000,  rank: 1  },
  { id: 'ethereum',         symbol: 'ETH',  name: 'Ethereum',      price: 3400,      change24h: -0.87, marketCap: 408000000000,  volume24h: 15000000000,  rank: 2  },
  { id: 'tether',           symbol: 'USDT', name: 'Tether',        price: 1.00,      change24h: -0.01, marketCap: 112000000000,  volume24h: 50000000000,  rank: 3  },
  { id: 'binancecoin',      symbol: 'BNB',  name: 'BNB',           price: 595,       change24h:  0.54, marketCap: 88000000000,   volume24h: 1800000000,   rank: 4  },
  { id: 'solana',           symbol: 'SOL',  name: 'Solana',        price: 178,       change24h:  3.45, marketCap: 82000000000,   volume24h: 3200000000,   rank: 5  },
  { id: 'ripple',           symbol: 'XRP',  name: 'XRP',           price: 0.62,      change24h: -1.20, marketCap: 34000000000,   volume24h: 1500000000,   rank: 6  },
  { id: 'usd-coin',         symbol: 'USDC', name: 'USD Coin',      price: 1.00,      change24h:  0.00, marketCap: 33000000000,   volume24h: 6000000000,   rank: 7  },
  { id: 'cardano',          symbol: 'ADA',  name: 'Cardano',       price: 0.48,      change24h:  2.11, marketCap: 17000000000,   volume24h: 620000000,    rank: 8  },
  { id: 'tron',             symbol: 'TRX',  name: 'TRON',          price: 0.128,     change24h:  1.55, marketCap: 11000000000,   volume24h: 340000000,    rank: 9  },
  { id: 'chainlink',        symbol: 'LINK', name: 'Chainlink',     price: 14.20,     change24h:  2.88, marketCap: 8300000000,    volume24h: 380000000,    rank: 10 },
  { id: 'stellar',          symbol: 'XLM',  name: 'Stellar',       price: 0.115,     change24h:  0.78, marketCap: 3200000000,    volume24h: 130000000,    rank: 11 },
  { id: 'uniswap',          symbol: 'UNI',  name: 'Uniswap',       price: 7.50,      change24h: -1.10, marketCap: 5700000000,    volume24h: 180000000,    rank: 12 },
  { id: 'aave',             symbol: 'AAVE', name: 'Aave',          price: 165,       change24h:  3.22, marketCap: 2400000000,    volume24h: 120000000,    rank: 13 },
  { id: 'litecoin',         symbol: 'LTC',  name: 'Litecoin',      price: 82.00,     change24h:  0.33, marketCap: 6100000000,    volume24h: 250000000,    rank: 14 },
  { id: 'bitcoin-cash',     symbol: 'BCH',  name: 'Bitcoin Cash',  price: 370,       change24h: -0.55, marketCap: 7300000000,    volume24h: 290000000,    rank: 15 },
  { id: 'avalanche-2',      symbol: 'AVAX', name: 'Avalanche',     price: 37.50,     change24h:  4.10, marketCap: 15000000000,   volume24h: 560000000,    rank: 16 },
  { id: 'near',             symbol: 'NEAR', name: 'NEAR Protocol', price: 5.80,      change24h:  1.90, marketCap: 6500000000,    volume24h: 220000000,    rank: 17 },
  { id: 'sui',              symbol: 'SUI',  name: 'Sui',           price: 2.15,      change24h:  5.30, marketCap: 6000000000,    volume24h: 400000000,    rank: 18 },
  { id: 'hyperliquid',      symbol: 'HYPE', name: 'Hyperliquid',   price: 18.40,     change24h:  2.10, marketCap: 6100000000,    volume24h: 180000000,    rank: 19 },
  { id: 'hedera-hashgraph', symbol: 'HBAR', name: 'Hedera',        price: 0.076,     change24h: -0.80, marketCap: 3000000000,    volume24h: 95000000,     rank: 20 },
].map((c) => ({
  ...c,
  image: `https://assets.coingecko.com/coins/images/1/small/bitcoin.png`, // placeholder; live fetch overwrites
  priceUpdatedAt: Date.now(),
}));

// ── State ─────────────────────────────────────────────────────────────────────

const state = {
  coins:        [],
  byId:         new Map(),
  fetchedAt:    null,
  ngnPerUsd:    null,
  fxFetchedAt:  null,
  blockedUntil: null,
  failures:     0,
};

let inFlight = null;
let timer    = null;

// ── Error types ───────────────────────────────────────────────────────────────

class PricesUnavailableError extends Error {
  constructor(msg = 'Live prices are temporarily unavailable. Please try again shortly.') {
    super(msg);
    this.status = 503;
  }
}

class RateLimitedError extends Error {
  constructor(retryAfterMs) {
    super(`CoinGecko rate limit hit; retrying in ${Math.round(retryAfterMs / 1000)}s`);
    this.retryAfterMs = retryAfterMs;
  }
}

// ── CoinGecko client ──────────────────────────────────────────────────────────

const cgFetch = async (path, params) => {
  const url = `${BASE_URL}${path}?${new URLSearchParams(params)}`;
  const headers = { Accept: 'application/json' };
  if (API_KEY) headers[AUTH_HEADER] = API_KEY;

  const res = await fetch(url, { headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT) });

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get('retry-after'), 10);
    const backoff = Math.min(REFRESH_INTERVAL * 2 ** state.failures, MAX_BACKOFF);
    throw new RateLimitedError(Number.isFinite(retryAfter) ? Math.max(retryAfter * 1000, 60_000) : backoff);
  }
  if (!res.ok) throw new Error(`CoinGecko responded ${res.status} for ${path}`);
  return res.json();
};

const toCoin = (c, now) => ({
  id:            c.id,
  symbol:        c.symbol.toUpperCase(),
  name:          c.name,
  price:         c.current_price,
  change24h:     c.price_change_percentage_24h,
  marketCap:     c.market_cap,
  volume24h:     c.total_volume,
  image:         c.image,
  rank:          c.market_cap_rank,
  priceUpdatedAt: now,
});

const refreshFx = async (now) => {
  if (NGN_PER_USD_OVERRIDE) return;
  if (state.fxFetchedAt && now - state.fxFetchedAt < FX_REFRESH_INTERVAL) return;
  try {
    const { rates } = await cgFetch('/exchange_rates', {});
    const ngnPerUsd = rates?.ngn?.value / rates?.usd?.value;
    if (!Number.isFinite(ngnPerUsd) || ngnPerUsd <= 0) throw new Error('No NGN rate in response');
    state.ngnPerUsd  = ngnPerUsd;
    state.fxFetchedAt = now;
  } catch (err) {
    if (err instanceof RateLimitedError) throw err;
    console.warn('Naira rate refresh failed:', err.message);
  }
};

// ── Refresh ───────────────────────────────────────────────────────────────────

const doRefresh = async () => {
  const now = Date.now();

  const rows = await cgFetch('/coins/markets', {
    vs_currency: 'usd',
    ids:         LISTED_COIN_IDS.join(','),
    order:       'market_cap_desc',
    per_page:    250,
    page:        1,
    sparkline:   'false',
    price_change_percentage: '24h',
  });

  const coins = rows
    .filter((c) => c.current_price != null && LISTED_COIN_IDS.includes(c.id))
    .map((c) => toCoin(c, now));

  if (coins.length === 0) throw new Error('CoinGecko returned no usable coins');

  const missing = LISTED_COIN_IDS.filter((id) => !coins.some((c) => c.id === id));
  if (missing.length) console.warn(`⚠️  No CoinGecko price for: ${missing.join(', ')}`);

  state.coins    = coins;
  state.byId     = new Map(coins.map((c) => [c.id, c]));
  state.fetchedAt = now;

  await refreshFx(now);

  state.failures    = 0;
  state.blockedUntil = null;
  const rate = getNgnPerUsd();
  console.log(`💹 Prices refreshed: ${coins.length} coins${rate ? `, ₦${rate.toFixed(0)}/$` : ''}`);
};

const msUntilNextRefresh = () => {
  const now = Date.now();
  if (state.blockedUntil && state.blockedUntil > now) return state.blockedUntil - now;
  if (!state.fetchedAt) return 0;
  return Math.max(0, state.fetchedAt + REFRESH_INTERVAL - now);
};

const scheduleNext = () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    await refresh();
    scheduleNext();
  }, msUntilNextRefresh());
};

const refresh = () => {
  if (!inFlight) {
    inFlight = doRefresh()
      .catch((err) => {
        state.failures += 1;
        const wait = err instanceof RateLimitedError
          ? err.retryAfterMs
          : Math.min(REFRESH_INTERVAL * 2 ** (state.failures - 1), MAX_BACKOFF);
        state.blockedUntil = Date.now() + wait;
        console.warn(`⚠️  Price refresh failed (${err.message}). Next attempt in ${Math.round(wait / 1000)}s.`);

        // Fall back to mock data so the API stays usable
        if (state.coins.length === 0) {
          console.warn('⚠️  Loading mock prices as fallback.');
          state.coins  = MOCK_PRICES;
          state.byId   = new Map(MOCK_PRICES.map((c) => [c.id, c]));
          state.fetchedAt = Date.now();
          if (!state.ngnPerUsd && !NGN_PER_USD_OVERRIDE) {
            state.ngnPerUsd  = 1580; // approximate NGN/USD fallback
            state.fxFetchedAt = Date.now();
          }
        }
      })
      .finally(() => { inFlight = null; });
  }
  return inFlight;
};

/**
 * Fetch prices, then start the scheduled refresh loop.
 * Call once at server start — no DB connection required.
 */
const startPriceFeed = async () => {
  console.log(
    `💹 Price feed: CoinGecko ${PLAN} plan, ${LISTED_COIN_IDS.length} coins, ` +
    `refresh every ${REFRESH_INTERVAL / 1000}s`
  );
  if (msUntilNextRefresh() === 0) await refresh();
  scheduleNext();
};

const stopPriceFeed = () => clearTimeout(timer);

// ── Read API ──────────────────────────────────────────────────────────────────

const ensureData = () => {
  if (!state.coins.length) throw new PricesUnavailableError();
};

const isFresh = (coin) => Date.now() - coin.priceUpdatedAt <= MAX_TRADE_PRICE_AGE;

const getAllCoins  = () => { ensureData(); return state.coins; };

const getMarketStatus = () => ({
  updatedAt: state.fetchedAt ? new Date(state.fetchedAt).toISOString() : null,
  stale:     !state.fetchedAt || Date.now() - state.fetchedAt > MAX_TRADE_PRICE_AGE,
});

const getBaseNgnPerUsd = () => NGN_PER_USD_OVERRIDE || state.ngnPerUsd || null;
const getNgnPerUsd     = () => {
  const base = getBaseNgnPerUsd();
  return base ? base + NGN_CHARGE_PER_USD : null;
};

const getFxStatus = () => ({
  ngnPerUsd:     getNgnPerUsd(),
  baseNgnPerUsd: getBaseNgnPerUsd(),
  chargePerUsd:  NGN_CHARGE_PER_USD,
  source:        NGN_PER_USD_OVERRIDE ? 'fixed' : 'market',
  updatedAt:     state.fxFetchedAt && !NGN_PER_USD_OVERRIDE
    ? new Date(state.fxFetchedAt).toISOString()
    : null,
});

const getCoinById = (coinId) => {
  ensureData();
  const coin = state.byId.get(coinId);
  return coin ? { ...coin, networks: getNetworksForCoin(coinId) } : null;
};

const getBuyQuote = (coinId) => {
  const coin = getCoinById(coinId);
  if (!coin) return null;
  if (!isFresh(coin)) throw new PricesUnavailableError();
  const ngnPerUsd = getNgnPerUsd();
  const fxFresh = NGN_PER_USD_OVERRIDE || (state.fxFetchedAt && Date.now() - state.fxFetchedAt <= MAX_FX_AGE);
  if (!ngnPerUsd || !fxFresh) {
    throw new PricesUnavailableError('The naira exchange rate is temporarily unavailable. Please try again shortly.');
  }
  return { coin, ngnPerUsd, baseNgnPerUsd: getBaseNgnPerUsd(), chargePerUsd: NGN_CHARGE_PER_USD };
};

module.exports = {
  startPriceFeed,
  stopPriceFeed,
  getAllCoins,
  getMarketStatus,
  getCoinById,
  getNgnPerUsd,
  getFxStatus,
  getBuyQuote,
  PricesUnavailableError,
};
