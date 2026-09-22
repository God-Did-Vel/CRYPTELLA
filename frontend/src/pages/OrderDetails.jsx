import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, Clock, CheckCircle2, XCircle, AlertTriangle, Upload, FileText, Landmark, Hourglass, ExternalLink, RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { formatNaira, formatUsd, formatCrypto, formatPrice, formatDate } from '../utils/format'
import { ORDER_STATUS, ORDER_STEPS, stepIndex, isPending } from '../utils/orders'
import OrderStatusBadge from '../components/OrderStatusBadge'
import CopyButton from '../components/CopyButton'
import Modal from '../components/Modal'
import ReceiptUploadModal from '../components/ReceiptUploadModal'
import ReceiptViewer from '../components/ReceiptViewer'

// Block explorers for "View transaction" links
const EXPLORERS = {
  BTC: 'https://mempool.space/tx/', ERC20: 'https://etherscan.io/tx/', BEP20: 'https://bscscan.com/tx/',
  ARBITRUM: 'https://arbiscan.io/tx/', BASE: 'https://basescan.org/tx/', TRC20: 'https://tronscan.org/#/transaction/',
  SOL: 'https://solscan.io/tx/', XRP: 'https://xrpscan.com/tx/', ADA: 'https://cardanoscan.io/transaction/',
  XLM: 'https://stellar.expert/explorer/public/tx/', BCH: 'https://blockchair.com/bitcoin-cash/transaction/',
  NEAR: 'https://nearblocks.io/txns/', LTC: 'https://blockchair.com/litecoin/transaction/',
  AVAXC: 'https://snowtrace.io/tx/', HBAR: 'https://hashscan.io/mainnet/transaction/', SUI: 'https://suiscan.xyz/mainnet/tx/',
}

const useCountdown = (target) => {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  const ms = target ? Math.max(0, new Date(target).getTime() - now) : 0
  return { ms, label: `${String(Math.floor(ms / 60000)).padStart(2, '0')}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}` }
}

const Field = ({ label, value, copy, mono, big }) => (
  <div style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <span style={{
        fontWeight: 700, fontSize: big ? 22 : 15, wordBreak: 'break-all',
        fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit',
      }}>{value}</span>
      {copy !== undefined && <CopyButton value={copy} label={`${label} copied`} size={16} />}
    </div>
  </div>
)

const Row = ({ label, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '9px 0', fontSize: 14, borderBottom: '1px solid var(--border-light)' }}>
    <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
    <span style={{ fontWeight: 600, textAlign: 'right', minWidth: 0, wordBreak: 'break-all' }}>{children}</span>
  </div>
)

