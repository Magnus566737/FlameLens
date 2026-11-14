import os, re, sys, html, requests

URL = os.environ["SUPABASE_URL"].rstrip("/")
KEY = os.environ["SUPABASE_KEY"]
H = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json",
     "Prefer": "resolution=merge-duplicates,return=minimal"}
UA = {"User-Agent": "Mozilla/5.0"}


def page_text(url, whole=False):
    s = requests.get(url, headers=UA, timeout=60).content.decode("utf-8", "ignore")
    title = html.unescape(re.search(r"<title>(.*?)</title>", s, re.S).group(1).strip())
    m = None if whole else (re.search(r"<article.*?</article>", s, re.S) or re.search(r"<main.*?</main>", s, re.S))
    b = m.group(0) if m else s
    b = re.sub(r"<(script|style|nav|header|footer|svg)\b.*?</\1>", "", b, flags=re.S)
    paras = [re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", p))).strip()
             for p in re.findall(r"<(?:p|h\d|li)[^>]*>(.*?)</(?:p|h\d|li)>", b, re.S)]
    return title, [p for p in paras if len(p) > 30]


rows = []


def add(i, title, abstract, year):
    rows.append({"ntrs_id": i, "title": title, "abstract": abstract[:2000] if abstract else None,
                 "year": year, "pdf_url": None, "related_investigations": None})


# Apollo 1 / Apollo 13 (history pages)
for i, u, year in [
    ("NASA-HIST-APOLLO1", "https://sma.nasa.gov/sma-disciplines/accllp/apollo-1", 1967),
    ("NASA-HIST-APOLLO13", "https://sma.nasa.gov/sma-disciplines/accllp/apollo-13", 1970),
]:
    t, ps = page_text(u, whole=True)
    seen, body = set(), []
    for p in ps:  # the pages repeat paragraphs
        if p not in seen:
            seen.add(p); body.append(p)
    name = "Apollo 1" if i == "NASA-HIST-APOLLO1" else "Apollo 13"
    add(i, f"{name} (NASA SMA Lessons Learned)", " ".join(body), year)

# Mir fire + spinoffs
t, ps = page_text("https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/")
body = [p for p in ps if p.startswith("On Feb. 24") or len(p) > 150]
add("NASA-HIST-MIR1997", "25 Years Ago: Fire Aboard Space Station Mir", " ".join(body), 2022)

for i, u, year in [("NASA-SPINOFF-9582", "https://spinoff.nasa.gov/node/9582", 1976),
                   ("NASA-SPINOFF-9407", "https://spinoff.nasa.gov/node/9407", 1978),
                   ("NASA-SPINOFF-9918", "https://spinoff.nasa.gov/node/9918", 1982)]:
    t, ps = page_text(u)
    add(i, t.replace(" | NASA Spinoff", ""), " ".join(ps), year)

# Researcher's guide
t, ps = page_text("https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/")
body = [p for p in ps if p.startswith("Combustion") or p.startswith("For future") or p.startswith("This Researcher")]
add("NASA-ISS-COMBUSTION-GUIDE", "A Researcher's Guide to: Combustion Science (October 2015 Edition)", " ".join(body), 2015)

# Glenn combustion science page: overview + experiments/facilities not already in the database
G = "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/"
t, ps = page_text(G)
ov = [p for p in ps if p.startswith(("In the United States", "Combustion occurs", "Despite being", "To understand", "By varying"))]
add("NASA-GLENN-COMBUSTION", "Combustion Science (NASA Glenn Physical Sciences Program)", " ".join(ov), None)


def find(prefix):
    return next((p for p in ps if p.startswith(prefix)), None)


for i, title, pre in [
    ("NASA-GLENN-FM2", "Flammability of Materials on the Moon (FM2)", "FM2 is the first-ever"),
    ("NASA-GLENN-FLARE", "Flammability Limits At Reduced-g Experiment (FLARE)", "To develop a methodology"),
    ("NASA-GLENN-DAFT", "Dust and Aerosol Measurement Feasibility Test (DAFT)", "The Dust and Aerosol Measurement"),
    ("NASA-GLENN-CIR", "Combustion Integrated Rack (CIR)", "The Combustion Integrated Rack (CIR), located"),
    ("NASA-GLENN-MDCA", "Multi-user Droplet Combustion Apparatus (MDCA)", "The Multi-user Droplet Combustion Apparatus (MDCA) is"),
]:
    txt = find(pre)
    if txt:
        add(i, title, txt, None)
    else:
        print("not found on page:", title)

for r in rows:
    print(r["ntrs_id"], "|", r["title"], "|", r["year"], "|", len(r["abstract"] or ""))
if "--dry" in sys.argv:
    sys.exit()
r = requests.post(f"{URL}/rest/v1/ntrs_papers", headers=H, json=rows, timeout=60)
print("insert:", r.status_code, r.text[:300])
for t in "investigations materials flex_tests bass_ii_tests taskbook_projects ntrs_papers".split():
    c = requests.get(f"{URL}/rest/v1/{t}?select=*", headers={**H, "Prefer": "count=exact", "Range": "0-0"}, timeout=60)
    print(t, c.headers.get("content-range", "?").split("/")[-1])
