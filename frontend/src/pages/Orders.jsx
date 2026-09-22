import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Plus } from 'lucide-react'
import api from '../utils/api'
import OrderRow from '../components/OrderRow'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'completed', label: 'Completed' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'expired', label: 'Expired' },
]

export default function Orders() {
  const [filter, setFilter] = useState('all')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = filter === 'all' ? { limit: 200 } : { status: filter, limit: 200 }
    api.get('/orders', { params })
      .then(({ data }) => setOrders(data.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <div style={{ paddingTop: 68 }}>
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>My Orders</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Track your crypto purchases</p>
          </div>
          <Link to="/markets" className="btn btn-primary"><Plus size={16} /> Buy crypto</Link>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 24px 48px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`chip ${filter === f.id ? 'chip-active' : ''}`} aria-pressed={filter === f.id}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="card">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 52, margin: '10px 0' }} />)
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
              <ClipboardList size={36} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p style={{ fontSize: 14 }}>{filter === 'all' ? "You haven't placed any orders yet." : 'No orders here.'}</p>
              <Link to="/markets" className="btn btn-primary btn-sm" style={{ marginTop: 16, display: 'inline-flex' }}>Buy your first crypto</Link>
            </div>
          ) : (
            orders.map((o) => <OrderRow key={o.id} order={o} />)
          )}
        </div>
      </div>
    </div>
  )
}
