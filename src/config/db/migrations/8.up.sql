CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL,
  gif VARCHAR,
  video VARCHAR,
  image VARCHAR,
  title VARCHAR(10000),
  description TEXT,
  content TEXT,
  tags TEXT,
  see INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
