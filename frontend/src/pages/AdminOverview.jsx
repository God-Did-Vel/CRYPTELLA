import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Hourglass, Clock, CheckCircle2, TrendingUp, TrendingDown, Wallet, ArrowRight, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { formatNaira, formatUsd, formatCrypto, formatDate } from '../utils/format'
import { useRates } from '../hooks/useRates'

const Stat = ({ icon, label, value, sub, color, to }) => {
  const body = (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', height: '100%' }}>
      <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--bg-secondary)', color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sub}</div>}
      </div>
    </div>
  )
  return to ? <Link to={to} className="stat-link">{body}</Link> : body
}

export default function AdminOverview() {
  const [data, setData] = useState(null)
  const { rates } = useRates()

  useEffect(() => {
    const load = () => api.get('/admin/overview')
      .then(({ data }) => setData(data.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load overview'))
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [])

  const o = data?.orders || {}
  const v = (x) => (data ? x : '…')

  return (
    <div style={{ paddingTop: 68 }}>
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Admin overview</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              Buy rate {rates?.ngnPerUsd ? `${formatNaira(rates.ngnPerUsd)} / $1` : '—'} · Sell rate {rates?.sell?.ngnPerUsd ? `${formatNaira(rates.sell.ngnPerUsd)} / $1` : '—'}
            </p>
          </div>
          <Link to="/admin/orders" className="btn btn-primary">
            Review orders{o.under_review ? ` (${o.under_review})` : ''} <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 24px 48px' }}>
        <h2 className="admin-section">Needs attention</h2>
        <div className="stat-grid">
          <Stat to="/admin/orders?status=under_review" icon={<Hourglass size={20} />} color="#60A5FA" label="To review (receipts & deposits)" value={v(o.under_review)} />
          <Stat to="/admin/orders?status=awaiting_receipt" icon={<Clock size={20} />} color="var(--yellow)" label="Awaiting receipt" value={v(o.awaiting_receipt)} />
          <Stat to="/admin/orders?status=awaiting_payment" icon={<Clock size={20} />} color="var(--yellow)" label="Awaiting payment / deposit" value={v(o.awaiting_payment)} />
        </div>

        <h2 className="admin-section">Business</h2>
        <div className="stat-grid">
          <Stat to="/admin/users" icon={<Users size={20} />} color="var(--accent)" label="Customers" value={v(data?.users)}
            sub={data ? `${data.newUsersThisWeek} joined this week` : null} />
          <Stat to="/admin/orders?status=completed" icon={<CheckCircle2 size={20} />} color="var(--green)" label="Completed orders" value={v(o.completed)}
            sub={data ? `${data.completed.buy.count} buys · ${data.completed.sell.count} sells · ${data.today.completed} today` : null} />
          <Stat to="/admin/orders?status=completed&type=buy" icon={<TrendingUp size={20} />} color="var(--green)" label="Naira received (buys)" value={data ? formatNaira(data.completed.buy.ngnReceived, 0) : '…'}
            sub={data ? `${formatUsd(data.completed.buy.usd)} of crypto sent · today ${formatNaira(data.today.ngnReceived, 0)}` : null} />
          <Stat to="/admin/orders?status=completed&type=sell" icon={<TrendingDown size={20} />} color="var(--red)" label="Naira paid out (sells)" value={data ? formatNaira(data.completed.sell.ngnPaidOut, 0) : '…'}
            sub={data ? `${formatUsd(data.completed.sell.usd)} of crypto received · today ${formatNaira(data.today.ngnPaidOut, 0)}` : null} />
          <Stat icon={<Wallet size={20} />} color="#EC4899" label="Charges earned" value={data ? formatNaira(data.completed.chargesNgn, 0) : '…'}
            sub={data ? `Today ${formatNaira(data.today.chargesNgn, 0)}` : null} />
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>Oldest orders waiting for review</h2>
            <Link to="/admin/orders?status=under_review" style={{ fontSize: 13, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
              Review queue <ArrowRight size={13} />
            </Link>
          </div>
          {!data ? (
            <div className="skeleton" style={{ height: 120 }} />
          ) : data.needsReview.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '20px 0', textAlign: 'center' }}>Nothing waiting for review. You're all caught up.</p>
          ) : (
            data.needsReview.map((ord) => (
              <Link key={ord.id} to={`/admin/orders?status=under_review&q=${ord.reference}`} className="order-row" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px', margin: '0 -12px',
                borderRadius: 10, borderBottom: '1px solid var(--border-light)', textDecoration: 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  {ord.image && <img src={ord.image} alt="" style={{ width: 28, height: 28, borderRadius: '50%' }} />}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      <span className={`type-pill type-${ord.type === 'sell' ? 'sell' : 'buy'}`}>{ord.type === 'sell' ? 'SELL' : 'BUY'}</span>
                      {formatCrypto(ord.cryptoAmount, ord.symbol)} · {formatNaira(ord.amountNgn)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ord.reference} · {ord.userId?.email}</div>
                  </div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>{formatDate(ord.updatedAt)}</span>
              </Link>
            ))
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          <Link to="/admin/users" className="btn btn-secondary"><UserPlus size={16} /> View customers</Link>
          <Link to="/markets" className="btn btn-secondary"><TrendingUp size={16} /> Market prices</Link>
        </div>
      </div>
    </div>
  )
}
