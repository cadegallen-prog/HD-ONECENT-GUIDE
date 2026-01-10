/**
 * Run migration script for Supabase
 *
 * Usage: node scripts/run-migration.js <migration-file>
 * Example: node scripts/run-migration.js supabase/migrations/010_add_enrichment_columns_to_penny_list.sql
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nNote: This script requires the SERVICE_ROLE_KEY (not anon key) to run migrations.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration(migrationPath) {
  console.log(`Running migration: ${migrationPath}\n`)

  // Read the migration file
  const sqlContent = fs.readFileSync(migrationPath, 'utf8')

  console.log('Migration SQL:')
  console.log('='.repeat(50))
  console.log(sqlContent)
  console.log('='.repeat(50))
  console.log('')

  try {
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent })

    if (error) {
      // Try direct execution if rpc doesn't work
      console.log('RPC method failed, trying direct execution...')

      // Split into individual statements and execute
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'))

      for (const statement of statements) {
        if (statement.toUpperCase().startsWith('BEGIN') || statement.toUpperCase().startsWith('COMMIT')) {
          continue // Skip transaction statements, Supabase handles these
        }

        console.log(`Executing: ${statement.substring(0, 60)}...`)
        const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement })

        if (stmtError) {
          console.error(`Error executing statement:`, stmtError)
          throw stmtError
        }
      }
    }

    console.log('\n✅ Migration completed successfully!')
    return true
  } catch (err) {
    console.error('\n❌ Migration failed:', err)
    console.error('\nPlease run this migration manually in the Supabase Dashboard:')
    console.error('1. Go to https://supabase.com/dashboard/project/djtejotbcnzzjfsogzlc/editor')
    console.error('2. Click "SQL Editor"')
    console.error('3. Paste the migration SQL above')
    console.error('4. Click "Run"')
    return false
  }
}

async function main() {
  const migrationFile = process.argv[2]

  if (!migrationFile) {
    console.error('Error: No migration file specified')
    console.error('Usage: node scripts/run-migration.js <migration-file>')
    console.error('Example: node scripts/run-migration.js supabase/migrations/010_add_enrichment_columns_to_penny_list.sql')
    process.exit(1)
  }

  const migrationPath = path.resolve(migrationFile)

  if (!fs.existsSync(migrationPath)) {
    console.error(`Error: Migration file not found: ${migrationPath}`)
    process.exit(1)
  }

  const success = await runMigration(migrationPath)
  process.exit(success ? 0 : 1)
}

main()
