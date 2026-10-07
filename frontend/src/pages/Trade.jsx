import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import {
  TrendingUp, TrendingDown, ArrowLeft, ArrowRight,
  Info, AlertTriangle, ArrowDownUp, Clock, ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRates } from '../hooks/useRates'
import api from '../utils/api'
import {
  formatPrice, formatChange, formatLargeNumber,
  formatNaira, formatUsd, formatCrypto,
} from '../utils/format'
import CoinIcon from '../components/CoinIcon'
import toast from 'react-hot-toast'
import SellPanel from '../components/SellPanel'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

const generateSparkline = (basePrice, points = 24) => {
  const data = []
  let price = basePrice * 0.95
  for (let i = 0; i < points; i++) {
    price = price * (1 + (Math.random() - 0.48) * 0.03)
    data.push({ hour: `${i}h`, price: parseFloat(price.toFixed(8)) })
  }
  data[data.length - 1].price = basePrice
  return data
}

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '8px 14px', fontSize: 13,
    }}>
      <div style={{ fontWeight: 700 }}>{formatPrice(payload[0].value)}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{payload[0].payload.hour} ago</div>
    </div>
  )
}

const SummaryRow = ({ label, value, strong }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', gap: 12,
    fontSize: strong ? 15 : 13,
    fontWeight: strong ? 800 : 400,
    color: strong ? 'var(--text-primary)' : 'var(--text-secondary)',
    marginBottom: strong ? 0 : 6,
  }}>
    <span>{label}</span>
    <span style={{ textAlign: 'right' }}>{value}</span>
  </div>
)

const QUICK_AMOUNTS = [10000, 50000, 100000, 500000]

// ── Component ─────────────────────────────────────────────────────────────────

