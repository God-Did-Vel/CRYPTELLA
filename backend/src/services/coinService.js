/**
 * Live coin price service (CoinGecko).
 *
 * Prices are never fetched per request. A single background job fetches the
 * listed coins' USD prices (see config/coins.js) in ONE CoinGecko call per
 * interval. Results are kept in memory and persisted to MongoDB, and every API
 * request is served from that cache, so CoinGecko traffic stays constant no
 * matter how many users are online. Naira rates come from P2P markets
 * (services/p2pService.js).
 *
 * Rate-limit safety:
 *  - one refresh at a time, on an interval sized to the CoinGecko plan's quota
 *  - HTTP 429 → honour Retry-After and back off (persisted across restarts)
 *  - restarts reuse the stored snapshot instead of refetching immediately
 *  - if CoinGecko is unreachable, the last good prices keep being served, but
 *    trades are refused once prices are too old (never trade on fake prices)
 */
const { MarketSnapshot } = require('../models');
const { LISTED_COIN_IDS, getNetworksForCoin } = require('../config/coins');
const { BUY_CHARGE_NGN_PER_USD, BUY_FEE_USD, SELL_CHARGE_NGN_PER_USD } = require('../config/orders');
const { getP2PRates, getCustomerRates } = require('./p2pService');
const { SELLABLE_COIN_IDS, getSellNetworks } = require('../config/sell');

const MAX_BACKOFF = 30 * 60 * 1000;
const REQUEST_TIMEOUT = 15 * 1000;

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const API_KEY = process.env.COINGECKO_API_KEY || '';
const PLAN = API_KEY ? (process.env.COINGECKO_API_PLAN || 'demo').toLowerCase() : 'public';

// Minimum/default refresh interval (seconds) per plan, sized to stay under quota.
// Each refresh is one CoinGecko call.
//  public: no key, ~5-15 calls/min shared per IP → 1 call/min is safe
//  demo:   30 calls/min but 10,000 calls/month → 1 call / 5 min ≈ 8,640/month
//  pro:    paid plans with large quotas
const PLAN_LIMITS = {
  public: { min: 60, default: 60 },
  demo: { min: 300, default: 300 },
  pro: { min: 15, default: 30 },
};

const planLimits = PLAN_LIMITS[PLAN] || PLAN_LIMITS.demo;
const requestedInterval = parseInt(process.env.COINGECKO_REFRESH_SECONDS, 10) || planLimits.default;
const REFRESH_INTERVAL = Math.max(requestedInterval, planLimits.min) * 1000;
if (requestedInterval < planLimits.min) {
  console.warn(
    `⚠️  COINGECKO_REFRESH_SECONDS=${requestedInterval} is below the safe minimum for the ` +
      `"${PLAN}" plan; using ${planLimits.min}s to avoid rate limiting.`
  );
}

// Trades are refused if the price is older than this
const MAX_TRADE_PRICE_AGE = Math.max(3 * REFRESH_INTERVAL, 10 * 60 * 1000);

const BASE_URL = PLAN === 'pro' ? 'https://pro-api.coingecko.com/api/v3' : 'https://api.coingecko.com/api/v3';
const AUTH_HEADER = PLAN === 'pro' ? 'x-cg-pro-api-key' : 'x-cg-demo-api-key';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const state = {
  coins: [], // listed coins, by market cap
  byId: new Map(),
  fetchedAt: null,
  blockedUntil: null,
  failures: 0,
};

let inFlight = null;
let timer = null;

class PricesUnavailableError extends Error {
  constructor(message = 'Live prices are temporarily unavailable. Please try again shortly.') {
    super(message);
    this.status = 503;
  }
}

class RateLimitedError extends Error {
  constructor(retryAfterMs) {
    super(`CoinGecko rate limit hit; retrying in ${Math.round(retryAfterMs / 1000)}s`);
    this.retryAfterMs = retryAfterMs;
  }
}

