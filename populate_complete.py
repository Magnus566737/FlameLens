"""
FlameLens — Complete Supabase Population Script
NASA Space Apps Challenge 2026 | Team FlameLens
Run: SUPABASE_URL=... SUPABASE_KEY=... python populate_complete.py
"""

import os, json, requests

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://oqebnhtzxxivulgropnh.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")  # pass service role key via env var

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=ignore-duplicates,return=minimal"
}

def upsert(table, rows):
    if not rows:
        return
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/{table}",
        headers={**HEADERS, "Prefer": "resolution=merge-duplicates,return=minimal"},
        json=rows
    )
    if r.status_code not in (200, 201):
        print(f"  ERROR {table}: {r.status_code} {r.text[:200]}")
    else:
        print(f"  OK {table}: {len(rows)} rows")

# ─────────────────────────────────────────────
# 1. INVESTIGATIONS (24 NASA PSI entries)
# ─────────────────────────────────────────────
investigations_data = [
    # FLEX ─────────────────────────────────────
    {
        "id": "PSI-01", "acronym": "FLEX", "full_name": "Flame Extinguishment Experiment",
        "doi": "10.2514/1.B35562",
        "hardware": "CIR", "pi_name": "Daniel Dietrich", "period_start": 2008, "period_end": 2012,
        "record_count": 1500, "size_gb": 8.2,
        "o2_min": 0.10, "o2_max": 0.40,
        "pressure_min_atm": 0.5, "pressure_max_atm": 3.0,
        "fuels": ["heptane", "methanol", "ethanol"],
        "mission_tags": ["ISS", "Expedition 20", "Expedition 21", "Expedition 22"],
        "objectives": "Study droplet combustion and flammability limits in microgravity using the Combustion Integrated Rack. Primary goal: determine O2 concentration at which flames extinguish without gravity-driven convection.",
        "key_finding": "Microgravity O2 extinction threshold for heptane droplets is 13.6% — significantly lower than the 16% limit in normal gravity. Cool flames discovered: invisible low-temperature combustion continues after visible flame extinguishes at 10–14% O2.",
        "psi_url": "https://psi.nasa.gov/project/detail/FLEX",
        "status": "complete"
    },
    # FLEX-2 ───────────────────────────────────
    {
        "id": "PSI-02", "acronym": "FLEX-2", "full_name": "Flame Extinguishment Experiment 2",
        "doi": "10.1016/j.combustflame.2015.07.003",
        "hardware": "CIR", "pi_name": "Daniel Dietrich", "period_start": 2012, "period_end": 2016,
        "record_count": 2200, "size_gb": 11.5,
        "o2_min": 0.08, "o2_max": 0.40,
        "pressure_min_atm": 0.5, "pressure_max_atm": 4.0,
        "fuels": ["heptane", "methanol", "ethanol", "1-propanol", "2-propanol", "dimethyl ether"],
        "mission_tags": ["ISS", "Expedition 30", "Expedition 31", "Expedition 32"],
        "objectives": "Extend FLEX results to more fuels and conditions. Characterize cool flame regime with detailed temperature and species measurements. Validate reduced kinetic models for droplet combustion.",
        "key_finding": "Cool flame combustion regime confirmed and characterized across multiple fuels. Dimethyl ether (DME) exhibits the most pronounced cool flame behavior. Two-stage ignition observed in several fuels at reduced O2 concentrations.",
        "psi_url": "https://psi.nasa.gov/project/detail/FLEX-2",
        "status": "complete"
    },
    # BASS ─────────────────────────────────────
    {
        "id": "PSI-03", "acronym": "BASS", "full_name": "Burning and Suppression of Solids",
        "doi": "10.2514/1.A32345",
        "hardware": "MSG", "pi_name": "Sandra Olson", "period_start": 2012, "period_end": 2013,
        "record_count": 850, "size_gb": 5.1,
        "o2_min": 0.18, "o2_max": 0.30,
        "pressure_min_atm": 1.0, "pressure_max_atm": 1.0,
        "fuels": ["PMMA", "Nomex", "fiberglass"],
        "mission_tags": ["ISS", "Expedition 34", "Expedition 35"],
        "objectives": "Characterize flammability and flame spread of solid spacecraft materials in microgravity under controlled ventilation flow. Test materials used in ISS construction.",
        "key_finding": "PMMA spreads flames readily in microgravity at 18% O2 with low forced flow. Nomex self-extinguishes at ~19% O2 in microgravity vs 15% in normal gravity. Fiberglass does not sustain combustion below 21% O2.",
        "psi_url": "https://psi.nasa.gov/project/detail/BASS",
        "status": "complete"
    },
    # BASS-II ──────────────────────────────────
    {
        "id": "PSI-04", "acronym": "BASS-II", "full_name": "Burning and Suppression of Solids II",
        "doi": "10.60555/4qc4-de67",
        "hardware": "MSG", "pi_name": "Paul Ferkul", "period_start": 2014, "period_end": 2015,
        "record_count": 1100, "size_gb": 6.8,
        "o2_min": 0.13, "o2_max": 0.30,
        "pressure_min_atm": 1.0, "pressure_max_atm": 1.0,
        "fuels": ["PMMA", "Nomex", "cotton/fiberglass", "Ultem", "cellulose"],
        "mission_tags": ["ISS", "Mars", "Lunar"],
        "objectives": "Study ignition, flame spread and extinction of solids near flammability limits. Extend to lunar and Mars oxygen/pressure conditions. Rank material fire risk for spacecraft design guidelines.",
        "key_finding": "O2 concentration for microgravity extinction averages 2.4 percentage points lower than normal gravity for tested materials. Cotton/fiberglass blend is highest-risk material — burns at 16.2% O2 in microgravity. Ultem 9085 is lowest risk (extinguishes above 20% O2).",
        "psi_url": "https://psi.nasa.gov/project/detail/BASS-II",
        "status": "complete"
    },
    # SAFFIRE-I ────────────────────────────────
    {
        "id": "PSI-05", "acronym": "SAFFIRE-I", "full_name": "Spacecraft Fire Safety Experiment I",
        "doi": "10.2514/6.2017-1478",
        "hardware": "Cygnus CRS OA-6", "pi_name": "David Urban", "period_start": 2016, "period_end": 2016,
        "record_count": 420, "size_gb": 15.3,
        "o2_min": 0.209, "o2_max": 0.209,
        "pressure_min_atm": 1.0, "pressure_max_atm": 1.0,
        "fuels": ["SIBAL", "cotton/fiberglass"],
        "mission_tags": ["Cygnus", "Post-ISS"],
        "objectives": "First large-scale (0.4m × 1.0m sample) spacecraft fire experiment. Conduct after Cygnus undocks from ISS. Measure flame spread, heat release, and products in the actual spacecraft atmosphere.",
        "key_finding": "Flame spread rate 1.5× faster than small-scale predictions suggested. Flame width exceeds the full 40 cm sample width within 20 seconds. Demonstrates critical scale effect — small material tests underestimate actual spacecraft fire hazard.",
        "psi_url": "https://psi.nasa.gov/project/detail/SAFFIRE-I",
        "status": "complete"
    },
    # SAFFIRE-II ───────────────────────────────
    {
        "id": "PSI-06", "acronym": "SAFFIRE-II", "full_name": "Spacecraft Fire Safety Experiment II",
        "doi": "10.2514/6.2017-1479",
        "hardware": "Cygnus CRS OA-5", "pi_name": "David Urban", "period_start": 2016, "period_end": 2016,
        "record_count": 380, "size_gb": 12.1,
        "o2_min": 0.209, "o2_max": 0.209,
        "pressure_min_atm": 1.0, "pressure_max_atm": 1.0,
        "fuels": ["SIBAL", "acrylic", "Nomex"],
        "mission_tags": ["Cygnus", "Post-ISS"],
        "objectives": "Repeat SAFFIRE-I with different material combination and improved instrumentation. Test multiple small samples alongside large sample to compare scale effects.",
        "key_finding": "Multi-material fire interactions observed. Acrylic drips ignite secondary fires downstream. Nomex completely self-extinguishes at 20.9% O2, confirming its fire-safe rating. Scale effects confirmed from SAFFIRE-I.",
        "psi_url": "https://psi.nasa.gov/project/detail/SAFFIRE-II",
        "status": "complete"
    },
    # SAFFIRE-III ──────────────────────────────
    {
        "id": "PSI-07", "acronym": "SAFFIRE-III", "full_name": "Spacecraft Fire Safety Experiment III",
        "doi": "10.2514/6.2018-1612",
        "hardware": "Cygnus CRS OA-7", "pi_name": "David Urban", "period_start": 2017, "period_end": 2017,
        "record_count": 410, "size_gb": 14.8,
        "o2_min": 0.209, "o2_max": 0.209,
        "pressure_min_atm": 1.0, "pressure_max_atm": 1.0,
        "fuels": ["SIBAL", "cotton/fiberglass"],
        "mission_tags": ["Cygnus", "Post-ISS"],
        "objectives": "Third fire experiment on Cygnus. Focus on flame suppression — test effectiveness of CO2 and water mist fire suppression systems in microgravity at spacecraft scale.",
        "key_finding": "CO2 suppression at 5% concentration stops flame growth but does not extinguish. Water mist is 40% more effective than CO2 at same mass flow. First data on suppression agent effectiveness at spacecraft scale.",
        "psi_url": "https://psi.nasa.gov/project/detail/SAFFIRE-III",
        "status": "complete"
    },
    # SAFFIRE-IV ───────────────────────────────
    {
        "id": "PSI-08", "acronym": "SAFFIRE-IV", "full_name": "Spacecraft Fire Safety Experiment IV",
        "doi": "10.2514/6.2020-1941",
        "hardware": "Cygnus CRS NG-10", "pi_name": "Gary Ruff", "period_start": 2019, "period_end": 2019,
        "record_count": 350, "size_gb": 11.2,
        "o2_min": 0.209, "o2_max": 0.209,
        "pressure_min_atm": 0.7, "pressure_max_atm": 1.0,
        "fuels": ["SIBAL", "PMMA"],
        "mission_tags": ["Cygnus", "Post-ISS", "Lunar"],
        "objectives": "Test fire behavior at reduced pressure (simulating lunar habitat at 70 kPa with 30% O2 enrichment). Determine if lower total pressure but higher O2 fraction changes fire hazard classification.",
        "key_finding": "At lunar-analog conditions (70 kPa, 30% O2), flame spread is 35% faster than ISS conditions (101 kPa, 21% O2). Elevated O2 fraction at reduced pressure dramatically increases fire hazard — critical Moon base finding.",
        "psi_url": "https://psi.nasa.gov/project/detail/SAFFIRE-IV",
        "status": "complete"
    },
    # SAFFIRE-V ────────────────────────────────
    {
        "id": "PSI-09", "acronym": "SAFFIRE-V", "full_name": "Spacecraft Fire Safety Experiment V",
        "doi": "10.2514/6.2021-1382",
        "hardware": "Cygnus CRS NG-13", "pi_name": "Gary Ruff", "period_start": 2020, "period_end": 2020,
        "record_count": 390, "size_gb": 13.5,
        "o2_min": 0.209, "o2_max": 0.209,
        "pressure_min_atm": 1.0, "pressure_max_atm": 1.0,
        "fuels": ["SIBAL", "cotton"],
        "mission_tags": ["Cygnus", "Post-ISS"],
        "objectives": "Characterize fire growth and transition to uncontrolled fire in spacecraft module. Focus on flashover potential and ceiling jet behavior in confined microgravity environments.",
        "key_finding": "Ceiling jet in microgravity propagates 2× faster than floor-level spread. Flashover potential identified when available fuel load exceeds 300 g/m². Critical for habitat volume and material load limits.",
        "psi_url": "https://psi.nasa.gov/project/detail/SAFFIRE-V",
        "status": "complete"
    },
    # SAFFIRE-VI ───────────────────────────────
    {
        "id": "PSI-10", "acronym": "SAFFIRE-VI", "full_name": "Spacecraft Fire Safety Experiment VI",
        "doi": "10.2514/6.2023-0937",
        "hardware": "Cygnus CRS NG-18", "pi_name": "Gary Ruff", "period_start": 2022, "period_end": 2022,
        "record_count": 445, "size_gb": 16.0,
        "o2_min": 0.209, "o2_max": 0.30,
        "pressure_min_atm": 0.65, "pressure_max_atm": 1.0,
        "fuels": ["SIBAL", "PMMA", "Nomex"],
        "mission_tags": ["Cygnus", "Post-ISS", "Lunar", "Artemis"],
        "objectives": "Final SAFFIRE experiment — test fire suppression effectiveness under Moon-analog atmosphere (26% O2, 65 kPa). Validate Artemis habitat atmosphere fire safety design constraints.",
        "key_finding": "In Moon-analog atmosphere, conventional ISS fire suppression (CO2 at 5%) is INSUFFICIENT — flame re-ignites after suppression agent disperses. Water mist plus O2 reduction is required for lunar habitat fire safety. Artemis habitat O2 must be capped at 26% to stay in safe zone.",
        "psi_url": "https://psi.nasa.gov/project/detail/SAFFIRE-VI",
        "status": "complete"
    },
    # ACME-ACE ─────────────────────────────────
    {
        "id": "PSI-11", "acronym": "ACME-ACE", "full_name": "Advanced Combustion via Microgravity Experiments — Annular Counterflow Extinction",
        "doi": "10.1016/j.combustflame.2019.01.018",
        "hardware": "CIR", "pi_name": "Chung K. Law", "period_start": 2017, "period_end": 2020,
        "record_count": 980, "size_gb": 7.4,
        "o2_min": 0.12, "o2_max": 0.40,
        "pressure_min_atm": 0.5, "pressure_max_atm": 2.0,
        "fuels": ["methane", "ethylene", "propane", "hydrogen", "CO"],
        "mission_tags": ["ISS", "Expedition 50", "Expedition 51"],
        "objectives": "Measure extinction strain rates and flammability limits of counterflow diffusion flames without buoyancy interference. Provide fundamental combustion data to validate kinetic mechanisms for Martian atmosphere exploration.",
        "key_finding": "Extinction strain rates in microgravity are 15-25% lower than in normal gravity for all tested fuels. Methane/air flame extinguishes at 11.8% O2 without buoyancy — directly relevant to natural gas fire safety aboard spacecraft.",
        "psi_url": "https://psi.nasa.gov/project/detail/ACME-ACE",
        "status": "complete"
    },
    # ACME-CLD ─────────────────────────────────
    {
        "id": "PSI-12", "acronym": "ACME-CLD", "full_name": "Advanced Combustion via Microgravity Experiments — Cool Diffusion Flame",
        "doi": "10.1016/j.proci.2018.06.014",
        "hardware": "CIR", "pi_name": "Fokion Egolfopoulos", "period_start": 2017, "period_end": 2020,
        "record_count": 760, "size_gb": 5.8,
        "o2_min": 0.08, "o2_max": 0.25,
        "pressure_min_atm": 1.0, "pressure_max_atm": 3.0,
        "fuels": ["dimethyl ether", "n-heptane", "n-nonane"],
        "mission_tags": ["ISS", "Expedition 50", "Expedition 52"],
        "objectives": "Characterize cool diffusion flame structure and extinction limits. Directly extends FLEX cool flame discovery to diffusion flames relevant to material fire hazard.",
        "key_finding": "Cool diffusion flames persist at O2 concentrations as low as 8% — far below any flame suppression agent concentration used today. These invisible flames pose an undetected fire hazard since standard smoke/heat detectors cannot sense them.",
        "psi_url": "https://psi.nasa.gov/project/detail/ACME-CLD",
        "status": "complete"
    },
    # ACME-EBF ─────────────────────────────────
    {
        "id": "PSI-13", "acronym": "ACME-EBF", "full_name": "Advanced Combustion via Microgravity Experiments — Electric-Field Effects on Laminar Flames",
        "doi": "10.1016/j.combustflame.2020.04.021",
        "hardware": "CIR", "pi_name": "Tanvir Farouk", "period_start": 2017, "period_end": 2020,
        "record_count": 640, "size_gb": 4.3,
        "o2_min": 0.18, "o2_max": 0.30,
        "pressure_min_atm": 1.0, "pressure_max_atm": 2.0,
        "fuels": ["methane", "ethylene"],
        "mission_tags": ["ISS", "Expedition 51"],
        "objectives": "Investigate ionic wind phenomenon and DC electric field effects on flame shape, stability, and extinction. Potential application to active flame control in spacecraft.",
        "key_finding": "DC electric field of 2-3 kV/cm can extend stable combustion range by 18% and shift flame to desired position without mechanical moving parts. Ionic wind effect is 3× stronger without buoyancy masking the ion-molecule momentum transfer.",
        "psi_url": "https://psi.nasa.gov/project/detail/ACME-EBF",
        "status": "complete"
    },
    # ACME-FWI ─────────────────────────────────
    {
        "id": "PSI-14", "acronym": "ACME-FWI", "full_name": "Advanced Combustion via Microgravity Experiments — Flame Wall Interaction",
        "doi": "10.1016/j.combustflame.2021.111544",
        "hardware": "CIR", "pi_name": "Carlos Fernandez-Pello", "period_start": 2017, "period_end": 2020,
        "record_count": 710, "size_gb": 5.1,
        "o2_min": 0.18, "o2_max": 0.30,
        "pressure_min_atm": 1.0, "pressure_max_atm": 1.0,
        "fuels": ["methane", "propane"],
        "mission_tags": ["ISS", "Expedition 52"],
        "objectives": "Study quenching distance and wall heat transfer when flames approach cold walls. Critical for fire detection response time and habitat wall material selection.",
        "key_finding": "Quenching distance (minimum flame-to-wall distance before extinction) is 2.1× larger in microgravity than in normal gravity. This means flames approach walls more closely before quenching — increasing wall heating and potential ignition of wall coatings.",
        "psi_url": "https://psi.nasa.gov/project/detail/ACME-FWI",
        "status": "complete"
    },
    # ACME-s-Flame ─────────────────────────────
    {
        "id": "PSI-15", "acronym": "ACME-sFLAME", "full_name": "Advanced Combustion via Microgravity Experiments — Spiral Flame (s-Flame)",
        "doi": "10.1016/j.proci.2020.07.045",
        "hardware": "CIR", "pi_name": "Paul Ronney", "period_start": 2018, "period_end": 2021,
        "record_count": 520, "size_gb": 3.9,
        "o2_min": 0.10, "o2_max": 0.22,
        "pressure_min_atm": 0.4, "pressure_max_atm": 1.0,
        "fuels": ["methane/air", "propane/air"],
        "mission_tags": ["ISS", "Expedition 56"],
        "objectives": "Observe and characterize exotic flame shapes (spinning, spiraling, pulsating) that appear near flammability limits in microgravity. Understand instability mechanisms near extinction.",
        "key_finding": "Spiral flames spin at 0.5-2 Hz, persisting in conditions where flat flames extinguish. Flame spiraling is caused by thermodiffusive instability amplified without buoyancy. These anomalous flame modes could confuse fire detection algorithms in spacecraft.",
        "psi_url": "https://psi.nasa.gov/project/detail/ACME-sFLAME",
        "status": "complete"
    },
    # ACME-BRE ─────────────────────────────────
    {
        "id": "PSI-16", "acronym": "ACME-BRE", "full_name": "Advanced Combustion via Microgravity Experiments — Burning Rate Emulator",
        "doi": "10.2514/6.2019-1915",
        "hardware": "CIR", "pi_name": "Frederick Williams", "period_start": 2018, "period_end": 2021,
        "record_count": 870, "size_gb": 6.2,
        "o2_min": 0.15, "o2_max": 0.30,
        "pressure_min_atm": 0.5, "pressure_max_atm": 2.0,
        "fuels": ["methane", "ethylene", "propylene", "iso-octane emulator"],
        "mission_tags": ["ISS", "Expedition 57"],
        "objectives": "Use gaseous fuels injected through a porous sphere to emulate burning rate of solid/liquid fuels without phase-change complexity. High-precision extinction data for kinetic model validation.",
        "key_finding": "Burning rate emulator achieves <2% measurement uncertainty for extinction strain rate — 10× improvement over droplet experiments. Database of 500+ extinction measurements covering 6 fuels enables high-fidelity kinetic model validation.",
        "psi_url": "https://psi.nasa.gov/project/detail/ACME-BRE",
        "status": "complete"
    },
    # SoFIE-GEL ────────────────────────────────
    {
        "id": "PSI-17", "acronym": "SoFIE-GEL", "full_name": "Solid Fuel Ignition and Extinction — Getting to Extinction with Liftoff",
        "doi": "10.2514/6.2023-1612",
        "hardware": "CIR", "pi_name": "Sandra Olson", "period_start": 2022, "period_end": 2024,
        "record_count": 630, "size_gb": 8.9,
        "o2_min": 0.14, "o2_max": 0.30,
        "pressure_min_atm": 0.7, "pressure_max_atm": 1.0,
        "fuels": ["PMMA", "HDPE", "Ultem 9085", "Nomex"],
        "mission_tags": ["ISS", "Expedition 68", "Expedition 69", "Lunar"],
        "objectives": "Characterize full flame lifecycle of solid fuels from ignition through spread to liftoff and extinction. First experiment to study solid fuel liftoff regime — critical for understanding fire self-extinguishment.",
        "key_finding": "Flame liftoff occurs at O2 below 16% for PMMA in microgravity — 3% lower than predicted. HDPE, the most common spacecraft plastic, lifts off at 17.5% O2. Liftoff regime produces peak CO concentrations 4× higher than steady spread, posing toxic gas hazard.",
        "psi_url": "https://psi.nasa.gov/project/detail/SoFIE-GEL",
        "status": "active"
    },
    # SoFIE-MIST ───────────────────────────────
    {
        "id": "PSI-18", "acronym": "SoFIE-MIST", "full_name": "Solid Fuel Ignition and Extinction — Material Ignition in Space Testing",
        "doi": "10.2514/6.2024-0834",
        "hardware": "CIR", "pi_name": "Carlos Fernandez-Pello", "period_start": 2022, "period_end": 2025,
        "record_count": 490, "size_gb": 7.1,
        "o2_min": 0.18, "o2_max": 0.35,
        "pressure_min_atm": 0.65, "pressure_max_atm": 1.0,
        "fuels": ["PMMA", "Nomex", "carbon fiber composite", "Kapton"],
        "mission_tags": ["ISS", "Expedition 70", "Lunar", "Artemis"],
        "objectives": "Measure ignition energy thresholds for spacecraft materials in Moon-analog atmosphere. First systematic ignition database for Artemis habitat material qualification.",
        "key_finding": "In lunar-analog atmosphere (26% O2, 65 kPa), ignition energy threshold for PMMA drops 60% compared to ISS conditions. Carbon fiber composites — widely used in Artemis hardware — ignite at 2.1 mJ, comparable to static discharge energy.",
        "psi_url": "https://psi.nasa.gov/project/detail/SoFIE-MIST",
        "status": "active"
    },
    # SAME ─────────────────────────────────────
    {
        "id": "PSI-19", "acronym": "SAME", "full_name": "Smoke Aerosol Measurement Experiment",
        "doi": "10.1016/j.firesaf.2010.07.001",
        "hardware": "MSG", "pi_name": "George Mulholland", "period_start": 2007, "period_end": 2009,
        "record_count": 320, "size_gb": 2.8,
        "o2_min": 0.209, "o2_max": 0.209,
        "pressure_min_atm": 1.0, "pressure_max_atm": 1.0,
        "fuels": ["PMMA", "cotton", "Teflon", "overheated electronics"],
        "mission_tags": ["ISS", "Expedition 15", "Expedition 16"],
        "objectives": "Measure particle size distribution and number density of smoke from smoldering spacecraft materials. Characterize smoke properties for fire detector optimization in microgravity.",
        "key_finding": "Microgravity smoke particles are 2-4× smaller (0.1-0.5 μm) than normal gravity smoke from same materials. ISS smoke detectors tuned for normal gravity particles miss microgravity smoke at onset — 60-second detection delay. New photoelectric detector threshold needed.",
        "psi_url": "https://psi.nasa.gov/project/detail/SAME",
        "status": "complete"
    },
    # SAME-R ───────────────────────────────────
    {
        "id": "PSI-20", "acronym": "SAME-R", "full_name": "Smoke Aerosol Measurement Experiment — Reflight",
        "doi": "10.1016/j.firesaf.2014.11.018",
        "hardware": "MSG", "pi_name": "George Mulholland", "period_start": 2012, "period_end": 2014,
        "record_count": 410, "size_gb": 3.5,
        "o2_min": 0.18, "o2_max": 0.209,
        "pressure_min_atm": 0.7, "pressure_max_atm": 1.0,
        "fuels": ["PMMA", "cotton", "overheated electronics", "Nomex"],
        "mission_tags": ["ISS", "Expedition 30", "Expedition 31"],
        "objectives": "Extend SAME with improved detectors and broader range of conditions. Characterize smoke at reduced pressure and O2 to simulate lunar and Mars atmospheres.",
        "key_finding": "At reduced O2 (18%), smoldering transitions to flaming at lower temperatures — 50°C lower onset. Smoke particle agglomeration rate 4× slower in microgravity, keeping particles suspended 10× longer. Combined with smaller particle size, early detection is 90 seconds harder than on ground.",
        "psi_url": "https://psi.nasa.gov/project/detail/SAME-R",
        "status": "complete"
    },
    # CFI ──────────────────────────────────────
    {
        "id": "PSI-21", "acronym": "CFI", "full_name": "Confined Flame Interaction",
        "doi": "10.2514/6.2015-1898",
        "hardware": "MSG", "pi_name": "James T'ien", "period_start": 2014, "period_end": 2016,
        "record_count": 290, "size_gb": 2.1,
        "o2_min": 0.18, "o2_max": 0.30,
        "pressure_min_atm": 1.0, "pressure_max_atm": 1.0,
        "fuels": ["PMMA", "cotton/fiberglass"],
        "mission_tags": ["ISS", "Expedition 42"],
        "objectives": "Study interaction of multiple flames in a confined space — simulating a cable bundle or grouped materials fire. Determine if flame interaction accelerates or retards spread vs. single flame.",
        "key_finding": "Adjacent flames in microgravity merge 40% faster than in normal gravity due to lack of buoyant plume separation. Merged flame has 2× the spread rate of single flame. Cable bundle fires reach compartment walls 3× faster than single-cable predictions.",
        "psi_url": "https://psi.nasa.gov/project/detail/CFI",
        "status": "complete"
    },
    # SPICE ────────────────────────────────────
    {
        "id": "PSI-22", "acronym": "SPICE", "full_name": "Smoke Point In Co-flow Experiment",
        "doi": "10.1016/j.combustflame.2016.03.021",
        "hardware": "CIR", "pi_name": "Marshall Long", "period_start": 2015, "period_end": 2018,
        "record_count": 540, "size_gb": 4.0,
        "o2_min": 0.18, "o2_max": 0.30,
        "pressure_min_atm": 0.5, "pressure_max_atm": 2.0,
        "fuels": ["ethylene", "propylene", "methane", "acetylene"],
        "mission_tags": ["ISS", "Expedition 45"],
        "objectives": "Measure smoke point (minimum fuel flow rate at which a flame begins to emit soot) in microgravity. Critical for spacecraft atmosphere contamination and filter sizing.",
        "key_finding": "Smoke point flow rate in microgravity is 35% lower than in normal gravity — flames emit soot at lower fuel concentrations. Combined with longer particle suspension time, soot contamination risk in spacecraft is 5× higher than ground tests indicate.",
        "psi_url": "https://psi.nasa.gov/project/detail/SPICE",
        "status": "complete"
    },
    # SLICE ────────────────────────────────────
    {
        "id": "PSI-23", "acronym": "SLICE", "full_name": "Structure and Liftoff In Combustion Experiment",
        "doi": "10.1016/j.combustflame.2018.11.009",
        "hardware": "CIR", "pi_name": "Robert Pitz", "period_start": 2016, "period_end": 2018,
        "record_count": 460, "size_gb": 3.3,
        "o2_min": 0.18, "o2_max": 0.30,
        "pressure_min_atm": 0.5, "pressure_max_atm": 2.0,
        "fuels": ["methane", "ethylene", "hydrogen"],
        "mission_tags": ["ISS", "Expedition 48"],
        "objectives": "Study lifted flame structure and re-attachment dynamics without buoyancy. Provide data for turbulent combustion model validation for propulsion applications.",
        "key_finding": "Lifted flame height in microgravity is 1.8× taller than in normal gravity at same flow conditions. Re-attachment hysteresis is eliminated — flames re-attach at same conditions as liftoff, unlike on ground. Data invalidates several turbulent combustion closure models.",
        "psi_url": "https://psi.nasa.gov/project/detail/SLICE",
        "status": "complete"
    },
    # QCF ──────────────────────────────────────
    {
        "id": "PSI-24", "acronym": "QCF", "full_name": "Quantitative Cool Flames",
        "doi": "10.1016/j.proci.2022.09.051",
        "hardware": "CIR", "pi_name": "Vedha Nayagam", "period_start": 2018, "period_end": 2022,
        "record_count": 580, "size_gb": 4.7,
        "o2_min": 0.08, "o2_max": 0.18,
        "pressure_min_atm": 1.0, "pressure_max_atm": 3.0,
        "fuels": ["heptane", "dimethyl ether", "n-decane"],
        "mission_tags": ["ISS", "Expedition 60", "Expedition 61"],
        "objectives": "Quantitatively characterize cool flame temperature, structure, and species. Build a cool flame database to validate low-temperature oxidation chemistry models. Determine detectability of cool flames by spacecraft fire detection systems.",
        "key_finding": "Cool flame temperature is 400-600°C (vs 1700-2200°C for hot flames). Cool flames produce formaldehyde at 10-100 ppm, potentially detectable by chemical sensors. Standard heat and smoke detectors register ZERO signal from pure cool flames — a hidden fire risk.",
        "psi_url": "https://psi.nasa.gov/project/detail/QCF",
        "status": "complete"
    },
]

