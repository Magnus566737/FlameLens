import { useEffect, useState } from 'react'
import { ConfigNotice } from '../components/Layout'
import { supabase, type Investigation } from '../lib/supabase'

const pct = (v: number | null) => (v === null ? '—' : `${v <= 1 ? Math.round(v * 1000) / 10 : v}%`)

export default function Experiments() {
  const [rows, setRows] = useState<Investigation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('investigations').select('*').order('id').then(({ data, error }) => {
      setLoading(false)
      if (error) setError(error.message)
      else setRows((data ?? []) as Investigation[])
    })
  }, [])

  const statuses = ['all', ...Array.from(new Set(rows.map((r) => r.status ?? 'unknown')))]
  const shown = rows.filter((r) => filter === 'all' || (r.status ?? 'unknown') === filter)

  return (
    <main className="page">
      <div className="eyebrow">Experiments</div>
      <h1 className="h1" style={{ fontSize: 'clamp(32px,4.5vw,56px)' }}>NASA combustion <span className="serif">investigations</span></h1>
      <ConfigNotice />
      <div style={{ display: 'flex', gap: 8, margin: '8px 0 22px', flexWrap: 'wrap' }}>
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className="btn" style={{ padding: '8px 16px', fontSize: 13, textTransform: 'capitalize', borderColor: filter === s ? 'var(--violet)' : undefined }}>{s}</button>
        ))}
      </div>
      {loading && <p className="muted">Loading…</p>}
      {error && <div className="notice">Could not load experiments: {error}</div>}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
        {shown.map((e) => {
          const st = e.status ?? 'unknown'
          return (
            <article key={e.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span className="tag">{e.id}</span>
                <span className={`badge ${st === 'complete' || st === 'active' ? st : 'other'}`}>{st}</span>
              </div>
              <h3 style={{ margin: '0 0 2px', fontSize: 22, fontWeight: 500 }}>{e.acronym}</h3>
              <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>{e.full_name}</div>
              {e.key_finding && <p style={{ margin: '0 0 14px', color: 'var(--soft)', lineHeight: 1.55, fontSize: 14 }}>{e.key_finding}</p>}
              <dl className="mono" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 14px', margin: 0, fontSize: 12, color: 'var(--muted)' }}>
                {e.pi_name && (<><dt>PI</dt><dd style={{ margin: 0, color: 'var(--soft)' }}>{e.pi_name}</dd></>)}
                {e.hardware && (<><dt>Hardware</dt><dd style={{ margin: 0, color: 'var(--soft)' }}>{e.hardware}</dd></>)}
                {e.period_start && (<><dt>Period</dt><dd style={{ margin: 0, color: 'var(--soft)' }}>{e.period_start}–{e.period_end ?? '…'}</dd></>)}
                {(e.o2_min !== null || e.o2_max !== null) && (<><dt>O₂</dt><dd style={{ margin: 0, color: 'var(--soft)' }}>{pct(e.o2_min)} – {pct(e.o2_max)}</dd></>)}
                {(e.pressure_min_atm !== null) && (<><dt>Pressure</dt><dd style={{ margin: 0, color: 'var(--soft)' }}>{e.pressure_min_atm}–{e.pressure_max_atm} atm</dd></>)}
              </dl>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
                {e.fuels?.map((f) => <span key={f} className="tag">{f}</span>)}
              </div>
              {e.doi && <a href={`https://doi.org/${e.doi}`} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 12, fontSize: 13, color: 'var(--cyan)' }}>DOI ↗</a>}
            </article>
          )
        })}
      </div>
    </main>
  )
}
