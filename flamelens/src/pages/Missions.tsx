import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SourceLine from '../components/SourceLine'
import { supabase, type Investigation } from '../lib/supabase'
import { FM2_TARGET_NOTE, SRC } from '../lib/sources'

type Tab = 'iss' | 'moon' | 'mars'

export default function Missions() {
  const [tab, setTab] = useState<Tab>('iss')
  const [inv, setInv] = useState<Investigation[]>([])

  useEffect(() => {
    if (!supabase) return
    supabase.from('investigations').select('id,acronym,full_name,hardware,period_start,period_end,status').contains('mission_tags', ['ISS']).order('id')
      .then(({ data }) => setInv((data ?? []) as Investigation[]))
  }, [])

  const tabs: [Tab, string][] = [['iss', 'ISS Today'], ['moon', 'Lunar Base'], ['mars', 'Mars Habitat']]

  return (
    <main className="page">
      <div className="eyebrow">Mission Scenarios</div>
      <h1 className="h1" style={{ fontSize: 'clamp(32px,4.5vw,56px)' }}>Where fire data <span className="serif">exists, and where it doesn’t</span></h1>
      <div style={{ display: 'flex', gap: 8, margin: '24px 0' }} role="tablist">
        {tabs.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className="btn" style={{ cursor: 'pointer', borderColor: tab === k ? 'var(--violet)' : undefined, background: tab === k ? 'rgba(108,99,255,.2)' : undefined }}>{label}</button>
        ))}
      </div>

      {tab === 'iss' && (
        <section>
          <div className="card" style={{ borderColor: 'var(--amber)' }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <div><div className="mono muted" style={{ fontSize: 11 }}>O₂</div><div className="stat">21%</div></div>
              <div><div className="mono muted" style={{ fontSize: 11 }}>PRESSURE</div><div className="stat">14.7 <span style={{ fontSize: 18 }}>psia</span></div></div>
              <div><div className="mono muted" style={{ fontSize: 11 }}>GRAVITY</div><div className="stat">0 g</div></div>
              <span className="badge" style={{ color: 'var(--amber)', borderColor: 'var(--amber)', fontSize: 14, padding: '6px 14px' }}>CAUTION</span>
            </div>
            <p style={{ color: 'var(--soft)', lineHeight: 1.6 }}>
              The ISS atmosphere is nominally air. Its documented maximum is 24.1% O₂ by volume. The CAUTION rating applies the team’s O₂-above-air rule from the Fire Risk Calculator.
            </p>
            <SourceLine s={SRC.iss24} />
            <SourceLine s={SRC.std6001b} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 500, margin: '32px 0 14px' }}>Investigations flown on the ISS</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {inv.map((i) => (
              <Link key={i.id} to="/experiments" className="card" style={{ display: 'block' }}>
                <div style={{ fontSize: 18, fontWeight: 500 }}>{i.acronym}</div>
                <div className="muted" style={{ fontSize: 13 }}>{i.full_name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {tab === 'moon' && (
        <GapCard
          title="Lunar base: DATA GAP"
          body={
            <>
              <p>No combustion experiment has been performed on the Moon. NASA’s FM2 (Flammability of Materials on the Moon) will be the first on another planetary body. {FM2_TARGET_NOTE}</p>
              <p>Until FM2 results are published, lunar fire-safety parameters are unknown: not estimated, not extrapolated.</p>
              <p className="muted" style={{ fontSize: 14 }}>Ground-based partial-gravity simulations exist (for example NASA Glenn drop-tower centrifuge tests at lunar gravity), but they are not on-Moon measurements and this site draws no atmosphere numbers from them.</p>
            </>
          }
        />
      )}

      {tab === 'mars' && (
        <GapCard
          title="Mars habitat: DATA GAP"
          body={
            <>
              <p>No combustion experiment has been performed on Mars, and this library holds no verified Mars-gravity (0.38 g) data. Every fire-safety number for a Mars habitat is currently unknown.</p>
            </>
          }
        />
      )}
    </main>
  )
}

function GapCard({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <section className="card" style={{ borderColor: '#b9b5ff', borderStyle: 'dashed' }}>
      <span className="badge" style={{ color: '#b9b5ff', borderColor: '#b9b5ff', fontSize: 14, padding: '6px 14px' }}>⚠ NO DATA</span>
      <h2 style={{ fontSize: 28, fontWeight: 500, margin: '16px 0 10px' }}>{title}</h2>
      <div style={{ color: 'var(--soft)', lineHeight: 1.7, maxWidth: 720 }}>{body}</div>
      <SourceLine s={SRC.fm2} />
    </section>
  )
}
