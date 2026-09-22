import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart2, Clock, CheckCircle2, ClipboardList, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCoins } from '../hooks/useCoins'
import { useRates } from '../hooks/useRates'
import api from '../utils/api'
import { formatChange, formatNaira, formatCrypto } from '../utils/format'
import { ORDER_STATUS } from '../utils/orders'
import OrderRow from '../components/OrderRow'
import OrderStatusBadge from '../components/OrderStatusBadge'

export default function Dashboard() {
  const { user } = useAuth()
  const { coins, loading: coinsLoading } = useCoins(30000)
  const { rates } = useRates()
  const [summary, setSummary] = useState(null)
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = () =>
      Promise.all([api.get('/user/dashboard'), api.get('/orders', { params: { status: 'pending' } })])
        .then(([dash, pend]) => { setSummary(dash.data.data); setPending(pend.data.data) })
        .catch(() => {})
        .finally(() => setLoading(false))
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [])

  const recent = summary?.recentOrders || []
  const hour = new Date().getHours()

  return (
    <div style={{ paddingTop: 68 }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
              Good {hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'}, {user?.firstName} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Buy crypto with naira{rates?.ngnPerUsd ? ` · Today's rate ${formatNaira(rates.ngnPerUsd)} / $1` : ''}
            </p>
          </div>
          <Link to="/markets" className="btn btn-primary"><BarChart2 size={16} /> Buy crypto</Link>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px 48px' }}>
        {/* Pending orders needing attention */}
        {!loading && pending.length > 0 && (
          <div className="card" style={{ marginBottom: 24, borderColor: 'rgba(245,158,11,0.5)' }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={18} style={{ color: 'var(--yellow)' }} /> Pending transactions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {pending.map((o) => (
                <Link key={o.id} to={`/orders/${o.id}`} className="pending-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {o.image && <img src={o.image} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />}
                      <span style={{ fontWeight: 700 }}>{formatCrypto(o.cryptoAmount, o.symbol)}</span>
                    </div>
                    <OrderStatusBadge status={o.status} size="sm" />
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
                    {formatNaira(o.amountNgn)} · {o.reference}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {o.status === 'awaiting_payment' ? 'Complete payment' : o.status === 'awaiting_receipt' ? 'Upload receipt' : 'View status'}
                    <ArrowRight size={13} />
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{ORDER_STATUS[o.status]?.hint}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Counts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { icon: <Clock size={20} />, label: 'Pending', value: summary?.pendingCount, color: 'var(--yellow)' },
            { icon: <CheckCircle2 size={20} />, label: 'Completed', value: summary?.completedCount, color: 'var(--green)' },
          ].map((s) => (
            <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px' }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--bg-secondary)', color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label} orders</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{loading ? '…' : s.value ?? 0}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>Recent orders</h2>
            <Link to="/orders" style={{ fontSize: 13, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 52, margin: '10px 0' }} />)
          ) : recent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <ClipboardList size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p style={{ fontSize: 14 }}>No orders yet. Pick a coin to buy with naira.</p>
              <Link to="/markets" className="btn btn-primary btn-sm" style={{ marginTop: 16, display: 'inline-flex' }}>Browse coins</Link>
            </div>
          ) : (
            recent.map((o) => <OrderRow key={o.id} order={o} />)
          )}
        </div>

        {/* Quick buy */}
        <div className="card" style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Quick buy</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {(coinsLoading ? [] : coins.slice(0, 10)).map((coin) => (
              <Link key={coin.id} to={`/trade/${coin.id}`} className="quick-coin">
                {coin.image && <img src={coin.image} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{coin.symbol}</div>
                  <div style={{ fontSize: 11, color: coin.change24h >= 0 ? 'var(--green)' : 'var(--red)' }}>{formatChange(coin.change24h)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
