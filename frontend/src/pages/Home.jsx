import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight, ShieldCheck, Zap, Globe, TrendingUp, Users, Lock, ChevronRight,
  Star, Sparkles, CheckCircle2, Shield, RefreshCw, Wallet, Clock, ArrowUpRight,
  Headphones, ChevronLeft, Award
} from 'lucide-react'
import TickerTape from '../components/TickerTape'
import CoinCard from '../components/CoinCard'
import { useCoins } from '../hooks/useCoins'

const StatBox = ({ value, label, sub }) => (
  <div
    className="card-glass"
    style={{
      padding: 'clamp(14px, 3vw, 20px) clamp(12px, 3vw, 20px)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: '100%',
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        fontSize: 'clamp(22px, 4.5vw, 32px)',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F59E0B 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 4,
        letterSpacing: '-0.5px',
        lineHeight: 1.15,
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 'clamp(12px, 2.8vw, 14px)', fontWeight: 700, color: '#F1F5F9' }}>{label}</div>
    {sub && <div style={{ fontSize: 'clamp(10px, 2.4vw, 11px)', color: '#94A3B8', marginTop: 3 }}>{sub}</div>}
  </div>
)

// Shared style for the hero toast badge (used by both the desktop and the small-screen placement)
const TOAST_STYLE = {
  fontSize: 'clamp(11.5px, 3.2vw, 13px)',
  padding: '7px 16px',
  cursor: 'pointer',
  border: '1px solid rgba(96, 165, 250, 0.35)',
  maxWidth: '100%',
  textAlign: 'center',
  wordBreak: 'break-word',
}

