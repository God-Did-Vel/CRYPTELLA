/**
 * Naira rates from USDT/NGN P2P markets.
 *
 * A background job fetches the best P2P adverts every P2P_REFRESH_SECONDS
 * (Binance P2P first, Bybit P2P second, Quidax USDT/NGN as a last fallback) and takes the median price of
 * the top adverts from established traders on each side:
 *   - buy price:  what it costs to buy 1 USDT with naira (advertisers selling)
 *   - sell price: what you get for selling 1 USDT (advertisers buying)
 *
 * Neither platform has an official public P2P price API — these are the
 * endpoints their websites use, so they can change or be blocked by region.
 * When live prices are unavailable or older than P2P_MAX_AGE_MINUTES, orders
 * are paused rather than priced on stale data. Admins can switch to manual
 * rates at any time (Admin → Overview → Naira rates).
 *
 * Customer rates:
 *   buy  = P2P buy price  + BUY_CHARGE_NGN_PER_USD  (plus a fee by size, BUY_FEE_TIERS)
 *   sell = P2P sell price − SELL_CHARGE_NGN_PER_USD
 */
const { NairaRate } = require('../models');
const {
  BUY_CHARGE_NGN_PER_USD,
  BUY_MIN_USD,
  BUY_FEE_TIERS,
  SELL_CHARGE_NGN_PER_USD,
  P2P_SOURCES,
  P2P_REFRESH_SECONDS,
  P2P_MAX_AGE_MINUTES,
} = require('../config/orders');
const crypto = require('node:crypto');

const BYBIT_API_KEY = process.env.BYBIT_P2P_API_KEY;
const BYBIT_API_SECRET = process.env.BYBIT_SECRET_KEY;

const REQUEST_TIMEOUT = 15 * 1000;
const REFRESH_INTERVAL = P2P_REFRESH_SECONDS * 1000;
const MAX_AGE = P2P_MAX_AGE_MINUTES * 60 * 1000;
const MAX_BACKOFF = 15 * 60 * 1000;

// Sanity limits: reject obviously broken data instead of pricing orders on it
const MIN_SANE_NGN = 300;
const MAX_SANE_NGN = 10000;
const MAX_SPREAD = 0.15; // buy may be at most 15% above sell

const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
};

const median = (values) => {
  const v = [...values].sort((a, b) => a - b);
  const mid = Math.floor(v.length / 2);
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
};

const postJson = async (url, body) => {
  const res = await fetch(url, { method: 'POST', headers: HEADERS, body: JSON.stringify(body), signal: AbortSignal.timeout(REQUEST_TIMEOUT) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};


const providers = {
  async bybit() {
    if (!BYBIT_API_KEY || !BYBIT_API_SECRET) {
    throw new Error('Missing Bybit API credentials');
    }

    const getAds = async (side) => {
      const timestamp = Date.now().toString();
      const recvWindow = '5000';

      const body = JSON.stringify({
      tokenId: 'USDT',
      currencyId: 'NGN',
      side: String(side),
      });

      const signaturePayload =
      timestamp + BYBIT_API_KEY + recvWindow + body;

      const signature = crypto
      .createHmac('sha256', BYBIT_API_SECRET)
      .update(signaturePayload)
      .digest('hex');

      const response = await fetch(
      'https://api.bybit.com/v5/p2p/item/online',
      {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-BAPI-API-KEY': BYBIT_API_KEY,
      'X-BAPI-SIGN': signature,
      'X-BAPI-SIGN-TYPE': '2',
      'X-BAPI-TIMESTAMP': timestamp,
      'X-BAPI-RECV-WINDOW': recvWindow,
      },
      body,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
      }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`
          Bybit API error  ${
          data.retMsg || response.statusText
          }`
        );
      }
      if (data.ret_code !== undefined && data.ret_code !== 0) {
        throw new Error(`Bybit error: ${JSON.stringify(data)}`);
      }

      if (!Array.isArray(data.result?.items) ||
        data.result.items.length === 0) {
        throw new Error(`No Bybit adverts returned for side=${side}`);
      }

      // Temporary: choose one random advert.
      // Later, replace this with your best-price selection logic.
      
      const advert =
        data.result.items[
        Math.floor(Math.random() * data.result.items.length)
      ];
      const items = data.result?.items;
    
      if (!Array.isArray(items)) {
        throw new Error(`Unexpected Bybit response: ${JSON.stringify(data)}`);
      }
    
      const verifiedAds = items.filter((ad) =>
        Array.isArray(ad.authTag) &&
        ad.authTag.includes('VA') &&
        Number.isFinite(Number(ad.price)) &&
        Number(ad.price) > 0
      );
    
      if (verifiedAds.length === 0) {
        throw new Error(`No verified advertisers found for side ${side}`);
      }
    
      const average =
        verifiedAds.reduce((sum, ad) => sum + Number(ad.price), 0) /
        verifiedAds.length;
    
      const price = Number(advert.price);
      console.log(side === 0 ? `Buy price ${price}`: `Sell price ${price}`);

      if (!Number.isFinite(price) || price <= 0) {
      throw new Error(`Invalid advert price for side=${side}`);
      }

      return {
      price,
      advert,
      average,
      count: verifiedAds.length,
      prices: verifiedAds.map((ad) => Number(ad.price)),
      };
    };

    const [buyAdvert, sellAdvert] = await Promise.all([
      getAds(0),
      getAds(1),
    ]);
  
    console.log('Verified Bybit P2P prices (USDT/NGN)');
    console.log('-------------------------------------');
    console.log(`Average buy price:  ₦${buyAdvert.average.toFixed(2)}`);
    console.log(`Average sell price: ₦${sellAdvert.average.toFixed(2)}`);
    console.log(`Verified buy ads:   ${buyAdvert.count}`);
    console.log(`Verified sell ads:  ${sellAdvert.count}`);

    return {
    buy: buyAdvert.price,
    sell: sellAdvert.price,
    sampleSize: 2,
    };
  },
};

