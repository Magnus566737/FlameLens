import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { hasKey } from '../lib/supabase'

type Leaf = { to: string; label: string }
type Group = { label: string; items: Leaf[] }

const GROUPS: Group[] = [
  { label: 'Explore', items: [{ to: '/experiments', label: 'Investigations' }, { to: '/incidents', label: 'Incidents Timeline' }] },
  { label: 'Safety', items: [{ to: '/risk-calculator', label: 'Fire Risk Calculator' }, { to: '/materials', label: 'Materials' }, { to: '/missions', label: 'Mission Scenarios' }] },
  { label: 'Research', items: [{ to: '/research', label: 'Research Library' }, { to: '/cool-flame', label: 'Cool Flame' }, { to: '/gravity-gap', label: 'Gravity Gap' }] },
]

export function ConfigNotice() {
  if (hasKey) return null
  return (
    <div className="notice">
      <strong>Supabase anon key not set.</strong> Add your project's public anon key to <span className="mono">.env.local</span> as{' '}
      <span className="mono">VITE_SUPABASE_ANON_KEY</span> (Supabase dashboard → Settings → API), then restart the dev server.
    </div>
  )
}

function Dropdown({ g, onNavigate }: { g: Group; onNavigate?: () => void }) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const active = g.items.some((i) => pathname.startsWith(i.to))

  // Click/tap outside closes; so does Escape.
  useEffect(() => {
    if (!open) return
    const outside = (e: Event) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', esc) }
  }, [open])

  return (
    <div className="dd" ref={ref}>
      <button className={`dd-btn ${active ? 'active' : ''}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {g.label} <span aria-hidden style={{ fontSize: 10 }}>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="dd-menu" role="menu">
          {g.items.map((i) => (
            <Link key={i.to} to={i.to} role="menuitem" onClick={() => { setOpen(false); onNavigate?.() }}>{i.label}</Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const mobileRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMobileOpen(false), [pathname])
  useEffect(() => {
    if (!mobileOpen) return
    const outside = (e: Event) => { if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) setMobileOpen(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [mobileOpen])

  return (
    <>
      <div className="bg-fixed" />
      <div className="vignette" />
      <header className="nav-wrap">
        <nav className="nav">
          <NavLink to="/" className="brand" aria-label="FlameLens home">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12.5" stroke="rgba(245,247,255,0.28)" />
              <ellipse cx="14" cy="14" rx="12.5" ry="4.2" transform="rotate(-28 14 14)" stroke="#6C63FF" />
              <circle cx="14" cy="14" r="7" stroke="#35B8FF" opacity="0.55" />
              <circle cx="14" cy="14" r="3.6" fill="#FF7138" />
            </svg>
            FlameLens
          </NavLink>
          <div className="links">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
            {GROUPS.map((g) => <Dropdown key={g.label} g={g} />)}
            <NavLink to="/ask" className={({ isActive }) => (isActive ? 'active' : '')}>Ask FlameLens</NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About</NavLink>
          </div>
          <NavLink to="/research" className="cta">Explore Research →</NavLink>
          <div className="mobile-menu" ref={mobileRef}>
            <button className="menu-btn" aria-label="Menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen((o) => !o)}>{mobileOpen ? '✕' : '☰'}</button>
            {mobileOpen && (
              <div className="mobile-panel">
                <NavLink to="/" end>Home</NavLink>
                {GROUPS.map((g) => <Dropdown key={g.label} g={g} onNavigate={() => setMobileOpen(false)} />)}
                <NavLink to="/ask">Ask FlameLens</NavLink>
                <NavLink to="/about">About</NavLink>
              </div>
            )}
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  )
}