const HERO_SLIDES = [
  {
    id: 1,
    entranceClass: 'slide-from-top',
    tag: '⚡ DIRECT SETTLEMENT ENGINE',
    toast: '⚡ Instant Buy & sell Executed: Confirmed in 60s 🟢',
    title: 'Instant Bitcoin Direct Dispatch',
    renderVisual: () => (
      <div
        className="card-glass"
        style={{
          padding: 'clamp(18px, 4vw, 28px)',
          borderRadius: 22,
          background: 'linear-gradient(145deg, rgba(16, 26, 56, 0.92), rgba(8, 14, 32, 0.96))',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(245, 158, 11, 0.18)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 19,
                fontWeight: 900,
                color: '#fff',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)',
                flexShrink: 0,
              }}
            >
              ₿
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 'clamp(14px, 3.5vw, 17px)', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Bitcoin Direct Settlement</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Blockchain Network: BTC Native</div>
            </div>
          </div>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 9999,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34D399',
              fontSize: 11,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            CONFIRMED 🟢
          </span>
        </div>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.38)',
            borderRadius: 16,
            padding: 'clamp(14px, 3.5vw, 18px)',
            marginBottom: 18,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
            <span style={{ fontSize: 'clamp(12px, 3vw, 13px)', color: '#94A3B8' }}>Executed Amount</span>
            <span style={{ fontSize: 'clamp(14px, 3.6vw, 16px)', fontWeight: 800, color: '#FCD34D', wordBreak: 'break-word' }}>0.75000000 BTC</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
            <span style={{ fontSize: 'clamp(12px, 3vw, 13px)', color: '#94A3B8' }}>Settlement Value</span>
            <span style={{ fontSize: 'clamp(12px, 3.2vw, 14px)', fontWeight: 700, color: '#FFFFFF', wordBreak: 'break-word' }}>$48,250.00 · ₦72,375,000</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
            <span style={{ fontSize: 'clamp(12px, 3vw, 13px)', color: '#94A3B8' }}>Destination Address</span>
            <span style={{ fontSize: 'clamp(11px, 2.8vw, 12px)', fontFamily: 'monospace', color: '#60A5FA', wordBreak: 'break-all' }}>0x71C...49bF</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'clamp(11px, 2.8vw, 12px)', color: '#A5B4FC', flexWrap: 'wrap' }}>
          <CheckCircle2 size={15} color="#10B981" style={{ flexShrink: 0 }} />
          <span>Dispatched directly to private keys · Zero custodial delay</span>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    entranceClass: 'slide-from-left',
    tag: '🚀 ULTRA-HIGH LIQUIDITY',
    toast: '🚀 Market Alert: Solana (SOL) +14.8% 💎',
    title: 'Surging Altcoin Direct Routing',
    renderVisual: () => (
      <div
        className="card-glass"
        style={{
          padding: 'clamp(18px, 4vw, 28px)',
          borderRadius: 22,
          background: 'linear-gradient(145deg, rgba(8, 28, 48, 0.92), rgba(5, 16, 32, 0.96))',
          border: '1px solid rgba(20, 241, 149, 0.35)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(20, 241, 149, 0.18)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #14F195, #9945FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: 900,
                color: '#fff',
                boxShadow: '0 0 20px rgba(20, 241, 149, 0.4)',
                flexShrink: 0,
              }}
            >
              SOL
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 'clamp(14px, 3.5vw, 17px)', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Solana Direct Route</div>
              <div style={{ fontSize: 11, color: '#34D399', fontWeight: 600 }}>+14.82% Last 24 Hours</div>
            </div>
          </div>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 9999,
              background: 'rgba(20, 241, 149, 0.15)',
              border: '1px solid rgba(20, 241, 149, 0.35)',
              color: '#14F195',
              fontSize: 11,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            HIGH LIQUIDITY 💎
          </span>
        </div>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.38)',
            borderRadius: 16,
            padding: 'clamp(14px, 3.5vw, 18px)',
            marginBottom: 18,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
            <span style={{ fontSize: 'clamp(12px, 3vw, 13px)', color: '#94A3B8' }}>Guaranteed Rate</span>
            <span style={{ fontSize: 'clamp(14px, 3.6vw, 16px)', fontWeight: 800, color: '#FFFFFF', wordBreak: 'break-word' }}>$148.50 / SOL</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
            <span style={{ fontSize: 'clamp(12px, 3vw, 13px)', color: '#94A3B8' }}>Settlement Speed</span>
            <span style={{ fontSize: 'clamp(12px, 3.2vw, 14px)', fontWeight: 700, color: '#34D399', wordBreak: 'break-word' }}>~45 Seconds Avg</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
            <span style={{ fontSize: 'clamp(12px, 3vw, 13px)', color: '#94A3B8' }}>Spread Markup</span>
            <span style={{ fontSize: 'clamp(12px, 3.2vw, 14px)', fontWeight: 700, color: '#60A5FA' }}>0.0% Hidden Markup</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'clamp(11px, 2.8vw, 12px)', color: '#6EE7B7', flexWrap: 'wrap' }}>
          <Sparkles size={15} color="#14F195" style={{ flexShrink: 0 }} />
          <span>Real-time sub-second depth direct from global orderbooks</span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    entranceClass: 'slide-from-bottom',
    tag: '🛡️ NON-CUSTODIAL INTEGRITY',
    toast: '🛡️ Zero wallet custody. Fast Payment✨',
    title: 'Fortified Non-Custodial Architecture',
    renderVisual: () => (
      <div
        className="card-glass"
        style={{
          padding: 'clamp(18px, 4vw, 28px)',
          borderRadius: 22,
          background: 'linear-gradient(145deg, rgba(20, 16, 48, 0.92), rgba(8, 10, 28, 0.96))',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.25)',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.45)',
                flexShrink: 0,
              }}
            >
              <Shield size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 'clamp(14px, 3.5vw, 17px)', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Zero Wallet Custody</div>
              <div style={{ fontSize: 11, color: '#A5B4FC' }}>No internal wallets or locked funds</div>
            </div>
          </div>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: 9999,
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              color: '#A5B4FC',
              fontSize: 11,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            PROTECTED ✨
          </span>
        </div>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.38)',
            borderRadius: 16,
            padding: 'clamp(14px, 3.5vw, 18px)',
            marginBottom: 18,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>Step 1</div>
              <div style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pay Direct</div>
            </div>
            <ArrowRight size={13} color="#60A5FA" style={{ flexShrink: 0 }} />
            <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>Step 2</div>
              <div style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 700, color: '#60A5FA', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Verify</div>
            </div>
            <ArrowRight size={13} color="#60A5FA" style={{ flexShrink: 0 }} />
            <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>Step 3</div>
              <div style={{ fontSize: 'clamp(11px, 2.8vw, 13px)', fontWeight: 700, color: '#34D399', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Your Keys</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'clamp(11px, 2.8vw, 12px)', color: '#C7D2FE', flexWrap: 'wrap' }}>
          <Lock size={15} color="#818CF8" style={{ flexShrink: 0 }} />
          <span>Your private keys remain 100% yours. Cryptella holds zero customer custody.</span>
        </div>
      </div>
    ),
  },
]