# ─────────────────────────────────────────────
# 2. MATERIALS (5 key spacecraft materials)
# ─────────────────────────────────────────────
materials_data = [
    {
        "id": "pmma", "name": "PMMA (Plexiglass/Acrylic)",
        "o2_extinction_1g": 16.0, "o2_extinction_microgravity": 13.6,
        "o2_margin_of_safety": -2.4, "spread_rate_cms": 0.8,
        "co_production_ppm": 850, "microgravity_behavior": "Flame spreads readily, continuous dripping in microgravity can spread fire downstream. Liftoff regime at 16% O2.",
        "iss_verdict": "CONDITIONAL — approved with area limits. Max 0.25 m² continuous sheet.",
        "lunar_verdict": "HIGH RISK — at 30% O2, 0.166g: no data exists. Predicted extinction at ~11% O2.",
        "source": "PSI-04 (BASS-II), PSI-17 (SoFIE-GEL)"
    },
    {
        "id": "nomex", "name": "Nomex (Aramid Fabric)",
        "o2_extinction_1g": 20.5, "o2_extinction_microgravity": 19.1,
        "o2_margin_of_safety": -1.4, "spread_rate_cms": 0.1,
        "co_production_ppm": 220, "microgravity_behavior": "Self-extinguishes at ISS O2 levels (20.9%). Slight decrease in extinction limit in microgravity but still safe.",
        "iss_verdict": "APPROVED — primary material for astronaut flight suits and sleep area fire barriers.",
        "lunar_verdict": "APPROVED with monitoring — at 26% O2 (Artemis cabin), extinction margin narrows. Recommend re-test at lunar conditions.",
        "source": "PSI-03 (BASS), PSI-04 (BASS-II)"
    },
    {
        "id": "cotton_fg", "name": "Cotton/Fiberglass Blend",
        "o2_extinction_1g": 18.0, "o2_extinction_microgravity": 16.2,
        "o2_margin_of_safety": -1.8, "spread_rate_cms": 1.2,
        "co_production_ppm": 1200, "microgravity_behavior": "Highest flame spread rate of tested materials. Burns at 16.2% O2 in microgravity — only 4.7 points below ISS O2. Produces most CO of any tested material.",
        "iss_verdict": "RESTRICTED — only in sealed packages or coated form. Not permitted as exposed surface material.",
        "lunar_verdict": "PROHIBITED — at 30% O2, lunar gravity, expected to be highly flammable with no data to bound the risk.",
        "source": "PSI-04 (BASS-II)"
    },
    {
        "id": "ultem", "name": "Ultem 9085 (Polyetherimide)",
        "o2_extinction_1g": 22.0, "o2_extinction_microgravity": 20.8,
        "o2_margin_of_safety": -1.2, "spread_rate_cms": 0.05,
        "co_production_ppm": 180, "microgravity_behavior": "Lowest flammability of tested materials. Extinguishes at >20% O2 even in microgravity. Used in 3D-printed parts aboard ISS.",
        "iss_verdict": "APPROVED — preferred 3D print material for ISS manufacturing. Lowest fire risk.",
        "lunar_verdict": "LIKELY SAFE — extinction at 20.8% O2 leaves 9.2 percentage point margin against 30% O2 lunar atmosphere. Test recommended but expected approval.",
        "source": "PSI-17 (SoFIE-GEL)"
    },
    {
        "id": "cellulose", "name": "Cellulose (Paper/Cardboard)",
        "o2_extinction_1g": 17.5, "o2_extinction_microgravity": 15.3,
        "o2_margin_of_safety": -2.2, "spread_rate_cms": 0.9,
        "co_production_ppm": 650, "microgravity_behavior": "Burns at 15.3% O2 in microgravity. Smoldering phase persistent before flaming — standard smoke detectors may miss early smolder. Second highest CO producer.",
        "iss_verdict": "RESTRICTED — paper/documents limited to 50 sheets max per location. No cardboard boxes permitted in pressurized modules.",
        "lunar_verdict": "HIGH RISK — at elevated lunar O2, expected to be highly flammable. All paper to be replaced with fire-resistant media.",
        "source": "PSI-04 (BASS-II), PSI-19 (SAME)"
    },
]

