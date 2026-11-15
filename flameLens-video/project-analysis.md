# FlameLens: Project Analysis

Prepared before any scripting, from the project's actual source. Nothing here is recorded, rendered or installed yet.
Method follows the `/brag` Step 1 rubric (github.com/latent-spaces/brag, `skills/brag/references/step-1-inspect.md`), extended for a 7-minute explainer.

**Audience:** NASA Space Apps Challenge judges. **Tone:** polished, cinematic, scientific. **Output:** `flameLens-video/FlameLens-Project-Explainer.mp4`.

---

## 1. What was read

| Area | Files |
|---|---|
| App shell, routing, nav | `flamelens/src/App.tsx`, `components/Layout.tsx` |
| Pages (11) | `pages/Home, Library, Experiments, Materials, MoonGap, RiskCalculator, Missions, CoolFlame, Incidents, Ask, About.tsx` |
| Shared components | `components/Earth3D, MaterialsTable, MoonGapChart, SourceLine.tsx` |
| Data layer + sources | `lib/supabase.ts`, `lib/sources.ts` |
| Styling | `src/index.css`, `index.html` (fonts) |
| Database | `schema.sql`, `flamelens/policies.sql`, live row counts via the public API |
| Data loading | `populate.py` / `populate_complete.py`, `ntrs_bulk.py`, `nasa_pages.py` |
| Design reference | `FlameLens.html` (hero design the site follows) |

Not read, by design: `.env.local` values. Keys never go into any video file.
Note: `flamelens/README.md` is still the default Vite template, so there is no project README to quote.

## 2. The nine-question rubric

1. **What is the app?** A web app that gathers NASA combustion and spacecraft fire-safety research in one place, and states plainly where data does not exist (Moon and Mars gravity).
2. **Most impressive claim:** "No combustion experiment has been performed on the Moon or Mars. NASA's FM2 is planned to be the first on another planetary body." (Gravity Gap and Missions pages.)
3. **Visual hook:** The 3D Earth with the orbit ring on Home, and the red dashed "NO DATA" box at 0.166 g on the Gravity Gap chart.
4. **Strongest real UI:** Ask FlameLens (question → five source papers → answer), the Risk Calculator (sliders → rule cards with citations), the Gravity Gap chart.
5. **Shortest satisfying video:** Not applicable: the brief is 7 minutes.
6. **Tone:** polished, cinematic, scientific (restrained, long holds, no jokes).
7. **Audio feel:** Calm music bed under local AI narration, light SFX only for UI interactions.
8. **Share caption:** "FlameLens: NASA fire-safety research in one place, and an honest map of what is still unknown at lunar gravity."
9. **User flow:** Home → ask a question → read sources and answer → check an environment in the Risk Calculator → see the Moon gap.

## 3. Architecture (as built)

```
NASA NTRS API ──┐
NASA web pages ─┼─ Python scripts (ntrs_bulk.py, nasa_pages.py, populate*.py)
Typed source data┘                │ insert via Supabase REST (service role, run locally)
                                  ▼
                       Supabase Postgres (project oqebnhtzxxivulgropnh)
                       tables: investigations, materials, flex_tests, bass_ii_tests,
                               ntrs_papers, taskbook_projects
                                  │ read with the public (anon) key from the browser
                                  ▼
          React 19 + TypeScript + Vite single-page app (HashRouter)
          ├─ Three.js Earth (NASA Blue Marble textures from unpkg)
          ├─ Ask FlameLens: keyword retrieval → Groq (qwen/qwen3.8-27b) → answer
          └─ Source-cited rule engine (Risk Calculator), static timeline (Incidents)
```

- **No custom backend.** The browser talks to Supabase directly. The Groq call also runs from the browser.
- **Styling is plain CSS**, not Tailwind. Fonts: Geist, Geist Mono, Instrument Serif.
- **Stack:** react 19, react-dom 19, react-router-dom 7, three 0.187, @supabase/supabase-js 2; build: Vite 8, TypeScript.
- **Vector search is not used.** `schema.sql` defines `embedding vector(1536)` columns and a `search_research` function. Nothing in the app calls it and no embeddings are populated. Retrieval is `ilike` keyword matching, ranked in the browser.

## 4. Feature inventory

| Route | What it does (verified in code) | Data source |
|---|---|---|
| `/` Home | Earth3D hero, three live counts, link card to Cool Flame | counts from Supabase |
| `/research` | Search titles and abstracts, 20 per page, "read more", link to NTRS | `ntrs_papers` |
| `/experiments` | Cards with acronym, full name, status badge (complete/active), PI, hardware, period, O₂ and pressure ranges, fuels, DOI; status filter | `investigations` |
| `/materials` | Table of 5 materials, ISS and Lunar verdicts colour-coded (green/amber/red/grey); disclaimer: "BASS-II values cover 0g ISS conditions. Lunar surface (1/6g) data pending FM2 mission." | `materials` |
| `/gravity-gap` | SVG chart at 0 g, 0.166 g, 1 g; red dashed "NO DATA, FM2 not yet flown" at 0.166 g; per-material selector | `materials` |
| `/risk-calculator` | Sliders (O₂ 10-40%, pressure 4-20 psia), gravity and ventilation buttons; result SAFE/CAUTION/WARNING/UNKNOWN with rule cards and source lines | rules in `RiskCalculator.tsx`, citations in `lib/sources.ts` |
| `/missions` | Tabs ISS / Lunar / Mars; ISS tab lists investigations tagged ISS; Lunar and Mars tabs say NO DATA | `investigations` |
| `/cool-flame` | 10-second animation (flame → disappears → violet glow), play/pause/restart, progress bar, three info cards; labelled "Illustration only" | static, source: NASA ISS Science Blog |
| `/incidents` | Timeline: Apollo 1 (1967), Mir (1997), Saffire (2016 →), FM2 (planned) with a countdown to Dec 31 2026 labelled "NOT a launch date" | static, cited |
| `/ask` | Keyword search → rank top 5 → Groq `qwen/qwen3.8-27b` answers "based ONLY on these abstracts", bullet format; sources listed below; fallback to quoted sentences; shows materials table for material questions and the gap chart for oxygen questions | `ntrs_papers` + Groq |
| `/about` | Challenge, data, gap, team, stack, sources (counts are live) | live counts |

