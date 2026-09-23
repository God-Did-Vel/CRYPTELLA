import React, { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, FileText, CheckCircle2, XCircle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { formatNaira, formatUsd, formatCrypto, formatDate } from '../utils/format'
import OrderStatusBadge from '../components/OrderStatusBadge'
import CopyButton from '../components/CopyButton'
import Modal from '../components/Modal'
import ReceiptViewer from '../components/ReceiptViewer'
import { explorerTxUrl } from '../utils/explorers'

const TABS = [
  { id: 'under_review', label: 'Under review' },
  { id: 'awaiting_receipt', label: 'Awaiting receipt' },
  { id: 'awaiting_payment', label: 'Awaiting payment' },
  { id: 'completed', label: 'Completed' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All' },
]

const ACTIONABLE = ['awaiting_payment', 'awaiting_receipt', 'under_review']

export default function AdminOrders() {
  // Filters can come from links (overview cards, customer list)
  const [params] = useSearchParams()
  const [tab, setTab] = useState(() => (TABS.some((t) => t.id === params.get('status')) ? params.get('status') : 'under_review'))
  const [query, setQuery] = useState(() => params.get('q') || '')
  const [search, setSearch] = useState(() => params.get('q') || '')
  const [typeFilter, setTypeFilter] = useState(() => (['buy', 'sell'].includes(params.get('type')) ? params.get('type') : 'all'))
  const [userFilter, setUserFilter] = useState(() => (params.get('user') ? { id: params.get('user'), name: params.get('name') || 'this customer' } : null))
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ data: [], pages: 1, total: 0 })
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const [receiptFor, setReceiptFor] = useState(null)
  const [completeFor, setCompleteFor] = useState(null)
  const [rejectFor, setRejectFor] = useState(null)
  const [txHash, setTxHash] = useState('')
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    const query = {
      page, ...(tab !== 'all' && { status: tab }), ...(typeFilter !== 'all' && { type: typeFilter }),
      ...(search && { q: search }), ...(userFilter && { user: userFilter.id }),
    }
    return Promise.all([api.get('/admin/orders', { params: query }), api.get('/admin/orders/stats')])
      .then(([orders, s]) => { setResult(orders.data); setStats(s.data.data) })
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false))
  }, [tab, page, search, userFilter, typeFilter])

  useEffect(() => { setLoading(true); load() }, [load])
  useEffect(() => {
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [load])

  const act = async (kind) => {
    const order = kind === 'complete' ? completeFor : rejectFor
    setBusy(true)
    try {
      const body = kind === 'complete'
        ? (order.type === 'sell' ? { payoutReference: txHash.trim() } : { txHash: txHash.trim() })
        : { reason: reason.trim() }
      const { data } = await api.post(`/admin/orders/${order.id}/${kind}`, body)
      toast.success(data.message)
      setCompleteFor(null); setRejectFor(null); setTxHash(''); setReason('')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ paddingTop: 68 }}>
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Order review</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Buys: confirm naira received, send crypto · Sells: confirm crypto received, pay naira</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(query.trim()) }} style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input-field" placeholder="Reference, email, address, tx hash, account no." value={query}
                onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 36, width: 300, maxWidth: '60vw' }} />
            </div>
            <button className="btn btn-secondary" type="submit">Search</button>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: '24px 24px 48px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
          {[['all', 'Buy & sell'], ['buy', 'Buys'], ['sell', 'Sells']].map(([id, label]) => (
            <button key={id} onClick={() => { setTypeFilter(id); setPage(1) }} className={`chip ${typeFilter === id ? 'chip-active' : ''}`}>{label}</button>
          ))}
          <span style={{ width: 1, height: 22, background: 'var(--border)', margin: '0 4px' }} />
          {TABS.map((t) => (
            <button key={t.id} onClick={() => { setTab(t.id); setPage(1) }} className={`chip ${tab === t.id ? 'chip-active' : ''}`}>
              {t.label}{stats && t.id !== 'all' ? ` (${stats[t.id] ?? 0})` : ''}
            </button>
          ))}
          <button onClick={() => { setLoading(true); load() }} className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {userFilter && (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Orders for <strong style={{ color: 'var(--text-primary)' }}>{userFilter.name}</strong> · <button onClick={() => { setUserFilter(null); setPage(1) }} style={{ background: 'none', border: 'none', color: 'var(--accent)' }}>show all customers</button>
          </p>
        )}

        {search && (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
            Results for “{search}” · <button onClick={() => { setSearch(''); setQuery('') }} style={{ background: 'none', border: 'none', color: 'var(--accent)' }}>clear</button>
          </p>
        )}

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 150, marginBottom: 12 }} />)
        ) : result.data.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>No orders here.</div>
        ) : (
          result.data.map((o) => (
            <div key={o.id} className="card" style={{ marginBottom: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {o.image && <img src={o.image} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />}
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16 }}>
                      <span className={`type-pill type-${o.type === 'sell' ? 'sell' : 'buy'}`}>{o.type === 'sell' ? 'SELL' : 'BUY'}</span>
                      {formatCrypto(o.cryptoAmount, o.symbol)}{' '}
                      <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{o.type === 'sell' ? '→ pay' : 'for'}</span> {formatNaira(o.amountNgn)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {o.reference} <CopyButton value={o.reference} size={12} /> · {formatDate(o.createdAt)}
                    </div>
                  </div>
                </div>
                <OrderStatusBadge status={o.status} type={o.type} />
              </div>

              <div className="admin-grid">
                <div>
                  <div className="admin-label">Customer</div>
                  <div>{o.userId ? `${o.userId.firstName} ${o.userId.lastName}` : '—'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{o.userId?.email}</div>
                </div>
                {o.type === 'sell' ? (
                  <>
                    <div style={{ minWidth: 0 }}>
                      <div className="admin-label">Customer sends ({o.network?.name}) to</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <code style={{ fontSize: 12.5, wordBreak: 'break-all' }}>{o.deposit?.address}</code>
                        <CopyButton value={o.deposit?.address} label="Address copied" />
                      </div>
                      {o.deposit?.memo && <div style={{ fontSize: 13 }}>{o.deposit.memoLabel}: <code>{o.deposit.memo}</code> <CopyButton value={o.deposit.memo} size={12} /></div>}
                      {o.depositTxHash ? (
                        <div style={{ fontSize: 13, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
                          <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>Tx:</span>
                          <code style={{ wordBreak: 'break-all' }}>{o.depositTxHash}</code>
                          <CopyButton value={o.depositTxHash} size={12} />
                          {explorerTxUrl(o.network?.id, o.depositTxHash) && (
                            <a href={explorerTxUrl(o.network?.id, o.depositTxHash)} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', flexShrink: 0 }}>view</a>
                          )}
                        </div>
                      ) : <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>No transaction hash yet</div>}
                    </div>
                    <div>
                      <div className="admin-label">Pay customer</div>
                      <div style={{ fontWeight: 700 }}>{formatNaira(o.amountNgn)} <CopyButton value={o.amountNgn} size={12} /></div>
                      <div style={{ fontSize: 13 }}>{o.payoutAccount?.bankName}</div>
                      <div style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                        {o.payoutAccount?.accountNumber} <CopyButton value={o.payoutAccount?.accountNumber} size={12} /> · {o.payoutAccount?.accountName}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--green)' }}>
                        Charge {formatNaira(o.chargeNgn)} ({formatNaira(o.chargePerUsd)}/$1 on {formatNaira(o.baseNgnPerUsd)})
                      </div>
                    </div>
                  </>
                ) : (
                <>
                <div>
                  <div className="admin-label">Paid to</div>
                  <div>{o.paymentAccount?.bankName}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{o.paymentAccount?.accountNumber} · {formatUsd(o.amountUsd)} @ {formatNaira(o.ngnPerUsd)}</div>
                  {o.chargeNgn > 0 && (
                    <div style={{ fontSize: 13, color: 'var(--green)' }}>
                      Charge {formatNaira(o.chargeNgn)} ({formatNaira(o.chargePerUsd)}/$1 on {formatNaira(o.baseNgnPerUsd)})
                    </div>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="admin-label">Send to ({o.network?.name})</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <code style={{ fontSize: 12.5, wordBreak: 'break-all' }}>{o.walletAddress}</code>
                    <CopyButton value={o.walletAddress} label="Address copied" />
                  </div>
                  {o.memo && <div style={{ fontSize: 13 }}>Memo/tag: <code>{o.memo}</code> <CopyButton value={o.memo} size={12} /></div>}
                </div>
                </>
                )}
              </div>

              {o.customerNote && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 12 }}>Customer note: “{o.customerNote}”</p>}
              {o.txHash && <p style={{ fontSize: 13, marginTop: 12, wordBreak: 'break-all' }}>Tx: <code>{o.txHash}</code></p>}
              {o.payoutReference && <p style={{ fontSize: 13, marginTop: 12, wordBreak: 'break-all' }}>Payout reference: <code>{o.payoutReference}</code></p>}
              {o.rejectionReason && <p style={{ fontSize: 13, marginTop: 12, color: 'var(--red)' }}>Rejected: {o.rejectionReason}</p>}

              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                {o.receipt?.id
                  ? <button className="btn btn-secondary btn-sm" onClick={() => setReceiptFor(o)}><FileText size={14} /> {o.type === 'sell' ? 'View screenshot' : 'View receipt'}</button>
                  : <span style={{ fontSize: 13, color: 'var(--text-muted)', alignSelf: 'center' }}>{o.type === 'sell' ? 'No screenshot' : 'No receipt yet'}</span>}
                {ACTIONABLE.includes(o.status) && (
                  <>
                    <button className="btn btn-green btn-sm" onClick={() => { setCompleteFor(o); setTxHash('') }}><CheckCircle2 size={14} /> {o.type === 'sell' ? 'Mark as paid' : 'Mark as sent'}</button>
                    <button className="btn btn-red btn-sm" onClick={() => { setRejectFor(o); setReason('') }}><XCircle size={14} /> Reject</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}

        {result.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 16 }}>
            <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={14} /> Prev</button>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Page {page} of {result.pages} · {result.total} orders</span>
            <button className="btn btn-secondary btn-sm" disabled={page >= result.pages} onClick={() => setPage(page + 1)}>Next <ChevronRight size={14} /></button>
          </div>
        )}
      </div>

      <ReceiptViewer open={!!receiptFor} onClose={() => setReceiptFor(null)}
        url={receiptFor ? `/admin/orders/${receiptFor.id}/receipt` : null}
        title={receiptFor ? `Receipt · ${receiptFor.reference} · ${formatNaira(receiptFor.amountNgn)}` : ''} />

      <Modal open={!!completeFor} onClose={() => setCompleteFor(null)} title={completeFor?.type === 'sell' ? 'Mark sell order as paid' : 'Mark order as sent'}>
        {completeFor?.type === 'sell' && (
          <form onSubmit={(e) => { e.preventDefault(); act('complete') }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
              Confirm you received <strong style={{ color: 'var(--text-primary)' }}>{formatCrypto(completeFor.cryptoAmount, completeFor.symbol)}</strong> on {completeFor.network?.name}
              {completeFor.depositTxHash ? ' (check the transaction hash on the explorer)' : ''} and paid{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{formatNaira(completeFor.amountNgn)}</strong> to:
            </p>
            <div style={{ background: 'var(--bg-secondary)', padding: 12, borderRadius: 8, fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
              <strong>{completeFor.payoutAccount?.accountName}</strong><br />
              {completeFor.payoutAccount?.bankName} · {completeFor.payoutAccount?.accountNumber}
            </div>
            <label className="label" htmlFor="payoutref">Bank transfer reference</label>
            <input id="payoutref" className="input-field" value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="Session ID / transfer reference" autoFocus
              style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13 }} />
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button type="button" className="btn btn-secondary btn-full" onClick={() => setCompleteFor(null)}>Cancel</button>
              <button type="submit" className="btn btn-green btn-full" disabled={busy || txHash.trim().length < 4}>{busy ? 'Saving…' : 'Complete order'}</button>
            </div>
          </form>
        )}
        {completeFor && completeFor.type !== 'sell' && (
          <form onSubmit={(e) => { e.preventDefault(); act('complete') }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
              Confirm you received <strong style={{ color: 'var(--text-primary)' }}>{formatNaira(completeFor.amountNgn)}</strong> (ref {completeFor.reference}) and sent{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{formatCrypto(completeFor.cryptoAmount, completeFor.symbol)}</strong> on {completeFor.network?.name} to:
            </p>
            <code style={{ display: 'block', background: 'var(--bg-secondary)', padding: 12, borderRadius: 8, fontSize: 12.5, wordBreak: 'break-all', marginBottom: 16 }}>
              {completeFor.walletAddress}{completeFor.memo ? `  (memo ${completeFor.memo})` : ''}
            </code>
            <label className="label" htmlFor="txhash">Transaction hash</label>
            <input id="txhash" className="input-field" value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="0x… / transaction ID" autoFocus
              style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13 }} />
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button type="button" className="btn btn-secondary btn-full" onClick={() => setCompleteFor(null)}>Cancel</button>
              <button type="submit" className="btn btn-green btn-full" disabled={busy || txHash.trim().length < 8}>{busy ? 'Saving…' : 'Complete order'}</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!rejectFor} onClose={() => setRejectFor(null)} title="Reject order">
        {rejectFor && (
          <form onSubmit={(e) => { e.preventDefault(); act('reject') }}>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              {rejectFor.reference} · {formatNaira(rejectFor.amountNgn)}. The customer will see this reason.
            </p>
            <label className="label" htmlFor="reason">Reason</label>
            <textarea id="reason" className="input-field" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} autoFocus
              placeholder="e.g. No matching transfer received. Contact support if you paid." />
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button type="button" className="btn btn-secondary btn-full" onClick={() => setRejectFor(null)}>Cancel</button>
              <button type="submit" className="btn btn-red btn-full" disabled={busy || reason.trim().length < 3}>{busy ? 'Saving…' : 'Reject order'}</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
