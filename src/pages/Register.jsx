import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
  ]
  if (!password) return null
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
      {checks.map((c) => (
        <span key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: c.pass ? 'var(--green)' : 'var(--text-muted)' }}>
          <CheckCircle size={12} fill={c.pass ? 'var(--green)' : 'none'} />
          {c.label}
        </span>
      ))}
    </div>
  )
}

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [agreed, setAgreed] = useState(false)

  const set = (field) => (e) => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: '' }) }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    if (!agreed) e.agreed = 'You must accept the terms'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const result = await register(form.firstName, form.lastName, form.email, form.password)
    if (result.success) {
      toast.success('Account created! Welcome to Cryptella 🎉')
      navigate('/dashboard')
    } else {
      toast.error(result.message)
    }
  }

  const Field = ({ label, field, type = 'text', icon, placeholder, autoComplete, children }) => (
    <div style={{ marginBottom: 18 }}>
      <label className="label">{label}</label>
      <div style={{ position: 'relative' }}>
        {icon && React.cloneElement(icon, {
          style: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }
        })}
        <input
          className="input-field"
          type={type}
          placeholder={placeholder}
          value={form[field]}
          onChange={set(field)}
          autoComplete={autoComplete}
          style={{ paddingLeft: icon ? 42 : 16, paddingRight: children ? 44 : 16, borderColor: errors[field] ? 'var(--red)' : '' }}
        />
        {children}
      </div>
      {errors[field] && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors[field]}</p>}
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px 60px',
      background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 60%)',
    }}>
      <div style={{ width: '100%', maxWidth: 460 }} className="fade-in">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 26, color: '#fff',
            margin: '0 auto 16px', boxShadow: '0 0 24px rgba(99,102,241,0.4)',
          }}>C</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Create your account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Start trading altcoins in under 2 minutes</p>
        </div>

        <div className="card" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <form onSubmit={handleSubmit} noValidate>
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ marginBottom: 18 }}>
                <label className="label">First name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    className="input-field"
                    type="text"
                    placeholder="John"
                    value={form.firstName}
                    onChange={set('firstName')}
                    autoComplete="given-name"
                    style={{ paddingLeft: 42, borderColor: errors.firstName ? 'var(--red)' : '' }}
                  />
                </div>
                {errors.firstName && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.firstName}</p>}
              </div>
              <div style={{ marginBottom: 18 }}>
                <label className="label">Last name</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={set('lastName')}
                  autoComplete="family-name"
                  style={{ borderColor: errors.lastName ? 'var(--red)' : '' }}
                />
                {errors.lastName && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label className="label">Email address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="input-field"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                  style={{ paddingLeft: 42, borderColor: errors.email ? 'var(--red)' : '' }}
                />
              </div>
              {errors.email && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18 }}>
              <label className="label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="input-field"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="new-password"
                  style={{ paddingLeft: 42, paddingRight: 44, borderColor: errors.password ? 'var(--red)' : '' }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} aria-label={showPw ? 'Hide' : 'Show'}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.password}</p>}
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: 20 }}>
              <label className="label">Confirm password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  className="input-field"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  autoComplete="new-password"
                  style={{ paddingLeft: 42, borderColor: errors.confirm ? 'var(--red)' : '' }}
                />
              </div>
              {errors.confirm && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => { setAgreed(e.target.checked); setErrors({ ...errors, agreed: '' }) }}
                  style={{ marginTop: 3, accentColor: 'var(--accent)' }}
                />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  I agree to the{' '}
                  <Link to="/" style={{ color: 'var(--accent)' }}>Terms of Service</Link>{' '}and{' '}
                  <Link to="/" style={{ color: 'var(--accent)' }}>Privacy Policy</Link>.
                  I understand crypto trading involves risk.
                </span>
              </label>
              {errors.agreed && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 5 }}>{errors.agreed}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Creating account…' : <><span>Create Account</span> <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="divider" />
          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
