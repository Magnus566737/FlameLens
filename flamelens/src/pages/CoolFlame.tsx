import { useEffect, useRef, useState } from 'react'
import SourceLine from '../components/SourceLine'
import { SRC } from '../lib/sources'

const TOTAL = 10

function stageOf(t: number) {
  if (t < 3) return 1
  if (t < 5) return 2
  return 3
}

const TEXT: Record<number, string> = {
  1: 'Visible flame burning',
  2: 'Flame appears extinguished…',
  3: 'Cool flame still active — invisible to the naked eye. CO still being produced.',
}

export default function CoolFlame() {
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(true)
  const last = useRef<number | null>(null)

  useEffect(() => {
    if (!playing) { last.current = null; return }
    let raf = 0
    const step = (now: number) => {
      if (last.current !== null) setT((p) => Math.min(TOTAL, p + (now - last.current!) / 1000))
      last.current = now
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  const restart = () => { setT(0); setPlaying(true) }
  const done = t >= TOTAL
  useEffect(() => { if (done) setPlaying(false) }, [done])
  const stage = stageOf(t)
  const paused = !playing && t > 0 && !done
  const status: 'playing' | 'paused' | 'stopped' = playing ? 'playing' : paused ? 'paused' : 'stopped'
  const toggle = () => (status === 'playing' ? setPlaying(false) : done ? restart() : setPlaying(true))

  return (
    <main className="page">
      <div className="eyebrow">Cool Flame</div>
      <h1 className="h1" style={{ fontSize: 'clamp(32px,4.5vw,56px)' }}>A flame you <span className="serif">can’t see</span></h1>
      <p className="lead">NASA’s FLEX experiment on the ISS found that burning can continue after the visible flame goes out.</p>

      <div className="card anim-box" style={{ marginTop: 24, textAlign: 'center', padding: '36px 22px' }}>
        {status === 'paused' && <div className="pause-overlay" aria-hidden>⏸ PAUSED</div>}
        <div className="status-row">
          <span className={`status-chip ${status}`} role="status">
            {status === 'playing' ? '▶ PLAYING' : status === 'paused' ? '⏸ PAUSED' : '■ FINISHED'}
          </span>
        </div>
        <div className="flame-stage" aria-hidden>
          <div className="droplet" />
          <div className={`flame hot ${stage === 1 ? 'on' : ''}`} />
          <div className={`flame cool ${stage === 3 ? 'on' : ''}`} />
        </div>
        <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>STAGE {stage} · {t.toFixed(1)} s</div>
        <p aria-live="polite" style={{ fontSize: 22, fontWeight: 500, margin: '0 auto', maxWidth: 560, minHeight: 64, color: stage === 3 ? '#b9b5ff' : stage === 1 ? 'var(--orange)' : 'var(--soft)' }}>{TEXT[stage]}</p>
        {stage === 3 && <SourceLine s={SRC.flex} />}
        <div className="progress" role="progressbar" aria-label="Animation progress" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={Math.round(t * 10) / 10}>
          <div className={`progress-fill ${status}`} style={{ width: `${(t / TOTAL) * 100}%` }} />
        </div>
        <div className="mono muted" style={{ fontSize: 11, marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
          <span>0 s</span><span>{t.toFixed(1)} / {TOTAL} s</span><span>{TOTAL} s</span>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
          {/* one toggle: Pause while playing, Resume while paused, Play when stopped */}
          <button
            className={`btn ${status === 'playing' ? 'primary' : status === 'paused' ? 'ghost' : 'primary'}`}
            style={{ cursor: 'pointer', minWidth: 130 }}
            onClick={toggle}
          >
            {status === 'playing' ? '⏸ Pause' : status === 'paused' ? '▶ Resume' : '▶ Play'}
          </button>
          <button className="btn" style={{ cursor: 'pointer' }} onClick={restart}>↺ Restart</button>
        </div>
        <p className="mono muted" style={{ fontSize: 11, marginTop: 16 }}>Illustration only: colours and timings are not measured values.</p>
      </div>

      {done && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: 24 }}>
          <article className="card">
            <h3 style={{ margin: '0 0 8px' }}>FLEX discovery</h3>
            <p style={{ color: 'var(--soft)', lineHeight: 1.6, margin: 0 }}>In 2012, researchers on NASA’s FLEX experiment saw fuel droplets keep burning on the ISS after the visible flame went out. They concluded the flames were still there but too faint to see.</p>
            <SourceLine s={SRC.flex} />
          </article>
          <article className="card">
            <h3 style={{ margin: '0 0 8px' }}>Carbon monoxide</h3>
            <p style={{ color: 'var(--soft)', lineHeight: 1.6, margin: 0 }}>Cool-flame chemistry is reported to produce carbon monoxide and formaldehyde, as described in coverage of the FLEX results. We have not verified this against a primary NASA paper.</p>
            <SourceLine s={{ ...SRC.flex, verified: false }} />
          </article>
          <article className="card" style={{ borderStyle: 'dashed' }}>
            <h3 style={{ margin: '0 0 8px' }}>Detection: an open question</h3>
            <p style={{ color: 'var(--soft)', lineHeight: 1.6, margin: 0 }}>We found no NASA source stating whether standard smoke or CO detectors respond to cool flames. We treat that as unknown and make no claim either way.</p>
          </article>
        </div>
      )}
    </main>
  )
}
