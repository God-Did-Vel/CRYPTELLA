import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Zap, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)',
      padding: '60px 0 32px',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 18, color: '#fff',
              }}>C</div>
              <span style={{ fontWeight: 800, fontSize: 20 }}>Cryptella</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 240 }}>
              The fastest and most secure platform to buy and sell altcoins in Nigeria and beyond.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {[<Shield size={16} />, <Zap size={16} />, <Globe size={16} />].map((icon, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: 8, background: 'var(--bg-card)',
                  border: '1px solid var(--border)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'var(--accent)',
                }}>{icon}</div>
              ))}
            </div>
          </div>

          {/* Trade */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Trade</h4>
            {['Markets', 'Buy Crypto', 'Sell Crypto', 'Portfolio'].map((l) => (
              <Link key={l} to="/markets" style={{
                display: 'block', color: 'var(--text-secondary)', fontSize: 14,
                marginBottom: 10, transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color='#6366F1'}
              onMouseLeave={e => e.currentTarget.style.color='var(--text-secondary)'}
              >{l}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Company</h4>
            {['About Us', 'Blog', 'Careers', 'Press'].map((l) => (
              <Link key={l} to="/" style={{
                display: 'block', color: 'var(--text-secondary)', fontSize: 14,
                marginBottom: 10, transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color='#6366F1'}
              onMouseLeave={e => e.currentTarget.style.color='var(--text-secondary)'}
              >{l}</Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Support</h4>
            {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map((l) => (
              <Link key={l} to="/" style={{
                display: 'block', color: 'var(--text-secondary)', fontSize: 14,
                marginBottom: 10, transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color='#6366F1'}
              onMouseLeave={e => e.currentTarget.style.color='var(--text-secondary)'}
              >{l}</Link>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border)', paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Cryptella. All rights reserved.
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Crypto trading involves risk. Only invest what you can afford to lose.
          </p>
        </div>
      </div>
    </footer>
  )
}
