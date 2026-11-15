# FlameLens: Narration Script (draft for approval)

Runtime target: **7:00**. Spoken at a measured cinematic pace of about 130 words per minute with pauses between chapters, so the narration fills roughly 5:40 to 6:10 and the rest is music, UI sound and silence.
Voice: local Kokoro (via `npx hyperframes tts`), final voice chosen after a three-voice audition.
Every sentence is traceable to `project-analysis.md` section 7 (claims register). Timestamps are targets; scene lengths flex to the generated audio.

---

## 1. Hook: 0:00 to 0:25

On January twenty-seventh, nineteen sixty-seven, a fire swept through the Apollo 1 command module during a ground test. Three astronauts died. The pure-oxygen atmosphere made the fire spread quickly.

Thirty years later, aboard the Mir space station, a canister built to make oxygen caught fire instead.

NASA calls fire a catastrophic hazard for crewed spacecraft.

## 2. The problem: 0:25 to 1:05

Researchers have spent years studying how flames behave without gravity. On the International Space Station, experiments burn fuel droplets and solid materials. NASA's Saffire experiments burned fabric inside an uncrewed Cygnus cargo ship.

But the Moon has one sixth of Earth's gravity, and Mars about thirty-eight percent. Ground tests can briefly simulate that, yet no combustion experiment has ever been performed on either.

NASA's FM2 experiment is planned to be the first on another planetary body, with a target of late twenty twenty-six. Until it flies, fire safety at lunar gravity is an open question.

## 3. Introducing FlameLens: 1:05 to 1:30

FlameLens is a web application that gathers this research in one place: one hundred ninety-one NASA documents, twenty-four combustion investigations, and five spacecraft materials.

It lets you search, explore, and ask questions, and it is honest about what is not known.

## 4. How it is built: 1:30 to 2:15

Behind the interface there is no custom server. Python scripts pull papers from NASA's technical reports server, and extract text from NASA web pages.

Everything lands in a Supabase Postgres database. The React front end reads it directly, using Supabase's public key. Three.js draws the Earth, using NASA Blue Marble textures.

That is the whole pipeline: NASA sources, a database, and a browser.

## 5. Research library and experiments: 2:15 to 3:00

The research library searches titles and abstracts across every document, twenty results at a time, with a link back to each paper on NASA's server.

The experiments page lists each investigation with its hardware, principal investigator, and oxygen and pressure ranges, and marks it complete or active. You can filter by status.

## 6. Materials: 3:00 to 3:35

The materials page compares five spacecraft materials: acrylic, Nomex, cotton-fiberglass, Ultem, and cellulose.

Verdicts for the space station and for the Moon are colour-coded. And a note at the top is explicit: the values cover zero gravity on the station, and lunar data is pending FM2.

## 7. Ask FlameLens: 3:35 to 4:30

Ask FlameLens answers questions in plain language. Type a question, and the app searches paper titles and abstracts, and ranks the five best matches.

Those five abstracts, and only those, go to a language model, Qwen, running on Groq. It is told to answer only from them, and to cite the paper behind each point.

The answer appears on top, and the five source papers appear below, so every statement can be checked. If the model is unavailable, the app falls back to quoting sentences directly from the papers.

Ask about oxygen, and it also shows the gravity gap. Ask about materials, and it shows the materials table.

## 8. Fire risk calculator: 4:30 to 5:15

The fire risk calculator turns published findings into rules. Set the oxygen level, pressure, gravity, and ventilation.

Above twenty-one percent oxygen, it flags caution. Above the space station's documented maximum of twenty-four point one percent, it warns, and cites the NASA paper behind that number.

At lunar or Mars gravity, it refuses to rate the environment at all. It says: unknown.

Every rule card shows its source, and marks any citation we could not independently verify.

## 9. Cool flames and missions: 5:15 to 5:55

Not every flame can be seen. In twenty twelve, NASA's FLEX experiment on the space station watched fuel droplets keep burning after the visible flame went out. The flames were still there, too faint to see.

The cool flame page animates the idea, and labels itself an illustration, not footage.

The missions page shows what is known for the space station, and marks the lunar base and Mars habitat as no data.

## 10. Under the hood: 5:55 to 6:30

Technically, FlameLens is a React and TypeScript application built with Vite. Search is keyword matching, ranked in the browser. The database has a vector column ready for semantic search, which the app does not use yet.

The rule we followed throughout: every claim points to a source, and anything we could not verify says so on the page.

## 11. Conclusion: 6:30 to 7:00

FlameLens cannot fill the gap at one sixth gravity. Only an experiment on the Moon can.

What it can do is make the existing research easy to explore, and the missing data impossible to overlook.

Built by Team FlameLens, in Karachi, for the NASA Space Apps Challenge.

Fire safety on the Moon starts with knowing what we do not know.

---

## On-screen credits (end card, no narration)

Team FlameLens, Karachi: Muhammad Umar (@umar67), Sheikh Talha (@sheikh_talha), Muhammad Hasan (@hasan0120). NASA Space Apps Challenge 2026.
Sources: NASA NTRS, NASA History, NASA SMA, NASA Glenn Research Center, NASA ISS Science Blog.
Music: Sascha Ende, ende.app (CC BY 4.0).
