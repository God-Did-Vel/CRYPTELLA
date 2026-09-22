import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, TrendingUp, TrendingDown, RefreshCw, ArrowUpDown, ShoppingCart } from 'lucide-react'
import { useCoins } from '../hooks/useCoins'
import { useAuth } from '../context/AuthContext'
import { formatPrice, formatChange, formatLargeNumber } from '../utils/format'
import TickerTape from '../components/TickerTape'

const SortIcon = ({ field, current, dir }) => {
  if (current !== field) return <ArrowUpDown size={13} style={{ color: 'var(--text-muted)', marginLeft: 4 }} />
  return dir === 'asc'
    ? <TrendingUp size={13} style={{ color: 'var(--accent)', marginLeft: 4 }} />
    : <TrendingDown size={13} style={{ color: 'var(--accent)', marginLeft: 4 }} />
}

export default function Markets() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const { coins, loading, error, refetch } = useCoins(30000)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('marketCap')
  const [sortDir, setSortDir] = useState('desc')
  const [filter, setFilter] = useState('all') // all | gainers | losers

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const filtered = useMemo(() => {
    let list = [...coins]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
    }
    if (filter === 'gainers') list = list.filter(c => (c.change24h ?? 0) >= 0)
    if (filter === 'losers')  list = list.filter(c => (c.change24h ?? 0) < 0)
    list.sort((a, b) => {
      const av = a[sortField] ?? 0
      const bv = b[sortField] ?? 0
      return sortDir === 'asc' ? av - bv : bv - av
    })
    return list
  }, [coins, search, sortField, sortDir, filter])

  const gainers = coins.filter(c => (c.change24h ?? 0) >= 0).length
  const losers  = coins.filter(c => (c.change24h ?? 0) < 0).length

  const ThBtn = ({ label, field }) => (
    <th
      onClick={() => handleSort(field)}
      style={{ padding: '12px 16px', textAlign: field === 'name' ? 'left' : 'right', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
        {label}<SortIcon field={field} current={sortField} dir={sortDir} />
      </span>
    </th>
  )

  return (
    <div style={{ paddingTop: 68 }}>
      <TickerTape coins={coins} />

      {/* Page header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Live Markets</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
                {loading ? 'Loading…' : `${coins.length} altcoins • ${gainers} gainers • ${losers} losers`}
              </p>
            </div>
            <button onClick={refetch} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Filter + Search bar */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 220, maxWidth: 360 }}>
              <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input-field"
                placeholder="Search coins… (e.g. BTC, Solana)"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 40 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { id: 'all',     label: 'All' },
                { id: 'gainers', label: `📈 Gainers (${gainers})` },
                { id: 'losers',  label: `📉 Losers (${losers})` },
              ].map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{
                  padding: '8px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  background: filter === f.id ? 'var(--accent)' : 'var(--bg-card)',
                  color:      filter === f.id ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid', borderColor: filter === f.id ? 'var(--accent)' : 'var(--border)',
                }}>{f.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {error && (
          <div style={{ background: 'var(--red-light)', border: '1px solid var(--red)', borderRadius: 10, padding: '14px 18px', marginBottom: 24, color: 'var(--red)', fontSize: 14 }}>
            {error} — showing cached data.
          </div>
        )}

        {/* Desktop table */}
        <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', width: 40 }}>#</th>
                <ThBtn label="Coin" field="name" />
                <ThBtn label="Price" field="price" />
                <ThBtn label="24h Change" field="change24h" />
                <ThBtn label="Market Cap" field="marketCap" />
                <ThBtn label="Volume (24h)" field="volume24h" />
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 12 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} style={{ padding: '14px 16px' }}>
                          <div className="skeleton" style={{ height: 18, width: j === 1 ? 140 : 80, borderRadius: 4 }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.length === 0
                ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No coins match your search.
                    </td>
                  </tr>
                )
                : filtered.map((coin, idx) => {
                    const positive = (coin.change24h ?? 0) >= 0
                    return (
                      <tr
                        key={coin.id}
                        style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{idx + 1}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <Link to={`/trade/${coin.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                            {coin.image
                              ? <img src={coin.image} alt={coin.symbol} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                              : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{coin.symbol[0]}</div>
                            }
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14 }}>{coin.name}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{coin.symbol}</div>
                            </div>
                          </Link>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, fontSize: 14 }}>{formatPrice(coin.price)}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '4px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                            background: positive ? 'var(--green-light)' : 'var(--red-light)',
                            color: positive ? 'var(--green)' : 'var(--red)',
                          }}>
                            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {formatChange(coin.change24h)}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{formatLargeNumber(coin.marketCap)}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{formatLargeNumber(coin.volume24h)}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          {isAdmin ? (
                            <Link to={`/trade/${coin.id}`} className="btn btn-secondary btn-sm">Details</Link>
                          ) : (
                            <Link to={`/trade/${coin.id}`} className="btn btn-primary btn-sm" style={{ gap: 6 }}>
                              <ShoppingCart size={13} /> Buy
                            </Link>
                          )}
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>
          Prices update every 30 seconds. Data sourced from CoinGecko.
        </p>
      </div>
    </div>
  )
}