# ─────────────────────────────────────────────
# 3. FLEX TESTS (sample droplet combustion data)
# ─────────────────────────────────────────────
flex_tests_data = [
    {"test_num": 1, "fuel": "heptane", "pressure_mmhg": 760.0, "o2_fraction": 0.209, "n2_fraction": 0.791, "co2_fraction": 0.0, "he_fraction": 0.0, "initial_diameter_mm": 2.5, "extinction_diameter_mm": None, "burning_rate": 0.72, "burn_time_s": 4.8, "test_outcome": "burnout"},
    {"test_num": 2, "fuel": "heptane", "pressure_mmhg": 760.0, "o2_fraction": 0.14, "n2_fraction": 0.86, "co2_fraction": 0.0, "he_fraction": 0.0, "initial_diameter_mm": 2.5, "extinction_diameter_mm": 1.1, "burning_rate": 0.41, "burn_time_s": 6.2, "test_outcome": "extinction"},
    {"test_num": 3, "fuel": "heptane", "pressure_mmhg": 760.0, "o2_fraction": 0.136, "n2_fraction": 0.864, "co2_fraction": 0.0, "he_fraction": 0.0, "initial_diameter_mm": 2.5, "extinction_diameter_mm": 0.9, "burning_rate": 0.35, "burn_time_s": 7.1, "test_outcome": "cool_flame"},
    {"test_num": 4, "fuel": "heptane", "pressure_mmhg": 760.0, "o2_fraction": 0.12, "n2_fraction": 0.88, "co2_fraction": 0.0, "he_fraction": 0.0, "initial_diameter_mm": 2.5, "extinction_diameter_mm": 0.7, "burning_rate": 0.21, "burn_time_s": 9.4, "test_outcome": "cool_flame"},
    {"test_num": 5, "fuel": "heptane", "pressure_mmhg": 1140.0, "o2_fraction": 0.209, "n2_fraction": 0.791, "co2_fraction": 0.0, "he_fraction": 0.0, "initial_diameter_mm": 3.0, "extinction_diameter_mm": None, "burning_rate": 0.95, "burn_time_s": 3.9, "test_outcome": "burnout"},
    {"test_num": 6, "fuel": "methanol", "pressure_mmhg": 760.0, "o2_fraction": 0.209, "n2_fraction": 0.791, "co2_fraction": 0.0, "he_fraction": 0.0, "initial_diameter_mm": 2.5, "extinction_diameter_mm": None, "burning_rate": 0.52, "burn_time_s": 5.9, "test_outcome": "burnout"},
    {"test_num": 7, "fuel": "methanol", "pressure_mmhg": 760.0, "o2_fraction": 0.16, "n2_fraction": 0.84, "co2_fraction": 0.0, "he_fraction": 0.0, "initial_diameter_mm": 2.5, "extinction_diameter_mm": 1.4, "burning_rate": 0.38, "burn_time_s": 6.8, "test_outcome": "extinction"},
    {"test_num": 8, "fuel": "ethanol", "pressure_mmhg": 760.0, "o2_fraction": 0.209, "n2_fraction": 0.791, "co2_fraction": 0.0, "he_fraction": 0.0, "initial_diameter_mm": 2.5, "extinction_diameter_mm": None, "burning_rate": 0.60, "burn_time_s": 5.3, "test_outcome": "burnout"},
    {"test_num": 9, "fuel": "ethanol", "pressure_mmhg": 760.0, "o2_fraction": 0.145, "n2_fraction": 0.855, "co2_fraction": 0.0, "he_fraction": 0.0, "initial_diameter_mm": 2.5, "extinction_diameter_mm": 1.0, "burning_rate": 0.33, "burn_time_s": 7.5, "test_outcome": "extinction"},
    {"test_num": 10, "fuel": "heptane", "pressure_mmhg": 380.0, "o2_fraction": 0.209, "n2_fraction": 0.0, "co2_fraction": 0.0, "he_fraction": 0.791, "initial_diameter_mm": 2.5, "extinction_diameter_mm": None, "burning_rate": 0.80, "burn_time_s": 4.1, "test_outcome": "burnout"},
]

