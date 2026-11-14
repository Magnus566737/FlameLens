import { useState } from 'react'
import { ConfigNotice } from '../components/Layout'
import MaterialsTable from '../components/MaterialsTable'
import MoonGapChart from '../components/MoonGapChart'
import { supabase, type Paper } from '../lib/supabase'

const STOP = new Set(('a an the and or of to in on at for from with without by is are was were be been being do does did what which who whom how why when where ' +
  'can could should would will shall may might must it its this that these those there their them they we you i me my our your about into over under than then so as if ' +
  'not no yes any some most more less very much many tell show give find explain happen happens happened safest safe best').split(' '))

const SYNONYMS: Record<string, string[]> = {
  moon: ['moon', 'lunar'],
  lunar: ['lunar', 'moon'],
  oxygen: ['oxygen'],
  fire: ['fire', 'flame'],
  flames: ['flame'],
}

const MATERIAL_WORDS: Record<string, string> = {
  pmma: 'pmma', acrylic: 'pmma', plexiglass: 'pmma', plexiglas: 'pmma',
  nomex: 'nomex', aramid: 'nomex',
  cotton: 'cotton_fg', fiberglass: 'cotton_fg', sibal: 'cotton_fg',
  ultem: 'ultem', polyetherimide: 'ultem',
  cellulose: 'cellulose', paper: 'cellulose', cardboard: 'cellulose',
}

function keywords(q: string): string[] {
  const words = q.toLowerCase().replace(/[^a-z0-9₂\s-]/g, ' ').split(/\s+/).filter(Boolean)
  const out = new Set<string>()
  for (const w of words) {
    if (STOP.has(w) || w.length < 3) continue
    const base = w.length > 4 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w
    ;(SYNONYMS[base] ?? SYNONYMS[w] ?? [base]).forEach((t) => out.add(t))
  }
  return [...out].slice(0, 8)
}

function countHits(text: string, term: string) {
  return text.toLowerCase().split(term).length - 1
}

type Scored = Paper & { score: number }

