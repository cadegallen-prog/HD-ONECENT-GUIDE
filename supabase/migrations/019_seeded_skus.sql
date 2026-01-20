-- Seeded SKUs Tracking Table
-- Purpose: Track which SKUs have been auto-seeded from penny_item_enrichment
-- to prevent duplicate seeding

CREATE TABLE seeded_skus (
  sku TEXT PRIMARY KEY,
  seeded_at TIMESTAMPTZ DEFAULT now(),
  penny_list_id UUID REFERENCES "Penny List"(id) ON DELETE SET NULL
);

-- Index for querying recent seeds
CREATE INDEX idx_seeded_skus_seeded_at ON seeded_skus(seeded_at DESC);

-- RLS: Service role only (cron job uses service role)
ALTER TABLE seeded_skus ENABLE ROW LEVEL SECURITY;

-- No public access needed - only cron jobs write/read
CREATE POLICY "Service role full access" ON seeded_skus
  FOR ALL
  USING (auth.role() = 'service_role');
