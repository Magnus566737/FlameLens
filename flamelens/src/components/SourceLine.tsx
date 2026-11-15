import type { Source } from '../lib/sources'

export default function SourceLine({ s }: { s: Source }) {
  return (
    <p className="mono" style={{ fontSize: 11, margin: '10px 0 0', color: 'var(--muted)', lineHeight: 1.5 }}>
      Source: {s.url ? <a href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)' }}>{s.label} ↗</a> : s.label}
      {!s.verified && <span style={{ color: 'var(--amber)' }}> · citation not independently verified</span>}
    </p>
  )
}