const TESTIMONIALS = [
  {
    name: 'Adewale O.',
    handle: '@adewale_btc',
    verified: 'Verified Trade 0.85 BTC',
    text: "The fastest direct settlement platform I've ever experienced in Nigeria. No funding nonsense, money transferred, and BTC landed in my Ledger in under 3 minutes.",
    stars: 5,
  },
  {
    name: 'Chisom E.',
    handle: '@chisom_crypto',
    verified: 'Verified Trade 1,450 USDT',
    text: "Finally a platform that treats you like a real crypto native! Beautiful glass interface, fair rates without crazy spreads, and direct delivery straight to my Trust Wallet.",
    stars: 5,
  },
  {
    name: 'Emeka N.',
    handle: '@emeka_defi',
    verified: 'Verified Trade 18 SOL',
    text: "Zero custody model is why I trust Kryptella with large volume. They never hold your coins on an exchange; they settle directly to your chosen address.",
    stars: 5,
  },
  {
    name: 'Fatima I.',
    handle: '@fatima_trades',
    verified: 'Verified Trade 2.4 ETH',
    text: "Top tier concierge service. Had a small question about proof of payment and their Telegram support resolved it in literally 90 seconds. Exceptional.",
    stars: 5,
  },
  {
    name: 'Tunde B.',
    handle: '@tunde_alt',
    verified: 'Verified Trade 3,200 USDT',
    text: "The rate transparency is unbeatable. What you see is what you get, no hidden funding withdrawal fees. Kryptella has completely replaced P2P for me.",
    stars: 5,
  },
  {
    name: 'Dr. Aisha M.',
    handle: '@aisha_fintech',
    verified: 'Verified Trade 0.45 BTC',
    text: "Classic, ultra-premium aesthetic and rock-solid execution. Seamless flow from bank transfer to blockchain dispatch. Highly recommended for professionals.",
    stars: 5,
  },
]

