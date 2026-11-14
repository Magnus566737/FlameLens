import os, sys, requests

URL = os.environ["SUPABASE_URL"].rstrip("/")
KEY = os.environ["SUPABASE_KEY"]
H = {"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json",
     "Prefer": "resolution=merge-duplicates,return=minimal"}

SEARCHES = [
    ("microgravity combustion", 100),
    ("FLEX droplet combustion ISS", 50),
    ("SAFFIRE spacecraft fire", 50),
    ("BASS solid combustion microgravity", 50),
    ("flame spread microgravity oxygen", 50),
]

papers = {}
# don't overwrite existing rows (merge would null out their related_investigations)
ex = requests.get(f"{URL}/rest/v1/ntrs_papers?select=ntrs_id", headers=H, timeout=60).json()
existing = {e["ntrs_id"] for e in ex}
for q, n in SEARCHES:
    # the API ignores "limit"; page.size controls how many results come back
    r = requests.get("https://ntrs.nasa.gov/api/citations/search",
                     params={"q": q, "page.size": n}, timeout=90)
    r.raise_for_status()
    results = r.json().get("results", [])
    new = 0
    for d in results:
        i = str(d.get("id"))
        if i in papers or i in existing or not d.get("title"):
            continue
        pub = (d.get("publications") or [{}])[0].get("publicationDate") or d.get("distributionDate") or d.get("created") or ""
        year = int(pub[:4]) if pub[:4].isdigit() else None
        abstract = (d.get("abstract") or "")[:2000] or None
        papers[i] = {"ntrs_id": i, "title": d["title"], "abstract": abstract, "year": year,
                     "pdf_url": f"https://ntrs.nasa.gov/citations/{i}", "related_investigations": None}
        new += 1
    print(f"{q!r}: {len(results)} results, {new} new, {len(papers)} unique total")

rows = list(papers.values())
for k in range(0, len(rows), 100):
    r = requests.post(f"{URL}/rest/v1/ntrs_papers", headers=H, json=rows[k:k + 100], timeout=90)
    if r.status_code >= 300:
        sys.exit(f"insert failed: {r.status_code} {r.text[:300]}")
print(f"inserted/merged {len(rows)} papers")