const validate = ({ buy, sell }) => {
  if (![buy, sell].every((p) => p >= MIN_SANE_NGN && p <= MAX_SANE_NGN)) throw new Error(`prices out of range (buy ${buy}, sell ${sell})`);
  if (buy < sell) throw new Error(`buy price ${buy} is below sell price ${sell}`);
  if ((buy - sell) / sell > MAX_SPREAD) throw new Error(`spread too wide (buy ${buy}, sell ${sell})`);
};

// ---------------------------------------------------------------------------
// State + refresh loop
// ---------------------------------------------------------------------------

const state = {
  mode: 'auto',
  live: null, // { buy, sell, source, sampleSize, fetchedAt (ms) }
  manual: null, // { buy, sell, updatedAt, updatedBy }
  lastError: null,
  lastErrorAt: null,
  failures: 0,
};
let timer = null;
let inFlight = null;

const fetchLive = async () => {
  const errors = [];
  for (const name of P2P_SOURCES) {
    const provider = providers[name];
    if (!provider) { errors.push(`${name}: unknown source`); continue; }
    try {
      const result = await provider();
      validate(result);
      return { ...result, source: name };
    } catch (err) {
      errors.push(`${name}: ${err.cause?.code || err.message}`);
    }
  }
  throw new Error(errors.join('; '));
};

const refresh = () => {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      const live = await fetchLive();
      state.live = { ...live, fetchedAt: Date.now() };
      state.failures = 0;
      state.lastError = null;
      await NairaRate.updateOne({ _id: 'p2p' }, { $set: { live: { ...live, fetchedAt: new Date(state.live.fetchedAt) }, lastError: null } }, { upsert: true });
      console.log(`💱 P2P USDT/NGN (${live.source}): buy ₦${live.buy.toFixed(2)} · sell ₦${live.sell.toFixed(2)}`);
    } catch (err) {
      state.failures += 1;
      state.lastError = err.message;
      state.lastErrorAt = Date.now();
      await NairaRate.updateOne({ _id: 'p2p' }, { $set: { lastError: err.message, lastErrorAt: new Date() } }, { upsert: true }).catch(() => {});
      if (state.failures === 1 || state.failures % 10 === 0) console.warn(`⚠️  P2P rate refresh failed: ${err.message}`);
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
};

const scheduleNext = () => {
  clearTimeout(timer);
  const wait = state.failures ? Math.min(REFRESH_INTERVAL * 2 ** (state.failures - 1), MAX_BACKOFF) : REFRESH_INTERVAL;
  timer = setTimeout(async () => { await refresh(); scheduleNext(); }, wait);
};

