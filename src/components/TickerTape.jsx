import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatPrice, formatChange } from '../utils/format'

const TickerItem = ({ coin }) => {
  const positive = (coin.change24h ?? 0) >= 0
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '0 28px', borderRight: '1px solid var(--border)',
      whiteSpace: 'nowrap',
    }}>
      {coin.image && (
        <img src={coin.image} alt={coin.symbol} style={{ width: 20, height: 20, borderRadius: '50%' }} />
      )}
      <span style={{ fontWeight: 700, fontSize: 13 }}>{coin.symbol}</span>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatPrice(coin.price)}</span>
      <span style={{ fontSize: 12, color: positive ? 'var(--green)' : 'var(--red)', display: 'flex', alignItems: 'center', gap: 3 }}>
        {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {formatChange(coin.change24h)}
      </span>
    </div>
  )
}

export default function TickerTape({ coins }) {
  if (!coins || coins.length === 0) return null
  // Duplicate for seamless loop
  const items = [...coins, ...coins]

  return (
    <div style={{
      background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
      overflow: 'hidden', height: 44, display: 'flex', alignItems: 'center',
    }}>
      <div className="ticker-inner">
        {items.map((coin, i) => (
          <TickerItem key={`${coin.id}-${i}`} coin={coin} />
        ))}
      </div>
    </div>
  )
}
