import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Globe, TrendingUp, Users, Lock, ChevronRight, Star } from 'lucide-react'
import TickerTape from '../components/TickerTape'
import CoinCard from '../components/CoinCard'
import { useCoins } from '../hooks/useCoins'
import { formatPrice, formatChange } from '../utils/format'

const StatBox = ({ value, label }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 32, fontWeight: 900, background: 'linear-gradient(135deg, #6366F1, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{label}</div>
  </div>
)

const FeatureCard = ({ icon, title, desc }) => (
  <div className="card card-hover" style={{ textAlign: 'center' }}>
    <div style={{
      width: 56, height: 56, borderRadius: 16, background: 'var(--accent-light)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 16px', color: 'var(--accent)',
    }}>{icon}</div>
    <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{title}</h3>
    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
  </div>
)

const StepItem = ({ num, title, desc }) => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
    <div style={{
      width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: 16, color: '#fff',
      boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
    }}>{num}</div>
    <div>
      <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{title}</h4>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
    </div>
  </div>
)

const TestimonialCard = ({ name, handle, text, stars }) => (
  <div className="card" style={{ flexShrink: 0, width: 300 }}>
    <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
      {Array.from({ length: stars }).map((_, i) => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
    </div>
    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>"{text}"</p>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 13, color: '#fff',
      }}>{name[0]}</div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{handle}</div>
      </div>
    </div>
  </div>
)

export default function Home() {
  const { coins, loading } = useCoins()
  const topCoins = coins.slice(0, 8)

  return (
    <div>
      {/* Ticker tape just below fixed navbar */}
      <div style={{ paddingTop: 68 }}>
        <TickerTape coins={coins} />
      </div>

      {/* Hero */}
      <section style={{
        minHeight: '88vh', display: 'flex', alignItems: 'center',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 70%)',
        padding: '80px 0 60px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)',
          top: -100, right: -100, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.07), transparent 70%)',
          bottom: -50, left: -80, pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <div className="badge badge-accent" style={{ marginBottom: 24, display: 'inline-flex' }}>
              <Zap size={13} /> Live Altcoin Trading Platform
            </div>
            <h1 style={{
              fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.1,
              marginBottom: 24, letterSpacing: '-2px',
            }}>
              Buy & Sell{' '}
              <span style={{ background: 'linear-gradient(135deg, #6366F1, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Altcoins
              </span>
              {' '}Instantly
            </h1>
            <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 40, maxWidth: 580, margin: '0 auto 40px' }}>
              Cryptella is the fastest and most secure way to trade over 20 altcoins.
              Real-time prices, instant execution, and bank-grade security.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg glow-pulse">
                Start Trading Free <ArrowRight size={18} />
              </Link>
              <Link to="/markets" className="btn btn-secondary btn-lg">
                View Live Markets <ChevronRight size={18} />
              </Link>
            </div>

            {/* Trust indicators */}
            <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }}>
              <StatBox value="20+" label="Altcoins" />
              <div style={{ width: 1, background: 'var(--border)', height: 40, alignSelf: 'center' }} />
              <StatBox value="$0 Fee" label="Registration" />
              <div style={{ width: 1, background: 'var(--border)', height: 40, alignSelf: 'center' }} />
              <StatBox value="24/7" label="Live Prices" />
              <div style={{ width: 1, background: 'var(--border)', height: 40, alignSelf: 'center' }} />
              <StatBox value="100%" label="Secure" />
            </div>
          </div>
        </div>
      </section>

      {/* Live Markets Preview */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: 6 }}>Live Market Prices</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Real-time prices updated every 30 seconds</p>
            </div>
            <Link to="/markets" className="btn btn-outline">View All Markets <ArrowRight size={16} /></Link>
          </div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card">
                  <div className="skeleton" style={{ height: 44, width: 44, borderRadius: '50%', marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 18, width: '60%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 28, width: '80%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '50%' }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {topCoins.map((coin) => <CoinCard key={coin.id} coin={coin} />)}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="section-title">Why Choose Cryptella?</h2>
            <p className="section-sub">Everything you need to trade altcoins with confidence</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24 }}>
            <FeatureCard icon={<Zap size={26} />} title="Instant Execution" desc="Lightning-fast order processing with real-time price feeds. Your trades execute in milliseconds." />
            <FeatureCard icon={<Shield size={26} />} title="Bank-Grade Security" desc="Military-grade encryption, 2FA authentication, and cold storage protection for your assets." />
            <FeatureCard icon={<TrendingUp size={26} />} title="20+ Altcoins" desc="Trade Bitcoin, Ethereum, Solana, BNB, Dogecoin, and 15+ other top altcoins all in one place." />
            <FeatureCard icon={<Globe size={26} />} title="Trade Anywhere" desc="Access your portfolio and trade from any device — desktop, tablet, or mobile browser." />
            <FeatureCard icon={<Users size={26} />} title="24/7 Support" desc="Our dedicated support team is available around the clock to assist with any questions." />
            <FeatureCard icon={<Lock size={26} />} title="Your Keys, Your Coins" desc="Transparent operations with clear fee structures. No hidden charges, ever." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="section-title">How It Works</h2>
            <p className="section-sub">Start trading altcoins in under 2 minutes</p>
          </div>
          <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 36 }}>
            <StepItem num="1" title="Create Your Free Account" desc="Sign up with your email and password. No ID verification required to get started." />
            <StepItem num="2" title="Fund Your Wallet" desc="Deposit USD into your Cryptella wallet using our secure payment methods." />
            <StepItem num="3" title="Buy or Sell Altcoins" desc="Browse live prices, pick your coin, enter your amount, and trade instantly." />
            <StepItem num="4" title="Grow Your Portfolio" desc="Monitor your holdings, track performance, and keep trading to grow your crypto portfolio." />
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 0', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">What Traders Say</h2>
            <p className="section-sub">Trusted by thousands of crypto traders</p>
          </div>
          <div style={{ display: 'flex', gap: 20, overflowX: 'auto', paddingBottom: 16 }}>
            <TestimonialCard name="Adewale O." handle="@adewale_btc" stars={5} text="The fastest altcoin platform I've used. Prices are accurate and trades execute instantly. Highly recommend!" />
            <TestimonialCard name="Chisom E." handle="@chisom_crypto" stars={5} text="Finally a Nigerian crypto platform that actually works well! The UI is clean and buying Solana took me 10 seconds." />
            <TestimonialCard name="Emeka N." handle="@emeka_defi" stars={5} text="The portfolio tracker is exactly what I needed. I can see all my altcoin holdings in one place." />
            <TestimonialCard name="Fatima I." handle="@fatima_trades" stars={4} text="Simple, clean, and reliable. I've been trading DOGE and SHIB here for months without any issues." />
            <TestimonialCard name="Tunde B." handle="@tunde_alt" stars={5} text="Love how many altcoins are available. Most platforms only have BTC and ETH but Cryptella has everything." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, marginBottom: 16, letterSpacing: '-1px' }}>
            Ready to Start Trading?
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            Join thousands of traders already buying and selling altcoins on Cryptella.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started — It's Free <ArrowRight size={18} />
            </Link>
            <Link to="/markets" className="btn btn-secondary btn-lg">
              Browse Markets
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
