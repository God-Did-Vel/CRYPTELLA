import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CopyButton({ value, label = 'Copied', size = 14 }) {
  const [copied, setCopied] = useState(false)

  const copy = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(String(value))
      setCopied(true)
      toast.success(label)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Could not copy — please copy it manually')
    }
  }

  return (
    <button type="button" onClick={copy} aria-label="Copy" title="Copy" style={{
      background: 'none', border: 'none', padding: 4, borderRadius: 6, lineHeight: 0,
      color: copied ? 'var(--green)' : 'var(--text-muted)', cursor: 'pointer',
    }}>
      {copied ? <Check size={size} /> : <Copy size={size} />}
    </button>
  )
}
