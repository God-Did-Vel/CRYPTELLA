import React from 'react'
import { Link } from 'react-router-dom'
import { Home, TrendingUp } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px', textAlign: 'center',
      background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(99,102,241,0.1) 0%, transparent 60%)',
    }}>
      <div className="fade-in">
        <div style={{
          fontSize: 100, fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg, #6366F1, #A78BFA)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 16,
        }}>404</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Page Not Found</h1>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 36, maxWidth: 400 }}>
          Looks like this page went to the moon and didn't come back. Let's get you somewhere useful.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary btn-lg"><Home size={18} /> Go Home</Link>
          <Link to="/markets" className="btn btn-secondary btn-lg"><TrendingUp size={18} /> View Markets</Link>
        </div>
      </div>
    </div>
  )
}
