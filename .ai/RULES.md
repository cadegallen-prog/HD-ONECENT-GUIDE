# QA Rules

## Default: qa:fast

All PRs run `npm run qa:fast` automatically. This includes:
- **lint** - ESLint checks
- **test:unit** - Unit tests
- **build** - Next.js production build (catches type errors)

Estimated time: ~2 minutes

## When to Run qa:full

Full QA runs automatically when:
- PR touches **risky files** (auth, db, api, infra, fragile UI)
- PR has the **`full-qa` label** added

Full QA can also be triggered:
- **Manually** via GitHub Actions tab (workflow_dispatch)

### What qa:full Adds
- **test:e2e** - Playwright end-to-end tests
- **check-contrast** - Color contrast validation
- **check-axe** - Accessibility checks

Estimated time: ~8 minutes

## Risky File Paths (Auto-Trigger Full QA)

```
middleware.ts          # Auth & security
app/auth/**            # Auth pages
lib/supabase/**        # Database client
supabase/migrations/** # DB schema changes
lib/fetch-penny-data.ts
lib/penny-list-query.ts
app/api/**             # API routes
next.config.js         # Build config
package.json           # Dependencies
.github/workflows/**   # CI changes
components/store-map.tsx # Fragile component
app/**/layout.tsx      # Layout changes
app/globals.css        # Global styles
```

## Local Commands

```bash
# Quick validation (no server needed)
npm run qa:fast

# Full validation (requires server for e2e)
npm run qa:full
```

## Branch Protection

Required check: `quality-fast` only.
Full QA is optional unless triggered by paths or label.
