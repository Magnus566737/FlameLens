import { useEffect, useState } from 'react'
import SourceLine from '../components/SourceLine'
import { FM2_TARGET_NOTE, SRC, type Source } from '../lib/sources'

// Exposed as an end-of-2026 horizon, not as a NASA launch date.
const HORIZON = new Date('2026-12-31T23:59:59').getTime()

function Countdown() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])
  const ms = HORIZON - now
  if (ms <= 0) return <p style={{ color: 'var(--amber)' }}>The end-of-2026 horizon has passed. See NASA for FM2’s current status.</p>
  const s = Math.floor(ms / 1000)
  const parts: [number, string][] = [[Math.floor(s / 86400), 'days'], [Math.floor((s % 86400) / 3600), 'hours'], [Math.floor((s % 3600) / 60), 'minutes'], [s % 60, 'seconds']]
  return (
    <div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {parts.map(([n, l]) => (
          <div key={l} className="card" style={{ padding: '12px 18px', minWidth: 90, textAlign: 'center' }}>
            <div className="stat" style={{ fontSize: 34 }}>{String(n).padStart(2, '0')}</div>
            <div className="mono muted" style={{ fontSize: 11 }}>{l}</div>
          </div>
        ))}
      </div>
      <p className="mono" style={{ fontSize: 11, color: 'var(--amber)', marginTop: 10 }}>
        Counts down to Dec 31, 2026, the end of NASA’s “late 2026” target. This is NOT a launch date. Target: late 2026, exact date TBD by NASA.
      </p>
    </div>
  )
}

type Item = { year: string; title: string; body: string; src: Source[]; color: string; planned?: boolean }

const ITEMS: Item[] = [
  {
    year: '1967', title: 'Apollo 1', color: 'var(--red)',
    body: 'Launch-pad fire during a ground test. Astronauts Virgil Grissom, Edward White and Roger Chaffee died when fire swept through the Command Module. Because of the pure oxygen atmosphere, the fire spread quickly and ruptured the Command Module pressure vessel. NASA afterwards redesigned the Apollo spacecraft.',
    src: [SRC.apollo1],
  },
  {
    year: '1997', title: 'Mir Space Station fire', color: 'var(--orange)',
    body: 'On Feb. 24, 1997, a solid-fuel oxygen generator canister ignited in Mir’s Kvant-1 module, shooting a three-foot flame. The fire cut off access to one of two Soyuz escape vehicles and filled the station with smoke. The crew used three fire extinguishers and put it out with no damage to the station’s structure. NASA says the lessons learned were passed on to the design and operations of the International Space Station.',
    src: [SRC.mir],
  },
  {
    year: '2016 →', title: 'Saffire experiments', color: 'var(--cyan)',
    body: 'NASA deliberately burned material samples inside an uncrewed Cygnus cargo spacecraft after it left the ISS, to study how large fires grow in low gravity. The series ran Saffire-I through Saffire-VI.',
    src: [SRC.saffire, SRC.saffire6],
  },
  {
    year: 'Late 2026', title: 'FM2: planned', color: '#b9b5ff', planned: true,
    body: 'Flammability of Materials on the Moon (FM2) is described by NASA Glenn as the first combustion experiment to be performed on another planetary body, burning solid samples in lunar gravity. ' + FM2_TARGET_NOTE,
    src: [SRC.fm2],
  },
]

export default function Incidents() {
  return (
    <main className="page">
      <div className="eyebrow">Incidents Timeline</div>
      <h1 className="h1" style={{ fontSize: 'clamp(32px,4.5vw,56px)' }}>Fires that <span className="serif">shaped the rules</span></h1>
      <ol className="timeline">
        {ITEMS.map((it) => (
          <li key={it.year} style={{ ['--c' as string]: it.color }}>
            <div className="tl-dot" />
            <div className="card" style={{ borderStyle: it.planned ? 'dashed' : 'solid' }}>
              <div className="mono" style={{ color: it.color, fontSize: 13, letterSpacing: '.1em' }}>{it.year}{it.planned ? ' · PLANNED' : ''}</div>
              <h2 style={{ margin: '6px 0 10px', fontSize: 28, fontWeight: 500 }}>{it.title}</h2>
              <p style={{ margin: 0, color: 'var(--soft)', lineHeight: 1.7 }}>{it.body}</p>
              {it.src.map((s) => <SourceLine key={s.label} s={s} />)}
              {it.planned && <div style={{ marginTop: 18 }}><Countdown /></div>}
            </div>
          </li>
        ))}
      </ol>
    </main>
  )
}