const Stepper = ({ status }) => {
  const current = stepIndex(status)
  const failed = !isPending(status) && status !== 'completed'
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 28 }}>
      {ORDER_STEPS.map((step, i) => {
        const done = !failed && i < current
        const active = !failed && i === current
        const color = done ? 'var(--green)' : active ? 'var(--accent)' : 'var(--border)'
        return (
          <React.Fragment key={step.key}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 'clamp(62px, 17vw, 90px)', flexShrink: 0 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', border: `2px solid ${color}`,
                background: done ? 'var(--green)' : active ? 'var(--accent-light)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700,
                color: done ? '#fff' : active ? 'var(--accent)' : 'var(--text-muted)',
              }}>{done ? <CheckCircle2 size={16} /> : i + 1}</div>
              <span style={{ fontSize: 12, textAlign: 'center', color: done || active ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: active ? 700 : 500 }}>
                {step.label}
              </span>
            </div>
            {i < ORDER_STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, marginTop: 14, background: !failed && i < current ? 'var(--green)' : 'var(--border)' }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [busy, setBusy] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [confirmPaid, setConfirmPaid] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)

  const load = useCallback(() =>
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.data))
      .catch((err) => err.response?.status === 404 && setNotFound(true))
      .finally(() => setLoading(false)), [id])

  useEffect(() => { load() }, [load])

  // Poll while the order is in progress, to pick up review results
  useEffect(() => {
    if (!order || !isPending(order.status)) return
    const intervalId = setInterval(load, 15000)
    return () => clearInterval(intervalId)
  }, [order?.status, load])

  const { ms, label: countdown } = useCountdown(order?.status === 'awaiting_payment' ? order.expiresAt : null)
  useEffect(() => {
    if (order?.status === 'awaiting_payment' && ms === 0) load()
  }, [ms, order?.status, load])

  const markPaid = async () => {
    setBusy(true)
    try {
      const { data } = await api.post(`/orders/${id}/mark-paid`)
      setOrder(data.data)
      setConfirmPaid(false)
      setShowUpload(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update the order')
      load()
    } finally {
      setBusy(false)
    }
  }

  const cancel = async () => {
    setBusy(true)
    try {
      const { data } = await api.post(`/orders/${id}/cancel`)
      setOrder(data.data)
      toast.success('Order cancelled')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel the order')
      load()
    } finally {
      setBusy(false)
      setConfirmCancel(false)
    }
  }

  if (loading) {
    return (
      <div style={{ paddingTop: 100 }}>
        <div className="container" style={{ padding: '32px 24px' }}>
          <div className="skeleton" style={{ height: 40, width: 260, marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 380 }} />
        </div>
      </div>
    )
  }

  if (notFound || !order) {
    return (
      <div style={{ paddingTop: 140, textAlign: 'center' }}>
        <h2>Order not found</h2>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Back to orders</Link>
      </div>
    )
  }

  const status = ORDER_STATUS[order.status]
  const acct = order.paymentAccount || {}
  const isTestAccount = /TEST BANK/i.test(acct.bankName || '')
  const explorer = EXPLORERS[order.network?.id]

  return (
    <div style={{ paddingTop: 68 }}>
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
        <div className="container">
          <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
            <ArrowLeft size={14} /> All orders
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {order.image && <img src={order.image} alt="" style={{ width: 44, height: 44, borderRadius: '50%' }} />}
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800 }}>Buy {formatCrypto(order.cryptoAmount, order.symbol)}</h1>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Order {order.reference} <CopyButton value={order.reference} label="Reference copied" size={12} /> · {formatDate(order.createdAt)}
                </div>
              </div>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 24px 48px' }}>
        <div style={{ overflowX: 'auto' }}><Stepper status={order.status} /></div>

        <div className="trade-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
          {/* Main action card */}
          <div style={{ minWidth: 0 }}>
            {order.status === 'awaiting_payment' && (
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Landmark size={20} style={{ color: 'var(--accent)' }} /> Transfer to this account
                  </h2>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, fontWeight: 700, fontSize: 14,
                    background: ms < 5 * 60000 ? 'var(--red-light)' : 'rgba(245,158,11,0.12)', color: ms < 5 * 60000 ? 'var(--red)' : 'var(--yellow)',
                    fontVariantNumeric: 'tabular-nums',
                  }}><Clock size={14} /> {countdown}</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  Send the exact amount below within the time shown. Your rate is locked until then.
                </p>

                {isTestAccount && (
                  <div className="notice notice-warn" style={{ margin: '12px 0' }}>
                    <AlertTriangle size={16} /> Test account — payment accounts are not configured yet. Don't send real money.
                  </div>
                )}

                <Field label="Amount to send" value={formatNaira(order.amountNgn)} copy={order.amountNgn} big />
                <Field label="Bank" value={acct.bankName} />
                <Field label="Account number" value={acct.accountNumber} copy={acct.accountNumber} mono big />
                <Field label="Account name" value={acct.accountName} />
                <Field label="Transfer narration / reference" value={acct.narration} copy={acct.narration} mono />

                <div className="notice" style={{ marginTop: 16 }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0, color: 'var(--yellow)' }} />
                  <span>Put <strong>{acct.narration}</strong> in the transfer narration, send from an account in your name, and send the exact amount in one transfer.</span>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
                  <button className="btn btn-green btn-lg" style={{ flex: 1, justifyContent: 'center', minWidth: 220 }} onClick={() => setConfirmPaid(true)} disabled={busy}>
                    <CheckCircle2 size={18} /> I have made payment
                  </button>
                  <button className="btn btn-secondary btn-lg" onClick={() => setConfirmCancel(true)} disabled={busy}>Cancel order</button>
                </div>
              </div>
            )}

            {order.status === 'awaiting_receipt' && (
              <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                <Upload size={36} style={{ color: 'var(--accent)', marginBottom: 12 }} />
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Upload your payment receipt</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 440, margin: '0 auto 20px' }}>
                  You've marked this order as paid. Upload the receipt of your {formatNaira(order.amountNgn)} transfer so we can confirm it.
                </p>
                <button className="btn btn-primary btn-lg" onClick={() => setShowUpload(true)}><Upload size={18} /> Upload receipt</button>
              </div>
            )}

            {order.status === 'under_review' && (
              <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                <Hourglass size={36} style={{ color: '#60A5FA', marginBottom: 12 }} />
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>We're confirming your payment</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 460, margin: '0 auto 20px' }}>
                  Once your {formatNaira(order.amountNgn)} transfer is confirmed, we'll send {formatCrypto(order.cryptoAmount, order.symbol)} to your wallet.
                  This page updates automatically.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary" onClick={() => setShowReceipt(true)}><FileText size={16} /> View receipt</button>
                  <button className="btn btn-secondary" onClick={() => setShowUpload(true)}><RefreshCw size={16} /> Replace receipt</button>
                </div>
              </div>
            )}

            {order.status === 'completed' && (
              <div className="card" style={{ textAlign: 'center', padding: '40px 24px', borderColor: 'var(--green)' }}>
                <CheckCircle2 size={40} style={{ color: 'var(--green)', marginBottom: 12 }} />
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{formatCrypto(order.cryptoAmount, order.symbol)} sent!</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
                  Sent to your {order.network?.name} wallet on {formatDate(order.completedAt)}.
                </p>
                {order.txHash && (
                  <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 16px', textAlign: 'left', maxWidth: 560, margin: '0 auto' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Transaction hash</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <code style={{ fontSize: 13, wordBreak: 'break-all', flex: 1 }}>{order.txHash}</code>
                      <CopyButton value={order.txHash} label="Transaction hash copied" />
                      {explorer && (
                        <a href={explorer + order.txHash} target="_blank" rel="noreferrer" title="View on block explorer" style={{ color: 'var(--accent)', lineHeight: 0 }}>
                          <ExternalLink size={15} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {['rejected', 'cancelled', 'expired'].includes(order.status) && (
              <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                <XCircle size={36} style={{ color: order.status === 'rejected' ? 'var(--red)' : 'var(--text-muted)', marginBottom: 12 }} />
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{status.label}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 460, margin: '0 auto 8px' }}>{status.hint}</p>
                {order.rejectionReason && (
                  <p style={{ fontSize: 14, maxWidth: 460, margin: '8px auto 0' }}><strong>Reason:</strong> {order.rejectionReason}</p>
                )}
                {order.status !== 'cancelled' && (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 460, margin: '12px auto 0' }}>
                    If you already sent money for this order, contact support and quote reference <strong>{order.reference}</strong>.
                  </p>
                )}
                <Link to={`/trade/${order.coinId}`} className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
                  Place a new order
                </Link>
              </div>
            )}
          </div>

          {/* Summary + timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Order summary</h3>
              <Row label="You pay">{formatNaira(order.amountNgn)}</Row>
              <Row label="You receive">{formatCrypto(order.cryptoAmount, order.symbol)}</Row>
              <Row label="Dollar value">{formatUsd(order.amountUsd)}</Row>
              <Row label={`${order.symbol} price`}>{formatPrice(order.priceUsd)}</Row>
              <Row label="Rate">{formatNaira(order.ngnPerUsd)} / $1</Row>
            </div>

            <div className="card">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Delivery</h3>
              <Row label="Network">{order.network?.name}</Row>
              <div style={{ padding: '9px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>Wallet address</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <code style={{ fontSize: 12.5, wordBreak: 'break-all', flex: 1 }}>{order.walletAddress}</code>
                  <CopyButton value={order.walletAddress} label="Address copied" />
                </div>
              </div>
              {order.memo && <Row label="Memo / tag">{order.memo}</Row>}
              {order.receipt?.id && order.status !== 'under_review' && (
                <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => setShowReceipt(true)}>
                  <FileText size={14} /> View receipt
                </button>
              )}
            </div>

            <div className="card">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Activity</h3>
              <ol style={{ listStyle: 'none', position: 'relative' }}>
                {[...(order.history || [])].reverse().map((h, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, paddingBottom: 14 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 7, flexShrink: 0, background: ORDER_STATUS[h.status]?.color || 'var(--border)' }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{h.note || ORDER_STATUS[h.status]?.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(h.at)}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <Modal open={confirmPaid} onClose={() => setConfirmPaid(false)} title="Have you sent the money?">
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
          Only continue if you've transferred <strong style={{ color: 'var(--text-primary)' }}>{formatNaira(order.amountNgn)}</strong> to{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{acct.accountName}</strong> ({acct.bankName}, {acct.accountNumber}).
          Next, you'll upload your receipt.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary btn-full" onClick={() => setConfirmPaid(false)}>Not yet</button>
          <button className="btn btn-green btn-full" onClick={markPaid} disabled={busy}>{busy ? 'Please wait…' : "Yes, I've paid"}</button>
        </div>
      </Modal>

      <Modal open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Cancel this order?">
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
          Don't cancel if you've already sent money for this order.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-secondary btn-full" onClick={() => setConfirmCancel(false)}>Keep order</button>
          <button className="btn btn-red btn-full" onClick={cancel} disabled={busy}>{busy ? 'Cancelling…' : 'Cancel order'}</button>
        </div>
      </Modal>

      <ReceiptUploadModal
        open={showUpload}
        order={order}
        onClose={() => setShowUpload(false)}
        onUploaded={(updated) => { setOrder(updated); setShowUpload(false) }}
      />
      <ReceiptViewer open={showReceipt} onClose={() => setShowReceipt(false)} url={`/orders/${order.id}/receipt`} />
    </div>
  )
}
