# Context Handoff Pack (Portable, Tool-Agnostic)

**Last Updated:** Mar 3, 2026 by Claude Code (Opus 4.6)

**Purpose:** Compressed, copy-paste-ready context for starting fresh chats or switching tools (Claude / Codex / Copilot).

---

## TL;DR (Read This First)

### What is Penny Central?

**Open-source Next.js PWA** helping Home Depot shoppers find "penny items" (clearance deals, often $0.01 to $10). Live at pennycentral.com.

### Current Reality (2026-03-03)

- ✅ **Site Recovery S1 (Hydration Stability) shipped** — global hydration mismatch fixed, 9-route regression coverage locked
- ✅ **Report-find basket hotfix shipped** — multi-item basket submit restored, 30-item limit aligned UI/API, blank draft field no longer blocks submit
- ✅ **FAQ CTR remediation shipped** — `/faq` is now an internal-link hub routing into the product loop
- ✅ **Resend SMTP connected to Supabase Auth** — OTP emails send from `noreply@pennycentral.com` via Resend (configured 2026-03-03)
- ✅ **Design system solid:** WCAG AAA compliant, CSS variable tokens, guide-article class
- ✅ **Agent continuity system created** — `.ai/THREAD.md` (reasoning chain) + `.ai/SURFACE_BRIEFS.md` (evaluative context per route) wired into all agent read orders
- 🔄 **PR #143 open** — monumetric docs + enrichment migration + FAQ fix. `full-e2e` failing on `report-find-batch.spec.ts` (basket hotfix not cherry-picked to release branch yet)
- 🔄 **Uncommitted work on dev** — S1 hydration fix, report-find hotfix, email docs, archived orphans, continuity system files (THREAD.md, SURFACE_BRIEFS.md, site recovery plans). See file list below.
- 🔄 **Site Recovery S2 (Homepage Proof Front Door)** is the next implementation slice
- ❌ **Weekly email digest paused** — 400 subscribers, Resend free tier (100/day) means 4-5 day send window. Needs Pro upgrade ($20/month) before resuming.
- ❌ **Monumetric ads disabled** — emergency rollback 2026-02-27 (refresh loop + header blocking). Do not re-enable without root-cause fix.
- ❌ **AdSense blocked** — policy violations (moved from "Low Value Content" to specific violations on Feb 12)
- 📊 **Metrics:** ~680 daily users, 26% conversion (HD clicks), ~400 email subscribers, 70K+ Facebook community

### Immediate Next Moves

1. **Add Context7 MCP** to Claude Code, Copilot, and Codex configs — gives all agents up-to-date library docs instead of stale training data. One-time setup, zero cost. See "MCP Upgrades" section below.
2. **Evaluate MCP Memory Service** — cross-agent persistent semantic memory that could replace manual markdown-based context management. Needs Windows compatibility check. See "MCP Upgrades" section below.
3. **Commit the uncommitted work on dev** — S1 + report-find hotfix + continuity system + email docs are verified but not committed
4. **Fix PR #143** — cherry-pick basket hotfix onto `release/ship-monumetric-and-faq` so `full-e2e` passes, then merge
5. **Start S2 (Homepage Proof Front Door)** — plan at `.ai/impl/site-recovery-s2-homepage-proof-front-door.md`

---

## What Just Happened (2026-03-03, Claude Code — session 2)

