import React from 'react'
import { statusMeta } from '../utils/orders'

export default function OrderStatusBadge({ status, type = 'buy', size = 'md' }) {
  const meta = statusMeta(status, type)
  return (
    <span className="badge" style={{
      background: meta.bg, color: meta.color,
      fontSize: size === 'sm' ? 11 : 12, padding: size === 'sm' ? '2px 8px' : '3px 10px',
    }}>
      {meta.pending && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color, animation: 'pulse-dot 1.6s ease-in-out infinite' }} />
      )}
      {meta.label}
    </span>
  )
}
