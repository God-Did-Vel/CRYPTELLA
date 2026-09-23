import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, ArrowDownUp, Clock, Landmark } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { formatNaira, formatUsd, formatCrypto } from '../utils/format'
import { NIGERIAN_BANKS } from '../utils/banks'

const Row = ({ label, value, strong, color }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: strong ? 15 : 13, fontWeight: strong ? 800 : 400,
    color: color || (strong ? 'var(--text-primary)' : 'var(--text-secondary)'), marginBottom: strong ? 0 : 6 }}>
    <span>{label}</span>
    <span style={{ textAlign: 'right' }}>{value}</span>
  </div>
)

// Sell form on the coin page: customer sends crypto, we pay naira to their bank
export default function SellPanel({ coin, rates, isLoggedIn }) {
  const navigate = useNavigate()
  const location = useLocation()
  const sell = rates?.sell

  const [mode, setMode] = useState('coin') // amount entered as 'coin' sold or 'ngn' received
  const [amount, setAmount] = useState('')
  const [networkId, setNetworkId] = useState(coin.sellNetworks?.[0]?.id || '')
  const [bank, setBank] = useState({ bankName: '', accountNumber: '', accountName: '' })
  const [confirmed, setConfirmed] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // Pre-fill the bank account used last time
  useEffect(() => {
    if (!isLoggedIn) return
    api.get('/user/me').then(({ data }) => {
      const acct = data.data?.payoutAccount
      if (acct?.accountNumber) setBank({ bankName: acct.bankName, accountNumber: acct.accountNumber, accountName: acct.accountName })
    }).catch(() => {})
  }, [isLoggedIn])

  const network = coin.sellNetworks?.find((n) => n.id === networkId)

  const quote = useMemo(() => {
    const value = parseFloat(amount)
    if (!sell?.ngnPerUsd || !value || value <= 0) return null
    const cryptoAmount = mode === 'coin' ? value : value / (coin.price * sell.ngnPerUsd)
    const usd = cryptoAmount * coin.price
    return { cryptoAmount, usd, netNgn: usd * sell.ngnPerUsd }
  }, [amount, mode, coin.price, sell])

  const limitError = quote && sell
    ? quote.netNgn < sell.minPayoutNgn
      ? `You'd receive ${formatNaira(quote.netNgn)}. The minimum payout is ${formatNaira(sell.minPayoutNgn)}.`
      : quote.netNgn > sell.maxPayoutNgn
        ? `The maximum payout per order is ${formatNaira(sell.maxPayoutNgn)}.`
        : null
    : null

  const switchMode = () => {
    if (quote) setAmount(mode === 'coin' ? String(Math.floor(quote.netNgn)) : String(parseFloat(quote.cryptoAmount.toFixed(8))))
    setMode(mode === 'coin' ? 'ngn' : 'coin')
  }

  const setBankField = (field) => (e) => {
    const value = field === 'accountNumber' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value
    setBank({ ...bank, [field]: value })
    setErrors({ ...errors, [field]: '' })
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) return navigate('/login', { state: { from: location } })

    const errs = {}
    if (!quote) errs.amount = 'Enter an amount'
    else if (limitError) errs.amount = limitError
    if (!networkId) errs.network = 'Choose a network'
    if (!bank.bankName.trim()) errs.bankName = 'Choose your bank'
    if (!/^\d{10}$/.test(bank.accountNumber)) errs.accountNumber = 'Account number must be 10 digits'
    if (bank.accountName.trim().length < 3) errs.accountName = 'Enter the account name'
    if (!confirmed) errs.confirmed = 'Please confirm the details above'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSubmitting(true)
    try {
      const { data } = await api.post('/orders/sell', {
        coinId: coin.id,
        cryptoAmount: parseFloat(quote.cryptoAmount.toFixed(8)),
        networkId,
        ...bank,
      })
      toast.success('Sell order created — send your crypto to continue')
      navigate(`/orders/${data.data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create the sell order')
    } finally {
      setSubmitting(false)
    }
  }

  const err = (k) => errors[k] && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors[k]}</p>

  return (
    <form onSubmit={submit} className="card" style={{ boxShadow: 'var(--shadow-lg)' }} noValidate>
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Sell {coin.symbol} for Naira</h2>

      {/* Amount */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label className="label" htmlFor="sell-amount" style={{ marginBottom: 0 }}>
          {mode === 'coin' ? `You sell (${coin.symbol})` : 'You receive (NGN)'}
        </label>
        <button type="button" onClick={switchMode} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          <ArrowDownUp size={12} /> {mode === 'coin' ? 'NGN' : coin.symbol}
        </button>
      </div>
      <div style={{ position: 'relative' }}>
        {mode === 'ngn' && (
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 600 }}>₦</span>
        )}
        <input
          id="sell-amount" className="input-field" type="number" inputMode="decimal" min="0" step="any"
          placeholder={mode === 'coin' ? '0.00' : '100,000'}
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setErrors({ ...errors, amount: '' }) }}
          style={{ paddingLeft: mode === 'ngn' ? 32 : 16, fontSize: 18, fontWeight: 700, borderColor: errors.amount || limitError ? 'var(--red)' : '' }}
        />
      </div>
      {(errors.amount || limitError) && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.amount || limitError}</p>}
      {sell && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          Payout per order: {formatNaira(sell.minPayoutNgn)} – {formatNaira(sell.maxPayoutNgn)}
        </p>
      )}

      {/* Network */}
      <div style={{ marginTop: 18 }}>
        <label className="label">Network you'll send on</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {coin.sellNetworks.map((n) => (
            <button key={n.id} type="button" onClick={() => { setNetworkId(n.id); setErrors({ ...errors, network: '' }) }}
              className={`chip ${networkId === n.id ? 'chip-active' : ''}`} aria-pressed={networkId === n.id}>
              {n.name}
            </button>
          ))}
        </div>
        {err('network')}
      </div>

      {/* Bank account */}
      <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Landmark size={16} style={{ color: 'var(--accent)' }} /> Pay me into
        </div>
        <label className="label" htmlFor="bankName">Bank</label>
        <input id="bankName" className="input-field" list="ng-banks" placeholder="Start typing your bank" autoComplete="off"
          value={bank.bankName} onChange={setBankField('bankName')} style={{ borderColor: errors.bankName ? 'var(--red)' : '' }} />
        <datalist id="ng-banks">{NIGERIAN_BANKS.map((b) => <option key={b} value={b} />)}</datalist>
        {err('bankName')}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <div>
            <label className="label" htmlFor="accountNumber">Account number</label>
            <input id="accountNumber" className="input-field" inputMode="numeric" placeholder="10 digits" autoComplete="off"
              value={bank.accountNumber} onChange={setBankField('accountNumber')}
              style={{ fontVariantNumeric: 'tabular-nums', borderColor: errors.accountNumber ? 'var(--red)' : '' }} />
            {err('accountNumber')}
          </div>
          <div>
            <label className="label" htmlFor="accountName">Account name</label>
            <input id="accountName" className="input-field" placeholder="As on your bank" autoComplete="name"
              value={bank.accountName} onChange={setBankField('accountName')} style={{ borderColor: errors.accountName ? 'var(--red)' : '' }} />
            {err('accountName')}
          </div>
        </div>
      </div>

      {/* Summary: the charge is shown on its own line */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '14px 16px', margin: '20px 0 16px' }}>
        <Row label="You sell" value={quote ? formatCrypto(quote.cryptoAmount, coin.symbol) : '—'} />
        <Row label="Rate" value={sell?.ngnPerUsd ? `1 ${coin.symbol} ≈ ${formatNaira(coin.price * sell.ngnPerUsd)}` : '—'} />
        <Row label="Dollar value" value={quote ? formatUsd(quote.usd) : '—'} />
        <Row label="Network" value={network?.name || '—'} />
        <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
        <Row strong label="You receive" value={quote ? formatNaira(quote.netNgn) : '—'} />
      </div>

      <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        <input type="checkbox" checked={confirmed} onChange={(e) => { setConfirmed(e.target.checked); setErrors({ ...errors, confirmed: '' }) }}
          style={{ marginTop: 3, accentColor: 'var(--accent)' }} />
        <span>
          I'll send exactly the amount above on <strong style={{ color: 'var(--text-primary)' }}>{network?.name || 'the selected network'}</strong>,
          and the bank account is in my name. Crypto sent on the wrong network can't be recovered.
        </span>
      </label>
      {err('confirmed')}

      {isLoggedIn ? (
        <button type="submit" className="btn btn-red btn-full btn-lg" style={{ marginTop: 18 }} disabled={submitting || !sell?.ngnPerUsd}>
          {submitting ? 'Creating order…' : <>Continue to deposit <ArrowRight size={18} /></>}
        </button>
      ) : (
        <Link to="/login" state={{ from: location }} className="btn btn-primary btn-full btn-lg" style={{ marginTop: 18 }}>
          Sign in to sell
        </Link>
      )}
      <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 14, fontSize: 12, color: 'var(--text-muted)' }}>
        <Clock size={12} /> Rate locked for {sell?.depositWindowMinutes ?? 60} min after you continue
      </p>
    </form>
  )
}
