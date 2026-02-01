# Context Handoff Pack (Portable, Tool-Agnostic)

**Last Updated:** Jan 31, 2026 by Codex

**Purpose:** Compressed, copy-paste-ready context for starting fresh chats or switching tools (Claude → Codex → Copilot).

---

## TL;DR (Read This First)

### What is Penny Central?

**Open-source Next.js PWA** helping Home Depot shoppers find "penny items" (clearance deals, often $0.01 to $10).

### Current Reality (Jan 23, 2026)

- ✅ **Core product working:** Submissions, enrichment, Penny List page
- ✅ **Staging warmer is local-only:** GitHub Action permanently removed. Run `npm run warm:staging` from your home IP to refresh `enrichment_staging` (upstream may block datacenter runners via Cloudflare).
- ✅ **Retention features live:** Email signup (10s subscribers), PWA install prompt, weekly digest cron
- ✅ **Monetization bridge:** Ezoic (temporary) + Mediavine Grow (analytics collection in progress)
- 🔄 **Cron health check needed:** Vercel cron is configured; ensure `CRON_SECRET` is set correctly so `/api/cron/send-weekly-digest` doesn’t return 401.
- 📊 **Metrics:** 680 daily users, 26% conversion (HD clicks), 80 clicks from organic (all branded)
- 🎯 **Cold start problem:** Penny List has ~67 items but needs more to encourage participation

### Immediate Next Move (Pipeline Reliability)

1. Run the staging warmer locally (only path): `npm run warm:staging`.
2. Confirm `CRON_SECRET` is set (prod) so `/api/cron/send-weekly-digest` returns 200 (not 401).
3. Confirm SerpApi spend stays low via `serpapi_logs` (batch job) + provenance on rows (staging vs serpapi).

---

## Quick-start Read Order

### Always First (5 min)

1. `.ai/START_HERE.md` - Universal entry point + read order
2. `.ai/CRITICAL_RULES.md` - 7 never-violate rules (honesty, port 3001, proof, etc.)
3. `.ai/STATE.md` - Current sprint snapshot (updated weekly)

### Always Second (2 min)

4. **This file** (`.ai/HANDOFF.md`) - Portable context pack

### Contextual (Choose One)

- **For general orientation:** `.ai/BACKLOG.md` (top 10 priorities) + `.ai/GROWTH_STRATEGY.md` (business why)
- **For topic work:** `.ai/topics/INDEX.md` → `.ai/topics/<TOPIC>.md` (e.g., SEO, MONETIZATION)
- **For implementation:** `.ai/impl/<FEATURE>.md` (approved plans only)

### Before Implementation

- `.ai/CONTRACT.md` - Collaboration rules (OCE protocol, decision rights)
- `.ai/DECISION_RIGHTS.md` - What needs approval (🟢 auto vs 🟡 propose)
- `.ai/CONSTRAINTS.md` - Design system + tech boundaries

---

## Tool Capability Notes

### Claude Code (VSCode Extension)

- ✅ **MCP Support:** Filesystem, GitHub, Playwright, Supabase, Vercel
- ✅ **Agent System:** 14 skills (plan, architect, implement, test, review, debug, document, brainstorm, doctor, verify, proof, session-start, session-end, checkpoint, capsule, handoff)
- ✅ **Capabilities:** Full file editing, terminal access, E2E testing, screenshots, DB queries
- ✅ **Context:** 200K tokens
- ✅ **Ideal for:** Full feature development (design → code → test → verify)

### Codex (ChatGPT, GPT-5.2)

- ✅ **MCP Support:** Same as Claude (if `~/.codex/config.toml` is synced)
- ✅ **Agent System:** Same (if configured)
- ✅ **Capabilities:** Full file editing, terminal access, E2E testing, screenshots, DB queries
- ✅ **Context:** 200K tokens
- ✅ **Ideal for:** Full feature development, alternative to Claude
- ⚠️ **Caveat:** MCP config drift possible; verify before complex tasks

### Copilot Chat (GitHub Copilot)

