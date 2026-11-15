import { useEffect, useState } from 'react'
import { countRows, supabase } from '../lib/supabase'

export default function About() {
  const [exps, setExps] = useState<number | null>(null)
  const [ntrs, setNtrs] = useState<number | null>(null)
  const [web, setWeb] = useState<number | null>(null)

  useEffect(() => {
    countRows('investigations').then(setExps)
    if (!supabase) return
    supabase.from('ntrs_papers').select('*', { count: 'exact', head: true }).not('ntrs_id', 'like', 'NASA-%').then(({ count }) => setNtrs(count))
    supabase.from('ntrs_papers').select('*', { count: 'exact', head: true }).like('ntrs_id', 'NASA-%').then(({ count }) => setWeb(count))
  }, [])
  const f = (n: number | null) => (n === null ? '…' : n)

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="card" style={{ marginBottom: 16 }}>
      <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 500 }}>{title}</h2>
      <div style={{ color: 'var(--soft)', lineHeight: 1.7 }}>{children}</div>
    </section>
  )

  return (
    <main className="page" style={{ maxWidth: 860 }}>
      <div className="eyebrow">About</div>
      <h1 className="h1" style={{ fontSize: 'clamp(32px,4.5vw,56px)' }}>About <span className="serif">FlameLens</span></h1>

      <Section title="The Challenge">NASA Space Apps Challenge 2026: <em>Flame in Freefall</em>.</Section>

      <Section title="The Data">
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>{f(exps)} combustion investigation records, compiled from NASA’s Physical Sciences Informatics (PSI) repository. Individual values are still being checked against the originals.</li>
          <li>{f(ntrs)} papers from the NASA Technical Reports Server (NTRS), plus {f(web)} NASA web pages (history, spinoff and combustion-science pages). Individual NTRS records carry their own copyright notices.</li>
        </ul>
      </Section>

      <Section title="The Gap">
        No combustion experiment has been performed on the Moon or Mars. NASA’s FM2 is planned to be the first on another planetary body, with a target of late 2026.
      </Section>

      <Section title="The Team">
        Team FlameLens, Karachi — NASA Space Apps Challenge 2026.
        <ul style={{ margin: '10px 0 0', paddingLeft: 20 }}>
          <li>Muhammad Umar (@umar67)</li>
          <li>Sheikh Talha (@sheikh_talha)</li>
          <li>Muhammad Hasan (@hasan0120)</li>
        </ul>
      </Section>

      <Section title="Tech Stack">React, Vite, TypeScript, Three.js, Supabase (Postgres, with the pgvector extension enabled).</Section>

      <Section title="Data Sources">
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><a href="https://psi.nasa.gov/physci/repo/" target="_blank" rel="noreferrer">NASA PSI</a></li>
          <li><a href="https://ntrs.nasa.gov/" target="_blank" rel="noreferrer">NASA NTRS</a></li>
          <li><a href="https://standards.nasa.gov/standard/NASA/NASA-STD-6001" target="_blank" rel="noreferrer">NASA-STD-6001B</a></li>
          <li><a href="https://standards.nasa.gov/standard/JSC/JSC-29353" target="_blank" rel="noreferrer">JSC-29353B</a></li>
        </ul>
      </Section>
    </main>
  )
}
