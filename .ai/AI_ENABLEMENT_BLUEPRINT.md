# AI Enablement Blueprint (Codex + Claude Code + Copilot Chat)

**Purpose:** Make PennyCentral's agentic coding workflow faster and more reliable for a non-developer founder by reducing iterations, reducing "verification friction", and preventing repeated failure modes.

**This document is tool-agnostic:** everything here is expressed as repo files + `npm` scripts + Playwright + VS Code tasks so it works the same for:
- Codex (VS Code extension / CLI)
- Claude Code (VS Code extension)
- GitHub Copilot Chat (VS Code extension)

**Important:** More tooling/spend is **not** automatically better. We add things only when they reduce total cycle time, regressions, or back-and-forth.

---

## 0) Canonical Sources (Do Not Fork Reality)

The canonical entrypoint and read order lives in the root `[README.md](../README.md)` (“AI Canon & Read Order”).

This blueprint is **only required reading** when the current session goal is:
- Improving AI workflows, verification, testing, proof capture, tooling, or process
- Reducing flake/timeouts, port conflicts, or “it works on my machine” drift
- Making Codex/Claude/Copilot behave consistently

For normal feature/bug work, follow the standard read order first:
`.ai/STATE.md` -> `.ai/BACKLOG.md` -> `.ai/CONTRACT.md` + `.ai/DECISION_RIGHTS.md` -> `.ai/CONSTRAINTS.md` + `.ai/FOUNDATION_CONTRACT.md` + `.ai/GUARDRAILS.md` -> latest `.ai/SESSION_LOG.md` -> `.ai/CONTEXT.md` (product calls).

---

## 1) North Star (What “Better Enablement” Means)

Enablement work is successful when it measurably improves:
- **Time-to-first-correct-result:** faster from “GOAL/WHY/DONE” to a working change.
- **Time-to-proof:** faster to produce the required verification artifacts (tests + screenshots).
- **Iteration count:** fewer “try again” loops caused by missing context, missing proof, or flaky dependencies.
- **Cross-agent consistency:** Codex, Claude Code, and Copilot follow the same rules and produce the same evidence.

What we do **not** optimize for:
- Lowest token usage
- Highest number of tools
- “Maximum automation” for its own sake

---

## 2) Non‑Negotiables (Must Stay True)

These are enforced elsewhere, but enablement changes must keep them intact:
- **Verification required:** see `.ai/VERIFICATION_REQUIRED.md` (no proof = not done).
- **Port 3001 rule:** never kill it unless explicitly asked; reuse if running.
- **Color rule:** no raw Tailwind palette colors; use tokens/CSS variables.
- **Main-only workflow:** `main` is the only branch.
- **No surprise deps/env vars:** if needed, justify and document.

---

## 3) Cross‑Agent Alignment Requirements (Must Be True at All Times)

These are the “single source of truth” requirements so all three tools share understanding:

### 3.1 Instruction entrypoints must not conflict
- `AGENTS.md` (Codex) + `CLAUDE.md` (Claude Code) + `.github/copilot-instructions.md` (Copilot) must point to the same canonical read order and rules.
- If any of these drift, we fix drift first before adding new tooling.

### 3.2 All workflow improvements must be repo-native
If we add an improvement, it should be usable by *any* agent/tool without special UI features:
- Prefer `package.json` scripts (`npm run …`) over “do X in extension settings”.
- Prefer Playwright specs/scripts in-repo over manual browser steps.
- Prefer `.vscode/tasks.json` tasks as a convenience (optional), but never as the only interface.

### 3.3 Proof artifacts must be reproducible
If a workflow depends on screenshots or logs, the repo must define:
- where the artifacts live (e.g., `reports/verification/`)
- how they’re generated
- how they’re referenced in `SESSION_LOG.md` / `STATE.md`

---

## 4) Step 1: Baseline Enablement Audit (Docs-Only Pass)

Before proposing any new tooling, capture the baseline so we can judge ROI:

### 4.1 Environment & permissions snapshot
Record in the audit notes:
- OS, shell, Node version, npm version
- sandbox mode / network mode / approvals policy (from tool context)
- whether VS Code tasks and extensions are being used