- ❌ **MCP Support:** None (no MCP servers)
- ❌ **Agent System:** None (no skills)
- ✅ **Capabilities:** Code explanation, quick fixes, inline suggestions
- ⚠️ **Context:** ~128K tokens (lower than Claude/Codex)
- ✅ **Ideal for:** Q&A only, not full development
- ⚠️ **Escalate when:** >3 files, refactoring, major UX changes, Playwright proof needed

---

## New Chat Primer (Copy/Paste into Chat)

**Use this when starting a fresh session in any tool:**

```
I'm starting fresh on Penny Central (pennycentral.com).

Read in order:
1. .ai/START_HERE.md (universal entry point)
2. .ai/CRITICAL_RULES.md (never violate these 7 rules)
3. .ai/STATE.md (current sprint snapshot)
4. .ai/HANDOFF.md (this context pack)

Current reality (Jan 20, 2026):
- ✅ Core product working (submissions, enrichment, Penny List)
- ✅ Enrichment DB: ~1,600+ penny items pre-scraped for auto-population
- 🔄 IN PROGRESS: Penny List seeding (auto-submit quality items to create social proof)
- 📊 680 daily users, 26% conversion, cold start problem on Penny List

Plan file: C:\Users\cadeg\.claude\plans\floating-popping-neumann.md
Phases remaining: 1 (migration), 2 (cron endpoint), 3 (Vercel schedule), 4 (dry-run + deploy)

My goal for this session: Continue implementing Penny List seeding feature from Phase 1

What should I read next?
```

---

## ARCHITECT Stub (Write .ai/impl/<feature-slug>.md)

**Use this when you need to design before implementing:**

```
I'm ready to architect a feature for Penny Central.

Read:
- .ai/CRITICAL_RULES.md
- .ai/DECISION_RIGHTS.md
- .ai/CONTRACT.md
- .ai/STATE.md
- .ai/BACKLOG.md
- Relevant: .ai/topics/<TOPIC>.md

Task:
Design the implementation plan for: [FEATURE]

Rules:
- Do not implement code.
- Resolve structural ambiguities. If any remain, list them and provide options A/B/C.
- Respect DECISION_RIGHTS: propose changes that need approval.

Deliverable:
Write the plan to: .ai/impl/<feature-slug>.md

Plan must include:
1) Goal + Done Means (testable)
2) Constraints and non-negotiables
3) Files to touch (create vs modify)
4) Step sequence (small steps)
5) Risks + mitigations
6) Verification plan (lint, build, unit, e2e, proof if UI)
7) Rollback plan
8) Open questions (max 5) with A/B/C when needed

Stop and ask for approval to implement.
```

---

## IMPLEMENT Stub (Read .ai/impl/<feature-slug>.md)

**Use this after a plan is approved:**

```
I'm ready to implement from an approved plan.

Read:
- .ai/CRITICAL_RULES.md
- .ai/DECISION_RIGHTS.md
- .ai/CONTRACT.md
- .ai/STATE.md
- Plan: .ai/impl/<feature-slug>.md

Task:
Implement exactly what the plan specifies.

Guardrails:
- No scope creep. No refactors.
- If plan is ambiguous, stop and present A/B/C.
- Provide traceable edits: list each file touched and why.

Verification:
- Run npm run ai:verify and report results.
- If UI changed, run proof workflow and link artifacts.

After:
- Update .ai/SESSION_LOG.md with changes + proof links.
- Run /checkpoint to compress context.
- Run /capsule <TOPIC> if it changed that topic's current reality.
```

---

## Portal Commands (For Context Management)

These commands (in Claude Code only) maintain portability across sessions:

### /checkpoint

Compress project context so it stays portable. Shrinks `.ai/STATE.md` to "current sprint only". History lives in pointers.

**When to use:** End of complex sessions or when context grows unwieldy.

### /capsule <TOPIC>

Update exactly one topic capsule (SEO, MONETIZATION, UI_DESIGN, DATA_PIPELINE).

**When to use:** After topic-specific work to lock decisions for next agent.

### /handoff

