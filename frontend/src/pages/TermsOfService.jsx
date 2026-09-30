import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight,
  Zap, Lock, HelpCircle, ArrowUpRight
} from 'lucide-react'

export default function TermsOfService() {
  const [activeTab, setActiveTab] = useState('agreement')

  const clauses = [
    { id: 'agreement', title: '1. Direct Purchase & Settlement Agreement' },
    { id: 'payment', title: '2. Payment Obligations & Bank Wire Verification' },
    { id: 'finality', title: '3. Blockchain Finality & Address Accuracy' },
    { id: 'pricing', title: '4. Rate Locks & Liquidity Quotations' },
    { id: 'noncustodial', title: '5. Non-Custodial Nature of Kryptella' },
    { id: 'aml', title: '6. AML / CFT & Regulatory Compliance' },
    { id: 'risk', title: '7. Market Volatility & Risk Disclosure' },
    { id: 'termination', title: '8. Account Conduct & Order Cancellation' },
  ]

  const scrollTo = (id) => {
    setActiveTab(id)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', paddingTop: 88, paddingBottom: 80 }}>
      {/* Header Hero */}
      <section
        style={{
          padding: '60px 0 40px',
          background: 'radial-gradient(ellipse 80% 60% at 50% 10%, rgba(99, 102, 241, 0.22) 0%, transparent 70%)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: 840 }}>
          <div className="luxury-glow-badge" style={{ marginBottom: 20 }}>
            <FileText size={14} color="#60A5FA" />
            <span>Kryptella User Master Service Agreement</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 50px)',
              fontWeight: 900,
              letterSpacing: '-1.5px',
              color: '#FFFFFF',
              marginBottom: 16,
            }}
          >
            Terms of Service
          </h1>
          <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.7, maxWidth: 660, margin: '0 auto 16px' }}>
            Please review the binding operational terms governing direct cryptocurrency purchase, blockchain settlement, and user obligations on Kryptella.
          </p>
          <div style={{ fontSize: 13, color: '#64748B' }}>
            Last Revised: September 2024 · Kryptella Technologies Ltd.
          </div>
        </div>
      </section>

      {/* Highlights / Summary Cards at Top */}
      <section style={{ padding: '20px 0 40px' }}>
        <div className="container" style={{ maxWidth: 1160 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            <div className="card-glass" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#60A5FA', fontWeight: 800, marginBottom: 8 }}>
                <Zap size={18} /> Direct Settlement
              </div>
              <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                Every purchase is a direct swap. We do not hold user balances or provide internal wallet storage.
              </p>
            </div>

            <div className="card-glass" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#F59E0B', fontWeight: 800, marginBottom: 8 }}>
                <ShieldAlert size={18} /> Address Accuracy
              </div>
              <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                Blockchain transactions are immutable. The buyer is exclusively responsible for providing accurate wallet addresses.
              </p>
            </div>

            <div className="card-glass" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#34D399', fontWeight: 800, marginBottom: 8 }}>
                <CheckCircle2 size={18} /> Proof of Payment
              </div>
              <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                Orders are processed strictly upon verified bank transfer confirmation and receipt submission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Terms & Clauses */}
      <section style={{ padding: '20px 0 60px' }}>
        <div className="container" style={{ maxWidth: 1160 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 300px) minmax(0, 1fr)',
              gap: 40,
              alignItems: 'start',
            }}
            className="terms-grid"
          >
            {/* Left Nav */}
            <div
              className="card-glass"
              style={{
                padding: '24px 20px',
                position: 'sticky',
                top: 96,
                maxHeight: 'calc(100vh - 120px)',
                overflowY: 'auto',
              }}
            >
              <h4 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94A3B8', marginBottom: 16 }}>
                Sections
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {clauses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => scrollTo(c.id)}
                    style={{
                      textAlign: 'left',
                      background: activeTab === c.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: activeTab === c.id ? '#60A5FA' : '#CBD5E1',
                      fontSize: 13,
                      fontWeight: activeTab === c.id ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {c.title}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#93C5FD', marginBottom: 4 }}>Need Clarification?</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginBottom: 10 }}>Contact our legal and compliance desk for any questions.</div>
                <Link to="/contact" style={{ fontSize: 12, fontWeight: 700, color: '#60A5FA', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>Speak to Concierge</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Right Detailed Text */}
            <div
              className="card-glass"
              style={{
                padding: '40px 36px',
                lineHeight: 1.8,
                fontSize: 15,
                color: '#CBD5E1',
              }}
            >
              {/* Clause 1 */}
              <div id="agreement" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  1. Direct Purchase & Settlement Agreement
                </h2>
                <p>
                  By creating an account, accessing Kryptella, or initiating a digital asset order, you ("the Customer") enter into a legally binding agreement with Kryptella Technologies Ltd. ("Kryptella", "we", "us").
                </p>
                <p>
                  Kryptella provides a non-custodial OTC settlement conduit enabling verified individuals and institutions to purchase cryptocurrencies using Nigerian Naira (NGN) via designated banking channels.
                </p>
              </div>

              {/* Clause 2 */}
              <div id="payment" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  2. Payment Obligations & Bank Wire Verification
                </h2>
                <p>
                  Upon generating an order on Kryptella, the Customer agrees to transfer the precise fiat amount specified to the designated corporate bank details presented at checkout within the allocated session window.
                </p>
                <ul style={{ paddingLeft: 20, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li>
                    <strong style={{ color: '#FFFFFF' }}>Proof of Transfer:</strong> The Customer must submit an authentic bank transfer receipt or payment confirmation generated by their banking institution.
                  </li>
                  <li>
                    <strong style={{ color: '#FFFFFF' }}>Third-Party Payments:</strong> Payments must originate from bank accounts matching the verified legal identity of the registered account holder. Third-party deposits are subject to security holds or return fees.
                  </li>
                </ul>
              </div>

              {/* Clause 3 */}
              <div id="finality" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  3. Blockchain Finality & Address Accuracy
                </h2>
                <div
                  style={{
                    padding: '16px 20px',
                    borderRadius: 12,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    marginBottom: 16,
                  }}
                >
                  <p style={{ margin: 0, color: '#FCA5A5', fontWeight: 600, fontSize: 14 }}>
                    WARNING: Blockchain transactions are mathematically irreversible once confirmed on the network.
                  </p>
                </div>
                <p>
                  The Customer bears sole and exclusive responsibility for verifying the accuracy of the recipient wallet address, compatible token standard (e.g. TRC-20, ERC-20, BEP-20, Solana Native), and any required destination tags/memos. Kryptella is not liable for assets transferred to incorrect, incompatible, or fraudulent addresses specified by the Customer.
                </p>
              </div>

              {/* Clause 4 */}
              <div id="pricing" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  4. Rate Locks & Liquidity Quotations
                </h2>
                <p>
                  Crypto quotations on Kryptella are derived in real-time from deep global liquidity books. Once an order is initiated, the quoted exchange rate is locked for the duration of the order window. In events of severe fiat banking delay extending past normal reconciliation windows, Kryptella reserves the right to refresh the quote to the prevailing market price upon fund clearance.
                </p>
              </div>

              {/* Clause 5 */}
              <div id="noncustodial" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  5. Non-Custodial Nature of Kryptella
                </h2>
                <p>
                  Kryptella is not a depository bank or custodial wallet provider. We do not maintain digital asset balances on behalf of customers. Purchased assets are dispatched immediately and directly to your designated external blockchain wallet upon payment reconciliation.
                </p>
              </div>

              {/* Clause 6 */}
              <div id="aml" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  6. AML / CFT & Regulatory Compliance
                </h2>
                <p>
                  Kryptella strictly complies with applicable Anti-Money Laundering (AML) and Counter-Terrorism Financing (CFT) regulations. We prohibit the use of our services for illicit activities, darknet financing, sanctions evasion, or unauthorized financial intermediation. Any suspicious transactions will be frozen and reported to relevant statutory enforcement authorities.
                </p>
              </div>

              {/* Clause 7 */}
              <div id="risk" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  7. Market Volatility & Risk Disclosure
                </h2>
                <p>
                  Cryptocurrency markets carry substantial economic volatility. Asset valuations may fluctuate precipitously within minutes. By transacting on Kryptella, you acknowledge that you possess sufficient financial and technical expertise to understand crypto assets, and you assume full responsibility for your market decisions.
                </p>
              </div>

              {/* Clause 8 */}
              <div id="termination" style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  8. Account Conduct & Order Cancellation
                </h2>
                <p>
                  Kryptella reserves the right to decline or cancel orders, or suspend access to services, in instances of suspected fraud, counterfeit payment slips, abuse of promotional spreads, or non-compliance with these Terms.
                </p>
                <p>
                  For disputes or resolution requests, please contact our senior concierge team directly at <a href="mailto:concierge@kryptella.com" style={{ color: '#60A5FA' }}>concierge@kryptella.com</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 900px) {
          .terms-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
