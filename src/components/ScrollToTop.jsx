import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show when page is scrolled down > 260px
      if (window.scrollY > 260) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!visible) return null

  return (
    <button
      id="scroll-to-top-btn"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll back to top"
      style={{
        position: 'fixed',
        bottom: '26px',
        right: '26px',
        zIndex: 999,
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(16, 26, 56, 0.92) 0%, rgba(8, 14, 32, 0.98) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.45)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.65), 0 0 20px rgba(245, 158, 11, 0.35)',
        color: '#F59E0B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)'
        e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.8), 0 0 28px rgba(245, 158, 11, 0.6)'
        e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.85)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.65), 0 0 20px rgba(245, 158, 11, 0.35)'
        e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.45)'
      }}
    >
      <ArrowUp size={20} strokeWidth={2.5} />
    </button>
  )
}
