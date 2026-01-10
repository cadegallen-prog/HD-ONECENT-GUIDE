-- Test query to verify Supabase extension is working
-- Right-click this file and select "Run on Supabase" to test

-- Check if we can connect to the database
SELECT current_database(), current_user;

-- View all tables in the public schema
SELECT 
  tablename,
  schemaname
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Count items in the penny_list table
SELECT 
  COUNT(*) as total_penny_items,
  COUNT(DISTINCT sku) as unique_skus
FROM penny_list;

-- View recent list activity
SELECT 
  id,
  title,
  created_at,
  item_count
FROM lists
ORDER BY created_at DESC
LIMIT 5;
