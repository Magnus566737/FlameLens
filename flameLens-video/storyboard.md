# FlameLens: Timestamped Storyboard (draft for approval)

Format: landscape 1920×1080, 30 fps, about 7:00. Tone: polished, cinematic, scientific.
Follows `/brag` rules: show the real product, hold text long enough to read (short label ~0.8 s; sentence ~0.3 s per word), fast-in then hold, no generic SaaS language, no abstract filler.
All "REC" shots are captured from the real running app. Narration text is in `narration-script.md`; this file shows what is on screen.

Look: `#050711` space background, glass panels, violet `#6C63FF` / cyan `#35B8FF` / orange `#FF7138` accents, Geist + Instrument Serif italic + Geist Mono, orbit-ring logo. Lower-third source tags use the same mono style as the site's "Source:" lines.

---

## Scene table

| # | Time | Scene | On screen | Source of picture | Overlays and captions | Transition out | Audio |
|---|---|---|---|---|---|---|---|
| 1 | 0:00–0:05 | Cold open | Black. Earth rises slowly in the site's Earth3D, orbit ring draws in. Narration starts at 0:02. | REC: Home hero, 5 s slow capture | None (the logo is revealed in scene 6) | slow dissolve | Music fades in from silence; no SFX |
| 2 | 0:05–0:15 | Apollo 1 | Incidents page scrolled to the Apollo 1 card; card text highlights "pure oxygen atmosphere" | REC: `/incidents` | Lower third: "Apollo 1 · Jan 27, 1967" + source tag "NASA SMA Apollo 1 case study" | cut on beat | one low swell |
| 3 | 0:15–0:25 | Mir | Mir card; highlights "solid-fuel oxygen generator", "Kvant-1" | REC: `/incidents` | "Mir · Feb 24, 1997" + "NASA History" | hard cut to black, 0.3 s | music dips |
| 4 | 0:25–0:50 | Fire without gravity | Missions → ISS tab (investigations grid), then Incidents → Saffire card | REC: `/missions`, `/incidents` | Captions only; Saffire source tag "NTRS 20180005168" | push-in | bed continues |
| 5 | 0:50–1:05 | The gap | Gravity Gap page: chart draws 0 g (green) and 1 g (cyan), then the red dashed NO DATA box at 0.166 g pulses once | REC: `/gravity-gap` (select PMMA) | Mono label "0.166 g · MOON · NO DATA"; "FM2 · target: late 2026" | dissolve | one soft low note on the red box |
| 6 | 1:05–1:30 | Introducing FlameLens | Home full view; live counts 191 / 24 / 5 settle; nav dropdowns open (Explore, Safety, Research) | REC: `/` | Counts are the app's own; caption "191 documents · 24 investigations · 5 materials" | wipe left | music lifts slightly |
| 7 | 1:30–2:15 | Architecture diagram | Animated diagram built in HTML (not a screenshot): NTRS + NASA pages → Python scripts → Supabase → React (Three.js) → browser. Nodes light in sequence with the narration. | Composition graphic, drawn from `project-analysis.md` §3 | Node labels use real file names (`ntrs_bulk.py`, `nasa_pages.py`); no URLs, no keys | morph into live app | quiet UI ticks as each node lights |
| 8 | 2:15–2:40 | Research Library | Type "microgravity" into search; results list; click "Read more"; hover a "View on NTRS" link (do not click) | REC: `/research` | Caption: "Searches titles and abstracts" | cut | soft key sounds on typing |
| 9 | 2:40–3:00 | Experiments | Cards grid; click the "active" filter then "all"; pause on one card | REC: `/experiments` | Caption: "Complete or active · hardware · PI · O₂ and pressure ranges" (no values read aloud) | slide | quiet |
| 10 | 3:00–3:35 | Materials | Table fades in; slow pan across ISS and Lunar verdict columns; disclaimer note zooms to legible size and holds 4 s | REC: `/materials` | Disclaimer text shown verbatim, held ≥ 4 s | dissolve | steady |
| 11 | 3:35–3:50 | Ask: the question | Type "what happens to flames at low oxygen?"; press Ask | REC: `/ask` | Mono label "STEP 1 · KEYWORD SEARCH" | cut | typing SFX |
| 12 | 3:50–4:10 | Ask: retrieval and answer | "Reading the papers…" then the bullet answer with the "✦ Super Intelligence" badge; scroll to Sources | REC: `/ask` | Labels "STEP 2 · TOP 5 ABSTRACTS → GROQ / QWEN", "STEP 3 · ANSWER + SOURCES"; badge stays visible; AI-generated note held | push | rising bed |
| 13 | 4:10–4:30 | Ask: fallback + context | Second question "which materials are safest on the Moon?" → materials table appears under answer; scroll to the gap chart on an oxygen question | REC: `/ask` | Caption "Falls back to quoted sentences if the model is unavailable" (told, not shown) | wipe | steady |
| 14 | 4:30–4:55 | Risk Calculator | Drag O₂ above 21 → CAUTION card; drag above 24.1 at 14.7 psia → WARNING card with NTRS source; end on cursor over a source link (no click) | REC: `/risk-calculator` | Source line stays readable ≥ 3 s | dissolve | UI ticks on card appearance |
| 15 | 4:55–5:15 | Risk: unknown | Click 0.166 g → big "⚠ UNKNOWN" and the FM2 card | REC: `/risk-calculator` | Caption "No rating without data" | dissolve | one low swell |
| 16 | 5:15–5:40 | Cool flame | Page plays 10 s animation compressed to ~20 s of screen time: orange flame → gone → violet glow; progress bar; badge changes | REC: `/cool-flame` (real-time) | Persistent label "ILLUSTRATION ONLY" and source tag "NASA ISS Science Blog, 2013" | cut | tonal swell on the violet glow |
| 17 | 5:40–5:55 | Missions | Tabs ISS → Lunar → Mars; Lunar and Mars show NO DATA cards | REC: `/missions` | Caption "Lunar and Mars habitats: no data" | dissolve | quiet |
| 18 | 5:55–6:30 | Under the hood | Split screen: left, the Layout dropdown and `sources.ts` shown as a styled code excerpt (non-secret lines only); right, a bullet list built from real facts: React 19 · TypeScript · Vite · Three.js · Supabase · keyword search · vector column unused | Composition graphic from real code excerpts (no `.env`, no key variables) | Code excerpt limited to `lib/sources.ts` and a rule from `RiskCalculator.tsx` | dissolve | steady |
| 19 | 6:30–6:50 | Conclusion | Return to the Gravity Gap chart, then back out to the Earth; closing line set in Instrument Serif italic | REC: `/gravity-gap` + Home hero | Closing line shown as text, held 5 s | slow fade | music resolves |
| 20 | 6:50–7:00 | End card | Credits (see narration script) over Earth; logo | Composition | Team, sources, music credit "Music: Sascha Ende, ende.app (CC BY 4.0)" | fade to black | music out |