export default function Trade() {
  const { coinId } = useParams()
  const { isLoggedIn, user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const { rates } = useRates()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const side = searchParams.get('side') === 'sell' ? 'sell' : 'buy'
  const setSide = (s) => setSearchParams(s === 'sell' ? { side: 'sell' } : {}, { replace: true })

  const [coin, setCoin]           = useState(null)
  const [coinLoading, setCoinLoading] = useState(true)
  const [chartData, setChartData] = useState([])

  const [mode, setMode]               = useState('ngn') // 'ngn' | 'coin'
  const [amount, setAmount]           = useState('')
  const [networkId, setNetworkId]     = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [memo, setMemo]               = useState('')
  const [confirmed, setConfirmed]     = useState(false)
  const [errors, setErrors]           = useState({})
  const [submitting, setSubmitting]   = useState(false)

  // Fetch coin on mount
  useEffect(() => {
    setCoinLoading(true)
    api.get(`/coins/${coinId}`)
      .then(({ data }) => {
        setCoin(data.data)
        setChartData(generateSparkline(data.data.price))
        setNetworkId(data.data.networks?.[0]?.id || '')
      })
      .catch(() => setCoin(null))
      .finally(() => setCoinLoading(false))
  }, [coinId])

  // Keep price fresh every 30 s
  useEffect(() => {
    const id = setInterval(() => {
      api.get(`/coins/${coinId}`)
        .then(({ data }) => setCoin(c => c ? { ...c, ...data.data } : c))
        .catch(() => {})
    }, 30000)
    return () => clearInterval(id)
  }, [coinId])

  const rate    = rates?.ngnPerUsd ?? null
  const network = coin?.networks?.find(n => n.id === networkId)

  const feeUsd = rates?.buyFeeUsd ?? 0

  // Derive NGN / USD / crypto amounts from whatever the user typed.
  // The flat fee comes off the dollar value: crypto = (naira ÷ rate − fee) ÷ price
  const quote = useMemo(() => {
    const value = parseFloat(amount)
    if (!coin || !rate || !value || value <= 0) return null
    let amountNgn, amountUsd
    if (mode === 'ngn') {
      amountNgn = value
      amountUsd = amountNgn / rate - feeUsd
    } else {
      amountUsd = value * coin.price
      amountNgn = (amountUsd + feeUsd) * rate
    }
    const cryptoAmount = Math.max(amountUsd, 0) / coin.price
    return { amountNgn, amountUsd, cryptoAmount, feeNgn: feeUsd * rate, tooSmall: amountUsd <= 0 }
  }, [amount, mode, coin, rate, feeUsd])

  const limitError = quote && rates
    ? quote.amountNgn > rates.maxOrderNgn
      ? `Maximum per order is ${formatNaira(rates.maxOrderNgn)} (≈ ${formatUsd(rates.maxOrderUsd)})`
      : quote.amountNgn < rates.minOrderNgn
        ? `Minimum order is ${formatNaira(rates.minOrderNgn)}`
        : quote.tooSmall
          ? `Amount is too small to cover the $${feeUsd} fee`
          : null
    : null

  const switchMode = () => {
    if (quote) {
      setAmount(
        mode === 'ngn'
          ? String(parseFloat(quote.cryptoAmount.toFixed(8)))
          : String(Math.round(quote.amountNgn))
      )
    }
    setMode(m => m === 'ngn' ? 'coin' : 'ngn')
  }

  const setMax = () => {
    if (!rates || !coin) return
    setAmount(
      mode === 'ngn'
        ? String(rates.maxOrderNgn)
        : String(parseFloat((Math.max(rates.maxOrderUsd - feeUsd, 0) / coin.price).toFixed(8)))
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) return navigate('/login', { state: { from: location } })

    const errs = {}
    if (!quote)       errs.amount = 'Enter an amount'
    else if (limitError) errs.amount = limitError
    if (!networkId)   errs.network = 'Choose a network'
    if (!walletAddress.trim()) errs.wallet = `Enter your ${coin.symbol} wallet address`
    else if (/\s/.test(walletAddress.trim())) errs.wallet = 'Wallet addresses cannot contain spaces'
    if (!confirmed)   errs.confirmed = 'Please confirm your wallet address and network'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSubmitting(true)
    try {
      const { data } = await api.post('/orders', {
        coinId,
        amountNgn:     Math.round(quote.amountNgn * 100) / 100,
        networkId,
        walletAddress: walletAddress.trim(),
        memo:          memo.trim() || undefined,
      })
      toast.success('Order created — complete your payment')
      navigate(`/orders/${data.data.id}`)
    } catch (err) {
      const message = err.response?.data?.message || 'Could not create the order'
      if (/address|memo|tag|network/i.test(message)) setErrors({ wallet: message })
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const positive = (coin?.change24h ?? 0) >= 0

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (coinLoading) {
    return (
      <div style={{ paddingTop: 100 }}>
        <div className="container" style={{ padding: '40px 24px' }}>
          <div className="skeleton" style={{ height: 48, width: 280, marginBottom: 24, borderRadius: 10 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
            <div className="card"><div className="skeleton" style={{ height: 280, borderRadius: 8 }} /></div>
            <div className="card"><div className="skeleton" style={{ height: 280, borderRadius: 8 }} /></div>
          </div>
        </div>
      </div>
    )
  }

  // ── Coin not found ──────────────────────────────────────────────────────────
  if (!coin) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center', padding: '120px 24px 60px' }}>
        <h2 style={{ marginBottom: 8 }}>Coin not available</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
          This coin can't be bought on Cryptella right now.
        </p>
        <Link to="/markets" className="btn btn-primary">Back to Markets</Link>
      </div>
    )
  }

  // ── Main layout ─────────────────────────────────────────────────────────────
  return (
    <div style={{ paddingTop: 68 }}>

      {/* Breadcrumb / coin header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
        <div className="container">
          <Link to="/markets" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--text-muted)', fontSize: 13, marginBottom: 12,
          }}>
            <ArrowLeft size={14} /> Back to Markets
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <CoinIcon symbol={coin.symbol} name={coin.name} image={coin.image} size={52} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 900 }}>
                  {isAdmin ? coin.name : `${side === 'sell' && coin.sellable ? 'Sell' : 'Buy'} ${coin.name}`}
                </h1>
                <span style={{
                  fontSize: 13, color: 'var(--text-muted)', fontWeight: 600,
                  background: 'var(--bg-card)', padding: '3px 10px', borderRadius: 20,
                }}>{coin.symbol}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800 }}>
                  {formatPrice(coin.price)}
                </span>
                {!isAdmin && rate && (
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    Buy ≈ {formatNaira(coin.price * rate)}
                    {coin.sellable && rates?.sell?.ngnPerUsd ? <> · Sell ≈ {formatNaira(coin.price * rates.sell.ngnPerUsd)}</> : null}
                  </span>
                )}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  background: positive ? 'var(--green-light)' : 'var(--red-light)',
                  color: positive ? 'var(--green)' : 'var(--red)',
                }}>
                  {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {formatChange(coin.change24h)} (24h)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container" style={{ padding: '28px 24px 60px' }}>
        <div className="trade-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: 24,
          alignItems: 'start',
        }}>

          {/* ── Left: chart + info ──────────────────────────── */}
          <div style={{ minWidth: 0 }}>

            {/* Sparkline chart */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700 }}>{coin.symbol} / USD — 24h</h2>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Info size={12} /> Simulated chart
                </span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="hour"
                    tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                    axisLine={false} tickLine={false} interval={3}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={v => formatPrice(v)}
                    width={76}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone" dataKey="price"
                    stroke={positive ? 'var(--green)' : 'var(--red)'}
                    strokeWidth={2.5} dot={false}
                    activeDot={{ r: 4, stroke: 'var(--bg-card)', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 14, marginBottom: 20,
            }}>
              {[
                { label: 'Market Cap', value: formatLargeNumber(coin.marketCap) },
                { label: '24h Volume', value: formatLargeNumber(coin.volume24h) },
                { label: '24h Change', value: formatChange(coin.change24h), color: positive ? 'var(--green)' : 'var(--red)' },
                side === 'sell' && coin.sellable
                  ? { label: 'Sell rate', value: rates?.sell?.ngnPerUsd ? `${formatNaira(rates.sell.ngnPerUsd)} / $1` : '—' }
                  : { label: 'Buy rate', value: rate ? `${formatNaira(rate)} / $1` : '—' },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: '14px 18px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>{s.label}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: s.color || 'var(--text-primary)' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* How it works */}
            <div className="card">
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>How {side === 'sell' && coin.sellable ? 'selling' : 'buying'} works</h3>
              {side === 'sell' && coin.sellable ? (
                <ol style={{ paddingLeft: 18, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.9 }}>
                  <li>Enter how much {coin.symbol} to sell, pick the network and add the bank account to pay you into.</li>
                  <li>We give you our {coin.symbol} deposit address. The rate is locked for {rates?.sell?.depositWindowMinutes ?? 60} minutes.</li>
                  <li>Send the exact amount, tap <strong>I have sent the crypto</strong> and paste the transaction hash.</li>
                  <li>Once the deposit is confirmed, we pay the naira into your bank account.</li>
                </ol>
              ) : (
                <ol style={{ paddingLeft: 18, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.9 }}>
                  <li>Enter the amount in naira, choose your network and paste your {coin.symbol} wallet address.</li>
                  <li>We show you a naira bank account to transfer to. The rate is locked for {rates?.paymentWindowMinutes ?? 30} minutes.</li>
                  <li>After transferring, tap <strong style={{ color: 'var(--text-primary)' }}>I have made payment</strong> and upload your receipt.</li>
                  <li>Once we confirm your payment we send {coin.symbol} straight to your wallet.</li>
                </ol>
              )}
            </div>
          </div>

          {/* ── Right: buy panel ────────────────────────────── */}
          <div className="trade-panel" style={{ position: 'sticky', top: 84 }}>
            {coin.sellable && (
              <div className="side-tabs" role="tablist">
                {['buy', 'sell'].map((s) => (
                  <button key={s} type="button" role="tab" aria-selected={side === s} onClick={() => setSide(s)}
                    className={`side-tab ${side === s ? `side-tab-${s}` : ''}`}>
                    {s === 'buy' ? 'Buy' : 'Sell'}
                  </button>
                ))}
              </div>
            )}
            {side === 'buy' ? (
            <form onSubmit={handleSubmit} className="card" style={{ boxShadow: 'var(--shadow-lg)' }} noValidate>
              <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20 }}>
                Buy {coin.symbol} with Naira
              </h2>

              {/* Amount */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="label" htmlFor="amount" style={{ marginBottom: 0 }}>
                  {mode === 'ngn' ? 'You pay (₦)' : `You receive (${coin.symbol})`}
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" onClick={setMax}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    MAX
                  </button>
                  <button type="button" onClick={switchMode}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ArrowDownUp size={12} /> {mode === 'ngn' ? coin.symbol : 'NGN'}
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                {mode === 'ngn' && (
                  <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700, pointerEvents: 'none' }}>₦</span>
                )}
                <input
                  id="amount"
                  className="input-field"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  placeholder={mode === 'ngn' ? '50000' : '0.00'}
                  value={amount}
                  onChange={e => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: '' })) }}
                  style={{
                    paddingLeft: mode === 'ngn' ? 32 : 16,
                    fontSize: 18, fontWeight: 700,
                    borderColor: errors.amount || limitError ? 'var(--red)' : '',
                  }}
                />
              </div>
              {(errors.amount || limitError) && (
                <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.amount || limitError}</p>
              )}

              {/* Quick naira presets */}
              {mode === 'ngn' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {QUICK_AMOUNTS.map(n => (
                    <button key={n} type="button" className="chip"
                      onClick={() => { setAmount(String(n)); setErrors(p => ({ ...p, amount: '' })) }}>
                      ₦{n >= 1000 ? `${n / 1000}k` : n}
                    </button>
                  ))}
                </div>
              )}

              {rates && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
                  Limit: {formatNaira(rates.minOrderNgn)} – {formatNaira(rates.maxOrderNgn)} (≈ {formatUsd(rates.maxOrderUsd)})
                </p>
              )}

              {/* Network selector */}
              <div style={{ marginTop: 20 }}>
                <label className="label">Network</label>
                {coin.networks && coin.networks.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {coin.networks.map(n => (
                      <button
                        key={n.id} type="button"
                        onClick={() => { setNetworkId(n.id); setMemo(''); setErrors(p => ({ ...p, network: '', wallet: '' })) }}
                        className={`chip ${networkId === n.id ? 'chip-active' : ''}`}
                        aria-pressed={networkId === n.id}
                      >
                        {n.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No networks available</p>
                )}
                {errors.network && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.network}</p>}
              </div>

              {/* Wallet address */}
              <div style={{ marginTop: 18 }}>
                <label className="label" htmlFor="wallet">
                  Your {coin.symbol} wallet address
                </label>
                <input
                  id="wallet"
                  className="input-field"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={`Paste your ${network?.name || coin.symbol} address`}
                  value={walletAddress}
                  onChange={e => { setWalletAddress(e.target.value); setErrors(p => ({ ...p, wallet: '' })) }}
                  style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: 13,
                    borderColor: errors.wallet ? 'var(--red)' : '',
                  }}
                />
                {errors.wallet && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.wallet}</p>}
              </div>

              {/* Optional memo */}
              {network?.memo && (
                <div style={{ marginTop: 16 }}>
                  <label className="label" htmlFor="memo">
                    {network.memo}{' '}
                    <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(if required)</span>
                  </label>
                  <input
                    id="memo"
                    className="input-field"
                    type="text"
                    autoComplete="off"
                    value={memo}
                    onChange={e => setMemo(e.target.value)}
                  />
                </div>
              )}

              {/* Order summary */}
              <div style={{
                background: 'var(--bg-secondary)', borderRadius: 10,
                padding: '14px 16px', margin: '20px 0 16px',
              }}>
                <SummaryRow label="Rate"         value={rate ? `1 ${coin.symbol} ≈ ${formatNaira(coin.price * rate)}` : '—'} />
                <SummaryRow label="Dollar value" value={quote ? formatUsd(Math.max(quote.amountUsd, 0)) : '—'} />
                {feeUsd > 0 && (
                  <SummaryRow label="Fee" value={`${formatUsd(feeUsd)}${rate ? ` (${formatNaira(feeUsd * rate)})` : ''}`} />
                )}
                <SummaryRow label="Network"      value={network?.name || '—'} />
                <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
                <SummaryRow strong label="You pay"     value={quote ? formatNaira(quote.amountNgn) : '—'} />
                <div style={{ height: 6 }} />
                <SummaryRow strong label="You receive" value={quote ? `≈ ${formatCrypto(quote.cryptoAmount, coin.symbol)}` : '—'} />
              </div>

              {/* Confirmation checkbox */}
              <label style={{
                display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer',
                fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55,
              }}>
                <input
                  type="checkbox" checked={confirmed}
                  onChange={e => { setConfirmed(e.target.checked); setErrors(p => ({ ...p, confirmed: '' })) }}
                  style={{ marginTop: 3, accentColor: 'var(--accent)' }}
                />
                <span>
                  I confirm this is my {coin.symbol} address on{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {network?.name || 'the selected network'}
                  </strong>.
                  Crypto sent to a wrong address cannot be recovered.
                </span>
              </label>
              {errors.confirmed && (
                <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.confirmed}</p>
              )}

              {/* CTA */}
              {isLoggedIn ? (
                <button
                  type="submit"
                  className="btn btn-green btn-full btn-lg"
                  style={{ marginTop: 18 }}
                  disabled={submitting || !rate}
                >
                  {submitting
                    ? 'Creating order…'
                    : <><span>Continue to payment</span> <ArrowRight size={17} /></>
                  }
                </button>
              ) : (
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="btn btn-primary btn-full btn-lg"
                  style={{ marginTop: 18 }}
                >
                  Sign in to buy
                </Link>
              )}

              {/* Unavailable rate warning */}
              {!rate && rates !== null && (
                <p style={{ display: 'flex', gap: 6, alignItems: 'center', color: 'var(--yellow)', fontSize: 12, marginTop: 10 }}>
                  <AlertTriangle size={13} /> The naira rate is temporarily unavailable.
                </p>
              )}

              {/* Trust badges */}
              <div style={{
                display: 'flex', justifyContent: 'center', gap: 20, marginTop: 14,
                fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={12} /> Rate locked {rates?.paymentWindowMinutes ?? 30} min
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ShieldCheck size={12} /> All fees included
                </span>
              </div>
            </form>
            ) : (
              <SellPanel coin={coin} rates={rates} isLoggedIn={isLoggedIn} />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .trade-grid   { grid-template-columns: 1fr !important; }
          .trade-panel  { position: static !important; }
        }
      `}</style>
    </div>
  )
}
