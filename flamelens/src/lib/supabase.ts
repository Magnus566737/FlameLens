import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// Only the public anon/publishable key belongs in the browser. Never use a service-role key here.
export const hasKey = Boolean(url && key)
export const supabase = hasKey ? createClient(url!, key!) : null

export type Paper = {
  ntrs_id: string
  title: string
  abstract: string | null
  year: number | null
  pdf_url: string | null
  related_investigations: string[] | null
}

export type Investigation = {
  id: string
  acronym: string
  full_name: string
  doi: string | null
  hardware: string | null
  pi_name: string | null
  period_start: number | null
  period_end: number | null
  o2_min: number | null
  o2_max: number | null
  pressure_min_atm: number | null
  pressure_max_atm: number | null
  fuels: string[] | null
  mission_tags: string[] | null
  objectives: string | null
  key_finding: string | null
  psi_url: string | null
  status: string | null
}

export type Material = {
  id: string
  name: string
  o2_extinction_1g: number | null
  o2_extinction_microgravity: number | null
  o2_margin_of_safety: number | null
  spread_rate_cms: number | null
  co_production_ppm: number | null
  microgravity_behavior: string | null
  iss_verdict: string | null
  lunar_verdict: string | null
  source: string | null
}

export type Verdict = 'safe' | 'caution' | 'danger' | 'unknown'

/** Classify free-text verdicts like "APPROVED — ...", "HIGH RISK — ..." into a colour class. */
export function classifyVerdict(v: string | null): Verdict {
  if (!v) return 'unknown'
  const s = v.toUpperCase()
  if (/(PROHIBITED|HIGH RISK|RISKY|DANGER|UNSAFE)/.test(s)) return 'danger'
  if (/(CONDITIONAL|RESTRICTED|CAUTION|BORDERLINE|MONITOR)/.test(s)) return 'caution'
  if (/(APPROVED|LIKELY SAFE|^SAFE|SAFE AT|\bSAFE\b)/.test(s)) return 'safe'
  return 'unknown'
}

export async function countRows(table: string): Promise<number | null> {
  if (!supabase) return null
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
  return error ? null : count
}