Generate a portable context pack (updates `.ai/HANDOFF.md`) + print New Chat Primer.

**When to use:** Before switching tools (Claude → Codex → Copilot) or starting new session.

---

## Key Files by Purpose

| Goal                              | File to Read                                              |
| --------------------------------- | --------------------------------------------------------- |
| Understand project & business     | `.ai/GROWTH_STRATEGY.md` + `.ai/BACKLOG.md`               |
| See what's broken/planned         | `.ai/STATE.md` + `.ai/BACKLOG.md`                         |
| Understand what changed recently  | `.ai/SESSION_LOG.md` (searchable by date)                 |
| Check design system               | `.ai/CONSTRAINTS.md` + `.ai/CONSTRAINTS_TECHNICAL.md`     |
| See design decisions              | `.ai/topics/UI_DESIGN.md` or `.ai/PENNY-LIST-REDESIGN.md` |
| Learn SEO plan                    | `.ai/topics/SEO.md` or `.ai/SEO_FOUNDATION_PLAN.md`       |
| See monetization status           | `.ai/topics/MONETIZATION.md`                              |
| See data pipeline status          | `.ai/topics/DATA_PIPELINE.md`                             |
| Check past mistakes               | `.ai/LEARNINGS.md`                                        |
| Understand collaboration rules    | `.ai/CONTRACT.md` + `.ai/DECISION_RIGHTS.md`              |
| See approved implementation plans | `.ai/impl/` directory                                     |

---

## Emergency Checklist (If Stuck)

| Situation                         | What to Do                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------ |
| "I'm out of context"              | Stop. Summarize to `.ai/SESSION_LOG.md`. Ask Cade to start fresh session. Run `/checkpoint`.           |
| "Dev server on port 3001 is down" | State clearly: "Port 3001 is unhealthy. Options: A) Restart, B) Use production, C) You restart." Wait. |
| "Tests are failing"               | Paste error + link to test file. Ask: "Should I debug or revert?"                                      |
| "I found a blocker"               | Don't ask clarifying questions. List the blocker + 3 options. Wait for Cade's choice.                  |
| "Feature scope is unclear"        | Stop. Use `.ai/USAGE.md` task template. Ask Cade: GOAL / WHY / DONE MEANS?                             |

---

## Session Checklist (Paste at Start)

```
[ ] Read .ai/START_HERE.md
[ ] Read .ai/CRITICAL_RULES.md
[ ] Read .ai/STATE.md
[ ] Read .ai/HANDOFF.md (this file)
[ ] Ask Cade: "GOAL / WHY / DONE MEANS?" (use .ai/USAGE.md format)
[ ] Clarify scope + constraints
[ ] Implement (or propose options if approval needed)
[ ] Run: npm run ai:verify
[ ] Update .ai/SESSION_LOG.md (with proof links)
[ ] Update .ai/STATE.md (if reality changed)
[ ] Update .ai/BACKLOG.md (if priorities moved)
[ ] Run /checkpoint (compress context)
[ ] Ask: "Switching tools? (y/n)" → if yes, run /handoff
```

---

## Top 3 Priorities (Current)

1. **🔴 Data Pipeline Reliability (BLOCKED)**
   - GitHub Action `Enrichment Staging Warmer` is failing due to Cloudflare 403 from upstream API.
   - Track and resolve via issue #106 (allowlist / self-hosted runner / new source).
   - Ensure Vercel cron auth is configured (`CRON_SECRET`) so `/api/cron/*` endpoints run.

2. **P0-3: SEO Improvement (Schema Markup + Internal Linking)**
   - Done means: FAQ schema + HowTo schema on `/guide`, internal links verified
   - Blocker: None (ready after seeding)

3. **Monetization Tuning (Post-Mediavine)**
   - Timeline: Awaiting Mediavine approval (~Feb 11)
   - When approved: Remove Ezoic, verify Grow still works

---

**Last updated:** Jan 20, 2026

**For questions:** See `.ai/USAGE.md` for task template + `.ai/CRITICAL_RULES.md` for never-violate rules.