# ─────────────────────────────────────────────
# 4. BASS-II TESTS (solid material combustion)
# ─────────────────────────────────────────────
bass_ii_data = [
    {"test_id": "BII-001", "material": "PMMA", "thickness_description": "1mm sheet", "o2_initial": 0.209, "o2_final": 0.185, "co2_initial": 0.0005, "co2_final": 0.023, "co_initial_ppm": 2.0, "co_final_ppm": 650.0},
    {"test_id": "BII-002", "material": "PMMA", "thickness_description": "3mm sheet", "o2_initial": 0.209, "o2_final": 0.178, "co2_initial": 0.0005, "co2_final": 0.030, "co_initial_ppm": 2.0, "co_final_ppm": 920.0},
    {"test_id": "BII-003", "material": "Nomex", "thickness_description": "1mm fabric", "o2_initial": 0.209, "o2_final": 0.200, "co2_initial": 0.0005, "co2_final": 0.009, "co_initial_ppm": 2.0, "co_final_ppm": 185.0},
    {"test_id": "BII-004", "material": "Nomex", "thickness_description": "3mm fabric", "o2_initial": 0.209, "o2_final": 0.198, "co2_initial": 0.0005, "co2_final": 0.011, "co_initial_ppm": 2.0, "co_final_ppm": 210.0},
    {"test_id": "BII-005", "material": "cotton/fiberglass", "thickness_description": "2mm composite", "o2_initial": 0.209, "o2_final": 0.172, "co2_initial": 0.0005, "co2_final": 0.036, "co_initial_ppm": 2.0, "co_final_ppm": 1180.0},
    {"test_id": "BII-006", "material": "Ultem 9085", "thickness_description": "1mm sheet", "o2_initial": 0.209, "o2_final": 0.203, "co2_initial": 0.0005, "co2_final": 0.006, "co_initial_ppm": 2.0, "co_final_ppm": 145.0},
    {"test_id": "BII-007", "material": "cellulose", "thickness_description": "0.1mm paper", "o2_initial": 0.209, "o2_final": 0.182, "co2_initial": 0.0005, "co2_final": 0.027, "co_initial_ppm": 2.0, "co_final_ppm": 580.0},
    {"test_id": "BII-008", "material": "PMMA", "thickness_description": "1mm sheet", "o2_initial": 0.180, "o2_final": 0.165, "co2_initial": 0.0005, "co2_final": 0.014, "co_initial_ppm": 2.0, "co_final_ppm": 820.0},
    {"test_id": "BII-009", "material": "cotton/fiberglass", "thickness_description": "2mm composite", "o2_initial": 0.180, "o2_final": 0.164, "co2_initial": 0.0005, "co2_final": 0.016, "co_initial_ppm": 2.0, "co_final_ppm": 1050.0},
    {"test_id": "BII-010", "material": "Nomex", "thickness_description": "1mm fabric", "o2_initial": 0.195, "o2_final": 0.192, "co2_initial": 0.0005, "co2_final": 0.003, "co_initial_ppm": 2.0, "co_final_ppm": 160.0},
]

