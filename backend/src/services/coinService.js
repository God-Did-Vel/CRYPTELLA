/**
 * Coin price service.
 * Fetches live prices from CoinGecko public API.
 * Falls back to realistic mock data if the request fails.
 */

const MOCK_PRICES = {
  bitcoin:       { id: 'bitcoin',       symbol: 'BTC',  name: 'Bitcoin',       price: 62400,   change24h: 1.23,  marketCap: 1220000000000, volume24h: 28000000000,  image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  ethereum:      { id: 'ethereum',      symbol: 'ETH',  name: 'Ethereum',      price: 3400,    change24h: -0.87, marketCap: 408000000000,  volume24h: 15000000000,  image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  solana:        { id: 'solana',        symbol: 'SOL',  name: 'Solana',        price: 178,     change24h: 3.45,  marketCap: 82000000000,   volume24h: 3200000000,   image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  binancecoin:   { id: 'binancecoin',   symbol: 'BNB',  name: 'BNB',           price: 595,     change24h: 0.54,  marketCap: 88000000000,   volume24h: 1800000000,   image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
  ripple:        { id: 'ripple',        symbol: 'XRP',  name: 'XRP',           price: 0.62,    change24h: -1.20, marketCap: 34000000000,   volume24h: 1500000000,   image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  cardano:       { id: 'cardano',       symbol: 'ADA',  name: 'Cardano',       price: 0.48,    change24h: 2.11,  marketCap: 17000000000,   volume24h: 620000000,    image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
  dogecoin:      { id: 'dogecoin',      symbol: 'DOGE', name: 'Dogecoin',      price: 0.155,   change24h: -2.33, marketCap: 22000000000,   volume24h: 980000000,    image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
  'matic-network': { id: 'matic-network', symbol: 'MATIC', name: 'Polygon',    price: 0.88,    change24h: 1.77,  marketCap: 8700000000,    volume24h: 410000000,    image: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png' },
  polkadot:      { id: 'polkadot',      symbol: 'DOT',  name: 'Polkadot',      price: 7.80,    change24h: -0.45, marketCap: 11000000000,   volume24h: 290000000,    image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png' },
  avalanche:     { id: 'avalanche',     symbol: 'AVAX', name: 'Avalanche',     price: 37.50,   change24h: 4.10,  marketCap: 15000000000,   volume24h: 560000000,    image: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png' },
  chainlink:     { id: 'chainlink',     symbol: 'LINK', name: 'Chainlink',     price: 14.20,   change24h: 2.88,  marketCap: 8300000000,    volume24h: 380000000,    image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
  litecoin:      { id: 'litecoin',      symbol: 'LTC',  name: 'Litecoin',      price: 82.00,   change24h: 0.33,  marketCap: 6100000000,    volume24h: 250000000,    image: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png' },
  uniswap:       { id: 'uniswap',       symbol: 'UNI',  name: 'Uniswap',       price: 7.50,    change24h: -1.10, marketCap: 5700000000,    volume24h: 180000000,    image: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png' },
  'shiba-inu':   { id: 'shiba-inu',     symbol: 'SHIB', name: 'Shiba Inu',     price: 0.0000245, change24h: -3.55, marketCap: 14000000000, volume24h: 640000000,   image: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png' },
  stellar:       { id: 'stellar',       symbol: 'XLM',  name: 'Stellar',       price: 0.115,   change24h: 0.78,  marketCap: 3200000000,    volume24h: 130000000,    image: 'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png' },
  tron:          { id: 'tron',          symbol: 'TRX',  name: 'TRON',          price: 0.128,   change24h: 1.55,  marketCap: 11000000000,   volume24h: 340000000,    image: 'https://assets.coingecko.com/coins/images/1094/small/tron-logo.png' },
  cosmos:        { id: 'cosmos',        symbol: 'ATOM', name: 'Cosmos',        price: 8.70,    change24h: -2.00, marketCap: 3400000000,    volume24h: 150000000,    image: 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png' },
  aave:          { id: 'aave',          symbol: 'AAVE', name: 'Aave',          price: 165,     change24h: 3.22,  marketCap: 2400000000,    volume24h: 120000000,    image: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png' },
  'the-sandbox': { id: 'the-sandbox',   symbol: 'SAND', name: 'The Sandbox',   price: 0.44,    change24h: -1.80, marketCap: 860000000,     volume24h: 65000000,     image: 'https://assets.coingecko.com/coins/images/12129/small/sandbox_logo.jpg' },
  decentraland:  { id: 'decentraland',  symbol: 'MANA', name: 'Decentraland',  price: 0.37,    change24h: -0.90, marketCap: 690000000,     volume24h: 42000000,     image: 'https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png' },
};

// Add slight random fluctuation to mock prices to simulate live movement
const fluctuate = (price) => {
  const pct = (Math.random() - 0.5) * 0.02; // ±1%
  return parseFloat((price * (1 + pct)).toPrecision(6));
};

const getAllCoins = async () => {
  try {
    const ids = Object.keys(MOCK_PRICES).join(',');
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) throw new Error('CoinGecko API error');

    const data = await response.json();
    return data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      image: coin.image,
    }));
  } catch (err) {
    // Fallback to mock data with simulated movement
    console.warn('CoinGecko fetch failed, using mock data:', err.message);
    return Object.values(MOCK_PRICES).map((c) => ({
      ...c,
      price: fluctuate(c.price),
    }));
  }
};

const getCoinById = async (coinId) => {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&sparkline=false&price_change_percentage=24h`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('CoinGecko API error');
    const data = await response.json();
    if (!data.length) throw new Error('Coin not found');
    const coin = data[0];
    return {
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      image: coin.image,
    };
  } catch {
    const mock = MOCK_PRICES[coinId];
    if (!mock) return null;
    return { ...mock, price: fluctuate(mock.price) };
  }
};

module.exports = { getAllCoins, getCoinById, MOCK_PRICES };
