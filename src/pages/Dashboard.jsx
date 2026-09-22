import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft,
  RefreshCw, Plus, ArrowRight, BarChart2, Clock
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useWallet } from '../hooks/useWallet'
import { useCoins } from '../hooks/useCoins'
import api from '../utils/api'
import { formatPrice, formatChange, formatDate, formatLargeNumber } from '../utils/format'
import toast from 'react-hot-toast'

const StatCard = ({ icon, label, value, sub, color = 'var(--accent)' }) => (
  <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12, flexShrink: 0,
      background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sub}</div>}
    </div>
  </div>
)

const OrderRow = ({ order }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 0', borderBottom: '1px solid var(--border-light)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: order.type === 'buy' ? 'var(--green-light)' : 'var(--red-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: order.type === 'buy' ? 'var(--green)' : 'var(--red)',
      }}>
        {order.type === 'buy' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>
          {order.type === 'buy' ? 'Bought' : 'Sold'} {order.symbol}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(order.createdAt)}</div>
      </div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontWeight: 700, fontSize: 14 }}>${order.total?.toFixed(2)}</div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.amount} {order.symbol}</div>
    </div>
  </div>
)

export default function Dashboard() {
  const { user } = useAuth()
  const { wallet, loading: walletLoading, refetch: refetchWallet } = useWallet()
  const { coins, loading: coinsLoading } = useCoins(30000)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [depositAmt, setDepositAmt] = useState('')
  const [depositing, setDepositing] = useState(false)
  const [showDeposit, setShowDeposit] = useState(false)

  useEffect(() => {
    api.get('/orders').then(({ data }) => {
      setOrders(data.data.slice(0, 5))
    }).catch(() => {}).finally(() => setOrdersLoading(false))
  }, [])

  // Calculate total portfolio value
  const portfolioValue = React.useMemo(() => {
    if (!wallet || !coins.length) return 0
    let total = wallet.usdBalance || 0
    Object.entries(wallet.holdings || {}).forEach(([symbol, amount]) => {
      const coin = coins.find((c) => c.symbol === symbol)
      if (coin) total += coin.price * amount
    })
    return total
  }, [wallet, coins])

  const handleDeposit = async (e) => {
    e.preventDefault()
    if (!depositAmt || isNaN(depositAmt) || parseFloat(depositAmt) <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    setDepositing(true)
    try {
      const { data } = await api.post('/wallet/deposit', { amount: parseFloat(depositAmt) })
      toast.success(data.message)
      setDepositAmt('')
      setShowDeposit(false)
      refetchWallet()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deposit failed')
    } finally {
      setDepositing(false)
    }
  }

  // Top holdings
  const topHoldings = React.useMemo(() => {
    if (!wallet || !coins.length) return []
    return Object.entries(wallet.holdings || {})
      .map(([symbol, amount]) => {
        const coin = coins.find((c) => c.symbol === symbol)
        if (!coin || amount === 0) return null
        return { symbol, amount, coin, value: coin.price * amount }
      })
      .filter(Boolean)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [wallet, coins])

  return (
    <div style={{ paddingTop: 68 }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.firstName} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Here's your portfolio overview</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => setShowDeposit(!showDeposit)} className="btn btn-primary">
              <Plus size={16} /> Deposit
            </button>
            <Link to="/markets" className="btn btn-secondary">
              <BarChart2 size={16} /> Trade
            </Link>
          </div>
        </div>
      </div>

      {/* Deposit panel */}
      {showDeposit && (
        <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
          <div className="container" style={{ padding: '20px 24px' }}>
            <form onSubmit={handleDeposit} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', maxWidth: 480 }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <label className="label">Deposit amount (USD)</label>
                <input
                  className="input-field"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="e.g. 500"
                  value={depositAmt}
                  onChange={(e) => setDepositAmt(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-green" disabled={depositing}>
                {depositing ? 'Processing…' : 'Confirm Deposit'}
              </button>
              <button type="button" onClick={() => setShowDeposit(false)} className="btn btn-secondary">Cancel</button>
            </form>
          </div>
        </div>
      )}

      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
          <StatCard
            icon={<Wallet size={22} />}
            label="Total Portfolio Value"
            value={coinsLoading || walletLoading ? '…' : formatPrice(portfolioValue)}
            sub="All assets combined"
            color="var(--accent)"
          />
          <StatCard
            icon={<ArrowDownLeft size={22} />}
            label="USD Balance"
            value={walletLoading ? '…' : formatPrice(wallet?.usdBalance || 0)}
            sub="Available to trade"
            color="var(--green)"
          />
          <StatCard
            icon={<TrendingUp size={22} />}
            label="Coin Holdings"
            value={walletLoading ? '…' : `${Object.keys(wallet?.holdings || {}).filter(k => wallet.holdings[k] > 0).length} coins`}
            sub="In your portfolio"
            color="var(--yellow)"
          />
          <StatCard
            icon={<Clock size={22} />}
            label="Total Trades"
            value={ordersLoading ? '…' : orders.length}
            sub="Recent transactions"
            color="#EC4899"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Holdings */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>Top Holdings</h2>
              <Link to="/portfolio" style={{ fontSize: 13, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <ArrowRight size={13} />
              </Link>
            </div>
            {walletLoading || coinsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div className="skeleton" style={{ height: 40, width: '45%' }} />
                  <div className="skeleton" style={{ height: 40, width: '30%' }} />
                </div>
              ))
            ) : topHoldings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                <TrendingUp size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                <p style={{ fontSize: 14 }}>No holdings yet. Deposit funds and buy your first coin!</p>
                <Link to="/markets" className="btn btn-primary btn-sm" style={{ marginTop: 16, display: 'inline-flex' }}>Go to Markets</Link>
              </div>
            ) : (
              topHoldings.map(({ symbol, amount, coin, value }) => (
                <Link to={`/trade/${coin.id}`} key={symbol} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 0', borderBottom: '1px solid var(--border-light)', cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {coin.image
                        ? <img src={coin.image} alt={symbol} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                        : <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 700, fontSize: 12 }}>{symbol[0]}</div>
                      }
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{coin.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{amount} {symbol}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{formatPrice(value)}</div>
                      <div style={{ fontSize: 12, color: coin.change24h >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {formatChange(coin.change24h)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Recent orders */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>Recent Orders</h2>
              <Link to="/portfolio" style={{ fontSize: 13, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <ArrowRight size={13} />
              </Link>
            </div>
            {ordersLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div className="skeleton" style={{ height: 40, width: '55%' }} />
                  <div className="skeleton" style={{ height: 40, width: '25%' }} />
                </div>
              ))
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                <Clock size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                <p style={{ fontSize: 14 }}>No orders yet. Start trading!</p>
                <Link to="/markets" className="btn btn-primary btn-sm" style={{ marginTop: 16, display: 'inline-flex' }}>Browse Markets</Link>
              </div>
            ) : (
              orders.map((order) => <OrderRow key={order.id} order={order} />)
            )}
          </div>
        </div>

        {/* Quick trade links */}
        <div className="card" style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Quick Buy</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {(coinsLoading ? [] : coins.slice(0, 8)).map((coin) => (
              <Link key={coin.id} to={`/trade/${coin.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', borderRadius: 10,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  transition: 'all 0.2s', cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-light)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)' }}
                >
                  {coin.image && <img src={coin.image} alt={coin.symbol} style={{ width: 24, height: 24, borderRadius: '50%' }} />}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{coin.symbol}</div>
                    <div style={{ fontSize: 11, color: coin.change24h >= 0 ? 'var(--green)' : 'var(--red)' }}>{formatChange(coin.change24h)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
