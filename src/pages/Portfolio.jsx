import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, RefreshCw } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { useCoins } from '../hooks/useCoins'
import { formatPrice, formatChange, formatDate } from '../utils/format'
import api from '../utils/api'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = ['#6366F1','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#14B8A6','#F97316','#3B82F6','#84CC16']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const d = payload[0].payload
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 16px', fontSize: 13 }}>
        <div style={{ fontWeight: 700 }}>{d.name}</div>
        <div style={{ color: 'var(--text-secondary)' }}>{formatPrice(d.value)} ({d.pct?.toFixed(1)}%)</div>
      </div>
    )
  }
  return null
}

export default function Portfolio() {
  const { wallet, loading: walletLoading, refetch: refetchWallet } = useWallet()
  const { coins, loading: coinsLoading } = useCoins(30000)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all | buy | sell

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data.data)).catch(() => {}).finally(() => setOrdersLoading(false))
  }, [])

  const holdings = React.useMemo(() => {
    if (!wallet || !coins.length) return []
    return Object.entries(wallet.holdings || {})
      .map(([symbol, amount]) => {
        const coin = coins.find((c) => c.symbol === symbol)
        if (!coin) return null
        return { symbol, amount, coin, value: coin.price * amount }
      })
      .filter(Boolean)
      .filter(h => h.amount > 0)
      .sort((a, b) => b.value - a.value)
  }, [wallet, coins])

  const totalCoinValue = holdings.reduce((s, h) => s + h.value, 0)
  const usdBalance = wallet?.usdBalance || 0
  const totalValue = totalCoinValue + usdBalance

  const pieData = [
    { name: 'USD Cash', value: usdBalance, pct: totalValue ? (usdBalance / totalValue) * 100 : 0 },
    ...holdings.map(h => ({ name: h.symbol, value: h.value, pct: totalValue ? (h.value / totalValue) * 100 : 0 })),
  ].filter(d => d.value > 0)

  const filteredOrders = orders.filter(o => filter === 'all' || o.type === filter)

  return (
    <div style={{ paddingTop: 68 }}>
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>My Portfolio</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>All your holdings and transaction history</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={refetchWallet} className="btn btn-secondary btn-sm"><RefreshCw size={14} /> Refresh</button>
            <Link to="/markets" className="btn btn-primary btn-sm"><TrendingUp size={14} /> Trade Now</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Summary row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Value', value: formatPrice(totalValue), color: 'var(--accent)' },
            { label: 'USD Balance', value: formatPrice(usdBalance), color: 'var(--green)' },
            { label: 'Coin Value', value: formatPrice(totalCoinValue), color: 'var(--yellow)' },
            { label: 'Assets Held', value: `${holdings.length}`, color: '#EC4899' },
          ].map(s => (
            <div key={s.label} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, marginBottom: 32 }}>
          {/* Holdings table */}
          <div className="card">
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Coin Holdings</h2>
            {walletLoading || coinsLoading ? (
              Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 48, marginBottom: 10, borderRadius: 8 }} />)
            ) : holdings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <Wallet size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
                <p>No coin holdings yet.</p>
                <Link to="/markets" className="btn btn-primary btn-sm" style={{ marginTop: 12, display: 'inline-flex' }}>Buy Coins</Link>
              </div>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, padding: '0 0 10px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                  <span>Asset</span><span style={{ textAlign: 'right' }}>Price</span>
                  <span style={{ textAlign: 'right' }}>Amount</span><span style={{ textAlign: 'right' }}>Value</span>
                </div>
                {holdings.map(({ symbol, amount, coin, value }) => (
                  <Link to={`/trade/${coin.id}`} key={symbol} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, padding: '12px 0', borderBottom: '1px solid var(--border-light)', alignItems: 'center', transition: 'opacity 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {coin.image
                          ? <img src={coin.image} alt={symbol} style={{ width: 30, height: 30, borderRadius: '50%' }} />
                          : <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11 }}>{symbol[0]}</div>
                        }
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{symbol}</div>
                          <div style={{ fontSize: 11, color: coin.change24h >= 0 ? 'var(--green)' : 'var(--red)' }}>{formatChange(coin.change24h)}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: 13 }}>{formatPrice(coin.price)}</div>
                      <div style={{ textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{parseFloat(amount.toFixed(6))}</div>
                      <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 13 }}>{formatPrice(value)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pie chart */}
          <div className="card">
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Allocation</h2>
            {walletLoading || coinsLoading ? (
              <div className="skeleton" style={{ height: 260, borderRadius: 8 }} />
            ) : pieData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: 14 }}>Deposit funds to see your allocation chart.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(v) => <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Transaction history */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>Transaction History</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'buy', 'sell'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  background: filter === f ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: filter === f ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid', borderColor: filter === f ? 'var(--accent)' : 'var(--border)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
              ))}
            </div>
          </div>
          {ordersLoading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 56, marginBottom: 10, borderRadius: 8 }} />)
          ) : filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <p>No transactions found.</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: 8, padding: '0 0 10px', borderBottom: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                <span>Type</span><span>Coin</span><span style={{ textAlign: 'right' }}>Amount</span>
                <span style={{ textAlign: 'right' }}>Price</span><span style={{ textAlign: 'right' }}>Total</span>
              </div>
              {filteredOrders.map((order) => (
                <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr', gap: 8, padding: '12px 0', borderBottom: '1px solid var(--border-light)', alignItems: 'center', fontSize: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: order.type === 'buy' ? 'var(--green-light)' : 'var(--red-light)',
                      color: order.type === 'buy' ? 'var(--green)' : 'var(--red)',
                    }}>
                      {order.type === 'buy' ? <ArrowDownLeft size={11} /> : <ArrowUpRight size={11} />}
                      {order.type.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {order.image && <img src={order.image} alt={order.symbol} style={{ width: 22, height: 22, borderRadius: '50%' }} />}
                    <span style={{ fontWeight: 600 }}>{order.symbol}</span>
                  </div>
                  <div style={{ textAlign: 'right', color: 'var(--text-secondary)', fontSize: 13 }}>{order.amount}</div>
                  <div style={{ textAlign: 'right', fontSize: 13 }}>{formatPrice(order.price)}</div>
                  <div style={{ textAlign: 'right', fontWeight: 700 }}>${order.total?.toFixed(2)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