/** Load saved state, fetch live prices if due, and start the refresh loop. */
const startP2PFeed = async () => {
  const doc = await NairaRate.findById('p2p').lean();
  if (doc) {
    state.mode = doc.mode || 'auto';
    if (doc.live?.buy) state.live = { ...doc.live, fetchedAt: doc.live.fetchedAt ? new Date(doc.live.fetchedAt).getTime() : 0 };
    if (doc.manual?.buy) state.manual = doc.manual;
    state.lastError = doc.lastError || null;
  }
  console.log(`💱 Naira rates: ${state.mode} mode, P2P sources ${P2P_SOURCES.join(' → ')}, refresh every ${P2P_REFRESH_SECONDS}s`);
  const due = !state.live?.fetchedAt || Date.now() - state.live.fetchedAt >= REFRESH_INTERVAL;
  if (due) await refresh();
  scheduleNext();
};

const stopP2PFeed = () => clearTimeout(timer);

// ---------------------------------------------------------------------------
// Read API
// ---------------------------------------------------------------------------

/**
 * The P2P base prices currently in use, or { available: false } when there
 * are none fresh enough to trade on.
 */
const getP2PRates = () => {
  if (state.mode === 'manual' && state.manual?.buy && state.manual?.sell) {
    return { available: true, buy: state.manual.buy, sell: state.manual.sell, source: 'manual', updatedAt: state.manual.updatedAt };
  }
  const live = state.live;
  const fresh = live?.buy && Date.now() - live.fetchedAt <= MAX_AGE;
  return {
    available: !!fresh,
    buy: live?.buy || null,
    sell: live?.sell || null,
    source: live?.source || null,
    updatedAt: live?.fetchedAt ? new Date(live.fetchedAt).toISOString() : null,
  };
};

/** Customer-facing naira rates (our charges included), or nulls when unavailable. */
const getCustomerRates = () => {
  const p2p = getP2PRates();
  if (!p2p.available) return { available: false, buy: null, sell: null, buyFeeTiers: BUY_FEE_TIERS, buyMinUsd: BUY_MIN_USD, p2p };
  return {
    available: true,
    buy: p2p.buy + BUY_CHARGE_NGN_PER_USD,
    sell: p2p.sell - SELL_CHARGE_NGN_PER_USD,
    buyFeeTiers: BUY_FEE_TIERS,
    buyMinUsd: BUY_MIN_USD,
    p2p,
  };
};

/** Full status for the admin dashboard. */
const getAdminRateStatus = () => ({
  mode: state.mode,
  current: getCustomerRates(),
  live: state.live ? { ...state.live, fetchedAt: new Date(state.live.fetchedAt).toISOString() } : null,
  manual: state.manual,
  lastError: state.lastError,
  lastErrorAt: state.lastErrorAt ? new Date(state.lastErrorAt).toISOString() : null,
  charges: { buyChargeNgnPerUsd: BUY_CHARGE_NGN_PER_USD, buyFeeTiers: BUY_FEE_TIERS, buyMinUsd: BUY_MIN_USD, sellChargeNgnPerUsd: SELL_CHARGE_NGN_PER_USD },
  sources: P2P_SOURCES,
  maxAgeMinutes: P2P_MAX_AGE_MINUTES,
});

/** Admin: switch mode and/or set manual P2P prices. */
const updateRateSettings = async ({ mode, manualBuy, manualSell }, adminEmail) => {
  const set = {};
  if (manualBuy !== undefined || manualSell !== undefined) {
    const prices = { buy: Number(manualBuy), sell: Number(manualSell) };
    validate(prices);
    state.manual = { ...prices, updatedAt: new Date(), updatedBy: adminEmail };
    set.manual = state.manual;
  }
  if (mode) {
    if (!['auto', 'manual'].includes(mode)) throw new Error('Mode must be auto or manual.');
    if (mode === 'manual' && !state.manual?.buy) throw new Error('Enter manual P2P prices before switching to manual mode.');
    state.mode = mode;
    set.mode = mode;
  }
  await NairaRate.updateOne({ _id: 'p2p' }, { $set: set }, { upsert: true });
  if (state.mode === 'auto') refresh(); // try a live update straight away
  return getAdminRateStatus();
};

module.exports = {
  startP2PFeed,
  stopP2PFeed,
  refreshP2P: refresh,
  getP2PRates,
  getCustomerRates,
  getAdminRateStatus,
  updateRateSettings,
  validateP2PPrices: validate,
};
