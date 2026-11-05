import React, { useState, useRef, useEffect } from 'react'
import { Upload, FileText, X, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from './Modal'
import api from '../utils/api'
import { formatNaira } from '../utils/format'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_BYTES = 5 * 1024 * 1024

export default function ReceiptUploadModal({ open, order, onClose, onUploaded }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [note, setNote] = useState('')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!open) { setFile(null); setNote(''); setProgress(0) }
  }, [open])

  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const pick = (f) => {
    if (!f) return
    if (!ACCEPTED.includes(f.type)) return toast.error('Upload a JPG, PNG, WEBP image or a PDF')
    if (f.size > MAX_BYTES) return toast.error('Receipt must be 5 MB or smaller')
    setFile(f)
  }

  const submit = async () => {
    if (!file) return toast.error('Attach your payment receipt')
    const form = new FormData()
    form.append('receipt', file)
    if (note.trim()) form.append('note', note.trim())
    setUploading(true)
    try {
      const { data } = await api.post(`/orders/${order.id}/receipt`, form, {
        timeout: 60000,
        onUploadProgress: (e) => e.total && setProgress(Math.round((e.loaded / e.total) * 100)),
      })
      toast.success(data.message)
      onUploaded(data.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Modal open={open} onClose={uploading ? undefined : onClose} closable={!uploading} title="Upload payment receipt">
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 18, lineHeight: 1.6 }}>
        Upload the receipt or screenshot of your <strong style={{ color: 'var(--text-primary)' }}>{formatNaira(order?.amountNgn)}</strong> transfer
        for order <strong style={{ color: 'var(--text-primary)' }}>{order?.reference}</strong>. Make sure the amount, date and
        recipient account are visible.
      </p>

      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]) }}
          role="button" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 12,
            background: dragging ? 'var(--accent-light)' : 'var(--bg-secondary)',
            padding: '36px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <Upload size={28} style={{ color: 'var(--accent)', marginBottom: 10 }} />
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Click to upload or drag and drop</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>JPG, PNG, WEBP or PDF · max 5 MB</div>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 12, background: 'var(--bg-secondary)' }}>
          {preview
            ? <img src={preview} alt="Receipt preview" style={{ maxHeight: 260, margin: '0 auto 12px', borderRadius: 8, objectFit: 'contain' }} />
            : <FileText size={40} style={{ color: 'var(--accent)', margin: '8px auto 12px' }} />}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, fontSize: 13 }}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {file.name} · {(file.size / 1024).toFixed(0)} KB
            </span>
            {!uploading && (
              <button onClick={() => setFile(null)} className="btn btn-secondary btn-sm"><X size={13} /> Change</button>
            )}
          </div>
        </div>
      )}
      <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = '' }} />

      <div style={{ marginTop: 16 }}>
        <label className="label" htmlFor="receipt-note">Note (optional)</label>
        <textarea
          id="receipt-note" className="input-field" rows={2} maxLength={500}
          placeholder="e.g. Sent from my GTBank account — Chinedu Okafor"
          value={note} onChange={(e) => setNote(e.target.value)} style={{ resize: 'vertical' }}
        />
      </div>

      {uploading && (
        <div style={{ height: 6, background: 'var(--bg-secondary)', borderRadius: 3, marginTop: 16, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent)', transition: 'width 0.2s' }} />
        </div>
      )}

      <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 20 }} disabled={!file || uploading} onClick={submit}>
        {uploading ? `Uploading… ${progress}%` : 'Submit receipt'}
      </button>
      <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
        <ShieldCheck size={13} /> Your receipt is only visible to you and the Cryptella team.
      </p>
    </Modal>
  )
}
