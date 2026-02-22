# Penny Central

The official companion site for the "Home Depot One Cent Items" Facebook community (70,000+ members as of February 17, 2026). A utility/reference guide for finding Home Depot clearance items marked to $0.01.

**Live:** https://pennycentral.com

---

## Founder Command Center (Always Open)

If you (Cade) want one plain-English decision tree + prompt bank so you do not need to remember skill names, keep this open:

- `docs/FOUNDER-COMMAND-CENTER.md`

---

## What It Does

- **Penny List (Crowdsourced Reports)** ⭐ NEW — Community-powered list of reported penny finds, updated regularly (usually within about 5 minutes) from the site's "Report a Find" page (Supabase-backed).
- **Penny Guide** — Complete reference on how clearance items reach penny status
- **Store Finder** — Find nearby Home Depot locations with intelligent search (supports city, state name, ZIP code)
- **My List** — Save and organize penny finds for your next store run
- **Transparency** — Funding/disclosure details plus contact paths (`/transparency`)

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS Variables
- **Components:** shadcn/ui
- **Font:** Inter
- **Hosting:** Vercel

---

## Quick Start

```bash
npm install        # Install dependencies
npm run dev        # Dev server (localhost:3001)
npm run build      # Production build
npm run lint       # ESLint check
npm run test:e2e   # Playwright (uses port 3002 by default to avoid clashing with your dev server)
```

---

## Analytics (Privacy-Friendly)

Analytics are enabled in production by default:

- **Vercel Web Analytics** (automatic on Vercel production)
- **GA4** (gtag)

**Single switch (never remove):**