function rank(papers: Paper[], terms: string[]): Scored[] {
  return papers
    .map((p) => {
      let score = 0
      for (const t of terms) {
        score += countHits(p.title, t) > 0 ? 3 : 0
        score += Math.min(countHits(p.abstract ?? '', t), 3)
      }
      return { ...p, score }
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score || (b.year ?? 0) - (a.year ?? 0))
    .slice(0, 5)
}

/** Extractive summary: the sentences from the top papers that mention the most question terms. */
function summarize(papers: Scored[], terms: string[]) {
  const cands: { s: string; id: string; score: number }[] = []
  papers.forEach((p, rankIdx) => {
    ;(p.abstract ?? '').split(/(?<=[.!?])\s+/).forEach((s) => {
      const clean = s.trim()
      if (clean.length < 40 || clean.length > 320) return
      const score = terms.reduce((n, t) => n + (countHits(clean, t) > 0 ? 1 : 0), 0) - rankIdx * 0.1
      if (score > 0) cands.push({ s: clean, id: p.ntrs_id, score })
    })
  })
  const seen = new Set<string>()
  return cands
    .sort((a, b) => b.score - a.score)
    .filter((c) => (seen.has(c.s) ? false : (seen.add(c.s), true)))
    .slice(0, 3)
}

const EXAMPLES = ['which materials are safest on the Moon?', 'what happens to flames at low oxygen?', 'how do cool flames behave in microgravity?', 'smoke detection in spacecraft']

export default function Ask() {
  const [input, setInput] = useState('')
  const [asked, setAsked] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [papers, setPapers] = useState<Scored[]>([])
  const [terms, setTerms] = useState<string[]>([])

  async function ask(question: string) {
    const q = question.trim()
    if (!q || !supabase) return
    setInput(q); setAsked(q); setLoading(true); setError(null)
    const t = keywords(q)
    setTerms(t)
    if (t.length === 0) { setPapers([]); setLoading(false); return }
    const filter = t.flatMap((w) => [`title.ilike.%${w}%`, `abstract.ilike.%${w}%`]).join(',')
    const { data, error } = await supabase.from('ntrs_papers').select('ntrs_id,title,abstract,year,pdf_url,related_investigations').or(filter).limit(300)
    setLoading(false)
    if (error) { setError(error.message); setPapers([]); return }
    setPapers(rank((data ?? []) as Paper[], t))
  }

  const lower = asked.toLowerCase()
  const namedMats = [...new Set(Object.entries(MATERIAL_WORDS).filter(([w]) => lower.includes(w)).map(([, id]) => id))]
  const wantsMaterials = namedMats.length > 0 || /material|fabric|plastic|flammab|safest|safe\b/.test(lower)
  const wantsOxygen = /oxygen|\bo2\b|o₂|extinction|extinguish/.test(lower)
  const summary = summarize(papers, terms)

  return (
    <main className="page">
      <div className="eyebrow">Ask FlameLens</div>
      <h1 className="h1" style={{ fontSize: 'clamp(32px,4.5vw,56px)' }}>Ask about fire in <span className="serif">space</span></h1>
      <p className="lead">Search 191 NASA papers in plain language. Answers are built from the papers themselves, not generated.</p>
      <ConfigNotice />
      <form onSubmit={(e) => { e.preventDefault(); ask(input) }} style={{ display: 'flex', gap: 10, maxWidth: 720, margin: '20px 0 12px' }}>
        <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. which materials are safest on the Moon?" aria-label="Your question" />
        <button className="btn primary" type="submit" disabled={loading || !supabase} style={{ cursor: 'pointer' }}>{loading ? '…' : 'Ask'}</button>
      </form>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {EXAMPLES.map((ex) => (
          <button key={ex} onClick={() => ask(ex)} className="btn" style={{ padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>{ex}</button>
        ))}
      </div>

      {error && <div className="notice">Search failed: {error}</div>}

      {asked && !loading && !error && (
        <>
          <section className="card" style={{ borderColor: 'rgba(108,99,255,.45)', marginBottom: 24 }}>
            <div className="eyebrow" style={{ color: 'var(--cyan)', marginBottom: 10 }}>Answer</div>
            {summary.length > 0 ? (
              <>
                <p style={{ margin: '0 0 12px', color: 'var(--soft)', fontSize: 14 }}>
                  Across the {papers.length} closest papers, the most relevant statements are:
                </p>
                <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.65 }}>
                  {summary.map((c) => (
                    <li key={c.s} style={{ marginBottom: 8 }}>{c.s} <span className="tag">{c.id}</span></li>
                  ))}
                </ul>
                <p className="muted mono" style={{ fontSize: 11, margin: '14px 0 0' }}>Sentences are quoted from the paper abstracts below. Searched for: {terms.join(', ')}.</p>
              </>
            ) : (
              <p style={{ margin: 0, color: 'var(--soft)' }}>
                No papers in the library match {terms.length ? <>“{terms.join(', ')}”</> : 'that question'}. Try different or more specific terms, such as a material, an experiment name, or a phenomenon.
              </p>
            )}
          </section>

          {papers.length > 0 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 500, margin: '8px 0 14px' }}>Top {papers.length} matching papers</h2>
              <div className="grid" style={{ marginBottom: 36 }}>
                {papers.map((p) => (
                  <article key={p.ntrs_id} className="card">
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                      <span className="tag">{p.ntrs_id}</span>
                      {p.year && <span className="muted mono" style={{ fontSize: 12 }}>{p.year}</span>}
                      <span className="muted mono" style={{ fontSize: 11 }}>relevance {p.score}</span>
                    </div>
                    <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 500 }}>{p.title}</h3>
                    {p.abstract && <p style={{ margin: 0, color: 'var(--soft)', lineHeight: 1.6, fontSize: 14 }}>{p.abstract.length > 600 ? p.abstract.slice(0, 600) + '…' : p.abstract}</p>}
                    {p.pdf_url && <a href={p.pdf_url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 10, fontSize: 13, color: 'var(--cyan)' }}>View on NTRS ↗</a>}
                  </article>
                ))}
              </div>
            </>
          )}

          {wantsMaterials && (
            <section style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 22, fontWeight: 500, margin: '0 0 14px' }}>Related material data</h2>
              <MaterialsTable only={namedMats.length ? namedMats : undefined} />
            </section>
          )}

          {wantsOxygen && (
            <section>
              <h2 style={{ fontSize: 22, fontWeight: 500, margin: '0 0 14px' }}>Oxygen and the Moon Base gap</h2>
              <MoonGapChart />
            </section>
          )}
        </>
      )}
    </main>
  )
}
