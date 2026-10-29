import React from 'react'
import { Link } from 'react-router-dom'
import {
  Award, Zap, ShieldCheck, TrendingUp, RefreshCw, Lock,
  Headphones, CheckCircle2, ArrowRight, Sparkles, Star
} from 'lucide-react'

export default function WhyUs() {
  const pillars = [
    {
      icon: <Zap size={28} />,
      color: '#60A5FA',
      glow: 'rgba(59, 130, 246, 0.25)',
      title: 'Instant Direct Settlements',
      tag: 'Sub-Minute Dispatch',
      desc: 'No funding delays or escrow holding periods. As soon as payment is confirmed, crypto is dispatched straight into your on-chain destination wallet.',
    },
    {
      icon: <ShieldCheck size={28} />,
      color: '#A5B4FC',
      glow: 'rgba(99, 102, 241, 0.25)',
      title: 'Zero Custodial Risk',
      tag: '100% Non-Custodial',
      desc: 'We never hold your coins on our books. Funds transfer directly to personal hardware or mobile wallets where only you control your private keys.',
    },
    {
      icon: <TrendingUp size={28} />,
      color: '#34D399',
      glow: 'rgba(20, 241, 149, 0.25)',
      title: '8 Top Coins & Deep Liquidity',
      tag: 'Deep Orderbooks',
      desc: 'Buy and sell Bitcoin, Ethereum, USDT, BNB, XRP, USDC, Solana and TRON at rates based on live naira P2P prices.',
    },
    {
      icon: <RefreshCw size={28} />,
      color: '#FBBF24',
      glow: 'rgba(245, 158, 11, 0.25)',
      title: 'Transparent Sub-Second Rates',
      tag: 'Guaranteed Lock',
      desc: 'What you see is exactly what you get. No inflated retail spreads, hidden deposit charges, or surprise withdrawal deduction fees at checkout.',
    },
    {
      icon: <Lock size={28} />,
      color: '#38BDF8',
      glow: 'rgba(14, 165, 233, 0.25)',
      title: 'Bank-Grade Fortified Security',
      tag: '256-Bit SSL Fortified',
      desc: 'Every transaction is protected by end-to-end encryption, automated verification logic, and strict compliance with global digital asset protocols.',
    },
    {
      icon: <Headphones size={28} />,
      color: '#F472B6',
      glow: 'rgba(236, 72, 153, 0.25)',
      title: '24/7 Dedicated Concierge Desk',
      tag: 'Average Response < 3m',
      desc: 'Round-the-clock VIP support through Live Chat, WhatsApp, and Telegram. Instant assistance with payments, confirmations, and custom requests.',
    },
  ]

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', paddingTop: 80 }}>
      {/* Hero Header */}
      <section
        style={{
          padding: '70px 0 60px',
          background: 'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(245, 158, 11, 0.2) 0%, rgba(6, 11, 24, 0.98) 75%)',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(245, 158, 11, 0.15)',
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
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#FBBF24',
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            <Award size={14} color="#F59E0B" />
            <span>THE LUXURY CRYPTO ADVANTAGE</span>
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
            Why Discerning Traders Choose{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Kryptella
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
            Purpose-built for investors and business owners who refuse to compromise on security,
            speed, or sovereignty. Discover how our architecture sets the benchmark for Nigerian digital asset exchange.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-glass-primary btn-lg">
              <span>Create Account Free</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/markets" className="btn btn-glass-secondary btn-lg">
              <span>Explore Live Markets</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6 Luxury Feature Cards */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 28,
            }}
          >
            {pillars.map((item, idx) => (
              <div
                key={idx}
                className="card-glass"
                style={{
                  padding: 'clamp(24px, 4vw, 32px)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: item.glow,
                    border: `1px solid ${item.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    marginBottom: 20,
                    boxShadow: `0 0 20px ${item.glow}`,
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, flexGrow: 1, marginBottom: 18 }}>
                  {item.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: item.color, fontSize: 12, fontWeight: 700 }}>
                  <span>{item.tag}</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 60 }}>
            <Link to="/register" className="btn btn-glass-primary btn-lg">
              <span>Experience Kryptella Today</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
