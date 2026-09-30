import React, { useState } from 'react'
import {
  Mail, MessageSquare, Send, Clock, ShieldCheck, CheckCircle2,
  Headphones, PhoneCall, Globe, ArrowRight, Sparkles, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reference: '',
    category: 'order',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      toast.success('Your message has been received by our senior concierge desk!')
    }, 1000)
  }

  const directChannels = [
    {
      title: 'WhatsApp Concierge',
      desc: 'Instant priority support for urgent trade settlements & address confirmations.',
      contact: '+234 810 000 8899',
      action: 'Open WhatsApp',
      href: 'https://wa.me/2348100008899',
      color: '#25D366',
      badge: 'Fastest Response',
    },
    {
      title: 'Telegram Official Desk',
      desc: 'Direct encrypted messaging with our senior settlement and liquidity team.',
      contact: '@KryptellaConcierge',
      action: 'Open Telegram',
      href: 'https://t.me/kryptella',
      color: '#229ED9',
      badge: '24/7 Active',
    },
    {
      title: 'Senior Concierge Email',
      desc: 'In-depth inquiries, corporate partnerships, and transaction receipts.',
      contact: 'concierge@kryptella.com',
      action: 'Send Email',
      href: 'mailto:concierge@kryptella.com',
      color: '#60A5FA',
      badge: 'Official Desk',
    },
    {
      title: 'Live Chat Support',
      desc: 'Connect in real-time with an active agent within your web session.',
      contact: 'Live Concierge Portal',
      action: 'Start Live Chat',
      href: '#live-chat',
      color: '#A855F7',
      badge: 'Under 2 Mins',
    },
  ]

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', paddingTop: 88, paddingBottom: 80 }}>
      {/* Hero Header */}
      <section
        style={{
          padding: '60px 0 40px',
          background: 'radial-gradient(ellipse 80% 60% at 50% 10%, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="luxury-glow-badge" style={{ marginBottom: 20 }}>
            <Clock size={14} color="#F59E0B" />
            <span>Guaranteed Response Under 5 Minutes</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              color: '#FFFFFF',
              marginBottom: 18,
            }}
          >
            Connect With Kryptella Concierge
          </h1>
          <p style={{ fontSize: 17, color: '#94A3B8', lineHeight: 1.7, margin: '0 auto' }}>
            Whether you have questions about a direct settlement, proof of payment verification, or high-volume liquidity routing, our dedicated desk is here 24/7.
          </p>
        </div>
      </section>

      {/* Main Content: Channels & Contact Form Grid */}
      <section style={{ padding: '30px 0 60px' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.4fr)',
              gap: 40,
              alignItems: 'start',
            }}
            className="contact-grid"
          >
            {/* Left Column: Direct Channels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>
                  Direct Priority Desks
                </h3>
                <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.6, marginBottom: 20 }}>
                  Select your preferred channel for instantaneous communication with our operational team.
                </p>
              </div>

              {directChannels.map((channel, idx) => (
                <div
                  key={idx}
                  className="card-glass"
                  style={{
                    padding: '22px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: channel.color,
                          boxShadow: `0 0 10px ${channel.color}`,
                        }}
                      />
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>{channel.title}</h4>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: channel.color,
                        background: `${channel.color}15`,
                        border: `1px solid ${channel.color}35`,
                        padding: '3px 10px',
                        borderRadius: 9999,
                      }}
                    >
                      {channel.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
                    {channel.desc}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', fontFamily: 'monospace' }}>
                      {channel.contact}
                    </span>
                    <a
                      href={channel.href}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#60A5FA',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span>{channel.action}</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              ))}

              {/* Security Reassurance Box */}
              <div
                className="card-glass"
                style={{
                  padding: 20,
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                }}
              >
                <ShieldCheck size={26} color="#34D399" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.5 }}>
                  <strong style={{ color: '#34D399' }}>Official Verification Protocol:</strong> Kryptella staff will never ask for your seed phrase or private password.
                </div>
              </div>
            </div>

            {/* Right Column: Glassmorphic Message Form */}
            <div
              className="card-glass"
              style={{
                padding: '36px 32px',
                borderRadius: 24,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.15)',
              }}
            >
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#60A5FA', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                  <Sparkles size={14} /> TRANSMIT INQUIRY
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 6 }}>
                  Send a Direct Concierge Ticket
                </h3>
                <p style={{ fontSize: 14, color: '#94A3B8', margin: 0 }}>
                  We dispatch priority alerts straight to our desk agents immediately upon submission.
                </p>
              </div>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      color: '#10B981',
                    }}
                  >
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginBottom: 10 }}>
                    Inquiry Successfully Dispatched
                  </h4>
                  <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, maxWidth: 420, margin: '0 auto 24px' }}>
                    Thank you, <strong style={{ color: '#fff' }}>{formData.name}</strong>. A senior agent is reviewing your inquiry and will reply to <strong style={{ color: '#60A5FA' }}>{formData.email}</strong> in under 5 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: '', email: '', reference: '', category: 'order', message: '' })
                    }}
                    className="btn btn-glass-secondary"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-row">
                    <div>
                      <label className="label" style={{ color: '#CBD5E1' }}>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                        style={{ background: 'rgba(11, 18, 38, 0.7)' }}
                      />
                    </div>
                    <div>
                      <label className="label" style={{ color: '#CBD5E1' }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="alex@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field"
                        style={{ background: 'rgba(11, 18, 38, 0.7)' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-row">
                    <div>
                      <label className="label" style={{ color: '#CBD5E1' }}>Inquiry Topic</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input-field"
                        style={{ background: 'rgba(11, 18, 38, 0.7)', cursor: 'pointer' }}
                      >
                        <option value="order">Order Settlement & Status</option>
                        <option value="receipt">Payment Receipt Verification</option>
                        <option value="address">Wallet Address / Network</option>
                        <option value="high-volume">High-Volume OTC Inquiries</option>
                        <option value="security">Security & Account Access</option>
                        <option value="partnership">Partnership & Business</option>
                      </select>
                    </div>
                    <div>
                      <label className="label" style={{ color: '#CBD5E1' }}>Order / Reference ID (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. KRYP-8921"
                        value={formData.reference}
                        onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        className="input-field"
                        style={{ background: 'rgba(11, 18, 38, 0.7)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" style={{ color: '#CBD5E1' }}>Detailed Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please describe your trade inquiry or question in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input-field"
                      style={{ background: 'rgba(11, 18, 38, 0.7)', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-glass-primary btn-lg"
                    style={{
                      justifyContent: 'center',
                      marginTop: 8,
                      cursor: submitting ? 'wait' : 'pointer',
                    }}
                  >
                    {submitting ? (
                      <span>Transmitting Ticket...</span>
                    ) : (
                      <>
                        <span>Submit to Concierge Desk</span>
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