Navigation: Home | Explore ▾ | Safety ▾ | Research ▾ | Ask FlameLens | About (click-to-open dropdowns).

## 5. Data (live counts, checked today)

- `ntrs_papers`: **191** rows = **178** NTRS records + **13** NASA web pages (IDs `NASA-…`); years 1967–2026.
- `investigations`: **24** (22 complete, 2 active). `materials`: **5**. `taskbook_projects`: **9** (not shown in the app).
- Experiments and Materials content comes from `populate_complete.py`. Earlier in this project I could not independently verify several of its values (for example a 13.6% microgravity O₂ limit for PMMA, which I found in no NASA source). You have since stated all data is verified. This video therefore **does not read out any individual investigation or material number**; it shows the pages and speaks only about structure and the cited findings. If you want specific figures narrated, send me the source for each.

## 6. Visual identity (to preserve)

Background `#050711`; text `#F5F7FF`; violet `#6C63FF`; cyan `#35B8FF`; orange `#FF7138`; muted `#6B7390`; panel `#0A1020`.
Display: Geist 500, tight tracking; accent serif italic: Instrument Serif (e.g. "Protecting the Future."); mono labels: Geist Mono, uppercase, wide tracking.
Logo: orbit-ring mark (circle, tilted violet ellipse, cyan inner ring, orange core) + "FlameLens". Nav is a floating glass pill.

## 7. Claims register (what the narration may say)

| Claim | Source | Status |
|---|---|---|
| Apollo 1 fire, Jan 27 1967; Grissom, White, Chaffee died; pure-oxygen atmosphere made it spread fast | NASA SMA Apollo 1 case study (fetched) | verified |
| Mir fire Feb 24 1997: solid-fuel oxygen generator canister, Kvant-1 module, three-foot flame; six crew aboard; three extinguishers used; no structural damage | NASA History "25 Years Ago: Fire Aboard Space Station Mir" (fetched) | verified |
| NASA calls fire a catastrophic hazard for crewed spacecraft | NASA Glenn Combustion Science page (fetched) | verified |
| Saffire burned samples in an uncrewed Cygnus after it left the ISS; Saffire-I through VI exist | NTRS 20180005168, 20240002981, Saffire-I coverage | verified |
| FM2 is the first combustion experiment on another planetary body; target late 2026 | NASA Glenn page; NTRS 20260000646 (LPSC 2026) | verified; exact date unknown, may have slipped |
| No combustion experiment has been performed on the Moon or Mars | follows from the FM2 statement | verified wording |
| Ground simulations of lunar gravity exist (drop-tower centrifuge) | NASA Glenn page photo caption | verified |
| ISS atmosphere is nominally air, max O₂ 24.1% by volume | NTRS 20070018178 | verified |
| FLEX (2012) saw droplets burn after the visible flame went out; too faint to see | NASA ISS Science Blog 2013 | verified |
| Cool flames produce carbon monoxide | secondary coverage only | **omit** |
| Standard detectors miss cool flames | no source found | **omit** |
| NASA-STD-6001B and JSC-29353B as rule citations | not confirmed to contain the stated limits | show as the app does ("citation not verified") or omit |
| App features, counts, stack | this codebase and live database | verified |
| "Read-only" database access for the public key | `policies.sql` intends it; not confirmed in the live project | **do not claim**; say "public key" |

## 8. Things the video must not do

- Show or read any key, token, `.env` file, DevTools console, or the Supabase project URL.
- Call Ask FlameLens "semantic" or "vector" search.
- Present the cool-flame animation as footage or measured data.
- Give a launch date for FM2, or say it has launched.
- Read out unverified numbers or the "unverified" citations as facts.
- Use stock footage in place of the app.

## 9. Recording risks and mitigations

- **Live dependencies:** Supabase and Groq must both respond. Mitigation: dry-run each take; the app falls back silently if Groq fails, so check that the "✦ Super Intelligence" badge appears on every Ask take.
- **Groq key is in the browser bundle.** Mitigation: capture the viewport only (no DevTools, no source view); never navigate to a Vite error overlay; run from a built copy (`vite build` + local static server), not the dev server.
- **Hover/animation timing** (Three.js Earth, flame animation): capture at real time at 1920×1080 and 30 fps.
- **AI answers vary per run.** Mitigation: record two takes, choose the more accurate one, and verify it against its sources before keeping it.
- **Windows tooling:** FFmpeg not on PATH; Playwright not installed. Both approved for install. Hyperframes needs Node 22+ (Node 24 present).

## 10. Open items for your review

1. Approve the narration script and storyboard.
2. Music: the five bundled tracks are titled "Happy Beats / Business Moves" and may sound brighter than "cinematic scientific". I will audition them against the cue files after install and tell you honestly if they don't fit; fallback is music you supply.
3. Voice: I will render the same 20 seconds in three Kokoro voices and pick the most natural; you can override.
4. FM2 wording ("target: late 2026") should be re-checked against NASA's current schedule on the day of final render.
