import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Earth3D from '../components/Earth3D'
import { ConfigNotice } from '../components/Layout'
import { countRows } from '../lib/supabase'

export default function Home() {
  const [stats, setStats] = useState<{ papers: number | null; exps: number | null; mats: number | null }>({ papers: null, exps: null, mats: null })

  useEffect(() => {
    Promise.all([countRows('ntrs_papers'), countRows('investigations'), countRows('materials')]).then(([papers, exps, mats]) =>
      setStats({ papers, exps, mats }),
    )
  }, [])

  const fmt = (n: number | null) => (n === null ? '—' : n.toLocaleString())

  return (
    <>
      <Earth3D style={{ position: 'fixed', top: 0, right: '-8vw', width: 'min(70vw, 900px)', height: '100vh', zIndex: 0, pointerEvents: 'none' }} />
      <main className="page" style={{ paddingTop: 150 }}>
        <div className="eyebrow">● Advanced space fire safety research</div>
        <h1 className="h1">
          Understanding Fire.
          <br />
          <span className="serif">Protecting the Future.</span>
        </h1>
        <p className="lead">
          Exploring combustion behavior, fire dynamics, and spacecraft safety through NASA research, experimental data, and artificial intelligence.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '28px 0 8px' }}>
          <Link to="/library" className="btn primary">Explore Research →</Link>
          <Link to="/experiments" className="btn">Discover Experiments</Link>
        </div>
        <ConfigNotice />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', maxWidth: 640, marginTop: 56 }}>
          <div className="card">
            <div className="stat">{fmt(stats.papers)}</div>
            <div className="muted">Research papers</div>
          </div>
          <div className="card">
            <div className="stat">{fmt(stats.exps)}</div>
            <div className="muted">Experiments</div>
          </div>
          <div className="card">
            <div className="stat">{fmt(stats.mats)}</div>
            <div className="muted">Materials tested</div>
          </div>
        </div>
        <p className="mono muted" style={{ fontSize: 12, marginTop: 28, maxWidth: 420, borderLeft: '1px solid var(--line)', paddingLeft: 14 }}>
          FIG. 01 — Earth from orbit. The orange ring is the ISS orbit at 51.6° inclination. Orbit altitude exaggerated.
        </p>
      </main>
    </>
  )
}
