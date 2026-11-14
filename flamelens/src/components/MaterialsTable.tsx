import { useEffect, useState } from 'react'
import { classifyVerdict, supabase, type Material } from '../lib/supabase'

const n = (v: number | null, unit = '') => (v === null ? '—' : `${v}${unit}`)

function Verdict({ text }: { text: string | null }) {
  return <span className={`verdict ${classifyVerdict(text)}`}>{text ?? 'No data'}</span>
}

export default function MaterialsTable({ only }: { only?: string[] }) {
  const [rows, setRows] = useState<Material[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase.from('materials').select('*').order('name').then(({ data, error }) => {
      setLoading(false)
      if (error) setError(error.message)
      else setRows((data ?? []) as Material[])
    })
  }, [])

  return (
    <>
      <div className="legend">
        <span><i className="dot" style={{ background: 'var(--green)' }} />Safe / approved</span>
        <span><i className="dot" style={{ background: 'var(--amber)' }} />Conditional / restricted</span>
        <span><i className="dot" style={{ background: 'var(--red)' }} />Danger / high risk</span>
        <span><i className="dot" style={{ background: 'var(--muted)' }} />No verdict</span>
      </div>
      {loading && <p className="muted">Loading…</p>}
      {error && <div className="notice">Could not load materials: {error}</div>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Material</th>
              <th>O₂ limit 1g</th>
              <th>O₂ limit µg</th>
              <th>Margin</th>
              <th>Spread cm/s</th>
              <th>CO ppm</th>
              <th>ISS verdict</th>
              <th>Lunar verdict</th>
            </tr>
          </thead>
          <tbody>
            {rows.filter((m) => !only || only.includes(m.id)).map((m) => (
              <tr key={m.id}>
                <td style={{ color: 'var(--text)', minWidth: 180 }}>
                  <div style={{ fontWeight: 500 }}>{m.name}</div>
                  {m.microgravity_behavior && <div className="muted" style={{ fontSize: 12, marginTop: 4, maxWidth: 260 }}>{m.microgravity_behavior}</div>}
                  {m.source && <div className="mono muted" style={{ fontSize: 11, marginTop: 4 }}>{m.source}</div>}
                </td>
                <td className="mono">{n(m.o2_extinction_1g, '%')}</td>
                <td className="mono">{n(m.o2_extinction_microgravity, '%')}</td>
                <td className="mono">{n(m.o2_margin_of_safety, ' pts')}</td>
                <td className="mono">{n(m.spread_rate_cms)}</td>
                <td className="mono">{n(m.co_production_ppm)}</td>
                <td><Verdict text={m.iss_verdict} /></td>
                <td><Verdict text={m.lunar_verdict} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