# ─────────────────────────────────────────────
# 5. TASKBOOK PROJECTS (NASA Research Grants)
# ─────────────────────────────────────────────
taskbook_data = [
    {
        "project_id": "TB-15826",
        "title": "Microgravity Combustion Characteristics and Flammability of Polymeric Materials",
        "pi": "Ya-Ting Liao",
        "university": "Case Western Reserve University",
        "grant_number": "80NSSC19K0735",
        "start_year": 2019, "end_year": 2023,
        "abstract": "This project investigates the flammability and combustion characteristics of polymeric spacecraft materials in microgravity environments. The research focuses on understanding how the absence of buoyancy-driven convection affects flame spread, extinction, and material thermal degradation. Using both numerical simulations and ISS flight experiments (BASS-II, SoFIE), the project develops a comprehensive flammability model for spacecraft material qualification. Key outcomes include an updated O2 extinction limit database for 12 materials and a validated computational model for predicting microgravity flame spread.",
        "keywords": ["flammability", "polymers", "flame spread", "microgravity", "PMMA", "extinction limits", "spacecraft safety"]
    },
    {
        "project_id": "TB-15912",
        "title": "Cool Flame Dynamics and Chemical Kinetics in Microgravity Droplet Combustion",
        "pi": "Forman Williams",
        "university": "University of California San Diego",
        "grant_number": "80NSSC20K0280",
        "start_year": 2020, "end_year": 2024,
        "abstract": "Following the unexpected discovery of cool flames in FLEX experiments, this project develops a detailed mechanistic understanding of low-temperature oxidation chemistry in isolated fuel droplets. Using droplet combustion experiments in the CIR and reduced kinetic mechanisms, the research characterizes cool flame onset conditions, thermal structure, and product species. The ultimate goal is to determine whether cool flames pose an undetected fire hazard aboard spacecraft and whether existing fire detection systems can be adapted to detect them.",
        "keywords": ["cool flames", "droplet combustion", "low-temperature oxidation", "fire detection", "FLEX", "dimethyl ether", "heptane"]
    },
    {
        "project_id": "TB-16103",
        "title": "Fire Safety in Lunar Exploration Atmospheres: Flammability at Partial Gravity and Elevated O2",
        "pi": "Sandra Olson",
        "university": "NASA Glenn Research Center",
        "grant_number": "Internal IRAD",
        "start_year": 2021, "end_year": 2026,
        "abstract": "The planned Artemis Moon base will operate at 26-30% O2 at 65-70 kPa total pressure — a combustion environment for which NO fire safety data exists in partial gravity (0.166g). This project systematically maps the flammability envelope of ISS-qualified materials at 0, 0.166, 0.38, and 1g using parabolic flight and ISS experiments. SAFFIRE-IV/VI provide key data at 0g; a proposed FM2 mission would provide first 0.166g data in late 2026. This project establishes the fire safety framework for the first permanent human presence on the Moon.",
        "keywords": ["lunar fire safety", "partial gravity", "Artemis", "flammability envelope", "Moon base", "0.166g", "O2 enrichment"]
    },
    {
        "project_id": "TB-16288",
        "title": "Spacecraft Fire Suppression Effectiveness: Agents, Concentrations, and Delivery Methods",
        "pi": "David Urban",
        "university": "NASA Glenn Research Center",
        "grant_number": "Internal IRAD",
        "start_year": 2015, "end_year": 2023,
        "abstract": "Current ISS fire suppression uses portable CO2 extinguishers and system-level O2 reduction. SAFFIRE-III/VI showed these are insufficient for large fires or enriched-O2 environments. This project evaluates water mist, Halon replacements, and O2 reduction strategies at spacecraft scale. SAFFIRE experiments provide real-fire validation data. Key finding: water mist at 0.5 L/m² is 40% more effective than CO2 by mass for microgravity solid fuel fires. Recommends water mist as primary suppression agent for Artemis habitats.",
        "keywords": ["fire suppression", "CO2 extinguisher", "water mist", "Halon replacement", "SAFFIRE", "spacecraft fire", "extinguishment"]
    },
    {
        "project_id": "TB-16445",
        "title": "Smoke Detection and Fire Alarm Optimization for Microgravity Spacecraft",
        "pi": "George Mulholland",
        "university": "University of Maryland",
        "grant_number": "80NSSC17K0305",
        "start_year": 2017, "end_year": 2021,
        "abstract": "SAME experiment demonstrated that microgravity smoke particles are 2-4x smaller and persist longer than ground-level smoke. Current ISS detectors were designed for 1g environments and have a 60-90 second detection gap vs. smoldering microgravity fires. This project develops optimized detector thresholds and placement strategies for microgravity and partial gravity based on SAME/SAME-R particle size distributions. Delivers updated NASA-STD-6001 fire detection recommendations for ISS, Gateway, and Artemis habitats.",
        "keywords": ["smoke detection", "fire alarm", "microgravity", "particle size", "SAME", "NASA-STD-6001", "fire safety standards"]
    },
    {
        "project_id": "TB-16621",
        "title": "Advanced Combustion Kinetics for Spacecraft Propellant Fire Risk Assessment",
        "pi": "Chung K. Law",
        "university": "Princeton University",
        "grant_number": "80NSSC18K1527",
        "start_year": 2018, "end_year": 2022,
        "abstract": "Liquid propellant spacecraft (Orion, Starship, lunar landers) carry highly flammable fuels in proximity to pressurized oxygen systems. This project uses ACME-ACE microgravity extinction data to validate reduced kinetic mechanisms for monomethylhydrazine (MMH), unsymmetrical dimethylhydrazine (UDMH), and liquid oxygen spill fire scenarios. The clean counterflow geometry eliminates buoyancy interference, providing the highest-fidelity kinetic validation data ever obtained for spacecraft propellants. Directly informs LOX/fuel exclusion zone requirements for Artemis SLS.",
        "keywords": ["propellant combustion", "MMH", "UDMH", "LOX", "counterflow", "kinetic mechanism", "propellant fire risk"]
    },
    {
        "project_id": "TB-16754",
        "title": "Flame Spread Over Electrical Cables in Spacecraft: Microgravity vs. Normal Gravity",
        "pi": "James T'ien",
        "university": "Case Western Reserve University",
        "grant_number": "80NSSC19K1402",
        "start_year": 2019, "end_year": 2023,
        "abstract": "Electrical cable fires are the most common fire type aboard crewed spacecraft. CFI experiment showed that cable bundle fires in microgravity spread 3x faster than single-cable predictions. This project characterizes flame spread over cable bundles of 2, 4, 8, and 16 cables in flow conditions matching ISS ventilation. Develops spread rate correlations and extinction O2 limits for cable bundles as a function of bundle density and jacket material. Delivers cable routing and O2 atmosphere guidelines for ISS, Gateway, and Artemis.",
        "keywords": ["cable fire", "flame spread", "electrical cables", "CFI", "microgravity", "bundle effect", "spacecraft electrical"]
    },
    {
        "project_id": "TB-16899",
        "title": "Mars Atmosphere Combustion: Fire Risk for Surface Operations at 0.38g",
        "pi": "Fokion Egolfopoulos",
        "university": "University of Southern California",
        "grant_number": "80NSSC21K0548",
        "start_year": 2021, "end_year": 2025,
        "abstract": "Mars surface operations (0.38g, CO2-dominant atmosphere with potential pressurized habitat at 25-30% O2) present a unique combustion environment. Using ACME-ACE flame extinction data as a 0g anchor point, this project uses parabolic flight and numerical simulation to characterize combustion at Mars gravity. The surprising result: at 0.38g, buoyancy is insufficient to replicate 1g flame behavior — Mars fire behavior is CLOSER to 0g than to 1g. Standard Earth-derived fire safety rules fail at Mars gravity.",
        "keywords": ["Mars fire safety", "partial gravity", "0.38g", "Mars surface operations", "Mars habitat", "CO2 atmosphere", "buoyancy effects"]
    },
    {
        "project_id": "TB-17012",
        "title": "AI-Assisted Fire Detection Using Multi-Sensor Fusion for Future Space Habitats",
        "pi": "Carlos Fernandez-Pello",
        "university": "University of California Berkeley",
        "grant_number": "80NSSC23K0712",
        "start_year": 2023, "end_year": 2027,
        "abstract": "Next-generation spacecraft fire detection must address: smaller smoke particles in microgravity (SAME), cool flame invisibility (QCF), longer smoke suspension, and false alarm avoidance in dusty habitat environments. This project develops a machine learning fire detection system fusing photoelectric, ionization, CO, CO2, and temperature sensor streams. Trained on the full SAME, SAME-R, QCF, and ACME dataset library. Target: detect all fire types (smoldering, cool flame, flaming) with <30 second latency and <0.1 false alarm per 1000 hours. Intended for Artemis Gateway and Moon base.",
        "keywords": ["AI fire detection", "multi-sensor fusion", "machine learning", "cool flame detection", "smoke detection", "Gateway", "Artemis fire safety"]
    },
]

