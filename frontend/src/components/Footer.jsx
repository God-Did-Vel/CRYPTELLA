import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Zap, Globe, ArrowUpRight, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Footer() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #070B14 0%, #04070F 100%)',
        borderTop: '1px solid rgba(56, 189, 248, 0.15)',
        padding: '70px 0 36px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '25%',
          width: '50vw',
          height: 180,
          background: 'radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: 40,
            marginBottom: 56,
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: 280 }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 16,
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: 'rgba(245, 158, 11, 0.08)',
                  borderRadius: 12,
                  border: '1px solid rgba(245, 158, 11, 0.22)',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)',
                  padding: 4,
                }}
              >
                <img
                  src="https://res.cloudinary.com/duweg8kpv/image/upload/v1790775110/k-logo-good-removebg-preview_c50puh.png"
                  alt="Kryptella Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    maxHeight: 34,
                    maxWidth: 34,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))',
                    transition: 'transform 0.25s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>
              <div>
                <span style={{ fontWeight: 900, fontSize: 21, color: '#FFFFFF', letterSpacing: '-0.5px' }}>     
KRYPTELLA
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#FBBF24',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Direct Settlement
                </span>
              </div>
            </Link>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
              The ultra-premium, non-custodial crypto portal. Direct blockchain settlement with naira bank transfer in Nigeria.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: <ShieldCheck size={16} />, title: 'Bank-Grade Security' },
                { icon: <Zap size={16} />, title: 'Sub-Minute Dispatch' },
                { icon: <Globe size={16} />, title: '8 Top Coins Supported' },
              ].map((item, i) => (
                <div
                  key={i}
                  title={item.title}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60A5FA',
                    transition: 'all 0.2s',
                  }}
                >
                  {item.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Trade Links */}
          <div>
            <h4 style={{ fontWeight: 800, marginBottom: 18, fontSize: 15, color: '#FFFFFF', letterSpacing: '0.02em' }}>
              Trading & Markets
            </h4>
            {(isAdmin
              ? [['Overview', '/admin'], ['Manage Orders', '/admin/orders'], ['User Management', '/admin/users'], ['Markets', '/markets']]
              : [['Live Markets', '/markets'], ['Buy Crypto', '/markets'], ['Sell Crypto', '/markets?side=sell'], ['My Orders', '/orders'], ['Customer Dashboard', '/dashboard']]
            ).map(([l, to]) => (
              <Link
                key={l}
                to={to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--text-secondary)',
                  fontSize: 14,
                  marginBottom: 12,
                  transition: 'color 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#60A5FA'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span>{l}</span>
              </Link>
            ))}
          </div>

          {/* Company (Removed Careers and Press) */}
          <div>
            <h4 style={{ fontWeight: 800, marginBottom: 18, fontSize: 15, color: '#FFFFFF', letterSpacing: '0.02em' }}>
              Company
            </h4>
            {[
              ['About Us', '/#about', 'about'],
              ['How It Works', '/#how-it-works', 'how-it-works'],
              ['Why Kryptella', '/#why-us', 'why-us'],
            ].map(([l, to, id]) => (
              <Link
                key={l}
                to={to}
                onClick={() => {
                  if (window.location.pathname === '/') {
                    const el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                style={{
                  display: 'block',
                  color: 'var(--text-secondary)',
                  fontSize: 14,
                  marginBottom: 12,
                  transition: 'color 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#60A5FA'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                {l}
              </Link>
            ))}
          </div>

          {/* Support (Linked directly to new pages) */}
          <div>
            <h4 style={{ fontWeight: 800, marginBottom: 18, fontSize: 15, color: '#FFFFFF', letterSpacing: '0.02em' }}>
              Kryptella & Legal
            </h4>
            {[
              ['Help Center', '/help'],
              ['Contact Us', '/contact'],
              ['Privacy Policy', '/privacy'],
              ['Terms of Service', '/terms'],
            ].map(([l, to]) => (
              <Link
                key={l}
                to={to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--text-secondary)',
                  fontSize: 14,
                  marginBottom: 12,
                  transition: 'color 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#F59E0B'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span>{l}</span>
                <ArrowUpRight size={13} style={{ opacity: 0.6 }} />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: 26,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} Kryptella. All rights reserved. Direct Non-Custodial Settlement.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Crypto trading involves market risk. Always verify recipient wallet addresses.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
