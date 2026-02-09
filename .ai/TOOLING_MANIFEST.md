# Tooling Manifest

**Last verified:** February 1, 2026

## npm Scripts

### Core Development

| Script        | Command                        | Purpose                   |
| ------------- | ------------------------------ | ------------------------- |
| ai:doctor     | `npm run ai:doctor`            | Pre-flight health check   |
| ai:verify     | `npm run ai:verify`            | Run all 4 quality gates   |
| ai:proof      | `npm run ai:proof -- [routes]` | Screenshot capture        |
| lint          | `npm run lint`                 | ESLint check              |
| build         | `npm run build`                | Next.js build             |
| test:unit     | `npm run test:unit`            | Unit tests                |
| test:e2e      | `npm run test:e2e`             | Playwright E2E tests      |
| lint:colors   | `npm run lint:colors`          | Block raw Tailwind colors |
| security:scan | `npm run security:scan`        | Block PII in commits      |

### Enrichment & Data Management

| Script             | Command                      | Purpose                                         |
| ------------------ | ---------------------------- | ----------------------------------------------- |
| warm:staging       | `npm run warm:staging`       | Scrape penny items from Scouter API to staging  |
| metrics:enrichment | `npm run metrics:enrichment` | Show staging consumption metrics & cost savings |
| enrich:auto        | `npm run enrich:auto`        | Auto-enrich penny items (legacy)                |
| enrich:bulk        | `npm run enrich:bulk`        | Bulk enrich penny items (legacy)                |
| enrich:stealth     | `npm run enrich:stealth`     | Stealth enrich penny items (legacy)             |
| enrich:serpapi     | `npm run enrich:serpapi`     | Real-time SerpAPI enrichment (active)           |

## Enrichment Staging System

**Purpose:** Pre-populate penny item metadata from Scouter API to avoid expensive SerpAPI calls.

**Architecture:**

1. **Staging Warmer** (`npm run warm:staging`) - Scrapes bulk penny items from `pro.scouterdev.io` API, upserts to `enrichment_staging` table
2. **Consumption** (automatic) - When users submit penny finds, `consume_enrichment_for_penny_item()` RPC matches staging data by SKU and fills metadata
3. **Metrics** (`npm run metrics:enrichment`) - Shows consumption rate, fields filled, cost savings

**Database Tables:**

- `enrichment_staging` - Queue of pre-scraped items (SKU, item_name, brand, image_url, etc.)
- `Penny List` - Main list with `enrichment_provenance` JSONB tracking source of each field

**Cost Savings:**

- SerpAPI: $0.125/item (2.5 credits × $0.05/credit)
- Staging enrichment: ~$0 (one-time scrape amortized over many items)

**Configuration:**

- Required env vars: `PENNY_RAW_COOKIE`, `PENNY_GUILD_ID` (in `.env.local`, do NOT commit)
- Default zips: Atlanta metro (30301, 30303, 30305, 30308, 30309)
- Default max items: 6,000 per run
- Retention: 60 days (stale rows pruned during warmer runs)

**Note:** Staging warmer runs locally only (GitHub Actions blocked by Cloudflare).

## Slash Commands (Claude Code)

| Command        | Purpose                                |
| -------------- | -------------------------------------- |
| /doctor        | Run pre-flight health check            |
| /verify        | Run all quality gates + generate proof |
| /proof         | Capture screenshots of routes          |
| /session-start | Start session with proper context      |
| /session-end   | End session with verification          |

## MCP Servers (5 Active - Unified Across All Tools)

MCPs are configured for ALL THREE AI tools:

| Config File             | Tool                           |
| ----------------------- | ------------------------------ |
| `.vscode/mcp.json`      | VS Code Copilot                |
| `.claude/settings.json` | Claude Code                    |
| `~/.codex/config.toml`  | Codex (see `.ai/MCP_SETUP.md`) |

| MCP         | Purpose                             |
| ----------- | ----------------------------------- |
| Filesystem  | Read/write project files            |
| Git         | Version control operations          |
| GitHub      | PRs, issues, actions                |
| Supabase    | Direct database access, SQL queries |
| Interactive | User input/clarification tools      |
| Vercel      | Deployment info (Claude only)       |

**Setup Guide:** `.ai/MCP_SETUP.md`

## Git Hooks (Husky)

| Hook       | Runs                            |
| ---------- | ------------------------------- |
| pre-commit | `security:scan` + `lint:colors` |

## Fixture Mode

When `PLAYWRIGHT=1` is set, the app uses deterministic fixture data instead of live Supabase calls. This enables stable E2E tests.

| Fixture File                  | Purpose          |
| ----------------------------- | ---------------- |
| `data/penny-list.json`        | Penny list items |
| `data/home-depot-stores.json` | Store locations  |

Playwright automatically sets `PLAYWRIGHT=1` when running tests (see `playwright.config.ts`).

## Agent System

| Document                | Purpose                                                      |
| ----------------------- | ------------------------------------------------------------ |
| `.ai/AGENT_POOL.md`     | All agent definitions (Architect, Implementer, Tester, etc.) |
| `.ai/ORCHESTRATION.md`  | How to chain agents together                                 |
| `.ai/AGENT_QUICKREF.md` | One-page cheat sheet for owner                               |

**How to invoke:** Say "Act as the [agent name] agent"

| Agent        | Purpose                       |
| ------------ | ----------------------------- |
| Architect    | Design plans, don't code      |
| Implementer  | Build approved plans          |
| Tester       | Write tests, run verification |
| Debugger     | Investigate and fix bugs      |
| Reviewer     | Check code before merge       |
| Documenter   | Update .ai/ docs              |
| Brainstormer | Explore ideas                 |

## Reusable Utilities

| Utility                    | Location                         | Purpose                                                                                      |
| -------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------- |
| `copyToClipboard(text)`    | `components/copy-sku-button.tsx` | Cross-browser clipboard copy with iOS Safari + Android fallback. Returns `Promise<boolean>`. |
| `formatSkuForDisplay(sku)` | `lib/sku.ts`                     | Format SKU with hyphens (6-digit: XXX-XXX, 10-digit: XXXX-XXX-XXX)                           |
| `validateSku(rawSku)`      | `lib/sku.ts`                     | Validate SKU format (6 or 10 digits, proper prefix, no patterns)                             |
| `buildReportFindUrl(opts)` | `lib/report-find-link.ts`        | Build prefilled /report-find URL with sku, name, src params                                  |
| `trackEvent(name, params)` | `lib/analytics.ts`               | Send GA4 event                                                                               |

## Parallel Agent Patterns

Use parallel agents for:

- UI + Tests (separate ownership)
- API + Frontend integration
- Core implementation + Documentation

Avoid parallel agents for:

- Debugging (needs shared context)
- Refactoring (naming drift risk)
- Single-file changes

See `.ai/ORCHESTRATION.md` for full patterns.
