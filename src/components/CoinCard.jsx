import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatPrice, formatChange, formatLargeNumber } from '../utils/format'
import CoinIcon from './CoinIcon'

export default function CoinCard({ coin }) {
  const positive = (coin.change24h ?? 0) >= 0

  return (
    <Link to={`/trade/${coin.id}`} style={{ textDecoration: 'none' }}>
      <div className="card card-hover" style={{ cursor: 'pointer' }}>
        {/* Header row */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <CoinIcon symbol={coin.symbol} name={coin.name} image={coin.image} size={44} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>{coin.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>{coin.symbol}</div>
            </div>
          </div>

          <span className={`badge ${positive ? 'badge-green' : 'badge-red'}`}>
            {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {formatChange(coin.change24h)}
          </span>
        </div>

        {/* Price */}
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
          {formatPrice(coin.price)}
        </div>

        {/* Footer stats */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 12, color: 'var(--text-muted)',
        }}>
          <span>MCap {formatLargeNumber(coin.marketCap)}</span>
          <span>Vol {formatLargeNumber(coin.volume24h)}</span>
        </div>
      </div>
    </Link>
  )
}
