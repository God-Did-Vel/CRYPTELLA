import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import {
  TrendingUp, TrendingDown, ArrowLeft, ArrowRight, Info, AlertTriangle, ArrowDownUp, Clock, ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRates } from '../hooks/useRates'
import api from '../utils/api'
import { formatPrice, formatChange, formatLargeNumber, formatNaira, formatUsd, formatCrypto } from '../utils/format'
import toast from 'react-hot-toast'
import SellPanel from '../components/SellPanel'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// Generates mock sparkline data around a base price
const generateSparkline = (basePrice, points = 24) => {
  const data = []
  let price = basePrice * 0.95
  for (let i = 0; i < points; i++) {
    price = price * (1 + (Math.random() - 0.48) * 0.03)
    data.push({ hour: `${i}h`, price: parseFloat(price.toFixed(6)) })
  }
  // End near actual price
  data[data.length - 1].price = basePrice
  return data
}

const ChartTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 13 }}>
        <div style={{ fontWeight: 700 }}>{formatPrice(payload[0].value)}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{payload[0].payload.hour} ago</div>
      </div>
    )
  }
  return null
}

const QUICK_AMOUNTS = [10000, 50000, 100000, 500000]

const SummaryRow = ({ label, value, strong }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: strong ? 15 : 13, fontWeight: strong ? 800 : 400,
    color: strong ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: strong ? 0 : 6 }}>
    <span>{label}</span>
    <span style={{ textAlign: 'right' }}>{value}</span>
  </div>
)

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

  const [coin, setCoin] = useState(null)
  const [coinLoading, setCoinLoading] = useState(true)
  const [chartData, setChartData] = useState([])

  const [mode, setMode] = useState('ngn') // amount entered in 'ngn' or 'coin'
  const [amount, setAmount] = useState('')
  const [networkId, setNetworkId] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [memo, setMemo] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

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

  // Keep the displayed price live
  useEffect(() => {
    const id = setInterval(() => {
      api.get(`/coins/${coinId}`).then(({ data }) => setCoin((c) => (c ? { ...c, ...data.data } : c))).catch(() => {})
    }, 30000)
    return () => clearInterval(id)
  }, [coinId])

  const rate = rates?.ngnPerUsd
  const network = coin?.networks?.find((n) => n.id === networkId)

  // Everything is priced in naira; the coin amount is derived
  const quote = useMemo(() => {
    const value = parseFloat(amount)
    if (!coin || !rate || !value || value <= 0) return null
    const amountNgn = mode === 'ngn' ? value : value * coin.price * rate
    return { amountNgn, amountUsd: amountNgn / rate, cryptoAmount: amountNgn / rate / coin.price }
  }, [amount, mode, coin, rate])

  const limitError = quote && rates
    ? quote.amountNgn > rates.maxOrderNgn
      ? `Maximum per order is ${formatNaira(rates.maxOrderNgn)} (≈ ${formatUsd(rates.maxOrderUsd)})`
      : quote.amountNgn < rates.minOrderNgn
        ? `Minimum order is ${formatNaira(rates.minOrderNgn)}`
        : null
    : null

  const switchMode = () => {
    if (quote) setAmount(mode === 'ngn' ? String(parseFloat(quote.cryptoAmount.toFixed(8))) : String(Math.round(quote.amountNgn)))
    setMode(mode === 'ngn' ? 'coin' : 'ngn')
  }

  const setMax = () => {
    if (!rates || !coin) return
    setAmount(mode === 'ngn' ? String(rates.maxOrderNgn) : String(parseFloat((rates.maxOrderUsd / coin.price).toFixed(8))))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) return navigate('/login', { state: { from: location } })

    const errs = {}
    if (!quote) errs.amount = 'Enter an amount'
    else if (limitError) errs.amount = limitError
    if (!networkId) errs.network = 'Choose a network'
    if (!walletAddress.trim()) errs.wallet = `Enter your ${coin.symbol} wallet address`
    else if (/\s/.test(walletAddress.trim())) errs.wallet = 'Wallet addresses do not contain spaces'
    if (!confirmed) errs.confirmed = 'Please confirm your wallet address and network'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSubmitting(true)
    try {
      const { data } = await api.post('/orders', {
        coinId,
        amountNgn: Math.round(quote.amountNgn * 100) / 100,
        networkId,
        walletAddress: walletAddress.trim(),
        memo: memo.trim() || undefined,
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

  if (coinLoading) {
    return (
      <div style={{ paddingTop: 100 }}>
        <div className="container" style={{ padding: '40px 24px' }}>
          <div className="skeleton" style={{ height: 48, width: 280, marginBottom: 24, borderRadius: 10 }} />
          <div className="trade-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
            <div className="card"><div className="skeleton" style={{ height: 300, borderRadius: 8 }} /></div>
            <div className="card"><div className="skeleton" style={{ height: 300, borderRadius: 8 }} /></div>
          </div>
        </div>
      </div>
    )
  }

  if (!coin) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center' }}>
        <h2>Coin not available</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>This coin can't be bought on Cryptella.</p>
        <Link to="/markets" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Back to Markets</Link>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: 68 }}>
      {/* Breadcrumb header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
        <div className="container">
          <Link to="/markets" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
            <ArrowLeft size={14} /> Back to Markets
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {coin.image
              ? <img src={coin.image} alt={coin.symbol} style={{ width: 52, height: 52, borderRadius: '50%' }} />
              : <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>{coin.symbol[0]}</div>
            }
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h1 style={{ fontSize: 26, fontWeight: 900 }}>{isAdmin ? coin.name : `${side === 'sell' && coin.sellable ? 'Sell' : 'Buy'} ${coin.name}`}</h1>
                <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600, background: 'var(--bg-card)', padding: '4px 10px', borderRadius: 20 }}>{coin.symbol}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 24, fontWeight: 800 }}>{formatPrice(coin.price)}</span>
                {!isAdmin && rate && (
                  <span style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
                    Buy ≈ {formatNaira(coin.price * rate)}
                    {coin.sellable && rates?.sell?.ngnPerUsd ? <> · Sell ≈ {formatNaira(coin.price * rates.sell.ngnPerUsd)}</> : null}
                  </span>
                )}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 12px', borderRadius: 20, fontSize: 14, fontWeight: 600,
                  background: positive ? 'var(--green-light)' : 'var(--red-light)',
                  color: positive ? 'var(--green)' : 'var(--red)',
                }}>
                  {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {formatChange(coin.change24h)} (24h)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        <div className="trade-grid" style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr' : '1fr 400px', gap: 24, alignItems: 'start' }}>

          {/* Left: chart + stats */}
          <div style={{ minWidth: 0 }}>
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>{coin.symbol} / USD — 24h Chart</h2>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Info size={12} /> Simulated chart
                </span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="hour" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} interval={3} />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={v => formatPrice(v)}
                    width={80}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone" dataKey="price"
                    stroke={positive ? 'var(--green)' : 'var(--red)'}
                    strokeWidth={2.5} dot={false}
                    activeDot={{ r: 5, fill: positive ? 'var(--green)' : 'var(--red)', stroke: 'var(--bg-card)', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Market Cap', value: formatLargeNumber(coin.marketCap) },
                { label: '24h Volume', value: formatLargeNumber(coin.volume24h) },
                { label: '24h Change', value: formatChange(coin.change24h), color: positive ? 'var(--green)' : 'var(--red)' },
                side === 'sell' && coin.sellable
                  ? { label: 'Sell rate', value: rates?.sell?.ngnPerUsd ? `${formatNaira(rates.sell.ngnPerUsd)} / $1` : '—' }
                  : { label: 'Buy rate', value: rate ? `${formatNaira(rate)} / $1` : '—' },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: '16px 20px' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color || 'var(--text-primary)' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {!isAdmin && (
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
                <li>Enter the amount, choose a network and paste your {coin.symbol} wallet address.</li>
                <li>We give you a naira account to transfer to. The rate is locked for {rates?.paymentWindowMinutes ?? 30} minutes.</li>
                <li>After transferring, tap <strong>I have made payment</strong> and upload your receipt.</li>
                <li>Once we confirm your payment, we send {coin.symbol} to your wallet.</li>
              </ol>
              )}
            </div>
            )}
          </div>

          {/* Right: buy panel */}
          {!isAdmin && (
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
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Buy {coin.symbol} with Naira</h2>

              {/* Amount */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="label" htmlFor="amount" style={{ marginBottom: 0 }}>
                  {mode === 'ngn' ? 'You pay (NGN)' : `You receive (${coin.symbol})`}
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" onClick={setMax} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, fontWeight: 700 }}>MAX</button>
                  <button type="button" onClick={switchMode} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ArrowDownUp size={12} /> {mode === 'ngn' ? coin.symbol : 'NGN'}
                  </button>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {mode === 'ngn' ? '₦' : ''}
                </span>
                <input
                  id="amount" className="input-field" type="number" inputMode="decimal" min="0" step="any"
                  placeholder={mode === 'ngn' ? '50,000' : '0.00'}
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setErrors({ ...errors, amount: '' }) }}
                  style={{ paddingLeft: mode === 'ngn' ? 32 : 16, fontSize: 18, fontWeight: 700, borderColor: errors.amount || limitError ? 'var(--red)' : '' }}
                />
              </div>
              {(errors.amount || limitError) && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.amount || limitError}</p>}

              {mode === 'ngn' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  {QUICK_AMOUNTS.map((n) => (
                    <button key={n} type="button" className="chip" onClick={() => { setAmount(String(n)); setErrors({ ...errors, amount: '' }) }}>
                      ₦{n >= 1000 ? `${n / 1000}k` : n}
                    </button>
                  ))}
                </div>
              )}
              {rates && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
                  Limit per order: {formatNaira(rates.minOrderNgn)} – {formatNaira(rates.maxOrderNgn)} (≈ {formatUsd(rates.maxOrderUsd)})
                </p>
              )}

              {/* Network */}
              <div style={{ marginTop: 20 }}>
                <label className="label">Network</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {coin.networks.map((n) => (
                    <button key={n.id} type="button" onClick={() => { setNetworkId(n.id); setMemo(''); setErrors({ ...errors, network: '', wallet: '' }) }}
                      className={`chip ${networkId === n.id ? 'chip-active' : ''}`} aria-pressed={networkId === n.id}>
                      {n.name}
                    </button>
                  ))}
                </div>
                {errors.network && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.network}</p>}
              </div>

              {/* Wallet address */}
              <div style={{ marginTop: 16 }}>
                <label className="label" htmlFor="wallet">Your {coin.symbol} wallet address</label>
                <input
                  id="wallet" className="input-field" type="text" autoComplete="off" spellCheck={false}
                  placeholder={`Paste your ${network?.name || coin.symbol} address`}
                  value={walletAddress}
                  onChange={(e) => { setWalletAddress(e.target.value); setErrors({ ...errors, wallet: '' }) }}
                  style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, borderColor: errors.wallet ? 'var(--red)' : '' }}
                />
                {errors.wallet && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.wallet}</p>}
              </div>

              {network?.memo && (
                <div style={{ marginTop: 16 }}>
                  <label className="label" htmlFor="memo">{network.memo} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(if your wallet or exchange requires one)</span></label>
                  <input id="memo" className="input-field" type="text" autoComplete="off" value={memo} onChange={(e) => setMemo(e.target.value)} />
                </div>
              )}

              {/* Summary */}
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '14px 16px', margin: '20px 0 16px' }}>
                <SummaryRow label="Rate" value={rate ? `1 ${coin.symbol} ≈ ${formatNaira(coin.price * rate)}` : '—'} />
                <SummaryRow label="Dollar value" value={quote ? formatUsd(quote.amountUsd) : '—'} />
                <SummaryRow label="Network" value={network?.name || '—'} />
                <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
                <SummaryRow strong label="You pay" value={quote ? formatNaira(quote.amountNgn) : '—'} />
                <div style={{ height: 6 }} />
                <SummaryRow strong label="You receive" value={quote ? `≈ ${formatCrypto(quote.cryptoAmount, coin.symbol)}` : '—'} />
              </div>

              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <input type="checkbox" checked={confirmed} onChange={(e) => { setConfirmed(e.target.checked); setErrors({ ...errors, confirmed: '' }) }}
                  style={{ marginTop: 3, accentColor: 'var(--accent)' }} />
                <span>
                  I confirm this is my {coin.symbol} address on <strong style={{ color: 'var(--text-primary)' }}>{network?.name || 'the selected network'}</strong>.
                  Crypto sent to a wrong address or network cannot be recovered.
                </span>
              </label>
              {errors.confirmed && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.confirmed}</p>}

              {isLoggedIn ? (
                <button type="submit" className="btn btn-green btn-full btn-lg" style={{ marginTop: 18 }} disabled={submitting || !rate}>
                  {submitting ? 'Creating order…' : <>Continue to payment <ArrowRight size={18} /></>}
                </button>
              ) : (
                <Link to="/login" state={{ from: location }} className="btn btn-primary btn-full btn-lg" style={{ marginTop: 18 }}>
                  Sign in to buy
                </Link>
              )}

              {!rate && rates !== null && (
                <p style={{ display: 'flex', gap: 6, alignItems: 'center', color: 'var(--yellow)', fontSize: 12, marginTop: 10 }}>
                  <AlertTriangle size={13} /> The naira rate is temporarily unavailable.
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, fontSize: 12, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={12} /> Rate locked for {rates?.paymentWindowMinutes ?? 30} min</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><ShieldCheck size={12} /> All fees included in the rate</span>
              </div>
            </form>
            ) : (
              <SellPanel coin={coin} rates={rates} isLoggedIn={isLoggedIn} />
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
