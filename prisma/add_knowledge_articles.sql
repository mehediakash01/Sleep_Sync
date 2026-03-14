CREATE TABLE IF NOT EXISTS knowledge_articles (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  source TEXT NOT NULL,
  crawled_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS knowledge_articles_source_idx
  ON knowledge_articles(source);

CREATE INDEX IF NOT EXISTS knowledge_articles_crawled_at_idx
  ON knowledge_articles(crawled_at);
