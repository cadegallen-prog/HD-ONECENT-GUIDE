-- Add source tracking column to Penny List table
-- This allows distinguishing between user submissions, seeded data, and trickle inserts

BEGIN;

-- Add source column to track origin of each submission
ALTER TABLE "Penny List"
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'user';

-- Add comment explaining the column
COMMENT ON COLUMN "Penny List".source IS
  'Origin of submission: user (real user), seed (pre-loaded), trickle (scheduled social proof)';

-- Create index for filtering by source (useful for analytics)
CREATE INDEX IF NOT EXISTS idx_penny_list_source ON "Penny List"(source);

-- Update existing rows to have 'user' as source (they're all real submissions)
UPDATE "Penny List"
SET source = 'user'
WHERE source IS NULL;

COMMIT;