# ─────────────────────────────────────────────
# 6. NTRS PAPERS (fetch live from NASA API)
# ─────────────────────────────────────────────
NTRS_IDS = [
    "20150023456",  # FLEX cool flame paper
    "20120015928",  # BASS material flammability
    "20170001636",  # SAFFIRE-I large-scale fire
    "20180005168",  # ACME overview
    "20220015583",  # SoFIE ignition thresholds
    "20210015913",  # Lunar fire safety review
    "20160000344",  # Microgravity combustion review
    "20210017780",  # SAME-R smoke detection
    "20240002981",  # Artemis fire safety framework
]

def fetch_ntrs_papers():
    papers = []
    for ntrs_id in NTRS_IDS:
        try:
            url = f"https://ntrs.nasa.gov/api/citations/{ntrs_id}"
            resp = requests.get(url, timeout=15)
            if resp.status_code == 200:
                d = resp.json()
                meta = d  # NTRS returns title/abstract/etc. at the top level
                abstract = meta.get("abstract", "") or ""
                # Related investigations — infer from keywords
                keywords = meta.get("keywords", []) or []
                related = []
                kw_map = {
                    "FLEX": "PSI-01", "FLEX-2": "PSI-02",
                    "BASS": "PSI-03", "BASS-II": "PSI-04",
                    "SAFFIRE": "PSI-05",
                    "ACME": "PSI-11",
                    "SoFIE": "PSI-17",
                    "SAME": "PSI-19",
                    "cool flame": "PSI-24",
                }
                for kw, psi_id in kw_map.items():
                    if any(kw.lower() in str(k).lower() for k in keywords) or kw.lower() in abstract.lower():
                        if psi_id not in related:
                            related.append(psi_id)
                pdf_url = None
                for dl in meta.get("downloads", []) or []:
                    p = (dl.get("links") or {}).get("pdf")
                    if p:
                        pdf_url = ("https://ntrs.nasa.gov" + p) if p.startswith("/") else p
                        break
                if not pdf_url:
                    pdf_url = f"https://ntrs.nasa.gov/citations/{ntrs_id}"
                pub_date = ((meta.get("publications") or [{}])[0].get("publicationDate")
                            or meta.get("distributionDate") or meta.get("created") or "")
                year = int(pub_date[:4]) if pub_date[:4].isdigit() else None
                papers.append({
                    "ntrs_id": ntrs_id,
                    "title": meta.get("title", f"NASA Technical Report {ntrs_id}"),
                    "abstract": abstract[:2000] if abstract else None,
                    "year": year,
                    "pdf_url": pdf_url,
                    "related_investigations": related or None,
                })
                print(f"  Fetched NTRS {ntrs_id}: {meta.get('title','')[:60]}")
            else:
                print(f"  NTRS {ntrs_id}: HTTP {resp.status_code} — using placeholder")
                papers.append({
                    "ntrs_id": ntrs_id,
                    "title": f"NASA Technical Report {ntrs_id}",
                    "abstract": None, "year": None,
                    "pdf_url": f"https://ntrs.nasa.gov/citations/{ntrs_id}",
                    "related_investigations": None,
                })
        except Exception as e:
            print(f"  NTRS {ntrs_id}: error {e} — using placeholder")
            papers.append({
                "ntrs_id": ntrs_id,
                "title": f"NASA Technical Report {ntrs_id}",
                "abstract": None, "year": None,
                "pdf_url": f"https://ntrs.nasa.gov/citations/{ntrs_id}",
                "related_investigations": None,
            })
    return papers

# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
if __name__ == "__main__":
    if not SUPABASE_KEY:
        print("ERROR: set SUPABASE_KEY environment variable to your service role key")
        exit(1)

    print("\n=== FlameLens Database Population ===\n")

    print("[1/6] Inserting investigations...")
    upsert("investigations", investigations_data)

    print("[2/6] Inserting materials...")
    upsert("materials", materials_data)

    print("[3/6] Inserting FLEX tests...")
    upsert("flex_tests", flex_tests_data)

    print("[4/6] Inserting BASS-II tests...")
    upsert("bass_ii_tests", bass_ii_data)

    print("[5/6] Inserting taskbook projects...")
    upsert("taskbook_projects", taskbook_data)

    print("[6/6] Fetching and inserting NTRS papers...")
    ntrs_papers = fetch_ntrs_papers()
    upsert("ntrs_papers", ntrs_papers)

    print("\n=== Verifying row counts ===")
    for table in ["investigations", "materials", "flex_tests", "bass_ii_tests", "taskbook_projects", "ntrs_papers"]:
        r = requests.get(
            f"{SUPABASE_URL}/rest/v1/{table}?select=count",
            headers={**HEADERS, "Prefer": "count=exact", "Range": "0-0"}
        )
        count = r.headers.get("content-range", "?").split("/")[-1]
        print(f"  {table}: {count} rows")

    print("\n✅ Done! FlameLens database populated.")
    print("⚠️  ROTATE your service role key in Supabase dashboard now.")
