import { NavLink, Outlet } from 'react-router-dom'
import { hasKey } from '../lib/supabase'

const items = [
  { to: '/', label: 'Home', end: true },
  { to: '/library', label: 'Research Library' },
  { to: '/experiments', label: 'Experiments' },
  { to: '/materials', label: 'Materials' },
  { to: '/moon-gap', label: 'Moon Base Gap' },
  { to: '/ask', label: 'Ask FlameLens' },
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

export default function Layout() {
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
            {items.map((i) => (
              <NavLink key={i.to} to={i.to} end={i.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                {i.label}
              </NavLink>
            ))}
          </div>
          <NavLink to="/library" className="cta">Explore Research →</NavLink>
        </nav>
      </header>
      <div className="mobile-links">
        {items.map((i) => (
          <NavLink key={i.to} to={i.to} end={i.end}>{i.label}</NavLink>
        ))}
      </div>
      <Outlet />
    </>
  )
}
