import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, Lock, Eye, FileText, CheckCircle2, ChevronRight,
  Server, Database, AlertCircle, ArrowLeft, ArrowUpRight
} from 'lucide-react'

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('framework')

  const sections = [
    { id: 'framework', label: '1. Privacy Framework & Principles' },
    { id: 'collection', label: '2. Information We Collect' },
    { id: 'noncustodial', label: '3. Non-Custodial Data Guarantee' },
    { id: 'receipts', label: '4. Proof of Payment & Receipt Security' },
    { id: 'encryption', label: '5. Encryption & Storage Protocols' },
    { id: 'sharing', label: '6. Third-Party Disclosures' },
    { id: 'rights', label: '7. Your Data Rights & NDPR Compliance' },
    { id: 'retention', label: '8. Data Retention & Erasure' },
    { id: 'contact', label: '9. Data Protection Officer Contact' },
  ]

  const scrollTo = (id) => {
    setActiveSection(id)
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
          background: 'radial-gradient(ellipse 80% 60% at 50% 10%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: 840 }}>
          <div className="luxury-glow-badge" style={{ marginBottom: 20 }}>
            <ShieldCheck size={14} color="#60A5FA" />
            <span>Kryptella Global Privacy & Security Framework</span>
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
            Privacy Policy & Data Protection
          </h1>
          <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.7, maxWidth: 660, margin: '0 auto 16px' }}>
            Learn how Kryptella collects, encrypts, and isolates transaction data while safeguarding your sovereignty and non-custodial financial privacy.
          </p>
          <div style={{ fontSize: 13, color: '#64748B' }}>
            Effective Date: September 2024 · Last Reviewed: Present Version 2.4
          </div>
        </div>
      </section>

      {/* Main Framework Content */}
      <section style={{ padding: '30px 0 60px' }}>
        <div className="container" style={{ maxWidth: 1160 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 300px) minmax(0, 1fr)',
              gap: 40,
              alignItems: 'start',
            }}
            className="policy-grid"
          >
            {/* Left Column: Quick Jump Navigation */}
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
                Table of Contents
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    style={{
                      textAlign: 'left',
                      background: activeSection === s.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: activeSection === s.id ? '#60A5FA' : '#CBD5E1',
                      fontSize: 13,
                      fontWeight: activeSection === s.id ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  borderRadius: 12,
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#F59E0B', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
                  <Lock size={14} /> Zero Key Custody
                </div>
                <div style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.5 }}>
                  Kryptella never accesses or stores your private seed phrases or wallet keys.
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Policy Clauses */}
            <div
              className="card-glass"
              style={{
                padding: '40px 36px',
                lineHeight: 1.8,
                fontSize: 15,
                color: '#CBD5E1',
              }}
            >
              {/* Section 1 */}
              <div id="framework" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  1. Privacy Framework & Principles
                </h2>
                <p>
                  At Kryptella, we believe financial privacy and sovereignty are foundational human rights. This Privacy Policy delineates how Kryptella collects, processes, and protects your information when you access our web application, create direct settlement orders, or interface with our concierge desks.
                </p>
                <p>
                  We adhere to international best practices, including the Nigerian Data Protection Regulation (NDPR) and relevant global data privacy benchmarks, ensuring transparent, purposeful, and strictly limited processing.
                </p>
              </div>

              {/* Section 2 */}
              <div id="collection" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  2. Information We Collect
                </h2>
                <p>
                  To execute direct settlement crypto trades reliably and adhere to financial compliance mandates, we collect only necessary data points:
                </p>
                <ul style={{ paddingLeft: 20, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li>
                    <strong style={{ color: '#FFFFFF' }}>Account Identifiers:</strong> Your registered email address and basic profile credentials.
                  </li>
                  <li>
                    <strong style={{ color: '#FFFFFF' }}>Settlement Metadata:</strong> Public destination wallet addresses, chosen blockchain network protocols (e.g. BTC, TRC-20, ERC-20), and transaction amounts.
                  </li>
                  <li>
                    <strong style={{ color: '#FFFFFF' }}>Verification Receipts:</strong> User-uploaded bank payment slips or transfer screenshots uploaded for order reconciliation.
                  </li>
                  <li>
                    <strong style={{ color: '#FFFFFF' }}>Technical Session Telemetry:</strong> Anonymized IP addresses, browser types, and timestamp logs utilized solely for session persistence and fraud prevention.
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div id="noncustodial" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  3. Non-Custodial Data Guarantee
                </h2>
                <div
                  style={{
                    padding: '20px 24px',
                    borderRadius: 14,
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(96, 165, 250, 0.3)',
                    marginBottom: 16,
                  }}
                >
                  <p style={{ margin: 0, color: '#E2E8F0', fontWeight: 600 }}>
                    Kryptella operates as a direct-settlement portal. We NEVER generate, collect, transmit, or store private keys, seed phrases, or master wallet passwords.
                  </p>
                </div>
                <p>
                  When you buy cryptocurrency on Kryptella, digital assets are broadcasted straight to the public blockchain address provided by you. We hold zero custodial control over your post-settlement funds.
                </p>
              </div>

              {/* Section 4 */}
              <div id="receipts" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  4. Proof of Payment & Receipt Security
                </h2>
                <p>
                  Receipts uploaded during the checkout process are stored in cryptographically isolated buckets with restricted administrative access. Uploaded receipts are used exclusively to confirm incoming bank wires with our designated banking partners and verify legitimate order execution.
                </p>
                <p>
                  Receipt images are never published, shared with unauthorized third parties, or indexed in search engines.
                </p>
              </div>

              {/* Section 5 */}
              <div id="encryption" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  5. Encryption & Storage Protocols
                </h2>
                <p>
                  We implement robust, state-of-the-art technical security controls:
                </p>
                <ul style={{ paddingLeft: 20, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li>
                    <strong style={{ color: '#FFFFFF' }}>Transport Security:</strong> All client-server communications are forced over TLS 1.3 with 256-bit asymmetric cipher suites.
                  </li>
                  <li>
                    <strong style={{ color: '#FFFFFF' }}>Database At-Rest Encryption:</strong> Transaction histories and sensitive attributes are encrypted using AES-256 standard encryption keys.
                  </li>
                  <li>
                    <strong style={{ color: '#FFFFFF' }}>Access Isolation:</strong> Strict role-based access control (RBAC) ensures only vetted operational administrators can view verification documents.
                  </li>
                </ul>
              </div>

              {/* Section 6 */}
              <div id="sharing" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  6. Third-Party Disclosures
                </h2>
                <p>
                  Kryptella does not sell, rent, or trade your personal information to data brokers or advertising networks. Information may only be disclosed under the following narrow circumstances:
                </p>
                <ul style={{ paddingLeft: 20, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li>
                    <strong style={{ color: '#FFFFFF' }}>Banking Partners:</strong> For reconciling settlement wires and preventing fraudulent transfers.
                  </li>
                  <li>
                    <strong style={{ color: '#FFFFFF' }}>Legal Obligations:</strong> In direct response to lawful, binding subpoenas, court orders, or statutory regulatory demands in accordance with applicable laws.
                  </li>
                </ul>
              </div>

              {/* Section 7 */}
              <div id="rights" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  7. Your Data Rights & NDPR Compliance
                </h2>
                <p>
                  Under NDPR and global data privacy standards, you hold the following rights:
                </p>
                <ul style={{ paddingLeft: 20, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li>
                    <strong style={{ color: '#FFFFFF' }}>Right to Access:</strong> Request a comprehensive export of your personal profile and trade logs.
                  </li>
                  <li>
                    <strong style={{ color: '#FFFFFF' }}>Right to Rectification:</strong> Request corrections to inaccurate registration information.
                  </li>
                  <li>
                    <strong style={{ color: '#FFFFFF' }}>Right to Erasure:</strong> Request deletion of personal records, subject to statutory anti-financial-crime retention periods.
                  </li>
                </ul>
              </div>

              {/* Section 8 */}
              <div id="retention" style={{ marginBottom: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  8. Data Retention & Erasure
                </h2>
                <p>
                  We retain order metadata and transaction verification receipts only for as long as necessary to satisfy accounting audits, resolve disputes, and comply with Anti-Money Laundering (AML) retention mandates. Upon expiration of mandatory holding periods, records are permanently purged or irreversibly anonymized.
                </p>
              </div>

              {/* Section 9 */}
              <div id="contact" style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
                  9. Data Protection Officer Contact
                </h2>
                <p>
                  For inquiries regarding your personal data, data erasure requests, or to contact our designated Data Protection Officer, please reach out directly:
                </p>
                <div
                  style={{
                    padding: '20px 24px',
                    borderRadius: 14,
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: 4 }}>
                    Kryptella Data Protection Office
                  </div>
                  <div style={{ fontSize: 14, color: '#94A3B8', marginBottom: 6 }}>
                    Email: <a href="mailto:privacy@kryptella.com" style={{ color: '#60A5FA' }}>privacy@kryptella.com</a>
                  </div>
                  <div style={{ fontSize: 14, color: '#94A3B8' }}>
                    Concierge Desk: <Link to="/contact" style={{ color: '#60A5FA' }}>Contact Us Page</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 900px) {
          .policy-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