// ---------------------------------------------------------------------------
// CoinGecko client
// ---------------------------------------------------------------------------

const cgFetch = async (path, params) => {
  const url = `${BASE_URL}${path}?${new URLSearchParams(params)}`;
  const headers = { Accept: 'application/json' };
  if (API_KEY) headers[AUTH_HEADER] = API_KEY;

  const res = await fetch(url, { headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT) });

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get('retry-after'), 10);
    const backoff = Math.min(REFRESH_INTERVAL * 2 ** state.failures, MAX_BACKOFF);
    throw new RateLimitedError(Number.isFinite(retryAfter) ? Math.max(retryAfter * 1000, 60 * 1000) : backoff);
  }
  if (!res.ok) throw new Error(`CoinGecko responded ${res.status} for ${path}`);
  return res.json();
};

const toCoin = (c, now) => ({
  id: c.id,
  symbol: c.symbol.toUpperCase(),
  name: c.name,
  price: c.current_price,
  change24h: c.price_change_percentage_24h,
  marketCap: c.market_cap,
  volume24h: c.total_volume,
  image: c.image,
  rank: c.market_cap_rank,
  priceUpdatedAt: now,
});

// ---------------------------------------------------------------------------
// Refresh
// ---------------------------------------------------------------------------

const doRefresh = async () => {
  const now = Date.now();

  const rows = await cgFetch('/coins/markets', {
    vs_currency: 'usd',
    ids: LISTED_COIN_IDS.join(','),
    order: 'market_cap_desc',
    per_page: 250,
    page: 1,
    sparkline: 'false',
    price_change_percentage: '24h',
  });

  const coins = rows
    .filter((c) => c.current_price != null && LISTED_COIN_IDS.includes(c.id))
    .map((c) => toCoin(c, now));
  if (coins.length === 0) throw new Error('CoinGecko returned no usable coins');

  const missing = LISTED_COIN_IDS.filter((id) => !coins.some((c) => c.id === id));
  if (missing.length) console.warn(`⚠️  No CoinGecko price for listed coin(s): ${missing.join(', ')}`);

  state.coins = coins;
  state.byId = new Map(state.coins.map((c) => [c.id, c]));
  state.fetchedAt = now;
  state.failures = 0;
  state.blockedUntil = null;
  console.log(`💹 Prices refreshed: ${coins.length} coins`);
};

const persist = () =>
  MarketSnapshot.updateOne(
    { _id: 'coingecko' },
    {
      coins: state.coins,
      fetchedAt: state.fetchedAt,
      blockedUntil: state.blockedUntil,
    },
    { upsert: true }
  ).catch((err) => console.warn('Failed to persist market snapshot:', err.message));

