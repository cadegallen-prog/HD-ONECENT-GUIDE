# Agent Autonomy Hardening - Current-State Audit

**Audited:** 2026-02-03
**Scope:** Planning-only. Capture current tooling, permissions, and workflow friction that blocks autonomous progress.

## 1) User-facing surfaces

- Routes:
  - No direct route/page changes in this initiative (tooling + process only).
- Entry points:
  - `npm run ai:doctor`
  - `npm run ai:verify [auto|dev|test]`
  - `npm run ai:proof -- <routes>`
  - `npm run dev` (port 3001)
- Logged-out experience:
  - N/A for this audit.

## 2) Core components (exact files)

- Primary files:
  - `scripts/ai-doctor.ts`
  - `scripts/ai-verify.ts`
  - `scripts/ai-proof.ts`
  - `playwright.config.ts`
- Guardrail/policy files:
  - `AGENTS.md`
  - `.ai/CRITICAL_RULES.md`
  - `.ai/CONSTRAINTS.md`
  - `.ai/VERIFICATION_REQUIRED.md`
  - `docs/skills/local-dev-faststart.md`

## 3) Data flow (read/write)

- Storage:
  - Verification outputs in `reports/verification/<timestamp>/`
  - Proof screenshots/logs in `reports/proof/<timestamp>/`
  - Memory system in `.ai/SESSION_LOG.md`, `.ai/STATE.md`, `.ai/BACKLOG.md`
- Read paths:
  - Scripts inspect local port state (`3001`, `3002`) and environment variables.
- Write paths:
  - `ai:verify` writes gate artifacts.
  - `ai:proof` writes screenshots and console log artifacts.

## 4) Mobile + accessibility

- Touch targets:
  - N/A (non-UI initiative).
- Focus/keyboard:
  - N/A (non-UI initiative).
- Labels:
  - Policy/docs language needs simplification so runbooks are unambiguous for humans and agents.

## 5) Strengths / pain points

### Strengths

- Strong existing verification discipline (`lint`, `build`, `test:unit`, `test:e2e`) and proof artifact conventions.
- Existing test-mode isolation on port 3002 already reduces many dev-server conflicts.
- Port 3001 kill protection is documented across core policy files.

### Pain points

- Port policy appears in many files; drift risk is high when updates are partial.
- Human preview workflow (persistent 3001) and agent verification workflow (isolated 3002) are both valid but not framed as a single explicit contract.
- Access needs outside code (Vercel logs, Sentry, analytics/search/ads dashboards) are not centralized in one required-scopes table.
- Plan memory for enablement can get lost if not anchored in canonical plan + backlog entries.
