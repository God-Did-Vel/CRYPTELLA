import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatPrice, formatChange } from '../utils/format'
import CoinIcon from './CoinIcon'

const TickerItem = ({ coin }) => {
  const positive = (coin.change24h ?? 0) >= 0
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 24px', borderRight: '1px solid var(--border)',
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      <CoinIcon symbol={coin.symbol} name={coin.name} image={coin.image} size={20} />
      <span style={{ fontWeight: 700, fontSize: 13 }}>{coin.symbol}</span>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{formatPrice(coin.price)}</span>
      <span style={{
        fontSize: 12, fontWeight: 600,
        color: positive ? 'var(--green)' : 'var(--red)',
        display: 'flex', alignItems: 'center', gap: 3,
      }}>
        {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {formatChange(coin.change24h)}
      </span>
    </div>
  )
}

export default function TickerTape({ coins }) {
  if (!coins || coins.length === 0) return null
  const items = [...coins, ...coins] // duplicate for seamless loop

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      overflow: 'hidden',
      height: 44,
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="ticker-inner">
        {items.map((coin, i) => (
          <TickerItem key={`${coin.id}-${i}`} coin={coin} />
        ))}
      </div>
    </div>
  )
}