const refresh = () => {
  if (!inFlight) {
    inFlight = doRefresh()
      .catch((err) => {
        state.failures += 1;
        const wait =
          err instanceof RateLimitedError
            ? err.retryAfterMs
            : Math.min(REFRESH_INTERVAL * 2 ** (state.failures - 1), MAX_BACKOFF);
        state.blockedUntil = Date.now() + wait;
        console.warn(`⚠️  Price refresh failed (${err.message}). Next attempt in ${Math.round(wait / 1000)}s.`);
      })
      .then(persist)
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
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

/**
 * Load the persisted snapshot, fetch fresh prices only if it is due,
 * and start the refresh loop. Call once after MongoDB is connected.
 */
const startPriceFeed = async () => {
  const snap = await MarketSnapshot.findById('coingecko').lean();
  if (snap) {
    // Only coins that are still listed, in case config/coins.js changed since the snapshot
    state.coins = (snap.coins || []).filter((c) => LISTED_COIN_IDS.includes(c.id));
    state.byId = new Map(state.coins.map((c) => [c.id, c]));
    state.fetchedAt = snap.fetchedAt ? snap.fetchedAt.getTime() : null;
    state.blockedUntil = snap.blockedUntil ? snap.blockedUntil.getTime() : null;

    // Listing changed → refresh as soon as allowed
    if (LISTED_COIN_IDS.some((id) => !state.byId.has(id))) state.fetchedAt = null;
  }

  console.log(
    `💹 Price feed: CoinGecko ${PLAN} plan, ${LISTED_COIN_IDS.length} listed coins, refresh every ${REFRESH_INTERVAL / 1000}s` +
      (state.fetchedAt ? `, cached prices from ${new Date(state.fetchedAt).toISOString()}` : '')
  );

  if (msUntilNextRefresh() === 0) await refresh();
  scheduleNext();
};

const stopPriceFeed = () => clearTimeout(timer);

// ---------------------------------------------------------------------------
// Read API (all served from memory)
// ---------------------------------------------------------------------------

const ensureData = () => {
  if (!state.coins.length) throw new PricesUnavailableError();
};

const isFresh = (coin) => Date.now() - coin.priceUpdatedAt <= MAX_TRADE_PRICE_AGE;

const getAllCoins = () => {
  ensureData();
  return state.coins;
};

const getMarketStatus = () => ({
  updatedAt: state.fetchedAt ? new Date(state.fetchedAt).toISOString() : null,
  stale: !state.fetchedAt || Date.now() - state.fetchedAt > MAX_TRADE_PRICE_AGE,
});

// Customer naira rates (P2P price ± our charges). Kept in the old shape for callers.
const getNgnPerUsd = () => getCustomerRates().buy;

const getFxStatus = () => {
  const rates = getCustomerRates();
  return {
    available: rates.available,
    ngnPerUsd: rates.buy, // customer buy rate
    sellNgnPerUsd: rates.sell, // customer sell rate
    buyFeeUsd: rates.buyFeeUsd,
    source: rates.p2p.source,
    updatedAt: rates.p2p.updatedAt,
  };
};

const getCoinById = (coinId) => {
  ensureData();
  const coin = state.byId.get(coinId);
  if (!coin) return null;
  const sellNetworks = getSellNetworks(coinId);
  return { ...coin, networks: getNetworksForCoin(coinId), sellable: sellNetworks.length > 0, sellNetworks };
};

const RATES_UNAVAILABLE = 'Naira rates are temporarily unavailable. Please try again shortly.';

/**
 * Coin price + naira rate that are safe to quote a buy order at, or throws.
 * Returns null if the coin is not listed.
 */
const getBuyQuote = (coinId) => {
  const coin = getCoinById(coinId);
  if (!coin) return null;
  if (!isFresh(coin)) throw new PricesUnavailableError();
  const p2p = getP2PRates();
  if (!p2p.available) throw new PricesUnavailableError(RATES_UNAVAILABLE);
  return {
    coin,
    ngnPerUsd: p2p.buy + BUY_CHARGE_NGN_PER_USD,
    baseNgnPerUsd: p2p.buy,
    chargePerUsd: BUY_CHARGE_NGN_PER_USD,
    feeUsd: BUY_FEE_USD,
    rateSource: p2p.source,
  };
};

/**
 * Price + naira rate for selling a coin, or throws. Returns null if we don't buy it.
 * The customer gets the P2P sell price − our sell charge per dollar.
 */
const getSellQuote = (coinId) => {
  if (!SELLABLE_COIN_IDS.includes(coinId)) return null;
  const coin = getCoinById(coinId);
  if (!coin) return null;
  if (!isFresh(coin)) throw new PricesUnavailableError();
  const p2p = getP2PRates();
  if (!p2p.available) throw new PricesUnavailableError(RATES_UNAVAILABLE);
  return {
    coin,
    baseNgnPerUsd: p2p.sell,
    chargePerUsd: SELL_CHARGE_NGN_PER_USD,
    ngnPerUsd: p2p.sell - SELL_CHARGE_NGN_PER_USD,
    rateSource: p2p.source,
  };
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
  getSellQuote,
  PricesUnavailableError,
};
