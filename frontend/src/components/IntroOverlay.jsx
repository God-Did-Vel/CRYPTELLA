import React, { useState, useEffect } from 'react'
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Sparkles, X, ChevronRight, CheckCircle2 } from 'lucide-react'

// Paste your Cloudinary image URL here whenever ready!
export const CLOUDINARY_IMAGE_URL = ''

export default function IntroOverlay({ isOpen, onClose, imageUrl = CLOUDINARY_IMAGE_URL }) {
  const [isExiting, setIsExiting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      setIsExiting(false)
    }
  }, [isOpen])

  if (!isOpen && !isExiting) return null

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
      setIsExiting(false)
    }, 600) // smooth dissolution duration
  }

  return (
    <div
      id="kryptella-intro-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 90% 70% at 50% 20%, #0E1C44 0%, #060B18 60%, #03060F 100%)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.04) translateY(-12px)' : 'scale(1) translateY(0)',
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Ambient Cosmic Radial Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
          width: '55vw',
          height: '55vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.08) 45%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '5%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 75%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Massive Glassmorphic Ambient Watermark Typography */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(70px, 15vw, 220px)',
          fontWeight: 900,
          letterSpacing: '0.12em',
          color: 'rgba(255, 255, 255, 0.025)',
          textShadow: '0 0 80px rgba(99, 102, 241, 0.08)',
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          fontFamily: 'Inter, sans-serif',
          zIndex: 0,
        }}
      >
        KRYPTELLA
      </div>

      {/* Top Navigation Bar: Branding & Close Button */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          padding: '24px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        {/* Top-Left Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              padding: 4,
            }}
          >
            <img
              src="https://res.cloudinary.com/duweg8kpv/image/upload/v1790775110/k-logo-good-removebg-preview_c50puh.png"
              alt="Kryptella Logo"
              style={{
                width: '100%',
                height: '100%',
                maxHeight: 36,
                maxWidth: 36,
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))',
              }}
            />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 20, color: '#FFFFFF', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Kryptella
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#93C5FD', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Direct Settlement Platform
            </div>
          </div>
        </div>

        {/* Skip / Enter Site Button */}
        <button
          onClick={handleClose}
          className="btn-glass"
          style={{
            padding: '8px 16px',
            fontSize: 13,
            borderRadius: 9999,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
          aria-label="Skip intro and enter Kryptella"
        >
          <span>Skip Intro</span>
          <X size={15} />
        </button>
      </div>

      {/* Main Intro Showcase Content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: 960,
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        {/* Top Tag */}
        <div
          className="slide-from-top"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 18px',
            borderRadius: 9999,
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(147, 197, 253, 0.28)',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.25)',
            color: '#BFDBFE',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          <Sparkles size={14} color="#F59E0B" />
          <span>The New Standard in Direct Crypto Settlement</span>
        </div>

        {/* Mobile View Dashboard Graphic (Slides in from Left) */}
        <div
          className="slide-from-left"
          style={{
            margin: '12px auto 28px',
            position: 'relative',
            perspective: 1200,
          }}
        >
          {imageUrl ? (
            /* Cloudinary Custom Mobile Dashboard Slot */
            <div
              style={{
                width: 'clamp(270px, 32vw, 340px)',
                borderRadius: 36,
                overflow: 'hidden',
                boxShadow: '0 24px 70px rgba(0, 0, 0, 0.8), 0 0 50px rgba(59, 130, 246, 0.35)',
                border: '4px solid rgba(255, 255, 255, 0.15)',
                transform: 'rotateY(-4deg) rotateX(2deg)',
                transition: 'transform 0.4s ease',
              }}
            >
              <img
                src={imageUrl}
                alt="Kryptella Mobile Dashboard"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          ) : (
            /* Ultra-Sleek Luxury Default Mobile Dashboard Mockup Visual */
            <div
              style={{
                width: 'clamp(280px, 34vw, 360px)',
                background: 'linear-gradient(160deg, #101935 0%, #0A1024 100%)',
                borderRadius: 40,
                border: '4px solid rgba(148, 163, 184, 0.25)',
                boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 60px rgba(59, 130, 246, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
                padding: '18px 16px 20px',
                textAlign: 'left',
                position: 'relative',
                transform: 'rotateY(-5deg) rotateX(3deg)',
                color: '#F8FAFC',
              }}
            >
              {/* Phone Dynamic Island / Speaker Notch */}
              <div
                style={{
                  width: 90,
                  height: 20,
                  background: '#040711',
                  borderRadius: 14,
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B82F6' }} />
                <div style={{ width: 28, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
              </div>

              {/* Mobile Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>PORTFOLIO BALANCE</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                    $48,250.00
                  </div>
                  <div style={{ fontSize: 12, color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <TrendingUp size={13} /> +8.45% 24h · ₦72,375,000
                  </div>
                </div>
                <div
                  style={{
                    padding: '5px 10px',
                    borderRadius: 8,
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34D399',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  LIVE RATE
                </div>
              </div>

              {/* Mini Sparkline Chart Visual */}
              <div
                style={{
                  height: 48,
                  marginBottom: 16,
                  background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.2) 0%, transparent 100%)',
                  borderRadius: 10,
                  position: 'relative',
                  overflow: 'hidden',
                  borderBottom: '2px solid #3B82F6',
                }}
              >
                <svg viewBox="0 0 300 48" style={{ width: '100%', height: '100%' }}>
                  <path
                    d="M0,40 Q40,32 80,36 T160,18 T240,24 T300,8 L300,48 L0,48 Z"
                    fill="rgba(59, 130, 246, 0.15)"
                  />
                  <path
                    d="M0,40 Q40,32 80,36 T160,18 T240,24 T300,8"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>

              {/* Instant Altcoins Feed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {[
                  { sym: 'BTC', name: 'Bitcoin', price: '$64,820', chg: '+3.2%', color: '#F59E0B' },
                  { sym: 'SOL', name: 'Solana', price: '$148.50', chg: '+14.8%', color: '#14F195' },
                  { sym: 'USDT', name: 'Tether USD', price: '₦1,500', chg: '0.0%', color: '#26A17B' },
                ].map((c) => (
                  <div
                    key={c.sym}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 12,
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          background: `${c.color}22`,
                          color: c.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 800,
                          border: `1px solid ${c.color}55`,
                        }}
                      >
                        {c.sym[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</div>
                        <div style={{ fontSize: 10, color: '#94A3B8' }}>{c.sym}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{c.price}</div>
                      <div style={{ fontSize: 10, color: '#10B981', fontWeight: 600 }}>{c.chg}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Settlement Badge */}
              <div
                style={{
                  padding: '9px 12px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.5), rgba(15, 23, 42, 0.7))',
                  border: '1px solid rgba(96, 165, 250, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <CheckCircle2 size={16} color="#60A5FA" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: 11, color: '#E2E8F0', lineHeight: 1.4 }}>
                  <strong style={{ color: '#93C5FD' }}>Direct Settlement:</strong> Crypto sent straight to your personal wallet.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Headline & Direct Settlement Value Proposition */}
        <div className="slide-from-bottom" style={{ maxWidth: 620, margin: '0 auto 24px' }}>
          <h1
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 900,
              letterSpacing: '-1px',
              color: '#FFFFFF',
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            Direct Crypto Settlement.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Zero Middleman Custody.
            </span>
          </h1>
          <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.6, margin: '0 auto' }}>
            No funding delay. No custodial wallet risks. Choose your coin, pay with ease, and receive crypto directly in your private wallet within minutes.
          </p>
        </div>

        {/* Pop-Up Action Button: "Trade Crypto with Kryptella" */}
        <div className="pop-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <button
            id="enter-kryptella-btn"
            onClick={handleClose}
            className="btn btn-glass-primary btn-lg"
            style={{
              fontSize: 16,
              fontWeight: 700,
              padding: '16px 38px',
              borderRadius: 9999,
              letterSpacing: '0.02em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              cursor: 'pointer',
              boxShadow: '0 12px 38px rgba(79, 70, 229, 0.45), 0 0 20px rgba(59, 130, 246, 0.35)',
            }}
          >
            <span>Trade Crypto with Kryptella</span>
            <ArrowRight size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, color: '#64748B', fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <ShieldCheck size={14} color="#60A5FA" /> Bank-Grade Fortified
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Zap size={14} color="#F59E0B" /> Sub-Minute Dispatch
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
