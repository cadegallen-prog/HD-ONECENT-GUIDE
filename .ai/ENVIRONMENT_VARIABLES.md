# Environment Variables Reference

**Last Updated:** 2025-12-29
**Purpose:** Track all environment variables for Penny Central project

---

## 🟢 REQUIRED - Your Code Uses These

### Supabase (3 variables)

| Variable                        | Where Set                     | Purpose                               | Used In                                                |
| ------------------------------- | ----------------------------- | ------------------------------------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Vercel (Supabase Integration) | Supabase project URL                  | `lib/supabase/client.ts`, form submissions             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel (Supabase Integration) | Public read/write key (RLS protected) | `lib/supabase/client.ts`, client-side queries          |
| `SUPABASE_SERVICE_ROLE_KEY`     | Vercel (Supabase Integration) | Admin master key (bypasses RLS)       | Server-side admin operations, fallback for submissions |

**Why NEXT_PUBLIC prefix?**

- Makes the variable available in browser JavaScript
- Safe to expose because RLS (Row Level Security) protects the data
- Service role key does NOT have NEXT_PUBLIC (server-only, must stay secret)

---

### Sentry (4 variables)

| Variable            | Where Set       | Purpose                          | Used In                   |
| ------------------- | --------------- | -------------------------------- | ------------------------- |
| `SENTRY_DSN`        | Vercel (Manual) | Error reporting endpoint         | All runtime error capture |
| `SENTRY_ORG`        | Vercel (Manual) | Sentry organization name         | Build process             |
| `SENTRY_PROJECT`    | Vercel (Manual) | Sentry project name              | Build process             |
| `SENTRY_AUTH_TOKEN` | Vercel (Manual) | Upload source maps during builds | Build process only        |

**Why needed?**

- Captures JavaScript errors in production
- Sends email alerts when errors occur
- Source maps help debug minified code

---

### Home Depot Stores (0 variables - Uses Local File)

**Single Source of Truth:** `data/stores/store_directory.master.json`

**How it works:**

- Store location data is bundled with the application during build
- Deployed to Vercel as part of the build artifacts
- API route at `app/api/stores/route.ts` reads from local file
- No remote storage needed (simpler, fewer dependencies)

**To update store data:**

1. Edit `data/stores/store_directory.master.json`
2. Commit and push to GitHub
3. Vercel auto-deploys with updated data (~2-3 minutes)

**Previous approach (deprecated):**

- ~~Used Vercel Blob Storage for remote updates~~
- ~~Required `NEXT_PUBLIC_HOME_DEPOT_STORES_URL` and `NEXT_PUBLIC_HOME_DEPOT_STORES_URL_READ_WRITE_TOKEN`~~
- **Removed Dec 2025:** Unnecessary complexity for infrequently-changing data

---

### Vercel System (1 variable)

| Variable            | Where Set               | Purpose                   | Used In                            |
| ------------------- | ----------------------- | ------------------------- | ---------------------------------- |
| `VERCEL_OIDC_TOKEN` | Vercel (Auto-generated) | OpenID Connect auth token | GitHub Actions, Vercel deployments |

**Don't touch this** - Vercel manages it automatically.

---

### Ezoic Ads (1 variable)

| Variable                    | Where Set       | Purpose                                                              | Used In                        |
| --------------------------- | --------------- | -------------------------------------------------------------------- | ------------------------------ |
| `NEXT_PUBLIC_EZOIC_ENABLED` | Vercel (Manual) | Kill switch for Ezoic placeholders + scripts (`false` disables ads). | `lib/ads.ts`, `app/layout.tsx` |

**Default behavior:** If unset, ads are enabled in production builds (placeholders + scripts gated to Vercel production).

**Important:** Vercel requires a redeploy for env var changes to take effect (because `NEXT_PUBLIC_*` values are inlined at build time).

---

## 🟡 OPTIONAL - Integration-Managed (Unused but Harmless)

These were auto-created by the Supabase Vercel Integration but your code doesn't use them:

### Analytics (privacy-friendly)

| Variable                           | Where Set             | Purpose                                              | Used In                              |
| ---------------------------------- | --------------------- | ---------------------------------------------------- | ------------------------------------ |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER`   | Vercel / `.env.local` | Analytics provider: `plausible`, `vercel`, or `none` | `app/layout.tsx`, `lib/analytics.ts` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`     | Vercel / `.env.local` | Plausible site domain (required for Plausible)       | `app/layout.tsx`                     |
| `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC` | Vercel / `.env.local` | Optional Plausible script override (self-host)       | `app/layout.tsx`                     |
| `NEXT_PUBLIC_PLAUSIBLE_API_HOST`   | Vercel / `.env.local` | Optional Plausible API endpoint override (self-host) | `app/layout.tsx`                     |

