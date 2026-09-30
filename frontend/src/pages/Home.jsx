import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
      padding: '20px 24px',
      textAlign: 'center',
      minWidth: 160,
      flex: 1,
    }}
  >
    <div
      style={{
        fontSize: 32,
        fontWeight: 900,
        background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F59E0B 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 4,
        letterSpacing: '-0.5px',
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9' }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{sub}</div>}
  </div>
)

const HERO_SLIDES = [
  {
    id: 1,
    entranceClass: 'slide-from-top',
    tag: '⚡ DIRECT SETTLEMENT ENGINE',
    toast: '⚡ Instant Buy Executed: 0.75 BTC ($48,250) · Confirmed in 60s 🟢',
    title: 'Instant Bitcoin Direct Dispatch',
    renderVisual: () => (
      <div
        className="card-glass"
        style={{
          padding: 28,
          borderRadius: 24,
          background: 'linear-gradient(145deg, rgba(16, 26, 56, 0.9), rgba(8, 14, 32, 0.95))',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(245, 158, 11, 0.18)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 900,
                color: '#fff',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)',
              }}
            >
              ₿
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#fff' }}>Bitcoin Direct Settlement</div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>Blockchain Network: BTC Native</div>
            </div>
          </div>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34D399',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            CONFIRMED 🟢
          </span>
        </div>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 16,
            padding: '16px 20px',
            marginBottom: 20,
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>Executed Amount</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#FCD34D' }}>0.75000000 BTC</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>Settlement Value</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>$48,250.00 · ₦72,375,000</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>Destination Address</span>
            <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#60A5FA' }}>0x71C...49bF</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#A5B4FC' }}>
          <CheckCircle2 size={16} color="#10B981" />
          <span>Dispatched directly to private keys · Zero custodial delay</span>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    entranceClass: 'slide-from-left',
    tag: '🚀 ULTRA-HIGH LIQUIDITY',
    toast: '🚀 Market Alert: Solana (SOL) +14.8% · High Liquidity Direct Settlement 💎',
    title: 'Surging Altcoin Direct Routing',
    renderVisual: () => (
      <div
        className="card-glass"
        style={{
          padding: 28,
          borderRadius: 24,
          background: 'linear-gradient(145deg, rgba(8, 28, 48, 0.9), rgba(5, 16, 32, 0.95))',
          border: '1px solid rgba(20, 241, 149, 0.35)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(20, 241, 149, 0.18)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #14F195, #9945FF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 900,
                color: '#fff',
                boxShadow: '0 0 20px rgba(20, 241, 149, 0.4)',
              }}
            >
              SOL
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#fff' }}>Solana Direct Route</div>
              <div style={{ fontSize: 12, color: '#34D399', fontWeight: 600 }}>+14.82% Last 24 Hours</div>
            </div>
          </div>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(20, 241, 149, 0.15)',
              border: '1px solid rgba(20, 241, 149, 0.35)',
              color: '#14F195',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            HIGH LIQUIDITY 💎
          </span>
        </div>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 16,
            padding: '16px 20px',
            marginBottom: 20,
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>Guaranteed Rate</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>$148.50 / SOL</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>Settlement Speed</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#34D399' }}>~45 Seconds Avg</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: '#94A3B8' }}>Spread Markup</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#60A5FA' }}>0.0% Hidden Markup</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#6EE7B7' }}>
          <Sparkles size={16} color="#14F195" />
          <span>Real-time sub-second depth direct from global orderbooks</span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    entranceClass: 'slide-from-bottom',
    tag: '🛡️ NON-CUSTODIAL INTEGRITY',
    toast: '🛡️ Direct Dispatch Verified: Zero wallet custody · Sent directly to recipient wallet ✨',
    title: 'Fortified Non-Custodial Architecture',
    renderVisual: () => (
      <div
        className="card-glass"
        style={{
          padding: 28,
          borderRadius: 24,
          background: 'linear-gradient(145deg, rgba(20, 16, 48, 0.9), rgba(8, 10, 28, 0.95))',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.45)',
              }}
            >
              <Shield size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: '#fff' }}>Zero Wallet Custody</div>
              <div style={{ fontSize: 12, color: '#A5B4FC' }}>No internal wallets or locked funds</div>
            </div>
          </div>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 9999,
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              color: '#A5B4FC',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            PROTECTED ✨
          </span>
        </div>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 16,
            padding: '16px 20px',
            marginBottom: 20,
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Step 1</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>Pay Direct</div>
            </div>
            <ArrowRight size={14} color="#60A5FA" />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Step 2</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#60A5FA' }}>Verify</div>
            </div>
            <ArrowRight size={14} color="#60A5FA" />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Step 3</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#34D399' }}>Your Keys</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#C7D2FE' }}>
          <Lock size={16} color="#818CF8" />
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

  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

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
          {/* Active Carousel Trading Toast Banner */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div
              key={`toast-${activeSlide}`}
              className="luxury-glow-badge slide-from-top"
              style={{
                fontSize: 13,
                padding: '8px 20px',
                cursor: 'pointer',
                border: '1px solid rgba(96, 165, 250, 0.3)',
              }}
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
            <div>
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
                  fontSize: 'clamp(36px, 5.2vw, 68px)',
                  fontWeight: 900,
                  lineHeight: 1.08,
                  letterSpacing: '-2px',
                  color: '#FFFFFF',
                  marginBottom: 24,
                }}
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

              <p
                style={{
                  fontSize: 18,
                  color: '#94A3B8',
                  lineHeight: 1.75,
                  marginBottom: 36,
                  maxWidth: 560,
                }}
              >
                Buy Bitcoin, USDT, Solana, and 20+ top altcoins with simple bank transfer.
                Funds settle straight into your private crypto address without custodial delays.
              </p>

              {/* Glassmorphic Action Buttons */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
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
            <div style={{ position: 'relative' }}>
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
                  padding: '12px 20px',
                  borderRadius: 14,
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#CBD5E1' }}>
                  <ShieldCheck size={16} color="#60A5FA" />
                  <span>Direct Blockchain Settlement Guarantee</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#34D399' }}>99.98% On-Time</span>
              </div>
            </div>
          </div>

          {/* Trust Stat Boxes */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              marginTop: 64,
              flexWrap: 'wrap',
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
          "WHY CHOOSE KRYPTELLA" — 6 BOXES (3 UP, 3 DOWN)
      ========================================================= */}
      <section style={{ padding: '90px 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60, maxWidth: 680, margin: '0 auto 60px' }}>
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
              Why Choose Kryptella?
            </h2>
            <p className="section-sub" style={{ fontSize: 16, color: '#94A3B8' }}>
              Built for traders who value absolute speed, security, and full sovereignty over their digital assets.
            </p>
          </div>
          {/* 6 Boxes Strictly in 3 columns x 2 rows on desktop */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 28,
            }}
            className="why-grid"
          >
            {/* Box 1 */}
            <div className="card-glass" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.1))',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60A5FA',
                  marginBottom: 20,
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.25)',
                }}
              >
                <Zap size={28} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
                Instant Direct Settlements
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, flexGrow: 1 }}>
                Fast payment confirmation and direct blockchain delivery without funding delays. No balance waiting periods or manual escrow freezes.
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: '#60A5FA', fontSize: 12, fontWeight: 700 }}>
                <span>Sub-Minute Settlement</span>
                <ArrowRight size={13} />
              </div>
            </div>

            {/* Box 2 */}
            <div className="card-glass" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.1))',
                  border: '1px solid rgba(165, 180, 252, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#A5B4FC',
                  marginBottom: 20,
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)',
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
                Zero Custodial Risk
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, flexGrow: 1 }}>
                We never hold customer funds in proprietary wallets. Crypto goes straight to your personal, non-custodial address where only you own the private keys.
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: '#A5B4FC', fontSize: 12, fontWeight: 700 }}>
                <span>100% Non-Custodial</span>
                <ArrowRight size={13} />
              </div>
            </div>

            {/* Box 3 */}
            <div className="card-glass" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, rgba(20, 241, 149, 0.2), rgba(6, 182, 212, 0.1))',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34D399',
                  marginBottom: 20,
                  boxShadow: '0 0 20px rgba(20, 241, 149, 0.25)',
                }}
              >
                <TrendingUp size={28} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
                20+ Premier Altcoins
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, flexGrow: 1 }}>
                Deep institutional liquidity across Bitcoin, Ethereum, Solana, USDT, BNB, Avalanche, and all leading layer-1 and layer-2 assets.
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: '#34D399', fontSize: 12, fontWeight: 700 }}>
                <span>Deep Liquidity Pool</span>
                <ArrowRight size={13} />
              </div>
            </div>

            {/* Box 4 */}
            <div className="card-glass" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(234, 88, 12, 0.1))',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FBBF24',
                  marginBottom: 20,
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.25)',
                }}
              >
                <RefreshCw size={28} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
                Live Sub-Second Pricing
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, flexGrow: 1 }}>
                Direct global market rates without inflated hidden spreads or arbitrary markups. What you lock at checkout is exactly what you receive.
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: '#FBBF24', fontSize: 12, fontWeight: 700 }}>
                <span>Guaranteed Rate Lock</span>
                <ArrowRight size={13} />
              </div>
            </div>

            {/* Box 5 */}
            <div className="card-glass" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(37, 99, 235, 0.1))',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8',
                  marginBottom: 20,
                  boxShadow: '0 0 20px rgba(14, 165, 233, 0.25)',
                }}
              >
                <Lock size={28} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
                Bank-Grade Fortified Security
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, flexGrow: 1 }}>
                SSL 256-bit encryption, strict cryptographic verification, automated proof-of-payment receipts, and regulatory compliance standards.
              </p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, color: '#38BDF8', fontSize: 12, fontWeight: 700 }}>
                <span>256-Bit SSL Fortified</span>
                <ArrowRight size={13} />
              </div>
            </div>

            {/* Box 6 */}
            <div className="card-glass" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(244, 63, 94, 0.1))',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F472B6',
                  marginBottom: 20,
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.25)',
                }}
              >
                <Headphones size={28} />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
                24/7 Dedicated Concierge
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, flexGrow: 1 }}>
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
          "HOW IT WORKS" — DIRECT SETTLEMENT TIMELINE (NO "FUND WALLET")
      ========================================================= */}
      <section style={{ padding: '90px 0', background: 'var(--bg-secondary)', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 60, maxWidth: 640, margin: '0 auto 60px' }}>
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
              gap: 24,
              position: 'relative',
            }}
            className="steps-grid"
          >
            {/* Step 1 */}
            <div
              className="card-glass"
              style={{
                padding: '28px 24px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 18,
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                  marginBottom: 20,
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Choose Crypto & Amount
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
                Select your preferred altcoin, enter your target naira amount, and paste your personal destination wallet address.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="card-glass"
              style={{
                padding: '28px 24px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366F1, #4338CA)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 18,
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
                  marginBottom: 20,
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Make Fast Payment
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
                Pay securely via your normal mobile banking transfer to the dedicated account provided on checkout.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="card-glass"
              style={{
                padding: '28px 24px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F59E0B, #B45309)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 18,
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
                  marginBottom: 20,
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Instant Confirmation
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
                Upload your payment receipt. Kryptella's automated verification engine confirms your transaction within minutes.
              </p>
            </div>

            {/* Step 4 */}
            <div
              className="card-glass"
              style={{
                padding: '28px 24px',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10B981, #047857)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 18,
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                  marginBottom: 20,
                }}
              >
                4
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                Receive Crypto Directly
              </h3>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
                Cryptocurrency is broadcasted directly to your personal address on-chain. Track full blockchain TX hash in real-time.
              </p>
            </div>
          </div>

          {/* Action button below steps */}
          <div style={{ textAlign: 'center', marginTop: 52 }}>
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
      <section style={{ padding: '90px 0', overflow: 'hidden', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48, maxWidth: 640, margin: '0 auto 48px' }}>
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
                  width: 380,
                  flexShrink: 0,
                  padding: 26,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: item.stars }).map((_, i) => (
                      <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
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
                <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.7, flexGrow: 1, marginBottom: 20 }}>
                  "{item.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 14,
                      color: '#fff',
                      boxShadow: '0 0 14px rgba(59, 130, 246, 0.4)',
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
                  width: 380,
                  flexShrink: 0,
                  padding: 26,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: item.stars }).map((_, i) => (
                      <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
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
                <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.7, flexGrow: 1, marginBottom: 20 }}>
                  "{item.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: 14,
                      color: '#fff',
                      boxShadow: '0 0 14px rgba(59, 130, 246, 0.4)',
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
          padding: '90px 0',
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
              marginBottom: 20,
            }}
          >
            <Zap size={14} color="#F59E0B" /> START TRADING IN UNDER 3 MINUTES
          </div>
          <h2
            style={{
              fontSize: 'clamp(32px, 4.5vw, 54px)',
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
              fontSize: 18,
              color: '#94A3B8',
              marginBottom: 40,
              maxWidth: 580,
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            Join discerning Nigerian investors who bypass custodial exchange delays and receive crypto directly in their personal wallets.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
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
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .why-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .steps-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .why-grid {
            grid-template-columns: 1fr !important;
          }
          .steps-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
