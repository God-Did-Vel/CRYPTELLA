import React, { useState } from 'react'

// Unique gradient per symbol so every coin has a distinctive colour
const SYMBOL_COLORS = {
  BTC:  ['#F7931A', '#FFB347'],
  ETH:  ['#627EEA', '#8FA5F5'],
  USDT: ['#26A17B', '#50C8A0'],
  BNB:  ['#F3BA2F', '#F9D371'],
  SOL:  ['#9945FF', '#14F195'],
  XRP:  ['#346AA9', '#5B9BD5'],
  USDC: ['#2775CA', '#5BA0E8'],
  ADA:  ['#0033AD', '#0052CC'],
  TRX:  ['#EF0027', '#FF4D6D'],
  LINK: ['#2A5ADA', '#4F85FF'],
  XLM:  ['#000000', '#666666'],
  UNI:  ['#FF007A', '#FF66B5'],
  AAVE: ['#B6509E', '#D97FCA'],
  LTC:  ['#A6A9AA', '#D3D3D3'],
  BCH:  ['#4CC947', '#7DE87A'],
  AVAX: ['#E84142', '#FF6B6B'],
  NEAR: ['#000000', '#666666'],
  SUI:  ['#4CA3FF', '#82CAFF'],
  HYPE: ['#00BCD4', '#4DD0E1'],
  HBAR: ['#222222', '#666666'],
  DOT:  ['#E6007A', '#FF4DAA'],
  DOGE: ['#C2A633', '#E5C84C'],
  MATIC:['#8247E5', '#A875FF'],
  ATOM: ['#2E3148', '#6F7390'],
  SAND: ['#04ADEF', '#63D7FF'],
  MANA: ['#FF2D55', '#FF6B80'],
  SHIB: ['#FFA409', '#FFC649'],
}

const getBg = (symbol) => {
  const cols = SYMBOL_COLORS[symbol?.toUpperCase()]
  if (cols) return `linear-gradient(135deg, ${cols[0]}, ${cols[1]})`
  // deterministic fallback from symbol string
  const hash = (symbol || 'X').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const hue = hash * 47 % 360
  return `linear-gradient(135deg, hsl(${hue},70%,40%), hsl(${(hue + 40) % 360},80%,60%))`
}

/**
 * CoinIcon — shows the coin's image if it loads, otherwise a letter avatar.
 * Never throws a network error the user can see. The `src` prop can be null/undefined.
 *
 * Props: symbol, name, image (URL), size (px number, default 36)
 */
export default function CoinIcon({ symbol, name, image, size = 36 }) {
  const [imgFailed, setImgFailed] = useState(false)

  const letter = (symbol || name || '?')[0].toUpperCase()
  const bg     = getBg(symbol)

  const base = {
    width:        size,
    height:       size,
    minWidth:     size,
    borderRadius: '50%',
    flexShrink:   0,
    display:      'flex',
    alignItems:   'center',
    justifyContent: 'center',
  }

  if (image && !imgFailed) {
    return (
      <img
        src={image}
        alt={symbol}
        width={size}
        height={size}
        style={{ ...base, objectFit: 'cover' }}
        onError={() => setImgFailed(true)}
        loading="lazy"
      />
    )
  }

  return (
    <div style={{
      ...base,
      background:  bg,
      color:       '#fff',
      fontWeight:  800,
      fontSize:    Math.round(size * 0.38),
      letterSpacing: '-0.5px',
      userSelect: 'none',
    }}>
      {letter}
    </div>
  )
}