**Local disable:** set `NEXT_PUBLIC_ANALYTICS_PROVIDER=none` in `.env.local`.

### Supabase Duplicates

- `SUPABASE_URL` - Duplicate of `NEXT_PUBLIC_SUPABASE_URL` (unused)
- `SUPABASE_ANON_KEY` - Duplicate of `NEXT_PUBLIC_SUPABASE_ANON_KEY` (unused)
- `SUPABASE_PUBLISHABLE_KEY` - Same as anon key (unused)
- `SUPABASE_JWT_SECRET` - For manual JWT validation (unused)
- `SUPABASE_SECRET_KEY` - Unknown purpose (unused)

### Postgres Variables (from Vercel Postgres, but you use Supabase)

- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_HOST`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

**Why they exist:**

- Created by Supabase Vercel Integration
- Can't be manually deleted (integration-managed)
- Harmless to leave them (your code ignores them)

---

## ❌ DELETED - Removed as Obsolete

| Variable                                             | Why Deleted                                    | When     |
| ---------------------------------------------------- | ---------------------------------------------- | -------- |
| `GOOGLE_SHEET_URL`                                   | Migrated from Google Sheets to Supabase        | Dec 2025 |
| `GOOGLE_APPS_SCRIPT_URL`                             | Migrated from Google Sheets to Supabase        | Dec 2025 |
| `NEXT_PUBLIC_HOME_DEPOT_STORES_URL`                  | Removed Vercel Blob - using local file instead | Dec 2025 |
| `NEXT_PUBLIC_HOME_DEPOT_STORES_URL_READ_WRITE_TOKEN` | Removed Vercel Blob - using local file instead | Dec 2025 |

---

## 📋 Local Development Setup (.env.local)

**You don't currently have a `.env.local` file**, and that's fine because:

- Supabase keys are already in Vercel (not secret)
- No local-only testing credentials needed
- `npm run dev` works without it

**If you wanted to test locally with different Supabase credentials:**

```bash
# .env.local (create this file in project root if needed)
NEXT_PUBLIC_SUPABASE_URL=your-test-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-test-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-test-service-role-key
```

**Important:** `.env.local` is already in `.gitignore` (safe to add secrets)

---

## 🔐 Security Notes

### ✅ Safe to Expose (NEXT_PUBLIC prefix)

- `NEXT_PUBLIC_SUPABASE_URL` - Just a URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Protected by RLS
- `NEXT_PUBLIC_HOME_DEPOT_STORES_URL` - Read-only public data

### 🔒 MUST Keep Secret (No NEXT_PUBLIC)

- `SUPABASE_SERVICE_ROLE_KEY` - Full database admin access
- `SENTRY_AUTH_TOKEN` - Can upload to your Sentry account

**How secrets are protected:**

- Server-only (no NEXT_PUBLIC prefix) → Never sent to browser
- Vercel encrypts all environment variables
- `.env.local` is gitignored (never committed to GitHub)

---

## 🎯 Quick Reference

**Need to add a new env var?**

1. **For production/Vercel:**
   - Go to Vercel → Settings → Environment Variables
   - Add the variable
   - Select environments (Production, Preview, Development)
   - Redeploy for changes to take effect

2. **For local development only:**
   - Create/edit `.env.local` in project root
   - Add `VARIABLE_NAME=value`
   - Restart `npm run dev`

**When to use NEXT_PUBLIC prefix?**

- ✅ If the browser/client-side code needs it
- ❌ If it's a secret (API keys, tokens, passwords)
- ❌ If only server-side code needs it

---

## 📊 Current Count

- **Required (used by code):** 8 variables
- **Optional (integration-managed):** 14+ variables
- **Deleted (obsolete):** 4 variables
- **Total in Vercel:** ~23 variables

---

## 🔄 Maintenance

**When to update this doc:**

- Adding a new environment variable
- Removing/deprecating a variable
- Changing what a variable does
- After major integrations (new services)

**Last major changes:**

- Dec 27, 2025: Removed Vercel Blob Storage (2 deleted, switched to local file)
- Dec 27, 2025: Added Sentry (4 variables)
- Dec 2025: Removed Google Sheets variables (2 deleted)
- Dec 2025: Migrated to Supabase (Supabase integration added ~15 variables)
