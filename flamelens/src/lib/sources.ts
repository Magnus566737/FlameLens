// Every external claim on the new pages points at one of these. `verified` means the claim text was
// checked against the linked page; unverified citations are shown as such on the site.
export type Source = { label: string; url?: string; verified: boolean }

export const SRC = {
  iss24: {
    label: 'NASA NTRS 20070018178 — ISS atmosphere is nominally air, maximum O₂ 24.1% by volume',
    url: 'https://ntrs.nasa.gov/citations/20070018178',
    verified: true,
  },
  std6001b: {
    label: 'NASA-STD-6001B (rule threshold supplied by the team; not yet checked against the standard text)',
    url: 'https://standards.nasa.gov/standard/NASA/NASA-STD-6001',
    verified: false,
  },
  jsc29353b: {
    label: 'JSC-29353B (flammability configuration analysis handbook; the specific limit is not confirmed to appear in it)',
    url: 'https://standards.nasa.gov/standard/JSC/JSC-29353',
    verified: false,
  },
  bass2: {
    label: 'BASS-II results: NTRS 20210011385 summary and Scientific Reports 2017 (s41598-017-18398-4) — in microgravity flames spread at lower O₂ (17%) than in normal gravity (18%)',
    url: 'https://link.springer.com/10.1038/s41598-017-18398-4',
    verified: true,
  },
  fm2: {
    label: 'NASA Glenn Combustion Science: FM2 is the first combustion experiment on another planetary body; target late 2026 per NASA LPSC 2026 paper (NTRS 20260000646)',
    url: 'https://ntrs.nasa.gov/citations/20260000646',
    verified: true,
  },
  flex: {
    label: 'NASA ISS Science Blog, "Cool Flames on the International Space Station — An Anatomy of Discovery" (2013)',
    url: 'https://blogs.nasa.gov/ISS_Science_Blog/2013/11/25/cool-flames-on-the-international-space-station-an-anatomy-of-discovery/',
    verified: true,
  },
  mir: {
    label: 'NASA History: "25 Years Ago: Fire Aboard Space Station Mir"',
    url: 'https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/',
    verified: true,
  },
  apollo1: {
    label: 'NASA SMA Apollo 1 case study',
    url: 'https://sma.nasa.gov/sma-disciplines/accllp/apollo-1',
    verified: true,
  },
  saffire: {
    label: 'NASA NTRS 20180005168 — Saffire: spacecraft fire safety experiments',
    url: 'https://ntrs.nasa.gov/citations/20180005168',
    verified: true,
  },
  saffire6: {
    label: 'NASA NTRS 20240002981 — Preliminary Results from the Saffire VI Experiment',
    url: 'https://ntrs.nasa.gov/citations/20240002981',
    verified: true,
  },
} satisfies Record<string, Source>

export const FM2_TARGET_NOTE =
  'NASA’s published target is “late 2026”. No exact date was found. Check NASA for the current schedule.'
