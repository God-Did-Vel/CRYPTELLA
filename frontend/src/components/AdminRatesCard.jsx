import React, { useEffect, useState } from 'react'
import { RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { formatNaira, formatDate } from '../utils/format'

const SOURCE_LABEL = { binance: 'Binance P2P', bybit: 'Bybit P2P', quidax: 'Quidax (exchange)', manual: 'Manual' }

const Cell = ({ label, value, sub, color }) => (
  <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '12px 14px' }}>
    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 800, color }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sub}</div>}
  </div>
)

// Admin overview: where naira rates come from, what customers pay, manual override
export default function AdminRatesCard() {
  const [data, setData] = useState(null)
  const [manual, setManual] = useState({ buy: '', sell: '' })
  const [saving, setSaving] = useState(false)

  const load = () => api.get('/admin/rates').then(({ data }) => {
    setData(data.data)
    setManual((m) => (m.buy || m.sell ? m : { buy: data.data.manual?.buy ?? '', sell: data.data.manual?.sell ?? '' }))
  }).catch(() => {})

  useEffect(() => {
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [])

  const save = async (body, message) => {
    setSaving(true)
    try {
      const { data: res } = await api.put('/admin/rates', body)
      setData(res.data)
      toast.success(message)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save rates')
    } finally {
      setSaving(false)
    }
  }

  if (!data) return <div className="card" style={{ marginBottom: 24 }}><div className="skeleton" style={{ height: 140 }} /></div>

  const { current, charges, mode, live } = data
  const p2p = current.p2p
  const hasManual = manual.buy !== '' && manual.sell !== ''

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>Naira rates</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {mode === 'manual' ? 'Manual rates entered by an admin' : `Live USDT/NGN prices · ${data.sources.map((s) => SOURCE_LABEL[s] || s).join(' → ')}`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['auto', 'manual'].map((m) => (
            <button key={m} className={`chip ${mode === m ? 'chip-active' : ''}`} disabled={saving}
              onClick={() => mode !== m && save({ mode: m }, m === 'auto' ? 'Switched to live P2P rates' : 'Switched to manual rates')}>
              {m === 'auto' ? 'Live P2P' : 'Manual'}
            </button>
          ))}
        </div>
      </div>

      {current.available ? (
        <div className="notice" style={{ marginBottom: 16, borderColor: 'rgba(16,185,129,0.4)' }}>
          <CheckCircle2 size={16} style={{ color: 'var(--green)', flexShrink: 0 }} />
          <span>Orders are open. Source: <strong>{SOURCE_LABEL[p2p.source] || p2p.source}</strong>{p2p.updatedAt ? ` · updated ${formatDate(p2p.updatedAt)}` : ''}</span>
        </div>
      ) : (
        <div className="notice notice-warn" style={{ marginBottom: 16 }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>
            <strong>Orders are paused</strong> — no live P2P price from the last {data.maxAgeMinutes} minutes
            {data.lastError ? ` (${data.lastError})` : ''}. Switch to manual rates below to keep trading.
          </span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
        <Cell label="P2P buy price" value={p2p.buy ? formatNaira(p2p.buy) : '—'} sub="cost of 1 USDT" />
        <Cell label="Customer buy rate" color="var(--green)" value={current.buy ? formatNaira(current.buy) : '—'}
          sub={`P2P + ${formatNaira(charges.buyChargeNgnPerUsd)} · plus $${charges.buyFeeUsd} fee per order`} />
        <Cell label="P2P sell price" value={p2p.sell ? formatNaira(p2p.sell) : '—'} sub="what 1 USDT sells for" />
        <Cell label="Customer sell rate" color="var(--red)" value={current.sell ? formatNaira(current.sell) : '—'}
          sub={`P2P − ${formatNaira(charges.sellChargeNgnPerUsd)}`} />
      </div>

      {mode === 'auto' && live && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
          Last live fetch: {SOURCE_LABEL[live.source] || live.source} · buy {formatNaira(live.buy)} · sell {formatNaira(live.sell)} · {formatDate(live.fetchedAt)}
        </p>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); save({ manualBuy: manual.buy, manualSell: manual.sell, mode: 'manual' }, 'Manual rates saved and in use') }}
        style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}
      >
        <div>
          <label className="label" htmlFor="manual-buy">Manual P2P buy price (₦ per USDT)</label>
          <input id="manual-buy" className="input-field" type="number" step="0.01" min="0" style={{ width: 200 }}
            value={manual.buy} onChange={(e) => setManual({ ...manual, buy: e.target.value })} placeholder="e.g. 1650" />
        </div>
        <div>
          <label className="label" htmlFor="manual-sell">Manual P2P sell price (₦ per USDT)</label>
          <input id="manual-sell" className="input-field" type="number" step="0.01" min="0" style={{ width: 200 }}
            value={manual.sell} onChange={(e) => setManual({ ...manual, sell: e.target.value })} placeholder="e.g. 1630" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving || !hasManual}>
          {saving ? 'Saving…' : 'Save & use manual rates'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={load} title="Refresh"><RefreshCw size={14} /></button>
      </form>
      {data.manual?.updatedAt && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          Manual rates last set {formatDate(data.manual.updatedAt)}{data.manual.updatedBy ? ` by ${data.manual.updatedBy}` : ''}.
          Our charges are added on top automatically.
        </p>
      )}
    </div>
  )
}