### 4.2 Confirm the 4 quality gates are runnable
Run and record outputs (even if unchanged code):
- `npm run lint`
- `npm run build`
- `npm run test:unit`
- `npm run test:e2e`

### 4.3 Identify recurring friction (from `.ai/SESSION_LOG.md` + reality)
Examples to look for:
- Port conflicts / agents killing 3001
- Playwright timeouts because of remote dependencies
- Missing screenshots / incomplete proof
- “Drift” between Copilot/Claude/Codex instructions

### 4.4 Audit outputs
Write results into:
- `.ai/SESSION_LOG.md` (new entry)
- `.ai/STATE.md` (if it changes current project snapshot)

---

## 5) Augmentation Selection Rubric (How We Decide What to Add)

Every candidate improvement must specify:

1) **Problem it solves** (one sentence)
2) **Evidence it exists** (log excerpt, repeated failure mode, reproducible steps)
3) **Proposed change** (repo-native: scripts/docs/tests/tasks)
4) **Expected ROI** (how it reduces time-to-proof, flake rate, or iteration count)
5) **Cross-agent compatibility** (Codex/Claude/Copilot all can use it)
6) **Maintenance cost** (who maintains it; how it can break; how to update)
7) **Roll-back plan** (how to undo if it causes friction)

Reject candidates that:
- Add complexity without eliminating a real bottleneck
- Are tool-vendor-specific and can’t be used across all three agents
- Encourage “process compliance” without improving outcomes (gates already verify outcomes)

---

## 6) Roadmap (Goldilocks Chunks — One Prompt/Session Each)

Each chunk below is intentionally sized to avoid “one-shot everything” failures while still delivering meaningful leverage.

### Chunk A — Instruction Consistency Lock
**Goal:** ensure Codex/Claude/Copilot load the same canon and don’t drift.

**Deliverables (repo changes):**
- Normalize references between `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, and `README.md` read order (no contradictions).
- Add a short “Enablement work?” pointer to this file.

**Done means:**
- Fresh sessions in all three tools show the same read order + rules.

---

### Chunk B — `ai:doctor` (Fast Health Check)
**Goal:** one command that prevents common wasted time.

**Deliverables:**
- `npm run ai:doctor` script that checks:
  - port 3001 status (use if running; never kill)
  - required env vars presence (without printing secrets)
  - Playwright availability
  - common “known bad” states (e.g., missing fixtures)
- Optional VS Code task entry.

**Done means:**
- Running `npm run ai:doctor` gives clear “pass/fail” guidance and next steps.

---

### Chunk C — `ai:verify` (One-Command Proof Pack)
**Goal:** produce the exact proof required by `.ai/VERIFICATION_REQUIRED.md` with minimal manual copy/paste.

**Deliverables:**
- `npm run ai:verify` that runs: lint -> build -> unit -> e2e and stores outputs under `reports/verification/` (or a similar stable location).
- A generated markdown snippet the agent can paste into the final response.

**Done means:**
- A non-coder can run one command and get the proof artifacts without hunting.

---

### Chunk D — Playwright Proof Harness (Screenshots + Console)
**Goal:** make “screenshots required” easy and consistent.

**Deliverables:**
- A small Playwright utility/spec that can:
  - capture before/after screenshots for a route
  - capture light/dark variants
  - record console errors (and fail if unexpected)
- Documentation for how to run it.

**Done means:**
- UI changes ship with deterministic proof, not “trust me”.

---

### Chunk E — Dependency Isolation for UI Proof (De-flake)
**Goal:** prevent external services from blocking verification (common source of timeouts).

**Deliverables:**
- A consistent “fixture mode” approach for routes that currently depend on remote fetches (pattern similar to `PLAYWRIGHT=1`).
- Document what gets stubbed and why.

**Done means:**
- Screenshot/proof runs don’t hang on remote data.

---

## 7) Completion Checklist for Enablement Work

Before saying "done" on enablement changes:
- Update `.ai/SESSION_LOG.md` with what changed and why.
- Update `.ai/STATE.md` if the workflow/tooling state changed.
- Provide the proof bundle (tests + screenshots where applicable) per `.ai/VERIFICATION_REQUIRED.md`.
- Confirm all changes are usable across Codex + Claude Code + Copilot Chat.
- Suggest 1-3 next actions from the roadmap (and why), based on the current bottleneck.