export default function Home() {
  const { coins, loading } = useCoins()
  const topCoins = coins.slice(0, 8)
  const location = useLocation()

  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Smooth hash scroll on load or hash change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 120)
      }
    }
  }, [location.hash])

  // Carousel Auto-play with pause-on-hover
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [isPaused])

  const currentSlide = HERO_SLIDES[activeSlide]

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', overflow: 'hidden' }}>
      {/* Ticker tape just below fixed navbar */}
      <div style={{ paddingTop: 70 }}>
        <TickerTape coins={coins} />
      </div>

      {/* =========================================================
          HERO SECTION: 3-IMAGE CAROUSEL & DIRECTIONAL ENTRANCES
      ========================================================= */}
      <section
        className="hero-section"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          minHeight: '88vh',
          display: 'flex',
          alignItems: 'center',
          background: 'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(30, 58, 138, 0.35) 0%, rgba(6, 11, 24, 0.95) 75%)',
          padding: '70px 0 60px',
          position: 'relative',
        }}
      >
        {/* Ambient Cosmic Lights */}
        <div
          style={{
            position: 'absolute',
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12), transparent 70%)',
            top: -120,
            right: -100,
            pointerEvents: 'none',
            filter: 'blur(50px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1), transparent 70%)',
            bottom: -60,
            left: -80,
            pointerEvents: 'none',
            filter: 'blur(60px)',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Active Carousel Trading Toast Banner — DESKTOP placement (above the grid).
              Hidden on tablet & mobile, where it sits under the headline instead. */}
          <div className="hero-toast-desktop">
            <div
              key={`toast-${activeSlide}`}
              className="luxury-glow-badge slide-from-top"
              style={TOAST_STYLE}
            >
              <span>{currentSlide.toast}</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
              gap: 48,
              alignItems: 'center',
            }}
            className="hero-grid"
          >
            {/* Left Column: Headline & Action Buttons */}
            <div className="hero-copy">
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 14px',
                  borderRadius: 9999,
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  color: '#93C5FD',
                  fontSize: 12,
                  fontWeight: 700,
                  marginBottom: 20,
                }}
              >
                <Zap size={14} color="#F59E0B" />
                <span>{currentSlide.tag}</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(28px, 5.5vw, 62px)',
                  fontWeight: 900,
                  lineHeight: 1.12,
                  letterSpacing: '-1.5px',
                  color: '#FFFFFF',
                  marginBottom: 20,
                  wordBreak: 'normal',
                  overflowWrap: 'break-word',
                }}
                className="hero-title"
              >
                Direct Settlement.{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F59E0B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Zero Delays.
                </span>{' '}
                Direct to Your Wallet.
              </h1>

              {/* Active Carousel Trading Toast Banner — TABLET & MOBILE placement
                  (directly under "Direct to Your Wallet."). Hidden on desktop. */}
              <div className="hero-toast-mobile">
                <div
                  key={`toast-mobile-${activeSlide}`}
                  className="luxury-glow-badge slide-from-top"
                  style={TOAST_STYLE}
                >
                  <span>{currentSlide.toast}</span>
                </div>
              </div>

              <p
                style={{
                  fontSize: 'clamp(14.5px, 3.5vw, 17px)',
                  color: '#94A3B8',
                  lineHeight: 1.65,
                  marginBottom: 32,
                  maxWidth: 540,
                }}
              >
                Buy Bitcoin, USDT, Solana, and 20+ top altcoins with simple bank transfer.
                Funds settle straight into your private crypto address without custodial delays.
              </p>

              {/* Glassmorphic Action Buttons */}
              <div className="hero-actions" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 36 }}>
                <Link to="/register" className="btn btn-glass-primary btn-lg">
                  <span>Get Started Free</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/markets" className="btn btn-glass-secondary btn-lg">
                  <span>View Live Markets</span>
                  <ChevronRight size={18} />
                </Link>
              </div>

              {/* Slider Dots & Manual Navigation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  {HERO_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={() => setActiveSlide(idx)}
                      style={{
                        width: idx === activeSlide ? 32 : 10,
                        height: 8,
                        borderRadius: 4,
                        background: idx === activeSlide ? 'linear-gradient(90deg, #3B82F6, #6366F1)' : 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                  0{activeSlide + 1} / 0{HERO_SLIDES.length}
                </span>
              </div>
            </div>

            {/* Right Column: Directional Entrance Animated Visual */}
            <div className="hero-visual" style={{ position: 'relative' }}>
              <div key={currentSlide.id} className={currentSlide.entranceClass}>
                {currentSlide.renderVisual()}
              </div>

              {/* Sub-badge below visual */}
              <div
                style={{
                  marginTop: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  borderRadius: 14,
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#CBD5E1' }}>
                  <ShieldCheck size={16} color="#60A5FA" style={{ flexShrink: 0 }} />
                  <span>Direct Blockchain Settlement Guarantee</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399' }}>99.98% On-Time</span>
              </div>
            </div>
          </div>

          {/* Trust Stat Boxes Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))',
              gap: 14,
              marginTop: 56,
              width: '100%',
            }}
          >
            <StatBox value="20+ Coins" label="Direct Settlement" sub="BTC, ETH, SOL, USDT & more" />
            <StatBox value="0% Hidden Fees" label="Transparent Spread" sub="Direct wholesale rates" />
            <StatBox value="< 3 Minutes" label="Dispatch Speed" sub="Average confirmation time" />
            <StatBox value="100% Non-Custodial" label="Your Keys, Your Coins" sub="Direct to personal address" />
          </div>
        </div>
      </section>

      {/* =========================================================
          LIVE MARKETS PREVIEW SECTION
      ========================================================= */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)', position: 'relative' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 40,
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#60A5FA',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 8,
                }}
              >
                <Sparkles size={14} /> LIVE MARKET STREAM
              </div>
              <h2 className="section-title" style={{ color: '#FFFFFF', marginBottom: 6 }}>
                Real-Time Crypto Quotations
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, margin: 0 }}>
                Live settlement rates refreshed dynamically with direct liquidity routing
              </p>
            </div>
            <Link to="/markets" className="btn btn-glass-secondary">
              <span>View All 20+ Markets</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-glass" style={{ padding: 20 }}>
                  <div className="skeleton" style={{ height: 44, width: 44, borderRadius: '50%', marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 18, width: '60%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 28, width: '80%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '50%' }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {topCoins.map((coin) => (
                <CoinCard key={coin.id} coin={coin} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          "ABOUT US" — INSTITUTIONAL DIRECT SETTLEMENT GATEWAY (id="about")
      ========================================================= */}
      <section
        id="about"
        style={{
          scrollMarginTop: '80px',
          padding: '85px 0',
          position: 'relative',
          background: 'linear-gradient(180deg, var(--bg-primary) 0%, rgba(10, 18, 38, 0.5) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 54, maxWidth: 760, margin: '0 auto 54px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: '#60A5FA',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 10,
              }}
            >
              <Award size={14} /> ABOUT KRYPTELLA
            </div>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#FFFFFF', marginBottom: 12 }}>
              Engineering Complete{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F59E0B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Financial Sovereignty
              </span>
            </h2>
            <p className="section-sub" style={{ fontSize: 16, color: '#94A3B8', margin: '0 auto', maxWidth: 660, lineHeight: 1.7 }}>
              Kryptella eliminates custodial holds and withdrawal freezes. We empower traders to swap between Naira and premier crypto directly with non-custodial blockchain dispatch straight into private keys.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(290px, 100%), 1fr))',
              gap: 24,
              marginBottom: 44,
            }}
          >
            <div className="card-glass" style={{ padding: 'clamp(20px, 3.2vw, 28px)', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60A5FA',
                  marginBottom: 16,
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.25)',
                }}
              >
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Instant Direct Dispatch
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, margin: 0, flexGrow: 1 }}>
                Transactions settle on-chain directly into your cold storage, hardware wallet, or personal software app. No funds reside on exchange hot wallets.
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: '#60A5FA', fontSize: 12, fontWeight: 700 }}>
                <span>&lt; 3 Min Settlement SLA</span>
                <ArrowRight size={13} />
              </div>
            </div>

            <div className="card-glass" style={{ padding: 'clamp(20px, 3.2vw, 28px)', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F59E0B',
                  marginBottom: 16,
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
                }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Bank-Grade Fortified Security
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, margin: 0, flexGrow: 1 }}>
                Protected with 256-bit SSL encryption, strict validation pipelines, and cryptographic proof-of-payment receipts for every customer order.
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: '#F59E0B', fontSize: 12, fontWeight: 700 }}>
                <span>100% Non-Custodial Protocol</span>
                <ArrowRight size={13} />
              </div>
            </div>

            <div className="card-glass" style={{ padding: 'clamp(20px, 3.2vw, 28px)', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34D399',
                  marginBottom: 16,
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.25)',
                }}
              >
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Deep Institutional Liquidity
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, margin: 0, flexGrow: 1 }}>
                Stream live prices from premier global order books. What you see is locked at checkout with 0% hidden spread inflation or surprise fees.
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: '#34D399', fontSize: 12, fontWeight: 700 }}>
                <span>Sub-Second Price Feeds</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>

          {/* Interactive About Story Banner */}
          <div
            className="card-glass"
            style={{
              padding: 'clamp(20px, 3.5vw, 28px)',
              background: 'linear-gradient(145deg, rgba(16, 26, 56, 0.6) 0%, rgba(8, 14, 32, 0.8) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginBottom: 4 }}>
                Ready to Experience Sovereign Trading?
              </div>
              <div style={{ fontSize: 14, color: '#94A3B8' }}>
                Join thousands of verified Nigerian traders who settle crypto without custody delays.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/about" className="btn btn-glass-secondary">
                <span>Read Full Story</span>
                <ChevronRight size={16} />
              </Link>
              <Link to="/register" className="btn btn-glass-primary">
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          "WHY CHOOSE KRYPTELLA" — 6 BOXES (id="why-us")
      ========================================================= */}
      <section id="why-us" style={{ scrollMarginTop: '80px', padding: '85px 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 54, maxWidth: 680, margin: '0 auto 54px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: '#F59E0B',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 10,
              }}
            >
              <Award size={14} /> THE LUXURY CRYPTO ADVANTAGE
            </div>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#FFFFFF' }}>
              Why Choose{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 50%, #D97706 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Kryptella?
              </span>
            </h2>
            <p className="section-sub" style={{ fontSize: 16, color: '#94A3B8' }}>
              Built for traders who value absolute speed, security, and full sovereignty over their digital assets.
            </p>
          </div>

          {/* 6 Boxes Strictly Responsive: 3 cols desktop, 2 tablet, 1 mobile */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
            }}
            className="why-grid"
          >
            {/* Box 1 */}
            <div className="card-glass" style={{ padding: 'clamp(20px, 3.2vw, 28px)', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.1))',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60A5FA',
                  marginBottom: 16,
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.25)',
                }}
              >
                <Zap size={26} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Instant Direct Settlements
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, flexGrow: 1, margin: 0 }}>
                Fast payment confirmation and direct blockchain delivery without funding delays. No balance waiting periods or manual escrow freezes.
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: '#60A5FA', fontSize: 12, fontWeight: 700 }}>
                <span>Sub-Minute Settlement</span>
                <ArrowRight size={13} />
              </div>
            </div>

            {/* Box 2 */}
            <div className="card-glass" style={{ padding: 'clamp(20px, 3.2vw, 28px)', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.1))',
                  border: '1px solid rgba(165, 180, 252, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#A5B4FC',
                  marginBottom: 16,
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)',
                }}
              >
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Zero Custodial Risk
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, flexGrow: 1, margin: 0 }}>
                We never hold customer funds in proprietary wallets. Crypto goes straight to your personal, non-custodial address where only you own the private keys.
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: '#A5B4FC', fontSize: 12, fontWeight: 700 }}>
                <span>100% Non-Custodial</span>
                <ArrowRight size={13} />
              </div>
            </div>

            {/* Box 3 */}
            <div className="card-glass" style={{ padding: 'clamp(20px, 3.2vw, 28px)', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(20, 241, 149, 0.2), rgba(6, 182, 212, 0.1))',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34D399',
                  marginBottom: 16,
                  boxShadow: '0 0 20px rgba(20, 241, 149, 0.25)',
                }}
              >
                <TrendingUp size={26} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                20+ Premier Altcoins
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, flexGrow: 1, margin: 0 }}>
                Deep institutional liquidity across Bitcoin, Ethereum, Solana, USDT, BNB, Avalanche, and all leading layer-1 and layer-2 assets.
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: '#34D399', fontSize: 12, fontWeight: 700 }}>
                <span>Deep Liquidity Pool</span>
                <ArrowRight size={13} />
              </div>
            </div>

            {/* Box 4 */}
            <div className="card-glass" style={{ padding: 'clamp(20px, 3.2vw, 28px)', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(234, 88, 12, 0.1))',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FBBF24',
                  marginBottom: 16,
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
                }}
              >
                <RefreshCw size={26} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Live Sub-Second Pricing
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, flexGrow: 1, margin: 0 }}>
                Direct global market rates without inflated hidden spreads or arbitrary markups. What you lock at checkout is exactly what you receive.
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: '#FBBF24', fontSize: 12, fontWeight: 700 }}>
                <span>Guaranteed Rate Lock</span>
                <ArrowRight size={13} />
              </div>
            </div>

            {/* Box 5 */}
            <div className="card-glass" style={{ padding: 'clamp(20px, 3.2vw, 28px)', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(37, 99, 235, 0.1))',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8',
                  marginBottom: 16,
                  boxShadow: '0 0 20px rgba(14, 165, 233, 0.25)',
                }}
              >
                <Lock size={26} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Bank-Grade Fortified Security
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, flexGrow: 1, margin: 0 }}>
                SSL 256-bit encryption, strict cryptographic verification, automated proof-of-payment receipts, and regulatory compliance standards.
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: '#38BDF8', fontSize: 12, fontWeight: 700 }}>
                <span>256-Bit SSL Fortified</span>
                <ArrowRight size={13} />
              </div>
            </div>

            {/* Box 6 */}
            <div className="card-glass" style={{ padding: 'clamp(20px, 3.2vw, 28px)', display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(244, 63, 94, 0.1))',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F472B6',
                  marginBottom: 16,
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.25)',
                }}
              >
                <Headphones size={26} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                24/7 Dedicated Concierge
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65, flexGrow: 1, margin: 0 }}>
                Real-time support via Live Chat, WhatsApp, and Telegram. Instant assistance with payments, address confirmations, and custom requests.
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: '#F472B6', fontSize: 12, fontWeight: 700 }}>
                <span>Average Response &lt; 5m</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          "HOW IT WORKS" — DIRECT SETTLEMENT TIMELINE (id="how-it-works")
      ========================================================= */}
      <section
        id="how-it-works"
        style={{
          scrollMarginTop: '80px',
          padding: '85px 0',
          background: 'var(--bg-secondary)',
          position: 'relative',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 54, maxWidth: 640, margin: '0 auto 54px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: '#34D399',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 10,
              }}
            >
              <Sparkles size={14} /> STREAMLINED EXECUTION
            </div>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#FFFFFF' }}>
              How Direct Settlement Works
            </h2>
            <p className="section-sub" style={{ fontSize: 16, color: '#94A3B8' }}>
              No preliminary wallet funding. Complete your purchase in 4 clear, transparent steps.
            </p>
          </div>

          {/* 4-Step Direct Settlement Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 20,
              position: 'relative',
            }}
            className="steps-grid"
          >
            {/* Step 1 */}
            <div
              className="card-glass"
              style={{
                padding: 'clamp(20px, 3vw, 26px)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 17,
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                  marginBottom: 16,
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Choose Crypto & Amount
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
                Select your preferred altcoin, enter your target naira amount, and paste your personal destination wallet address.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="card-glass"
              style={{
                padding: 'clamp(20px, 3vw, 26px)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1, #4338CA)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 17,
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
                  marginBottom: 16,
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Make Fast Payment
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
                Pay securely via your normal mobile banking transfer to the dedicated account provided on checkout.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="card-glass"
              style={{
                padding: 'clamp(20px, 3vw, 26px)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F59E0B, #B45309)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 17,
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
                  marginBottom: 16,
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Instant Confirmation
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
                Upload your payment receipt. Kryptella's automated verification engine confirms your transaction within minutes.
              </p>
            </div>

            {/* Step 4 */}
            <div
              className="card-glass"
              style={{
                padding: 'clamp(20px, 3vw, 26px)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10B981, #047857)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 17,
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                  marginBottom: 16,
                }}
              >
                4
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Receive Crypto Directly
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, margin: 0, flexGrow: 1 }}>
                Cryptocurrency is broadcasted directly to your personal address on-chain. Track full blockchain TX hash in real-time.
              </p>
            </div>
          </div>

          {/* Action button below steps */}
          <div style={{ textAlign: 'center', marginTop: 46 }}>
            <Link to="/register" className="btn btn-glass-primary btn-lg">
              <span>Create Free Account</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTINUOUS SLIDING TESTIMONIALS (INFINITE MARQUEE)
      ========================================================= */}
      <section style={{ padding: '85px 0', overflow: 'hidden', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 44, maxWidth: 640, margin: '0 auto 44px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: '#F59E0B',
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 10,
              }}
            >
              <Star size={14} fill="#F59E0B" /> VERIFIED TRADER EXPERIENCES
            </div>
            <h2 className="section-title" style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: '#FFFFFF' }}>
              What High-Volume Traders Say
            </h2>
            <p className="section-sub" style={{ fontSize: 16, color: '#94A3B8' }}>
              Real direct-settlement stories from crypto investors across Nigeria
            </p>
          </div>
        </div>

        {/* Continuous Marquee Container */}
        <div className="marquee-container">
          <div className="marquee-track">
            {/* First Set */}
            {TESTIMONIALS.map((item, idx) => (
              <div
                key={`testi-1-${idx}`}
                className="card-glass"
                style={{
                  width: 'clamp(280px, 86vw, 360px)',
                  flexShrink: 0,
                  padding: 'clamp(20px, 3.5vw, 24px)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: item.stars }).map((_, i) => (
                      <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#34D399',
                      background: 'rgba(16, 185, 129, 0.12)',
                      padding: '3px 10px',
                      borderRadius: 9999,
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                    }}
                  >
                    {item.verified}
                  </span>
                </div>
                <p style={{ fontSize: 13.5, color: '#CBD5E1', lineHeight: 1.65, flexGrow: 1, marginBottom: 18 }}>
                  "{item.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 14,
                      color: '#fff',
                      boxShadow: '0 0 14px rgba(59, 130, 246, 0.4)',
                      flexShrink: 0,
                    }}
                  >
                    {item.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#FFFFFF' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{item.handle}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Duplicated Set for Seamless Continuous Infinite Scroll */}
            {TESTIMONIALS.map((item, idx) => (
              <div
                key={`testi-2-${idx}`}
                className="card-glass"
                style={{
                  width: 'clamp(280px, 86vw, 360px)',
                  flexShrink: 0,
                  padding: 'clamp(20px, 3.5vw, 24px)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: item.stars }).map((_, i) => (
                      <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#34D399',
                      background: 'rgba(16, 185, 129, 0.12)',
                      padding: '3px 10px',
                      borderRadius: 9999,
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                    }}
                  >
                    {item.verified}
                  </span>
                </div>
                <p style={{ fontSize: 13.5, color: '#CBD5E1', lineHeight: 1.65, flexGrow: 1, marginBottom: 18 }}>
                  "{item.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 14,
                      color: '#fff',
                      boxShadow: '0 0 14px rgba(59, 130, 246, 0.4)',
                      flexShrink: 0,
                    }}
                  >
                    {item.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#FFFFFF' }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{item.handle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          LUXURY CALL TO ACTION (CTA)
      ========================================================= */}
      <section
        style={{
          padding: '85px 0',
          background: 'linear-gradient(145deg, rgba(14, 25, 58, 0.8) 0%, rgba(6, 11, 24, 0.95) 100%)',
          borderTop: '1px solid rgba(56, 189, 248, 0.15)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
          position: 'relative',
        }}
      >
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 9999,
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              color: '#93C5FD',
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 18,
            }}
          >
            <Zap size={14} color="#F59E0B" /> START TRADING IN UNDER 3 MINUTES
          </div>
          <h2
            style={{
              fontSize: 'clamp(30px, 4.5vw, 52px)',
              fontWeight: 900,
              marginBottom: 16,
              letterSpacing: '-1.5px',
              color: '#FFFFFF',
            }}
          >
            Experience Sovereign Crypto Settlement
          </h2>
          <p
            style={{
              fontSize: 'clamp(15px, 2.5vw, 17px)',
              color: '#94A3B8',
              marginBottom: 36,
              maxWidth: 580,
              margin: '0 auto 36px',
              lineHeight: 1.7,
            }}
          >
            Join discerning Nigerian investors who bypass custodial exchange delays and receive crypto directly in their personal wallets.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-glass-primary btn-lg">
              <span>Create Free Account</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/markets" className="btn btn-glass-secondary btn-lg">
              <span>Explore Live Markets</span>
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Responsive Styles Injection */}
      <style>{`
        /* ---------- Hero toast: desktop vs. tablet/mobile placement ---------- */
        .hero-toast-desktop {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          width: 100%;
        }
        .hero-toast-mobile {
          display: none;
        }

        /* ---------- TABLET & BELOW (<= 960px) ---------- */
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          .why-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .steps-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }

          /* Toast moves under "Direct to Your Wallet." */
          .hero-toast-desktop {
            display: none !important;
          }
          .hero-toast-mobile {
            display: flex;
            justify-content: flex-start;
            width: 100%;
            margin: -6px 0 22px;
          }
          .hero-toast-mobile .luxury-glow-badge {
            text-align: left !important;
            line-height: 1.5;
          }

          /* Keep the copy and the visual card at a comfortable, centered reading width */
          .hero-copy {
            width: 100%;
            max-width: 680px;
            margin-left: auto;
            margin-right: auto;
          }
          .hero-visual {
            width: 100%;
            max-width: 620px;
            margin-left: auto;
            margin-right: auto;
          }
        }

        /* ---------- MOBILE (<= 640px) ---------- */
        @media (max-width: 640px) {
          .why-grid {
            grid-template-columns: 1fr !important;
          }
          .steps-grid {
            grid-template-columns: 1fr !important;
          }

          .hero-section {
            min-height: auto !important;
            padding: 44px 0 48px !important;
          }
          .hero-grid {
            gap: 30px !important;
          }
          .hero-title {
            letter-spacing: -1px !important;
          }
          .hero-toast-mobile {
            margin: -4px 0 20px;
          }

          /* Premium touch-friendly full-width action buttons */
          .hero-actions {
            gap: 12px !important;
            margin-bottom: 28px !important;
          }
          .hero-actions .btn {
            flex: 1 1 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}