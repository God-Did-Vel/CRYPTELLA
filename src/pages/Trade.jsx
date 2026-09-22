import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  TrendingUp, TrendingDown, ArrowLeft, ShoppingCart, ArrowUpRight,
  Wallet, RefreshCw, Info, CheckCircle
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useWallet } from '../hooks/useWallet'
import api from '../utils/api'
import { formatPrice, formatChange, formatLargeNumber } from '../utils/format'
import toast from 'react-hot-toast'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// Generates mock sparkline data around a base price
const generateSparkline = (basePrice, points = 24) => {
  const data = []
  let price = basePrice * 0.95
  for (let i = 0; i < points; i++) {
    price = price * (1 + (Math.random() - 0.48) * 0.03)
    data.push({ hour: `${i}h`, price: parseFloat(price.toFixed(6)) })
  }
  // End near actual price
  data[data.length - 1].price = basePrice
  return data
}

const ChartTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 13 }}>
        <div style={{ fontWeight: 700 }}>{formatPrice(payload[0].value)}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{payload[0].payload.hour} ago</div>
      </div>
    )
  }
  return null
}

export default function Trade() {
  const { coinId } = useParams()
  const { isLoggedIn } = useAuth()
  const { wallet, refetch: refetchWallet } = useWallet()
  const navigate = useNavigate()

  const [coin, setCoin] = useState(null)
  const [coinLoading, setCoinLoading] = useState(true)
  const [tab, setTab] = useState('buy') // 'buy' | 'sell'
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [chartData, setChartData] = useState([])
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    setCoinLoading(true)
    api.get(`/coins/${coinId}`)
      .then(({ data }) => {
        setCoin(data.data)
        setChartData(generateSparkline(data.data.price))
      })
      .catch(() => toast.error('Coin not found'))
      .finally(() => setCoinLoading(false))
  }, [coinId])

  const holding = coin ? (wallet?.holdings?.[coin.symbol] ?? 0) : 0
  const usdBalance = wallet?.usdBalance ?? 0

  const estimatedTotal = coin && amount && !isNaN(amount)
    ? parseFloat(amount) * coin.price
    : 0

  const setMax = () => {
    if (!coin) return
    if (tab === 'buy') {
      const maxAmount = usdBalance / coin.price
      setAmount(parseFloat(maxAmount.toFixed(8)).toString())
    } else {
      setAmount(parseFloat(holding.toFixed(8)).toString())
    }
  }

  const handleTrade = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) { navigate('/login'); return }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    setSubmitting(true)
    setSuccess(null)
    try {
      const { data } = await api.post(`/orders/${tab}`, { coinId, amount: parseFloat(amount) })
      toast.success(data.message)
      setSuccess(data.message)
      setAmount('')
      refetchWallet()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Trade failed')
    } finally {
      setSubmitting(false)
    }
  }

  const positive = (coin?.change24h ?? 0) >= 0

  if (coinLoading) {
    return (
      <div style={{ paddingTop: 100 }}>
        <div className="container" style={{ padding: '40px 24px' }}>
          <div className="skeleton" style={{ height: 48, width: 280, marginBottom: 24, borderRadius: 10 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
            <div className="card"><div className="skeleton" style={{ height: 300, borderRadius: 8 }} /></div>
            <div className="card"><div className="skeleton" style={{ height: 300, borderRadius: 8 }} /></div>
          </div>
        </div>
      </div>
    )
  }

  if (!coin) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center' }}>
        <h2>Coin not found</h2>
        <Link to="/markets" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Back to Markets</Link>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 68 }}>
      {/* Breadcrumb header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
        <div className="container">
          <Link to="/markets" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
            <ArrowLeft size={14} /> Back to Markets
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {coin.image
              ? <img src={coin.image} alt={coin.symbol} style={{ width: 52, height: 52, borderRadius: '50%' }} />
              : <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>{coin.symbol[0]}</div>
            }
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h1 style={{ fontSize: 26, fontWeight: 900 }}>{coin.name}</h1>
                <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600, background: 'var(--bg-card)', padding: '4px 10px', borderRadius: 20 }}>{coin.symbol}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
                <span style={{ fontSize: 24, fontWeight: 800 }}>{formatPrice(coin.price)}</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 600,
                  background: positive ? 'var(--green-light)' : 'var(--red-light)',
                  color: positive ? 'var(--green)' : 'var(--red)',
                }}>
                  {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {formatChange(coin.change24h)} (24h)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>

          {/* Left: chart + stats */}
          <div>
            {/* Price chart */}
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>{coin.symbol} / USD — 24h Chart</h2>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Info size={12} /> Simulated chart
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} interval={3} />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={v => formatPrice(v)}
                    width={80}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone" dataKey="price"
                    stroke={positive ? 'var(--green)' : 'var(--red)'}
                    strokeWidth={2.5} dot={false}
                    activeDot={{ r: 5, fill: positive ? 'var(--green)' : 'var(--red)', stroke: 'var(--bg-card)', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Market Cap', value: formatLargeNumber(coin.marketCap) },
                { label: '24h Volume', value: formatLargeNumber(coin.volume24h) },
                { label: '24h Change', value: formatChange(coin.change24h), color: positive ? 'var(--green)' : 'var(--red)' },
                { label: 'Current Price', value: formatPrice(coin.price) },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color || 'var(--text-primary)' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* About */}
            <div className="card">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>About {coin.name}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                {coin.name} ({coin.symbol}) is a cryptocurrency traded on Cryptella. You can buy or sell {coin.symbol} instantly
                using your USD wallet balance. All trades are executed at the current live market price.
              </p>
              <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                <span className="badge badge-accent">{coin.symbol}</span>
                <span className="badge badge-green">Live Trading</span>
                <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>Instant Execution</span>
              </div>
            </div>
          </div>

          {/* Right: trade panel */}
          <div style={{ position: 'sticky', top: 84 }}>
            <div className="card" style={{ boxShadow: 'var(--shadow-lg)' }}>
              {/* Buy / Sell tabs */}
              <div style={{ display: 'flex', marginBottom: 24, background: 'var(--bg-secondary)', borderRadius: 10, padding: 4 }}>
                {['buy', 'sell'].map(t => (
                  <button key={t} onClick={() => { setTab(t); setAmount(''); setSuccess(null) }} style={{
                    flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    background: tab === t ? (t === 'buy' ? 'var(--green)' : 'var(--red)') : 'transparent',
                    color: tab === t ? '#fff' : 'var(--text-muted)',
                  }}>{t === 'buy' ? '🟢 Buy' : '🔴 Sell'}</button>
                ))}
              </div>

              {/* Wallet info */}
              {isLoggedIn && (
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
                    <Wallet size={14} />
                    {tab === 'buy' ? 'USD Balance' : `${coin.symbol} Balance`}
                  </div>
                  <span style={{ fontWeight: 700 }}>
                    {tab === 'buy' ? formatPrice(usdBalance) : `${parseFloat(holding.toFixed(6))} ${coin.symbol}`}
                  </span>
                </div>
              )}

              {success && (
                <div style={{ background: 'var(--green-light)', border: '1px solid var(--green)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--green)', fontSize: 14 }}>
                  <CheckCircle size={16} /> {success}
                </div>
              )}

              <form onSubmit={handleTrade}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label className="label" style={{ marginBottom: 0 }}>
                      Amount ({coin.symbol})
                    </label>
                    <button type="button" onClick={setMax} style={{
                      background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>MAX</button>
                  </div>
                  <input
                    className="input-field"
                    type="number"
                    min="0"
                    step="any"
                    placeholder={`e.g. 0.5`}
                    value={amount}
                    onChange={e => { setAmount(e.target.value); setSuccess(null) }}
                  />
                </div>

                {/* Quick amount shortcuts */}
                {tab === 'buy' && coin && (
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    {[25, 50, 100, 250].map(usd => {
                      const a = parseFloat((usd / coin.price).toFixed(8))
                      return (
                        <button key={usd} type="button" onClick={() => setAmount(a.toString())} style={{
                          flex: 1, padding: '6px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-secondary)',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-secondary)' }}
                        >${usd}</button>
                      )
                    })}
                  </div>
                )}

                {/* Total estimate */}
                <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}>
                    <span>Price per {coin.symbol}</span>
                    <span>{formatPrice(coin.price)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6, color: 'var(--text-secondary)' }}>
                    <span>Amount</span>
                    <span>{amount || '0'} {coin.symbol}</span>
                  </div>
                  <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800 }}>
                    <span>Total</span>
                    <span style={{ color: tab === 'buy' ? 'var(--red)' : 'var(--green)' }}>
                      {tab === 'buy' ? '-' : '+'}{formatPrice(estimatedTotal)}
                    </span>
                  </div>
                </div>

                {isLoggedIn ? (
                  <button
                    type="submit"
                    className={`btn btn-full btn-lg ${tab === 'buy' ? 'btn-green' : 'btn-red'}`}
                    disabled={submitting || !amount}
                  >
                    {submitting
                      ? 'Processing…'
                      : tab === 'buy'
                        ? <><ShoppingCart size={18} /> Buy {coin.symbol}</>
                        : <><ArrowUpRight size={18} /> Sell {coin.symbol}</>
                    }
                  </button>
                ) : (
                  <Link to="/login" className="btn btn-primary btn-full btn-lg">
                    Sign in to Trade
                  </Link>
                )}
              </form>

              <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
                Trades execute instantly at current market price. No hidden fees.
              </p>
            </div>

            {/* Related markets */}
            <div className="card" style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>More Markets</h3>
              <Link to="/markets" className="btn btn-secondary btn-full btn-sm">
                View All Coins <TrendingUp size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .trade-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