Scene lengths flex to the generated narration audio; total stays within 6:50 to 7:10.

## Capture plan (real app, no secrets on screen)

- **Run from a production build** (`vite build` + a local static server), not the dev server, so there is no error overlay or HMR badge. This is a copy of build output; the app source is untouched.
- **Playwright + installed Chrome**, 1920×1080, device scale 1, 30 fps screen recording, one scripted take per scene, real-time.
- **Viewport only.** No browser UI, no DevTools, no address bar, no console. The Supabase project URL and keys appear nowhere in frame or in text overlays.
- **Cursor** is rendered as an overlay (smooth bezier moves), not the OS cursor.
- **Ask takes:** record two takes per question; keep the take whose AI answer is accurate against its sources and shows the "✦ Super Intelligence" badge.
- **No hyperlinks are clicked** that leave the app.
- **Fixed states** for repeatability: Library query "microgravity"; Ask questions as written above; Gravity Gap material "PMMA"; Risk Calculator values as in scene 14.
- Static stills (PNG) are also captured per scene as fallbacks and for the poster frame.

## Composition and rendering plan

1. `flameLens-video/` holds `composition/` (Hyperframes project: one HTML scene per row above, `data-*` timing), `captures/` (video and PNG), `audio/` (narration WAV per chapter, music, SFX), `captions/`, and the final `FlameLens-Project-Explainer.mp4`.
2. **Narration:** `npx hyperframes tts` (Kokoro) per chapter. Voice audition first: the same chapter-1 text in three Kokoro voices (the default `af_heart` plus two others from `npx hyperframes tts --list`); I pick the most natural and tell you which.
3. **Subtitles:** burned-in, sentence-level, timed from the measured WAV durations; Geist 500, white on a subtle dark band, lower third, max 2 lines, never over a source tag.
4. **Music:** bundled "Happy Beats / Business Moves" tracks (Vol. 1 2:44, Vol. 9 1:54, Vol. 10 1:00, Vol. 11 1:28, Vol. 12 1:58), cross-faded to cover 7:00, ducked to about 12 to 15 percent under narration, light fades at start and end. Credit line on the end card. I will audition them; if they feel too upbeat for the tone I will say so before using them.
5. **SFX:** only UI-motivated (typing, soft ticks on cards), from the repo's CC0 Kenney set; none during narration emphasis moments.
6. **Gates:** `npx hyperframes check` (contrast, overflow, text readability) → `snapshot` frames reviewed → draft render for your review → delivery render → duration, audio-level and caption-sync check with FFmpeg.
7. **Install list (approved):** FFmpeg, Playwright (and its browser use via installed Chrome), Hyperframes via `npx`. No change to the FlameLens app or its dependencies.

## Approval checkpoints

1. **Now:** you approve or edit `project-analysis.md`, `narration-script.md`, this storyboard.
2. Then I install tooling, run `npx hyperframes doctor`, and send a 20-second voice and music audition.
3. I record the captures and show you contact sheets (stills) before composing.
4. Draft render (low quality) for review, then the delivery render to `flameLens-video/FlameLens-Project-Explainer.mp4`.
