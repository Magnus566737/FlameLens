import { useRef, useState } from 'react'
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

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined
const GROQ_MODEL = 'qwen/qwen3.8-27b'
const LOG = '[FlameLens]'
// Never logs the key itself, only whether it was found.
console.info(`${LOG} VITE_GROQ_API_KEY ${GROQ_KEY ? `loaded (${GROQ_KEY.length} chars)` : 'NOT FOUND: restart the dev server after editing .env.local'}`)

/** Ask the model (via Groq) to answer from the retrieved abstracts only. Throws on any failure so the caller can fall back. */
async function askGroq(question: string, papers: Scored[]): Promise<string> {
  if (!GROQ_KEY) throw new Error('VITE_GROQ_API_KEY is not set')
  const abstracts = papers
    .map((p, i) => `Paper ${i + 1} [${p.ntrs_id}]: "${p.title}" (${p.year ?? 'n.d.'})\n${(p.abstract ?? '').slice(0, 1500)}`)
    .join('\n\n')
  const prompt = [
    'You are FlameLens, a NASA space fire safety super intelligence.',
    `Based ONLY on these NASA paper abstracts, answer: ${question}`,
    `Abstracts:\n${abstracts}`,
    'Be specific, cite which paper supports each point (use the paper ID, e.g. [20150023456]).',
    'Keep answer under 150 words.',
    'Do not use asterisks, bold, or any markdown formatting. Plain text only.',
    'Format your answer as 3-4 short bullet points, each starting with a dash (-). Keep each point under 2 sentences.',
  ].join('\n')
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 20000)
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({ model: GROQ_MODEL, messages: [{ role: 'user', content: prompt }], max_tokens: 300 }),
      signal: ctrl.signal,
    })
    const raw = await res.text()
    console.info(`${LOG} Groq HTTP ${res.status}`, raw.slice(0, 1500))
    if (!res.ok) throw new Error(`Groq HTTP ${res.status}: ${raw.slice(0, 300)}`)
    const data = JSON.parse(raw)
    const content: string | undefined = data?.choices?.[0]?.message?.content
    // Some reasoning models wrap their thinking in <think> tags; show only the answer.
    const text = content?.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
    if (!text) throw new Error(`empty answer (finish_reason: ${data?.choices?.[0]?.finish_reason ?? 'unknown'})`)
    return text
  } finally {
    clearTimeout(timer)
  }
}

const EXAMPLES = ['which materials are safest on the Moon?', 'what happens to flames at low oxygen?', 'how do cool flames behave in microgravity?', 'smoke detection in spacecraft']

export default function Ask() {
  const [input, setInput] = useState('')
  const [asked, setAsked] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [papers, setPapers] = useState<Scored[]>([])
  const [terms, setTerms] = useState<string[]>([])
  const [ai, setAi] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const reqId = useRef(0)

  async function ask(question: string) {
    const q = question.trim()
    if (!q || !supabase) return
    setInput(q); setAsked(q); setLoading(true); setError(null); setAi(null); setAiLoading(false)
    const id = ++reqId.current
    const t = keywords(q)
    setTerms(t)
    if (t.length === 0) { setPapers([]); setLoading(false); return }
    const filter = t.flatMap((w) => [`title.ilike.%${w}%`, `abstract.ilike.%${w}%`]).join(',')
    const { data, error } = await supabase.from('ntrs_papers').select('ntrs_id,title,abstract,year,pdf_url,related_investigations').or(filter).limit(300)
    setLoading(false)
    if (error) { setError(error.message); setPapers([]); return }
    const ranked = rank((data ?? []) as Paper[], t)
    setPapers(ranked)
    // Model answer on top of the retrieved papers. Any failure silently keeps the keyword summary.
    if (ranked.length > 0 && GROQ_KEY) {
      setAiLoading(true)
      askGroq(q, ranked)
        .then((text) => { if (id === reqId.current) setAi(text) })
        .catch((err) => { console.error(`${LOG} AI answer failed, using keyword fallback:`, err) })
        .finally(() => { if (id === reqId.current) setAiLoading(false) })
    }
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
      <p className="lead">SI-Powered answers from 191 NASA papers using Groq AI.</p>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
              <span className="eyebrow" style={{ color: 'var(--cyan)' }}>Answer</span>
              {ai && <span className="si-badge">✦ Super Intelligence</span>}
            </div>
            {aiLoading && <p className="muted" style={{ margin: 0 }}>Reading the papers…</p>}
            {!aiLoading && ai && (
              <>
                <p style={{ margin: 0, color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{ai}</p>
                <p className="muted mono" style={{ fontSize: 11, margin: '14px 0 0' }}>AI-generated from the abstracts of the papers listed under Sources. Check the papers before relying on it.</p>
              </>
            )}
            {!aiLoading && !ai && (summary.length > 0 ? (
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
            ))}
          </section>

          {papers.length > 0 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 500, margin: '8px 0 14px' }}>{ai ? 'Sources' : `Top ${papers.length} matching papers`}</h2>
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
