import React, { useEffect, useRef, useState } from 'react'
import { Paperclip, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from './Modal'
import api from '../utils/api'
import { formatCrypto } from '../utils/format'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_BYTES = 5 * 1024 * 1024

// Sell orders: "I have sent the crypto" → transaction hash (+ optional screenshot)
export default function DepositModal({ open, order, onClose, onSubmitted }) {
  const [txHash, setTxHash] = useState('')
  const [note, setNote] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) { setTxHash(order?.depositTxHash || ''); setNote(''); setFile(null); setError('') }
  }, [open, order?.depositTxHash])

  const pick = (f) => {
    if (!f) return
    if (!ACCEPTED.includes(f.type)) return toast.error('Upload a JPG, PNG, WEBP image or a PDF')
    if (f.size > MAX_BYTES) return toast.error('Screenshot must be 5 MB or smaller')
    setFile(f)
  }

  const submit = async (e) => {
    e.preventDefault()
    const hash = txHash.trim()
    if (hash.length < 10 || /\s/.test(hash)) return setError('Paste the transaction hash (TXID) from your wallet or exchange')
    const form = new FormData()
    form.append('txHash', hash)
    if (note.trim()) form.append('note', note.trim())
    if (file) form.append('receipt', file)
    setBusy(true)
    try {
      const { data } = await api.post(`/orders/${order.id}/deposit`, form, { timeout: 60000 })
      toast.success(data.message)
      onSubmitted(data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open={open} onClose={busy ? undefined : onClose} closable={!busy} title="Confirm your deposit">
      <form onSubmit={submit}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 18, lineHeight: 1.6 }}>
          Paste the transaction hash for the <strong style={{ color: 'var(--text-primary)' }}>{formatCrypto(order?.cryptoAmount, order?.symbol)}</strong> you
          sent on {order?.network?.name}. You'll find it in your wallet or exchange's withdrawal history.
        </p>

        <label className="label" htmlFor="deposit-tx">Transaction hash (TXID)</label>
        <input id="deposit-tx" className="input-field" autoFocus autoComplete="off" spellCheck={false}
          placeholder="e.g. 0x3f5c… or 9a1b…" value={txHash}
          onChange={(e) => { setTxHash(e.target.value); setError('') }}
          style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, borderColor: error ? 'var(--red)' : '' }} />
        {error && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{error}</p>}

        <div style={{ marginTop: 16 }}>
          <label className="label">Screenshot (optional)</label>
          {file ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 12px', borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: 13 }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
              <button type="button" onClick={() => setFile(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', lineHeight: 0 }} aria-label="Remove"><X size={16} /></button>
            </div>
          ) : (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => inputRef.current?.click()}>
              <Paperclip size={14} /> Attach withdrawal screenshot
            </button>
          )}
          <input ref={inputRef} type="file" hidden accept={ACCEPTED.join(',')} onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />
        </div>

        <div style={{ marginTop: 16 }}>
          <label className="label" htmlFor="deposit-note">Note (optional)</label>
          <textarea id="deposit-note" className="input-field" rows={2} maxLength={500} placeholder="e.g. Sent from my Binance account"
            value={note} onChange={(e) => setNote(e.target.value)} style={{ resize: 'vertical' }} />
        </div>

        <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 20 }} disabled={busy}>
          {busy ? 'Submitting…' : 'Submit'}
        </button>
      </form>
    </Modal>
  )
}
