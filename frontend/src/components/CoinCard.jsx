import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatPrice, formatChange, formatLargeNumber } from '../utils/format'

export default function CoinCard({ coin }) {
  const positive = (coin.change24h ?? 0) >= 0

  return (
    <Link to={`/trade/${coin.id}`} style={{ textDecoration: 'none' }}>
      <div className="card card-hover" style={{ cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {coin.image ? (
              <img src={coin.image} alt={coin.symbol} style={{ width: 44, height: 44, borderRadius: '50%' }} />
            ) : (
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14, color: '#fff',
              }}>{coin.symbol?.[0]}</div>
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{coin.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{coin.symbol}</div>
            </div>
          </div>
          <span className={`badge ${positive ? 'badge-green' : 'badge-red'}`}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {formatChange(coin.change24h)}
          </span>
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{formatPrice(coin.price)}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
          <span>MCap: {formatLargeNumber(coin.marketCap)}</span>
          <span>Vol: {formatLargeNumber(coin.volume24h)}</span>
        </div>
      </div>
    </Link>
  )
}
