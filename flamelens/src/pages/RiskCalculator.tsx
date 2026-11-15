import { useState } from 'react'
import SourceLine from '../components/SourceLine'
import { FM2_TARGET_NOTE, SRC, type Source } from '../lib/sources'

type Level = 'SAFE' | 'CAUTION' | 'WARNING' | 'UNKNOWN'
type Grav = 0 | 0.166 | 0.38 | 1
type Vent = 'Low' | 'Normal' | 'High'
type Rule = { level: Exclude<Level, 'SAFE'>; title: string; text: string; sources: Source[] }

const COLOR: Record<Level, string> = { SAFE: 'var(--green)', CAUTION: 'var(--amber)', WARNING: 'var(--red)', UNKNOWN: '#b9b5ff' }
const ORDER: Level[] = ['SAFE', 'CAUTION', 'UNKNOWN', 'WARNING']

export function evaluate(o2: number, psia: number, grav: Grav, vent: Vent) {
  const rules: Rule[] = []
  const notes: string[] = []

  if (o2 > 21)
    rules.push({
      level: 'CAUTION',
      title: 'O₂ above normal air (21%)',
      text: `${o2}% O₂ is higher than the 21% of normal air.`,
      sources: [SRC.std6001b],
    })

  if (o2 > 24.1 && psia >= 14.5)
    rules.push({
      level: 'WARNING',
      title: 'O₂ above the ISS maximum (24.1%)',
      text: `${o2}% O₂ at ${psia} psia exceeds the 24.1% by-volume maximum documented for the ISS atmosphere.`,
      sources: [SRC.iss24, SRC.jsc29353b],
    })
  else if (o2 > 24.1)
    notes.push(
      `${o2}% O₂ at ${psia} psia is outside the documented ISS limits (24.1% O₂ at ISS-like pressure). No rule is evaluated for this pressure, so the result does not cover it.`,
    )

  if (o2 <= 21 && vent === 'Low' && grav === 0)
    rules.push({
      level: 'WARNING',
      title: 'Low ventilation in microgravity',
      text: 'BASS-II found that in microgravity flames can spread at lower O₂ than in normal gravity. This warning is the team’s interpretation of that finding for low-ventilation conditions, not a NASA limit.',
      sources: [SRC.bass2],
    })

  if (grav === 0.166 || grav === 0.38)
    rules.push({
      level: 'UNKNOWN',
      title: `No flight data at ${grav} g`,
      text: `No combustion experiment has been performed on the Moon or Mars. FM2 will be the first on another planetary body. ${FM2_TARGET_NOTE}`,
      sources: [SRC.fm2],
    })

  const level = rules.reduce<Level>((worst, r) => (ORDER.indexOf(r.level) > ORDER.indexOf(worst) ? r.level : worst), 'SAFE')
  return { level, rules, notes }
}

export default function RiskCalculator() {
  const [o2, setO2] = useState(21)
  const [psia, setPsia] = useState(14.7)
  const [grav, setGrav] = useState<Grav>(0)
  const [vent, setVent] = useState<Vent>('Normal')
  const { level, rules, notes } = evaluate(o2, psia, grav, vent)
  const ppo2 = Math.round(((o2 / 100) * psia) * 100) / 100

  return (
    <main className="page">
      <div className="eyebrow">Fire Risk Calculator</div>
      <h1 className="h1" style={{ fontSize: 'clamp(32px,4.5vw,56px)' }}>Check an environment against <span className="serif">NASA findings</span></h1>
      <p className="lead">Each result comes only from the rules listed below, each with its source. It is an educational tool, not a safety certification.</p>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: 28 }}>
        <section className="card">
          <label className="mono muted" style={{ fontSize: 12 }}>O₂ — {o2}%</label>
          <input type="range" min={10} max={40} step={0.1} value={o2} onChange={(e) => setO2(+e.target.value)} style={{ width: '100%', accentColor: '#6c63ff' }} />
          <label className="mono muted" style={{ fontSize: 12, display: 'block', marginTop: 18 }}>PRESSURE — {psia} psia</label>
          <input type="range" min={4} max={20} step={0.1} value={psia} onChange={(e) => setPsia(+e.target.value)} style={{ width: '100%', accentColor: '#6c63ff' }} />
          <div className="mono muted" style={{ fontSize: 11, marginTop: 6 }}>Calculated O₂ partial pressure: {ppo2} psia</div>

          <div className="mono muted" style={{ fontSize: 12, margin: '18px 0 8px' }}>GRAVITY</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {([[0, '0 g'], [0.166, '0.166 g Moon'], [0.38, '0.38 g Mars'], [1, '1 g']] as [Grav, string][]).map(([g, label]) => (
              <button key={g} onClick={() => setGrav(g)} className="btn" style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer', borderColor: grav === g ? 'var(--violet)' : undefined }}>{label}</button>
            ))}
          </div>

          <div className="mono muted" style={{ fontSize: 12, margin: '18px 0 8px' }}>VENTILATION</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['Low', 'Normal', 'High'] as Vent[]).map((v) => (
              <button key={v} onClick={() => setVent(v)} className="btn" style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer', borderColor: vent === v ? 'var(--violet)' : undefined }}>{v}</button>
            ))}
          </div>
        </section>

        <section className="card" style={{ borderColor: COLOR[level] }}>
          <div className="mono muted" style={{ fontSize: 12 }}>RESULT</div>
          <div style={{ fontSize: 56, fontWeight: 500, letterSpacing: '-0.03em', color: COLOR[level], margin: '6px 0' }}>{level === 'UNKNOWN' ? '⚠ UNKNOWN' : level}</div>
          {level === 'SAFE' && <p style={{ color: 'var(--soft)', margin: 0 }}>No rule was triggered. This is not a safety guarantee: the rules cover only the NASA findings listed on this page.</p>}
          {level === 'UNKNOWN' && <p style={{ color: 'var(--soft)', margin: 0 }}>The data needed to rate this environment does not exist yet.</p>}
        </section>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 500, margin: '36px 0 14px' }}>Rules triggered</h2>
      <div className="grid">
        {rules.length === 0 && <p className="muted">None.</p>}
        {rules.map((r) => (
          <article key={r.title} className="card" style={{ borderLeft: `3px solid ${COLOR[r.level]}` }}>
            <span className="badge" style={{ color: COLOR[r.level], borderColor: COLOR[r.level] }}>{r.level}</span>
            <h3 style={{ margin: '10px 0 6px', fontSize: 18, fontWeight: 500 }}>{r.title}</h3>
            <p style={{ margin: 0, color: 'var(--soft)', lineHeight: 1.6 }}>{r.text}</p>
            {r.sources.map((s) => <SourceLine key={s.label} s={s} />)}
          </article>
        ))}
        {notes.map((n) => <div key={n} className="notice">{n}</div>)}
      </div>
      <p className="muted" style={{ fontSize: 13, marginTop: 24 }}>No rule is applied for Normal or High ventilation, or for pressure on its own.</p>
    </main>
  )
}
