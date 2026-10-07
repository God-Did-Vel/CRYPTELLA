import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, ArrowRight, ShieldCheck, Zap, Wallet, CheckCircle2,
  RefreshCw, ArrowUpRight, HelpCircle, ChevronRight, Lock
} from 'lucide-react'

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('buy')

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', paddingTop: 80 }}>
      {/* Hero Header */}
      <section
        style={{
          padding: '70px 0 60px',
          background: 'radial-gradient(ellipse 90% 70% at 50% -10%, rgba(14, 165, 233, 0.25) 0%, rgba(6, 11, 24, 0.98) 75%)',
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
              background: 'rgba(14, 165, 233, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38BDF8',
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            <Zap size={14} color="#F59E0B" />
            <span>DIRECT ON-CHAIN SETTLEMENT EXPLAINED</span>
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
            How Direct Crypto Settlement Works{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #34D399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              In 4 Transparent Steps
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
            No waiting on exchange wallet balances. Pay via familiar bank transfer, verify automatically,
            and have cryptocurrency delivered straight into your self-custody wallet within 3 minutes.
          </p>

          {/* Tab Switcher: Buy Crypto vs Sell Crypto */}
          <div
            style={{
              display: 'inline-flex',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: 5,
              borderRadius: 9999,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              gap: 6,
            }}
          >
            <button
              onClick={() => setActiveTab('buy')}
              style={{
                padding: '10px 24px',
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'buy' ? 'linear-gradient(135deg, #3B82F6, #6366F1)' : 'transparent',
                color: activeTab === 'buy' ? '#FFFFFF' : '#94A3B8',
                transition: 'all 0.25s ease',
              }}
            >
              How to Buy Crypto (Direct Delivery)
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              style={{
                padding: '10px 24px',
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'sell' ? 'linear-gradient(135deg, #10B981, #059669)' : 'transparent',
                color: activeTab === 'sell' ? '#FFFFFF' : '#94A3B8',
                transition: 'all 0.25s ease',
              }}
            >
              How to Sell Crypto (Instant Fiat Cashout)
            </button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          {activeTab === 'buy' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 24,
              }}
            >
              <div className="card-glass" style={{ padding: 'clamp(24px, 4vw, 32px)', position: 'relative' }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#fff',
                    marginBottom: 20,
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                  }}
                >
                  1
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                  Select Coin & Amount
                </h3>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
                  Choose Bitcoin, Ethereum, USDT, BNB, XRP, USDC, Solana or TRON. Enter your purchase amount in Naira and provide your personal destination address (Ledger, Trust Wallet, etc.).
                </p>
              </div>

              <div className="card-glass" style={{ padding: 'clamp(24px, 4vw, 32px)', position: 'relative' }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366F1, #4338CA)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#fff',
                    marginBottom: 20,
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  2
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                  Transfer to Dedicated Account
                </h3>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
                  You receive an official dedicated company bank account. Transfer the exact order total from your mobile banking app with zero card surcharges.
                </p>
              </div>

              <div className="card-glass" style={{ padding: 'clamp(24px, 4vw, 32px)', position: 'relative' }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F59E0B, #B45309)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#fff',
                    marginBottom: 20,
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
                  }}
                >
                  3
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                  Upload Receipt & Verify
                </h3>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
                  Attach your payment screenshot or reference. Kryptella's high-speed verification engine acknowledges receipt within moments.
                </p>
              </div>

              <div className="card-glass" style={{ padding: 'clamp(24px, 4vw, 32px)', position: 'relative' }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10B981, #047857)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#fff',
                    marginBottom: 20,
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  4
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                  Direct Blockchain Dispatch
                </h3>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
                  Coins are broadcasted directly on-chain to your provided address. You receive the transaction hash to verify confirmations immediately on public explorers.
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 24,
              }}
            >
              <div className="card-glass" style={{ padding: 'clamp(24px, 4vw, 32px)', position: 'relative' }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#fff',
                    marginBottom: 20,
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
                  }}
                >
                  1
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                  Initiate Sell Order
                </h3>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
                  Select the cryptocurrency you want to liquidate and enter your receiving Nigerian bank account details (account number, bank name).
                </p>
              </div>

              <div className="card-glass" style={{ padding: 'clamp(24px, 4vw, 32px)', position: 'relative' }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#fff',
                    marginBottom: 20,
                    boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)',
                  }}
                >
                  2
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                  Send To Deposit Address
                </h3>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
                  Transfer the exact crypto amount to the unique Kryptella settlement deposit wallet or QR code displayed on your order screen.
                </p>
              </div>

              <div className="card-glass" style={{ padding: 'clamp(24px, 4vw, 32px)', position: 'relative' }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#fff',
                    marginBottom: 20,
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
                  }}
                >
                  3
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                  Blockchain Confirmed
                </h3>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
                  As soon as the network nodes register the required transaction confirmations, our automated settlement pipeline triggers payout.
                </p>
              </div>

              <div className="card-glass" style={{ padding: 'clamp(24px, 4vw, 32px)', position: 'relative' }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#fff',
                    marginBottom: 20,
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
                  }}
                >
                  4
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                  Instant Fiat Credit
                </h3>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.65 }}>
                  The equivalent Naira amount is sent directly to your bank account via instant NIBSS transfer. Receive credit alert within minutes.
                </p>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div style={{ textAlign: 'center', marginTop: 56 }}>
            <Link to="/register" className="btn btn-glass-primary btn-lg">
              <span>Start Trading Now</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Direct Settlement vs Custodial Table */}
      <section style={{ padding: '70px 0', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>
              Why Traders Prefer Direct Settlement
            </h2>
            <p style={{ fontSize: 15, color: '#94A3B8' }}>
              Comparison of Kryptella vs. Traditional Centralized Crypto Exchanges
            </p>
          </div>

          <div
            className="card-glass"
            style={{
              padding: 'clamp(18px, 3.5vw, 28px)',
              overflowX: 'auto',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 540 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                  <th style={{ padding: '14px 16px', color: '#94A3B8', fontSize: 13, textTransform: 'uppercase' }}>Feature</th>
                  <th style={{ padding: '14px 16px', color: '#F59E0B', fontSize: 13, fontWeight: 800 }}>Kryptella Direct</th>
                  <th style={{ padding: '14px 16px', color: '#64748B', fontSize: 13 }}>Standard Exchanges</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#F1F5F9' }}>Fund Custody</td>
                  <td style={{ padding: '14px 16px', color: '#34D399', fontWeight: 700 }}>Zero (Non-Custodial)</td>
                  <td style={{ padding: '14px 16px', color: '#EF4444' }}>Centralized Custody</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#F1F5F9' }}>Withdrawal Delays</td>
                  <td style={{ padding: '14px 16px', color: '#34D399', fontWeight: 700 }}>0 Mins (Direct Send)</td>
                  <td style={{ padding: '14px 16px', color: '#94A3B8' }}>24hr - 72hr Security Holds</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#F1F5F9' }}>Account Freeze Risk</td>
                  <td style={{ padding: '14px 16px', color: '#34D399', fontWeight: 700 }}>None (Delivered to Keys)</td>
                  <td style={{ padding: '14px 16px', color: '#EF4444' }}>High Risk (Platform Lockouts)</td>
                </tr>
                <tr>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#F1F5F9' }}>Delivery Destination</td>
                  <td style={{ padding: '14px 16px', color: '#38BDF8', fontWeight: 700 }}>Cold Storage / Private Wallet</td>
                  <td style={{ padding: '14px 16px', color: '#94A3B8' }}>Exchange Internal Balance</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
