# Supabase Configuration

This directory contains the Supabase configuration and migrations for PennyCentral.

## Setup

The Supabase VS Code extension is configured and linked to the remote project:

- **Project Ref**: `djtejotbcnzzjfsogzlc`
- **Project URL**: https://djtejotbcnzzjfsogzlc.supabase.co

## Files

- `config.toml` - Local Supabase CLI configuration
- `.env.local` - Remote project credentials (DO NOT COMMIT)
- `migrations/` - Database migration files
- `.temp/` - Temporary files (ignored by git)

## VS Code Extension Features

With the Supabase extension installed, you can:

1. **View Database Schema** - Right-click on tables to view structure
2. **Run SQL Queries** - Use the SQL editor with syntax highlighting
3. **Manage Migrations** - Create and run migrations
4. **View Logs** - Monitor real-time database logs
5. **GitHub Copilot Integration** - Get Supabase-specific code suggestions

## Using the Extension

### Open Supabase Panel

- Press `Cmd/Ctrl+Shift+P` and search for "Supabase"
- Click the Supabase icon in the Activity Bar (if visible)

### Link to Remote Project

The project is already linked via `.vscode/settings.json`:

```json
"supabase.projectRef": "djtejotbcnzzjfsogzlc"
```

### Run SQL Queries

1. Create a new `.sql` file
2. Right-click and select "Run on Supabase"
3. View results in the output panel

### Create Migrations

1. Make changes to your database schema
2. Generate migration: `supabase db diff -f <migration_name>`
3. Apply locally: `supabase db reset`
4. Push to remote: `supabase db push`

## Environment Variables

The following variables are used (stored in root `.env.local`):

- `NEXT_PUBLIC_SUPABASE_URL` - Public API URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key (safe for client)
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (server-only, never expose)
- `SUPABASE_ACCESS_TOKEN` - CLI access token

## Security Notes

- Never commit `.env.local` files
- Service role key has full database access - use only server-side
- Anon key is safe for client-side use (protected by RLS policies)

## Existing Migrations

The following migrations have been applied:

1. `001_create_lists_tables.sql` - User lists feature
2. `002_create_list_shares.sql` - List sharing
3. `003_security_search_path.sql` - Security settings
4. `004_create_enrichment_table.sql` - Product enrichment
5. `005_add_source_column.sql` - Source tracking
6. `006_add_serpapi_source.sql` - SerpAPI integration
7. `007_enrichment_status.sql` - Enrichment status tracking
8. `008_apply_penny_list_rls.sql` - Row Level Security
9. `009_add_retail_price_to_enrichment.sql` - Retail price field
10. `010_add_enrichment_columns_to_penny_list.sql` - Additional enrichment fields

## Troubleshooting

### Extension Not Connecting

1. Check that `.vscode/settings.json` has the correct `projectRef`
2. Verify `.env.local` has valid credentials
3. Reload VS Code window (`Cmd/Ctrl+Shift+P` → "Reload Window")

### CLI Commands Not Working

1. Install Supabase CLI: `npm install -g supabase`
2. Link project: `supabase link --project-ref djtejotbcnzzjfsogzlc`
3. Login: `supabase login` (uses SUPABASE_ACCESS_TOKEN from .env.local)

### Migration Issues

- Local and remote schemas can drift - always test migrations locally first
- Use `supabase db pull` to sync remote schema to local
- Use `supabase db push` to apply local migrations to remote
