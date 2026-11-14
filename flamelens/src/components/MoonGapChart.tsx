import { useEffect, useMemo, useState } from 'react'
import { supabase, type Material } from '../lib/supabase'

// x positions (gravity in g) for the three conditions that matter
const W = 860, H = 420, L = 70, R = 30, T = 40, B = 70
const xOf = (g: number) => L + (g / 1) * (W - L - R)

export default function MoonGapChart() {
  const [mats, setMats] = useState<Material[]>([])
  const [sel, setSel] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    supabase.from('materials').select('*').order('name').then(({ data, error }) => {
      if (error) { setError(error.message); return }
      const list = ((data ?? []) as Material[]).filter((m) => m.o2_extinction_1g !== null && m.o2_extinction_microgravity !== null)
      setMats(list)
      setSel((cur) => cur || (list.find((m) => m.id === 'pmma') ?? list[0])?.id || '')
    })
  }, [])

  const m = useMemo(() => mats.find((x) => x.id === sel), [mats, sel])
  const y1 = m?.o2_extinction_1g ?? null
  const y0 = m?.o2_extinction_microgravity ?? null

  // y axis: O2 concentration (%) at which the flame goes out
  const lo = 10, hi = 22
  const yOf = (v: number) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B)
  const x0 = xOf(0), xm = xOf(0.166), x1 = xOf(1)

  return (
    <>
      {error && <div className="notice">Could not load materials: {error}</div>}

      {mats.length > 0 && (
        <div style={{ margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <label htmlFor="mat" className="muted mono" style={{ fontSize: 12 }}>MATERIAL</label>
          <select id="mat" value={sel} onChange={(e) => setSel(e.target.value)} className="input" style={{ width: 'auto', borderRadius: 12 }}>
            {mats.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </div>
      )}

      <div className="card" style={{ padding: 12 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Oxygen extinction limit at 0 g, 0.166 g and 1 g. The 0.166 g value is unmeasured.">
          {/* grid + y axis */}
          {[10, 12, 14, 16, 18, 20, 22].map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={yOf(v)} y2={yOf(v)} stroke="rgba(255,255,255,0.06)" />
              <text x={L - 10} y={yOf(v) + 4} textAnchor="end" fill="#6B7390" fontSize="12" fontFamily="Geist Mono, monospace">{v}%</text>
            </g>
          ))}
          <text x={18} y={H / 2} fill="#6B7390" fontSize="12" fontFamily="Geist Mono, monospace" transform={`rotate(-90 18 ${H / 2})`} textAnchor="middle">O₂ at which the flame goes out</text>

          {/* x axis */}
          <line x1={L} x2={W - R} y1={H - B} y2={H - B} stroke="rgba(255,255,255,0.2)" />
          {[
            [x0, '0 g', 'ISS microgravity'],
            [xm, '0.166 g', 'Moon'],
            [x1, '1 g', 'Earth'],
          ].map(([x, a, b]) => (
            <g key={a as string}>
              <line x1={x as number} x2={x as number} y1={H - B} y2={H - B + 6} stroke="rgba(255,255,255,0.3)" />
              <text x={x as number} y={H - B + 24} textAnchor="middle" fill="#F5F7FF" fontSize="14" fontFamily="Geist, sans-serif">{a}</text>
              <text x={x as number} y={H - B + 42} textAnchor="middle" fill="#6B7390" fontSize="12" fontFamily="Geist, sans-serif">{b}</text>
            </g>
          ))}

          {/* the gap */}
          <rect x={xm - 70} y={T} width={140} height={H - T - B} rx={10} fill="rgba(255,90,95,0.07)" stroke="#FF5A5F" strokeDasharray="6 5" />
          <text x={xm} y={H / 2 - 6} textAnchor="middle" fill="#FF5A5F" fontSize="30" fontFamily="Instrument Serif, serif" fontStyle="italic">NO DATA</text>
          <text x={xm} y={H / 2 + 16} textAnchor="middle" fill="#ffc4c6" fontSize="12" fontFamily="Geist Mono, monospace">FM2 · not yet flown</text>

          {/* measured points */}
          {y0 !== null && y1 !== null && (
            <>
              {/* dashed bridge = interpolation, not measurement */}
              <line x1={x0} y1={yOf(y0)} x2={x1} y2={yOf(y1)} stroke="rgba(255,255,255,0.18)" strokeDasharray="3 6" />
              <circle cx={x0} cy={yOf(y0)} r={9} fill="#3DDC97" />
              <text x={x0 + 16} y={yOf(y0) + 5} fill="#b8f5d8" fontSize="14" fontFamily="Geist Mono, monospace">{y0}%</text>
              <circle cx={x1} cy={yOf(y1)} r={9} fill="#35B8FF" />
              <text x={x1 - 16} y={yOf(y1) - 14} textAnchor="end" fill="#bfe8ff" fontSize="14" fontFamily="Geist Mono, monospace">{y1}%</text>
            </>
          )}
          <circle cx={xm} cy={H - B - 16} r={7} fill="none" stroke="#FF5A5F" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
        <div className="legend" style={{ margin: '4px 10px 8px' }}>
          <span><i className="dot" style={{ background: 'var(--green)' }} />0 g: ISS data exists</span>
          <span><i className="dot" style={{ background: 'var(--red)' }} />0.166 g: no data (FM2)</span>
          <span><i className="dot" style={{ background: 'var(--cyan)' }} />1 g: Earth data exists</span>
        </div>
      </div>

      {m && (
        <div className="card" style={{ marginTop: 16 }}>
          <strong>{m.name}</strong>
          <p style={{ color: 'var(--soft)', lineHeight: 1.6, margin: '8px 0 0' }}>
            Measured extinction limit: {y1}% O₂ at 1 g and {y0}% at 0 g. The faint dashed line joins the two measurements only to guide the eye; it is not a prediction for the Moon.
            {m.lunar_verdict && <> Current lunar verdict: <em>{m.lunar_verdict}</em></>}
          </p>
        </div>
      )}
    </>
  )
}
