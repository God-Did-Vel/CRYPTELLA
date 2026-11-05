import React, { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import Modal from './Modal'
import api from '../utils/api'

// Receipts need the auth header, so they're fetched as a blob, not linked directly
export default function ReceiptViewer({ open, onClose, url, title = 'Payment receipt' }) {
  const [blobUrl, setBlobUrl] = useState(null)
  const [type, setType] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open || !url) return
    let revoked = null
    setBlobUrl(null); setError(null)
    api.get(url, { responseType: 'blob', timeout: 60000 })
      .then(({ data }) => {
        revoked = URL.createObjectURL(data)
        setType(data.type)
        setBlobUrl(revoked)
      })
      .catch(() => setError('Could not load the receipt.'))
    return () => revoked && URL.revokeObjectURL(revoked)
  }, [open, url])

  return (
    <Modal open={open} onClose={onClose} title={title} width={720}>
      {error && <p style={{ color: 'var(--red)' }}>{error}</p>}
      {!error && !blobUrl && <div className="skeleton" style={{ height: 360 }} />}
      {blobUrl && (type === 'application/pdf'
        ? <iframe src={blobUrl} title="Receipt" style={{ width: '100%', height: '70vh', border: 'none', borderRadius: 8, background: '#fff' }} />
        : <img src={blobUrl} alt="Payment receipt" style={{ maxHeight: '70vh', margin: '0 auto', borderRadius: 8, objectFit: 'contain' }} />)}
      {blobUrl && (
        <a href={blobUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>
          <ExternalLink size={13} /> Open in new tab
        </a>
      )}
    </Modal>
  )
}
