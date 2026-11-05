import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import OrderStatusBadge from './OrderStatusBadge'
import { formatNaira, formatCrypto, formatDate } from '../utils/format'

// One order in a list (dashboard + orders page)
export default function OrderRow({ order }) {
  return (
    <Link to={`/orders/${order.id}`} className="order-row" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      padding: '14px 12px', margin: '0 -12px', borderRadius: 10, borderBottom: '1px solid var(--border-light)',
      textDecoration: 'none', transition: 'background 0.15s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        {order.image
          ? <img src={order.image} alt="" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
          : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent-light)', flexShrink: 0 }} />}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span className={`type-pill type-${order.type === 'sell' ? 'sell' : 'buy'}`}>{order.type === 'sell' ? 'Sell' : 'Buy'}</span>
            {formatCrypto(order.cryptoAmount, order.symbol)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {order.reference} · {formatDate(order.createdAt)}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: order.type === 'sell' ? 'var(--green)' : undefined }}>
            {order.type === 'sell' ? '+' : ''}{formatNaira(order.amountNgn)}
          </div>
          <OrderStatusBadge status={order.status} type={order.type} size="sm" />
        </div>
        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
      </div>
    </Link>
  )
}
