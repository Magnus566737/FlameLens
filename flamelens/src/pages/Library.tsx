import { useEffect, useState } from 'react'
import { ConfigNotice } from '../components/Layout'
import { supabase, type Paper } from '../lib/supabase'

const PAGE = 20

export default function Library() {
  const [input, setInput] = useState('')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(0)
  const [rows, setRows] = useState<Paper[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => {
    const t = setTimeout(() => { setQ(input.trim()); setPage(0) }, 300)
    return () => clearTimeout(t)
  }, [input])

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    setLoading(true)
    let query = supabase
      .from('ntrs_papers')
      .select('ntrs_id,title,abstract,year,pdf_url,related_investigations', { count: 'exact' })
      .order('year', { ascending: false, nullsFirst: false })
      .range(page * PAGE, page * PAGE + PAGE - 1)
    if (q) {
      const s = q.replace(/[%,()*\\]/g, ' ')
      query = query.or(`title.ilike.%${s}%,abstract.ilike.%${s}%`)
    }
    query.then(({ data, count, error }) => {
      if (cancelled) return
      setLoading(false)
      if (error) setError(error.message)
      else { setError(null); setRows((data ?? []) as Paper[]); setTotal(count ?? 0) }
    })
    return () => { cancelled = true }
  }, [q, page])

  const pages = Math.max(1, Math.ceil(total / PAGE))

  return (
    <main className="page">
      <div className="eyebrow">Research Library</div>
      <h1 className="h1" style={{ fontSize: 'clamp(32px,4.5vw,56px)' }}>NASA technical <span className="serif">papers</span></h1>
      <ConfigNotice />
      <input className="input" placeholder="Search titles and abstracts…" value={input} onChange={(e) => setInput(e.target.value)} aria-label="Search papers" style={{ maxWidth: 560 }} />
      <p className="muted mono" style={{ fontSize: 12, margin: '14px 0 20px' }}>
        {loading ? 'Loading…' : `${total.toLocaleString()} result${total === 1 ? '' : 's'}`}
      </p>
      {error && <div className="notice">Could not load papers: {error}. If this says the table is empty or permission denied, run <span className="mono">policies.sql</span> in Supabase so the anon key can read.</div>}
      <div className="grid">
        {rows.map((p) => (
          <article key={p.ntrs_id} className="card">
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
              <span className="tag">{p.ntrs_id}</span>
              {p.year && <span className="muted mono" style={{ fontSize: 12 }}>{p.year}</span>}
              {p.related_investigations?.map((r) => <span key={r} className="tag">{r}</span>)}
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 500, letterSpacing: '-0.01em' }}>{p.title}</h3>
            {p.abstract && (
              <p style={{ margin: 0, color: 'var(--soft)', lineHeight: 1.6, fontSize: 14.5 }}>
                {open === p.ntrs_id || p.abstract.length < 320 ? p.abstract : p.abstract.slice(0, 320) + '…'}
              </p>
            )}
            <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13 }}>
              {p.abstract && p.abstract.length >= 320 && (
                <button onClick={() => setOpen(open === p.ntrs_id ? null : p.ntrs_id)} style={{ background: 'none', border: 0, color: 'var(--cyan)', cursor: 'pointer', padding: 0 }}>
                  {open === p.ntrs_id ? 'Show less' : 'Read more'}
                </button>
              )}
              {p.pdf_url && <a href={p.pdf_url} target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)' }}>View on NTRS ↗</a>}
            </div>
          </article>
        ))}
        {!loading && !error && rows.length === 0 && supabase && <p className="muted">No papers match.</p>}
      </div>
      {pages > 1 && (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', marginTop: 28 }}>
          <button className="btn" disabled={page === 0} onClick={() => setPage(page - 1)}>← Prev</button>
          <span className="mono muted" style={{ fontSize: 12 }}>{page + 1} / {pages}</span>
          <button className="btn" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Next →</button>
        </div>
      )}
    </main>
  )
}
