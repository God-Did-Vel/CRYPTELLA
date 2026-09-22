export const formatPrice = (price) => {
  if (price === undefined || price === null) return '$—'
  if (price < 0.001) return `$${price.toFixed(8)}`
  if (price < 1) return `$${price.toFixed(4)}`
  if (price < 100) return `$${price.toFixed(2)}`
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(price)
}

export const formatLargeNumber = (num) => {
  if (!num) return '—'
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  return `$${num.toFixed(2)}`
}

export const formatChange = (change) => {
  if (change === undefined || change === null) return '—'
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}

export const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export const formatCryptoAmount = (amount, decimals = 6) => {
  if (!amount && amount !== 0) return '—'
  return parseFloat(amount.toFixed(decimals)).toString()
}

export const formatNaira = (amount, decimals = 2) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₦—'
  return `₦${Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: decimals })}`
}

export const formatUsd = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '$—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(amount)
}

// Exact amount (orders store 8 decimals), trailing zeros trimmed
export const formatCrypto = (amount, symbol = '') => {
  if (amount === undefined || amount === null || isNaN(amount)) return '—'
  const s = Number(amount).toLocaleString('en-US', { maximumFractionDigits: 8 })
  return symbol ? `${s} ${symbol}` : s
}

export const shortAddress = (addr, start = 8, end = 6) =>
  !addr || addr.length <= start + end + 3 ? addr : `${addr.slice(0, start)}…${addr.slice(-end)}`