1. Reviewed dev branch — 7 commits ahead of main. 5 safe to ship, 2 held back (guide hub refocus + Copilot workflow — Cade hasn't verified)
2. Cherry-picked 5 commits onto `release/ship-monumetric-and-faq`, created PR #143
3. PR #143 CI result: fast gate + smoke pass, `full-e2e` fails on `report-find-batch.spec.ts` (pre-existing bug fixed on dev but not on the release branch)
4. Deep discussion about agent continuity: agents have been making changes without understanding what "good" looks like for each surface. Identified the gap between executing tasks and evaluating quality.
5. Created `.ai/THREAD.md` — reasoning chain document that carries the _why_ forward between sessions (not just what happened)
6. Created `.ai/SURFACE_BRIEFS.md` — evaluative context per surface with job descriptions, success criteria, failure modes, and baseline metrics from GA4 data
7. Wired both files into all three agent entry points (CLAUDE.md, CODEX_ENTRY.md, copilot-instructions.md) and the handoff protocol
8. Researched current tools for agent continuity — discovered Context7 MCP (up-to-date docs), MCP Memory Service (cross-agent semantic memory), and the three-tier context architecture pattern from academic research

---

## MCP Upgrades to Evaluate

### Context7 (Ready to add)

**What:** MCP server that gives agents real-time access to up-to-date library documentation instead of relying on stale training data.

**Why:** Claude's training data cuts off ~May 2025. Next.js 16, newer Tailwind, etc. may have APIs that agents guess at instead of looking up.

**Setup:**

- Claude Code: `claude mcp add context7 -- npx -y @upstash/context7-mcp@latest`
- Copilot (`.vscode/mcp.json`): add `"context7": { "type": "http", "url": "https://mcp.context7.com/mcp" }`
- Codex (`~/.codex/config.toml`): add equivalent config

**Cost:** Free. **Risk:** Low. **Source:** https://github.com/upstash/context7

### MCP Memory Service (Needs evaluation)

**What:** Self-hosted persistent memory service with semantic search, knowledge graphs, and cross-agent memory sharing. Works with Claude Code, Copilot, Codex, and ChatGPT.

**Why:** Could replace manual markdown-based context management. Agents would automatically capture and retrieve relevant context instead of relying on file reads.

**Key questions before adopting:**

- Does it run cleanly on Windows 11?
- Does the semantic search actually surface relevant context better than grep on `.ai/` files?
- Is the maintenance overhead worth the benefit for a solo-founder project?
- Does it complement or replace THREAD.md / SURFACE_BRIEFS.md?

**Source:** https://github.com/doobidoo/mcp-memory-service

### Three-Tier Context Architecture (Pattern reference)

**What:** Academic pattern (arXiv 2602.20478) for structuring AI agent context: hot memory (always loaded), specialist agents (per-task), cold memory (queried on-demand via retrieval service).

**Current fit:** PennyCentral's `.ai/START_HERE.md` + `CRITICAL_RULES.md` = Tier 1. Agent pool = partial Tier 2. Tier 3 (on-demand retrieval) is the gap that MCP Memory Service could fill.

**Source:** https://arxiv.org/html/2602.20478v1

---

## Uncommitted Changes on dev

Verified work from Codex + Claude sessions that need committing:

| File                                    | Source                   | What changed                                         |
| --------------------------------------- | ------------------------ | ---------------------------------------------------- |
| `app/layout.tsx`                        | S1 (Codex)               | Grow script → `next/script afterInteractive`         |
| `lib/penny-list-utils.ts`               | S1 (Codex)               | DIY normalization fix                                |
| `tests/visual-smoke.spec.ts`            | S1 (Codex)               | Hydration mismatch sweep for 9 routes                |
| `tests/smoke-critical.spec.ts`          | S1 (Codex) + report-find | Penny list text + report-find coverage               |
| `tests/penny-list-utils.test.ts`        | S1 (Codex)               | DIY normalization unit test                          |
| `.ai/THREAD.md`                         | Claude (this session)    | NEW: reasoning chain continuity doc                  |
| `.ai/SURFACE_BRIEFS.md`                 | Claude (this session)    | NEW: evaluative context per surface                  |
| `.ai/START_HERE.md`                     | Claude (this session)    | THREAD + SURFACE_BRIEFS added to read order          |
| `.ai/HANDOFF_PROTOCOL.md`               | Claude (this session)    | THREAD + SURFACE_BRIEFS added to session-end updates |
| `.ai/CODEX_ENTRY.md`                    | Claude (this session)    | Read order updated                                   |
| `.ai/ENVIRONMENT_VARIABLES.md`          | Claude (earlier)         | SMTP cross-reference                                 |
| `.ai/BACKLOG.md`                        | Codex                    | S1 completion update                                 |
| `.ai/LEARNINGS.md`                      | Codex                    | New learnings                                        |
| `.ai/plans/INDEX.md`                    | Codex                    | Site recovery registered                             |
| `.ai/impl/site-recovery-*.md` (9 files) | Codex                    | NEW: site recovery program + 8 slice plans           |
| `.ai/topics/SITE_RECOVERY_CURRENT.md`   | Codex                    | NEW: per-route quality audit                         |
| `CLAUDE.md`                             | Claude (this session)    | Read order updated                                   |
| `.github/copilot-instructions.md`       | Claude (this session)    | Continuity rule added                                |
| `.gitignore`                            | Codex                    | Removed 2 entries                                    |
| `Guide Remodel/*` (deleted)             | Codex                    | Archived to `archive/root-level-orphans/`            |
| `monumental/*` (deleted)                | Codex                    | Archived to `archive/root-level-orphans/`            |
| `docs/EMAIL-INFRASTRUCTURE.md`          | Claude (earlier)         | NEW: full email setup doc                            |

**Recommendation:** Commit as 3-4 separate commits:

1. S1 hydration fix (layout.tsx, penny-list-utils, tests)
2. Agent continuity system (THREAD.md, SURFACE_BRIEFS.md, read order updates)
3. Site recovery planning docs (impl plans, site recovery audit)
4. Housekeeping (email docs, archived orphans, .gitignore)

---

## Open PRs

| PR       | Branch                            | Status             | Action needed               |
| -------- | --------------------------------- | ------------------ | --------------------------- |
| #143     | `release/ship-monumetric-and-faq` | `full-e2e` failing | Cherry-pick basket hotfix   |
| #138     | dependabot: zod 3→4               | Passing            | Review — major version bump |
| #137     | dependabot: react-email bump      | Passing            | Review                      |
| #136-145 | Various dependabot                | Mixed              | Low priority                |

---

## Held-back Changes on dev (Need Cade's Review)

| Commit    | What it does                                                                                          | Why held            |
| --------- | ----------------------------------------------------------------------------------------------------- | ------------------- |
| `9cc9800` | Rewrites `/guide` page intro — Part 1 primer, ethical disclosure moved, chapter grid starts at Part 2 | Cade hasn't seen it |
| `2843e20` | Copilot native workflow — 7 agent definitions + 6 prompt files under `.github/`                       | Cade hasn't seen it |

---

## Site Recovery Program (Current Priority)

**Plan:** `.ai/impl/site-recovery-program.md`
**Current state audit:** `.ai/topics/SITE_RECOVERY_CURRENT.md`

| Slice                                | Status                                |
| ------------------------------------ | ------------------------------------- |
| S0 — Planning spine                  | ✅ Complete                           |
| S1 — Hydration stability             | ✅ Complete (verified, not committed) |
| **S2 — Homepage proof front door**   | **Next**                              |
| S3 — Guide core rebuild              | Planned                               |
| S4 — Penny list mobile focus         | Planned                               |
| S5 — Report-find compression         | Planned                               |
| S6 — Typography/template consistency | Planned                               |
| S7 — Store finder supporting role    | Planned                               |
| S8 — Trust pages hardening           | Planned                               |

---

## Key Decisions Pending

| Decision                     | Context                                                         | Who                              |
| ---------------------------- | --------------------------------------------------------------- | -------------------------------- |
| Add Context7 MCP?            | Gives agents current library docs. One command, free, low risk. | Cade (approve) → agent (execute) |
| Evaluate MCP Memory Service? | Cross-agent semantic memory. Needs Windows check.               | Agent (research) → Cade (decide) |
| Resume weekly digest?        | 400 subs, free tier can't handle it. Resend Pro = $20/month     | Cade                             |
| Re-enable Monumetric?        | Rollback 2026-02-27. Need root-cause for refresh loop           | Cade + agent                     |
| Review guide hub refocus     | Sitting on dev unverified                                       | Cade                             |
| Review Copilot workflow      | `.github/agents/` + `.github/prompts/` added                    | Cade                             |

---

## Email Infrastructure Summary

| Path                   | Sender                     | Method                   | Configured where                 |
| ---------------------- | -------------------------- | ------------------------ | -------------------------------- |
| Supabase Auth (OTP)    | `noreply@pennycentral.com` | Resend SMTP              | Supabase Dashboard > Auth > SMTP |
| Weekly Digest (paused) | `updates@pennycentral.com` | Resend SDK (API)         | `RESEND_API_KEY` in Vercel       |
| Inbound support        | `contact@pennycentral.com` | Cloudflare Email Routing | Cloudflare dashboard             |

Rate limits (free tier): 100/day, 3,000/month, 60-sec OTP interval.
Full docs: `docs/EMAIL-INFRASTRUCTURE.md`

---

## Quick-start Read Order

### Always First (5 min)

1. `.ai/START_HERE.md`
2. `.ai/CRITICAL_RULES.md`
3. `.ai/THREAD.md`
4. `.ai/STATE.md`

### Always Second (2 min)

5. **This file** (`.ai/HANDOFF.md`)

### Before Touching Any Surface

6. `.ai/SURFACE_BRIEFS.md` (read the brief for the surface you're modifying)

### Contextual (Choose One)

- **For general:** `.ai/BACKLOG.md` + `.ai/GROWTH_STRATEGY.md`
- **For site recovery (current priority):** `.ai/impl/site-recovery-program.md` → `site-recovery-s2-homepage-proof-front-door.md`
- **For monetization:** `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
- **For email/auth:** `docs/EMAIL-INFRASTRUCTURE.md`
- **For topic work:** `.ai/topics/INDEX.md` → `.ai/topics/<TOPIC>.md`

### Before Implementation

- `.ai/CONTRACT.md`
- `.ai/DECISION_RIGHTS.md`
- `.ai/CONSTRAINTS.md`

---

## Tool Capability Notes

### Claude Code (VSCode Extension)

- ✅ **MCP:** filesystem, git, github, playwright, supabase
- ✅ **Skills:** plan, architect, implement, test, review, debug, handoff, verify, etc.
- ✅ **GA4/GSC:** `npm run analytics:delta`
- ✅ **Ideal for:** Full feature development (design, code, test, verify)
- 🔜 **Pending:** Context7 MCP (up-to-date library docs)

### Codex (ChatGPT, GPT-5.2)

- ✅ **MCP:** Same (if `~/.codex/config.toml` is synced)
- ✅ **Ideal for:** Full feature development, alternative perspective
- 🔜 **Pending:** Context7 MCP

### Copilot Chat (GitHub Copilot)

- ✅ **MCP:** filesystem, github, playwright, supabase (via `.vscode/mcp.json`)
- ✅ **Ideal for:** Quick development + Supabase migrations
- 🔜 **Pending:** Context7 MCP

---

## Key Files by Purpose

| Goal                                          | File to Read                                       |
| --------------------------------------------- | -------------------------------------------------- |
| Understand reasoning chain                    | `.ai/THREAD.md`                                    |
| Understand what "good" looks like per surface | `.ai/SURFACE_BRIEFS.md`                            |
| Understand project & business                 | `.ai/GROWTH_STRATEGY.md` + `.ai/BACKLOG.md`        |
| See what's broken/planned                     | `.ai/STATE.md` + `.ai/BACKLOG.md`                  |
| See what changed recently                     | `.ai/SESSION_LOG.md`                               |
| Check design system                           | `.ai/CONSTRAINTS.md` + `docs/DESIGN-SYSTEM-AAA.md` |
| See approved plans                            | `.ai/impl/` directory                              |
| Check past mistakes                           | `.ai/LEARNINGS.md`                                 |
| Understand collaboration rules                | `.ai/CONTRACT.md` + `.ai/DECISION_RIGHTS.md`       |
| Email/auth setup                              | `docs/EMAIL-INFRASTRUCTURE.md`                     |

---

## Emergency Checklist (If Stuck)

| Situation                         | What to Do                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------- |
| "I'm out of context"              | Stop. Summarize to SESSION_LOG.md. Ask Cade to start fresh.                  |
| "Dev server on port 3001 is down" | State clearly. Options: A) Restart, B) Use production, C) You restart. Wait. |
| "Tests are failing"               | Paste error. Ask: "Debug or revert?"                                         |
| "Locked copy seems wrong"         | STOP. Ask founder. Do NOT modify.                                            |
| "Feature scope is unclear"        | Stop. Ask Cade: GOAL / WHY / DONE MEANS?                                     |
