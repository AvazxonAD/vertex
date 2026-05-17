CREATE TABLE IF NOT EXISTS jurnal_posts (
  id                       SERIAL PRIMARY KEY,

  title                    VARCHAR(500) NOT NULL,
  description              TEXT,
  body                     TEXT,
  dru_link                 TEXT,
  pdf_file                 TEXT,

  author_name              VARCHAR(255),
  author_bio               TEXT,
  author_academic_link     TEXT,
  author_scholar_link      TEXT,
  co_authors               JSONB DEFAULT '[]'::jsonb,

  year                     INTEGER,
  volume_order             INTEGER,
  quarter                  INTEGER,

  jurnal_id                INTEGER REFERENCES jurnals(id),
  jurnal_name              VARCHAR(255),
  article_id               INTEGER REFERENCES articles(id),
  article_title            VARCHAR(500),

  received                 DATE,
  revision_received        DATE,
  accepted                 DATE,
  published                DATE,

  see_count                INTEGER DEFAULT 0,
  download_count           INTEGER DEFAULT 0,

  created_at               TIMESTAMP DEFAULT NOW(),
  updated_at               TIMESTAMP DEFAULT NOW(),
  deleted_at               TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jurnal_posts_jurnal_id ON jurnal_posts(jurnal_id);
CREATE INDEX IF NOT EXISTS idx_jurnal_posts_year_quarter ON jurnal_posts(year, quarter);
CREATE INDEX IF NOT EXISTS idx_jurnal_posts_published ON jurnal_posts(published DESC);
CREATE INDEX IF NOT EXISTS idx_jurnal_posts_deleted_at ON jurnal_posts(deleted_at);
