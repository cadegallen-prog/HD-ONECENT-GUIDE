-- Penny find submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(10) NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  store_city VARCHAR(100),
  store_state VARCHAR(2) NOT NULL,
  date_found DATE NOT NULL,
  quantity VARCHAR(100),
  notes TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  validation_score INTEGER
);

-- Index for faster filtering
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_sku ON submissions(sku);
