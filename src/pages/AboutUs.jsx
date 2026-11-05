import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, Zap, Lock, Award, CheckCircle2, ArrowRight,
  TrendingUp, Globe, Sparkles, Building2, Users2, ShieldAlert
} from 'lucide-react'

export default function AboutUs() {
  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', paddingTop: 80 }}>
      {/* Hero Section */}
      <section
        style={{
          padding: '70px 0 60px',
          background: 'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(30, 58, 138, 0.4) 0%, rgba(6, 11, 24, 0.98) 75%)',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 840 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 18px',
              borderRadius: 9999,
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(96, 165, 250, 0.35)',
              color: '#93C5FD',
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            <Sparkles size={14} color="#F59E0B" />
            <span>INSTITUTIONAL DIRECT SETTLEMENT PLATFORM</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              lineHeight: 1.15,
              color: '#FFFFFF',
              marginBottom: 20,
            }}
          >
            Empowering Sovereign Crypto Trading{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Without Middleman Custody
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(15px, 2.5vw, 18px)',
              color: '#94A3B8',
              lineHeight: 1.7,
              margin: '0 auto 36px',
            }}
          >
            Kryptella was established with a singular mission: to eliminate custodial risk, withdrawal delays,
            and inflated exchange spreads for African and international crypto investors through automated direct settlement.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-glass-primary btn-lg">
              <span>Join Kryptella Today</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/markets" className="btn btn-glass-secondary btn-lg">
              <span>View Live Markets</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section style={{ padding: '40px 0', background: 'rgba(11, 18, 38, 0.6)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 20,
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 900, color: '#60A5FA' }}>₦14.2B+</div>
              <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>Total Volume Dispatched</div>
            </div>
            <div>
              <div style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 900, color: '#F59E0B' }}>&lt; 3 Mins</div>
              <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>Avg Blockchain Settlement</div>
            </div>
            <div>
              <div style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 900, color: '#34D399' }}>100%</div>
              <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>Non-Custodial Delivery</div>
            </div>
            <div>
              <div style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 900, color: '#A78BFA' }}>25,000+</div>
              <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600 }}>Verified Traders Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy & Architecture */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ maxWidth: 840, margin: '0 auto 60px', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, color: '#FFFFFF', marginBottom: 16 }}>
              The Non-Custodial Advantage
            </h2>
            <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.7 }}>
              Unlike traditional exchanges that trap your fiat and cryptocurrency in centralized custodial pools,
              Kryptella operates on pure sovereign settlement:
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            <div className="card-glass" style={{ padding: 'clamp(22px, 4vw, 32px)' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60A5FA',
                  marginBottom: 20,
                }}
              >
                <Zap size={26} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
                Direct To Your Private Wallet
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7 }}>
                When you buy Bitcoin, Solana, or USDT on Kryptella, it is dispatched directly from wholesale liquidity to your
                specified Ledger, MetaMask, Trust Wallet, or exchange address. You own your private keys at all times.
              </p>
            </div>

            <div className="card-glass" style={{ padding: 'clamp(22px, 4vw, 32px)' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F59E0B',
                  marginBottom: 20,
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
                Zero Account Freeze Threat
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7 }}>
                Because Kryptella holds zero customer custody or internal wallet balances, your hard-earned funds are never
                vulnerable to platform liquidations, frozen withdrawal buttons, or exchange insolvencies.
              </p>
            </div>

            <div className="card-glass" style={{ padding: 'clamp(22px, 4vw, 32px)' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34D399',
                  marginBottom: 20,
                }}
              >
                <TrendingUp size={26} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
                Zero Spread Inflation
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7 }}>
                We stream deep liquidity quotations directly from tier-1 institutional order books. The rate you see at checkout
                is locked with zero surprise withdrawal fees or hidden payment penalties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Concierge Desk */}
      <section style={{ padding: '70px 0', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 740 }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#FFFFFF', marginBottom: 16 }}>
            Concierge Institutional Support
          </h2>
          <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.7, marginBottom: 32 }}>
            Whether executing an everyday purchase of ₦20,000 or an OTC block trade exceeding ₦50,000,000,
            our specialized settlement operations team is available 24/7 to guide and verify your order.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-glass-secondary">
              <span>Contact Concierge Desk</span>
            </Link>
            <Link to="/help" className="btn btn-glass-secondary">
              <span>Visit Help Center</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