```bash
# Set to "false" to disable BOTH GA4 and Vercel Analytics
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

No “provider” env var is used — this avoids tracking silently dropping due to misconfiguration.

---

## AdSense Readiness + Professional Domain Email (Checklist)

Use this as the **single checklist** for a professional contact email and AdSense reviewer readiness.

### A) Domain + DNS Foundation

1. **Pick the canonical domain** (e.g., `www.pennycentral.com`) and set a 301 redirect from the apex.
2. **DNS on Cloudflare** (or your DNS provider):
   - Ensure the domain is active and the site resolves over HTTPS.
   - Keep your `A`/`CNAME` records pointed to Vercel (or your host).

### B) Professional Contact Email (Cloudflare Email Routing)

**Goal (AdSense-ready):** Create `contact@pennycentral.com` that forwards to your personal inbox and **does not bounce**.

**Step 1 — Cloudflare Email Routing (receive)**

1. Enable **Email Routing** in Cloudflare.
2. Add the **MX** + **TXT** records Cloudflare provides.
3. Create a **Custom Address**: `contact@pennycentral.com`.
4. Set the **Destination Address** to your personal email (e.g., `you@gmail.com`).

**Step 2 — Outbound / Replying (optional)**

Cloudflare Email Routing is **receive-only** (no SMTP). If you need to send/reply _from_ `contact@pennycentral.com`, pick one:

- **Option A (fastest, free):** Receive mail at `contact@...`, but reply from your personal email (set your Gmail display name to “Penny Central”). This is usually sufficient for AdSense.
- **Option B (reliable, paid):** Use an email host (Google Workspace, Fastmail, Zoho, etc.) and then configure Gmail “Send mail as” using that provider’s SMTP.
- **Option C (already in this repo):** Keep using Resend for the weekly digest/newsletter sender address; keep `contact@...` for inbound support.

**Step 3 — Verification (required)**

1. Send a test email **to** `contact@pennycentral.com` from another account.
2. Confirm it lands in your inbox and does **not bounce**.

### C) AdSense Review Readiness (Site Checklist)

1. **Contact page** with the professional email (`contact@pennycentral.com`).
2. **Privacy Policy** page (required).
3. **Terms/Disclaimer** page (recommended).
4. **Clear navigation** so reviewers can reach key pages.
5. **Sufficient original content** (not thin or placeholder).
6. **No broken links** / “under construction” pages.
7. **HTTPS everywhere** (no mixed-content warnings).
8. **Ads.txt ready** once AdSense is approved (AdSense gives the line to add).

### D) Optional (Nice-to-Have for Trust)

1. **About page** with who runs the site.
2. **Consistency**: use the same brand name in footer, email, and policy pages.
3. **Search Console** verification on the canonical domain.

---

## OG Images (Facebook Reliable)

Main pages use **static** OG PNGs for reliability on Facebook and other scrapers.

- **Static files:** `public/og/*.png`
- **Source template:** `app/api/og/route.tsx`
- **Generator:** `scripts/generate-og-images-playwright.ts` (screenshots the OG endpoint)

To regenerate after updating the OG template:

1. Ensure the dev server is running on port 3001.
2. Run:

```bash
tsx scripts/generate-og-images-playwright.ts
```

Then commit the updated `public/og/*.png` files.

---

## Definition of Done (Required)

For any meaningful change (especially UI/copy/navigation):

- Paste raw outputs for: `npm run verify:fast`
- Add `npm run e2e:smoke` output for route/form/API/navigation/UI-flow changes
- Add `npm run e2e:full` output when FULL trigger policy applies (or if explicitly requested)
- UI changes: capture Playwright screenshots (light/dark, mobile/desktop) and confirm browser console has no errors
- Branch hygiene evidence: branch used, commit SHA(s), push status, and session-end `git status --short`
- Docs/memory updated: `README.md`, `.ai/STATE.md`, `.ai/BACKLOG.md`, `.ai/SESSION_LOG.md`
- Include a structured next-agent handoff block per `.ai/HANDOFF_PROTOCOL.md`
- Token-only colors confirmed (no raw Tailwind palette); prefer `npm run lint:colors`
- Docs-only exception: if no runtime code paths changed, mark test lanes N/A with reason and run `npm run ai:memory:check` + `npm run ai:checkpoint`

See: `.ai/VERIFICATION_REQUIRED.md`

---

## Design System

**Full spec:** `docs/DESIGN-SYSTEM-AAA.md`

**Target:** WCAG AAA compliance (7:1 contrast for normal text)

**Palette:** Clean neutrals + blue CTA + amber live indicator

| Mode  | Background | Text      | CTA       | Live Indicator |
| ----- | ---------- | --------- | --------- | -------------- |
| Light | `#FFFFFF`  | `#1C1917` | `#2B4C7E` | `#D97706`      |
| Dark  | `#121212`  | `#DCDCDC` | `#8AA7C7` | `#FBBF24`      |

---

## Project Structure

```
app/                    # Pages (App Router)
  page.tsx              # Homepage
  store-finder/         # Store Finder
  lists/                # My List
  guide/                # Penny Guide
  about/                # About
  transparency/         # Transparency/funding disclosures
components/             # Shared components
docs/                   # Documentation
  DESIGN-SYSTEM-AAA.md  # Color & typography spec
lib/                    # Utilities and constants
public/                 # Static assets
```

---

## Critical Dec 2025 Updates

### Autonomous Penny List (Live)

- **Data source:** Supabase (`Penny List` + optional enrichment overlay when available)
- **Files:** `lib/fetch-penny-data.ts`, `app/api/submit-find/route.ts`, `app/api/penny-list/route.ts`
- **How it works:** Report Find inserts into `Penny List`; the site reads via `penny_list_public` (RLS-safe view). Enrichment fields (brand/model/upc/image/home_depot_url/internet_sku/retail_price) live on the Penny List rows and are filled via the `enrichment_staging` queue and the SerpApi gap-filler script.
- **Why there are 5 tables:** `lists`, `list_items`, `list_shares` exist for the optional Save/My Lists feature (separate from scraping/enrichment).
- **Legacy note:** The older Google Sheets pipeline is deprecated; historical docs are archived at `docs/legacy/PENNY-LIST-STRATEGY.md`.

### Setup Required

1. Set environment/secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; never exposed to the browser)
2. Apply/verify Supabase RLS + the public read view: `docs/supabase-rls.md`

---

## For AI Agents & Developers

| File                              | Purpose                                                              |
| --------------------------------- | -------------------------------------------------------------------- |
| `docs/skills/README.md`           | Task-to-skill index: fastest way to find exact implementation files  |
| `AGENTS.md`                       | Master source of truth — behavior rules, design system, constraints  |
| `SKILLS.md`                       | Technical stack, domain knowledge, MCP patterns                      |
| `CLAUDE.md`                       | Claude Code instructions (points to AGENTS.md)                       |
| `.github/copilot-instructions.md` | Copilot Chat instructions (points to AGENTS.md)                      |
| `PENNYCENTRAL_MASTER_CONTEXT.md`  | Founder strategic intent + cognitive-load protocol for future agents |
| `.ai/AI_ENABLEMENT_BLUEPRINT.md`  | When the goal is AI workflow/tooling/verification enablement         |
| `.ai/STATE.md`                    | Current snapshot of what is true right now                           |
| `.ai/BACKLOG.md`                  | Current priorities and execution order                               |
| `docs/DESIGN-SYSTEM-AAA.md`       | Complete color and typography specification                          |
| `docs/CROWDSOURCE-SYSTEM.md`      | Current Supabase tables and roles (Penny List + enrichment + lists)  |
| `docs/supabase-rls.md`            | Supabase RLS + public view policy set (how reads/writes are secured) |
| `docs/SCRAPING_COSTS.md`          | SerpApi enrichment budget + options                                  |
| `docs/PENNY-LIST-STRATEGY.md`     | Community intake strategy, low-effort moderation                     |

### AI Canon & Read Order (canonical entrypoint)

- **Start here:** Read `VISION_CHARTER.md` first (highest authority), then `.ai/START_HERE.md`
- The `.ai/README.md` file is now a stub that points back to this section
- **Read sequence:** `VISION_CHARTER.md` → `.ai/START_HERE.md` → `PENNYCENTRAL_MASTER_CONTEXT.md` → `.ai/CRITICAL_RULES.md` → `.ai/STATE.md` → `.ai/BACKLOG.md` → `.ai/CONTRACT.md` → `.ai/DECISION_RIGHTS.md`
- **Task closeout contract:** `.ai/HANDOFF_PROTOCOL.md` (mandatory completion + next-agent handoff schema)
- **First session only:** Read `.ai/GROWTH_STRATEGY.md` for business context
- **If session goal is AI workflow/tooling/verification enablement:** Also read `.ai/AI_ENABLEMENT_BLUEPRINT.md`
- **Rules:** Default no new dependencies; run `verify:fast` on meaningful changes, run `e2e:smoke` for flow changes, run `e2e:full` when FULL triggers apply, record results in `.ai/SESSION_LOG.md`; work on `dev` and promote verified changes to `main`
- **Planning rule (mandatory):** Decompose large plans into parent + child implementation slices (default: one user outcome per slice), with acceptance/rollback/verification per slice and a stop-go checkpoint after each slice.
- **Mandatory Alignment Gate before mutation:** GOAL / WHY / DONE MEANS / NOT DOING / CONSTRAINTS / ASSUMPTIONS / CHALLENGES

---

## Governance Quick Entry

Use this if the session is policy/process/governance heavy:

1. Read `VISION_CHARTER.md` (authority + decision hierarchy).
2. Confirm the Alignment Gate block is complete before any file edits.
3. Follow canonical owners only:
   - Vision/authority: `VISION_CHARTER.md`
   - Read order: `README.md`, `.ai/START_HERE.md`
   - Agent behavior: `AGENTS.md`
   - Non-negotiables: `.ai/CRITICAL_RULES.md`
   - Technical boundaries: `.ai/CONSTRAINTS.md`
   - Verification contract: `.ai/VERIFICATION_REQUIRED.md`
   - Collaboration/approvals: `.ai/CONTRACT.md`, `.ai/DECISION_RIGHTS.md`
   - Closeout/handoff: `.ai/HANDOFF_PROTOCOL.md`
4. If secondary docs conflict with canonical owners, update secondary docs to reference canon instead of redefining policy.

---

## Affiliate Links & Redirects

- Retired referral routes `/go/rakuten` and `/go/befrugal` now redirect to `/transparency`.
- Do not claim active referral/affiliate programs in public copy unless monetization status is explicitly reactivated and legal pages are updated.
- When monetization status changes, use `docs/skills/legal-monetization-copy-guard.md` to update disclosures, route behavior, and tests together.

---

## Branch Strategy

- **`dev`** — integration branch for active implementation work.
- **`main`** — protected deployment branch. Only promote verified work from `dev`.

**Workflow:**

1. `git checkout dev && git pull origin dev`
2. Run `git status --short` before new work. If dirty, close carryover first (commit/push or explicit blocker resolution) before starting another objective.
3. Make scoped changes for one objective on `dev`.
4. Stage intentionally (`git add <paths>`) and verify staged scope with `git diff --cached --name-only`.
5. Run `npm run ai:memory:check` + `npm run verify:fast` (and `npm run e2e:smoke` for route/form/API/navigation/UI-flow changes).
6. Commit/push `dev`.
7. Re-run `git status --short`; clean is expected before starting the next task.
8. Promote to `main` only after review and all required checks pass.

---

## Community

- **Facebook Group:** Home Depot One Cent Items (70,000+ members as of February 17, 2026)
- **Purpose:** Educational resource for penny hunting community
- **Penny List Form:** Collects verified penny finds from community members

---

## License

Educational use. Not affiliated with Home Depot.
