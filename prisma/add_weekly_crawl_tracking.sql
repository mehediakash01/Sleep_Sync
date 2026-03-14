ALTER TABLE knowledge_articles
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'success';

CREATE TABLE IF NOT EXISTS crawl_sources (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL UNIQUE,
  last_crawled_at TIMESTAMP(3),
  last_job_id TEXT,
  last_status TEXT NOT NULL DEFAULT 'idle',
  last_error TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS crawl_sources_last_status_idx
  ON crawl_sources(last_status);
