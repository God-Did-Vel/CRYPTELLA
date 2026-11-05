import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, width = 480, closable = true }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && closable && onClose?.()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, closable, onClose])

  if (!open) return null

  return (
    <div
      onClick={() => closable && onClose?.()}
      style={{
        position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(2,6,23,0.75)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
    >
      <div
        role="dialog" aria-modal="true" aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="card fade-in"
        style={{ width: '100%', maxWidth: width, maxHeight: 'calc(100vh - 32px)', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>{title}</h2>
          {closable && (
            <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', lineHeight: 0 }}>
              <X size={20} />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}
