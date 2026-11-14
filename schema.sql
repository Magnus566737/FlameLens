CREATE EXTENSION IF NOT EXISTS vector;

DROP TABLE IF EXISTS taskbook_projects, ntrs_papers, flex_tests,
bass_ii_tests, materials, findings, embeddings, papers,
experiments, investigations CASCADE;

CREATE TABLE investigations (
  id TEXT PRIMARY KEY, acronym TEXT NOT NULL, full_name TEXT NOT NULL,
  doi TEXT, hardware TEXT, pi_name TEXT, period_start INT, period_end INT,
  record_count INT, size_gb FLOAT, o2_min FLOAT, o2_max FLOAT,
  pressure_min_atm FLOAT, pressure_max_atm FLOAT, fuels TEXT[],
  mission_tags TEXT[], objectives TEXT, key_finding TEXT,
  psi_url TEXT, status TEXT DEFAULT 'complete'
);

CREATE TABLE flex_tests (
  test_num INT PRIMARY KEY, fuel TEXT, pressure_mmhg FLOAT,
  o2_fraction FLOAT, n2_fraction FLOAT, co2_fraction FLOAT,
  he_fraction FLOAT, initial_diameter_mm FLOAT,
  extinction_diameter_mm FLOAT, burning_rate FLOAT,
  burn_time_s FLOAT, test_outcome TEXT
);

CREATE TABLE bass_ii_tests (
  test_id TEXT PRIMARY KEY, material TEXT, thickness_description TEXT,
  o2_initial FLOAT, o2_final FLOAT, co2_initial FLOAT, co2_final FLOAT,
  co_initial_ppm FLOAT, co_final_ppm FLOAT
);

CREATE TABLE materials (
  id TEXT PRIMARY KEY, name TEXT NOT NULL,
  o2_extinction_1g FLOAT, o2_extinction_microgravity FLOAT,
  o2_margin_of_safety FLOAT, spread_rate_cms FLOAT,
  co_production_ppm FLOAT, microgravity_behavior TEXT,
  iss_verdict TEXT, lunar_verdict TEXT, source TEXT
);

CREATE TABLE ntrs_papers (
  ntrs_id TEXT PRIMARY KEY, title TEXT NOT NULL, abstract TEXT,
  year INT, pdf_url TEXT, related_investigations TEXT[],
  embedding vector(1536)
);

CREATE TABLE taskbook_projects (
  project_id TEXT PRIMARY KEY, title TEXT NOT NULL, pi TEXT,
  university TEXT, grant_number TEXT, start_year INT, end_year INT,
  abstract TEXT, keywords TEXT[], embedding vector(1536)
);

CREATE OR REPLACE FUNCTION search_research(
  query_embedding vector(1536), match_count INT DEFAULT 5
)
RETURNS TABLE(id TEXT, title TEXT, abstract TEXT,
              similarity FLOAT, source_type TEXT)
LANGUAGE sql STABLE AS $$
  (SELECT ntrs_id, title, abstract,
    1-(embedding <=> query_embedding) AS similarity, 'ntrs'
   FROM ntrs_papers WHERE embedding IS NOT NULL
   ORDER BY embedding <=> query_embedding LIMIT match_count)
  UNION ALL
  (SELECT project_id, title, abstract,
    1-(embedding <=> query_embedding) AS similarity, 'taskbook'
   FROM taskbook_projects WHERE embedding IS NOT NULL
   ORDER BY embedding <=> query_embedding LIMIT match_count)
  ORDER BY similarity DESC LIMIT match_count;
$$;
