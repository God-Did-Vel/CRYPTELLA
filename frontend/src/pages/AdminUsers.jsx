import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { formatNaira, formatDate } from '../utils/format'

const SORTS = [
  { id: 'recent', label: 'Newest' },
  { id: 'active', label: 'Last order' },
  { id: 'orders', label: 'Most orders' },
  { id: 'spent', label: 'Most bought' },
  { id: 'sold', label: 'Most sold' },
]

const th = { padding: '12px 14px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }
const td = { padding: '12px 14px', fontSize: 14, borderBottom: '1px solid var(--border-light)', whiteSpace: 'nowrap' }

export default function AdminUsers() {
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('recent')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ data: [], pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get('/admin/users', { params: { sort, page, ...(search && { q: search }) } })
      .then(({ data }) => setResult(data))
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load users'))
      .finally(() => setLoading(false))
  }, [sort, page, search])

  return (
    <div style={{ paddingTop: 68 }}>
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '28px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Customers</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{loading ? '…' : `${result.total} registered customer${result.total === 1 ? '' : 's'}`}</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setPage(1); setSearch(query.trim()) }} style={{ display: 'flex', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input-field" placeholder="Name or email" value={query} onChange={(e) => setQuery(e.target.value)}
                style={{ paddingLeft: 36, width: 260, maxWidth: '55vw' }} />
            </div>
            <button className="btn btn-secondary" type="submit">Search</button>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: '24px 24px 48px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sort by</span>
          {SORTS.map((s) => (
            <button key={s.id} onClick={() => { setSort(s.id); setPage(1) }} className={`chip ${sort === s.id ? 'chip-active' : ''}`}>{s.label}</button>
          ))}
          {search && (
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 8 }}>
              Results for “{search}” · <button onClick={() => { setSearch(''); setQuery('') }} style={{ background: 'none', border: 'none', color: 'var(--accent)' }}>clear</button>
            </span>
          )}
        </div>

        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: 'left' }}>Customer</th>
                <th style={{ ...th, textAlign: 'left' }}>Joined</th>
                <th style={{ ...th, textAlign: 'right' }}>Orders</th>
                <th style={{ ...th, textAlign: 'right' }}>Pending</th>
                <th style={{ ...th, textAlign: 'right' }}>Completed</th>
                <th style={{ ...th, textAlign: 'right' }}>Bought</th>
                <th style={{ ...th, textAlign: 'right' }}>Sold</th>
                <th style={{ ...th, textAlign: 'left' }}>Last order</th>
                <th style={th} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}><td colSpan={9} style={{ padding: '10px 14px' }}><div className="skeleton" style={{ height: 32 }} /></td></tr>
                ))
              ) : result.data.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>No customers found.</td></tr>
              ) : (
                result.data.map((u) => (
                  <tr key={u.id}>
                    <td style={td}>
                      <div style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
                    </td>
                    <td style={{ ...td, color: 'var(--text-secondary)', fontSize: 13 }}>{formatDate(u.createdAt)}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 700 }}>{u.stats.total}</td>
                    <td style={{ ...td, textAlign: 'right', color: u.stats.pending ? 'var(--yellow)' : 'var(--text-muted)', fontWeight: u.stats.pending ? 700 : 400 }}>{u.stats.pending}</td>
                    <td style={{ ...td, textAlign: 'right', color: u.stats.completed ? 'var(--green)' : 'var(--text-muted)' }}>{u.stats.completed}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 600 }}>{formatNaira(u.stats.spentNgn, 0)}</td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 600 }}>{formatNaira(u.stats.receivedNgn || 0, 0)}</td>
                    <td style={{ ...td, color: 'var(--text-secondary)', fontSize: 13 }}>{u.stats.lastOrderAt ? formatDate(u.stats.lastOrderAt) : '—'}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      {u.stats.total > 0 && (
                        <Link to={`/admin/orders?status=all&user=${u.id}&name=${encodeURIComponent(`${u.firstName} ${u.lastName}`)}`}
                          style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          Orders <ArrowRight size={13} />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {result.pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 16 }}>
            <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft size={14} /> Prev</button>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Page {page} of {result.pages}</span>
            <button className="btn btn-secondary btn-sm" disabled={page >= result.pages} onClick={() => setPage(page + 1)}>Next <ChevronRight size={14} /></button>
          </div>
        )}
      </div>
    </div>
  )
}
