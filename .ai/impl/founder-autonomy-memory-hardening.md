# Founder Autonomy + Memory Hardening Plan (Canonical)

**Status:** Active  
**Owner:** AI agents (execution), Cade (business approvals only)  
**Last updated:** 2026-02-22

---

## Objective

Build an ironclad persistence and execution system that survives context-window resets, minimizes founder effort, and keeps all agents aligned on measurable outcomes.

---

## Why this exists

Context windows are transient. If memory and protocol are not persisted in-repo, agents drift, work is repeated, and critical details are lost. This plan operationalizes a durable memory layer and a low-effort founder workflow.

---

## Evidence-based pillars

This plan is grounded in high-signal engineering standards:

1. **DORA performance model** (delivery stability and change reliability)
2. **SRE error-budget/SLO thinking** (measurable reliability targets)
3. **NIST SSDF framing** (secure-by-process, repeatable controls)
4. **WCAG/AAA and quality-gate contracts already in repo** (objective acceptance bars)

---

## Phase map

## Phase 1 — Memory Integrity Foundation (completed 2026-02-15)

- Add machine-checkable memory integrity script.
- Add context pack generation for fresh-session recovery.
- Add checkpoint command (check + pack).
- Wire commands into canonical docs.

### Done means

- `npm run ai:memory:check` exists and returns deterministic pass/fail.
- `npm run ai:memory:pack` generates timestamped context packs.
- `npm run ai:checkpoint` blocks on critical memory failures.
- Canon docs reference the commands.

## Phase 2 — Founder Operating System (completed 2026-02-15)

- Define explicit role boundaries and service levels per function area.
- Convert broad responsibilities into measurable operating cadences.
- Reduce required founder actions to approvals + strategic decisions only.
- Ship domain execution contracts across:
  - DevOps
  - Security
  - Marketing
  - SEO
  - Affiliates
  - Advertising
  - Monetization
  - PRD
  - Planning
  - Debugging
  - MVP
  - Future Projects

### Done means

- Founder-facing SOP exists and is canonical. ✅
- Each domain has owner, cadence, artifact requirements, and hard acceptance criteria. ✅
- Handoff quality is quantifiable and audited. ✅

## Phase 3 — Hardening + Enforcement (active)

- Integrate memory checks into verification pathways where appropriate.
- Add failure-mode drills (simulate context resets and verify recovery time).
- Expand drift checks to include memory-contract conformance.
- 2026-02-15 progress: `scripts/ai-memory.ts` now enforces multi-domain SOP conformance as critical checks; failures block `ai:checkpoint` and therefore fail `ai:verify` (memory gate).
- 2026-02-22 progress: failure-mode drill command added to `scripts/ai-memory.ts` with reversible scenarios (`missing-file`, `corrupt-heading`) and explicit remediation output; npm wrappers added (`ai:memory:drill`, `ai:memory:drill:missing`, `ai:memory:drill:heading`).
- 2026-02-22 progress: weekly trend reporting shipped in `scripts/ai-memory.ts` with:
  - new command: `trend` (supports `--days=<n>`)
  - npm wrappers: `ai:memory:trend`, `ai:memory:trend:30`
  - checkpoint run-history ledger: `reports/memory-integrity/checkpoint-history.jsonl`
  - weekly artifact bundle: `reports/memory-integrity-weekly/<YYYY-MM-DD>/{summary.md,metrics.json}`
  - fail-closed behavior for missing history windows and strict SLO breach detection.

### Done means

- Context recovery from fresh session is ≤ 5 minutes using generated pack.
- Memory integrity check pass rate is stable (target ≥ 95%).
- No critical memory file omissions across session closeouts.

---

## Quantitative SLOs

1. **Memory Integrity SLO:** `critical_failures = 0` on checkpoint.
2. **Recovery-Time SLO:** fresh-session context recovery ≤ 5 minutes.
3. **Founder-Input SLO:** ≤ 2 required founder actions per implementation cycle (goal: approvals only).
4. **Verification SLO:** 100% of meaningful changes include required proof artifacts.

---

## Risks

- Existing documentation size/entropy can create stale metadata flags.
- Process adoption drift if commands are not used at every handoff.
- Over-constraining checks can create false blocks.

---

## Risk controls

- Keep critical checks strict; freshness checks warning-level.
- Use checkpoint command before every multi-session handoff.
- Keep command outputs artifacted in `reports/context-packs/`.

---

## Immediate next task

Define a weekly operating cadence for `ai:memory:trend` review and predeclare remediation steps when pass-rate/integrity SLOs fail (so drift response is automatic, not ad hoc).
