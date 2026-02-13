# Governance Surface Map (2026-02)

Date: 2026-02-11
Scope: rule-bearing governance docs under `.ai/`, root governance docs, and governance-adjacent `docs/skills` docs.

## Inventory Scope Logic

A file is included when it defines behavior with normative language (for example: MUST, REQUIRED, NEVER, should/shall in policy context), decision rights, verification policy, workflow sequencing, or canonical ownership.

## Root Governance Surface

| File                      | Domain                            | Current Role                     | Canonical Owner Target      |
| ------------------------- | --------------------------------- | -------------------------------- | --------------------------- |
| `VISION_CHARTER.md`       | Vision + authority                | Highest authority contract       | Vision/authority            |
| `README.md`               | Canonical entrypoint + read order | Human/agent startup canon        | Read order                  |
| `AGENTS.md`               | Agent behavior + quality contract | Operating behavior + constraints | Agent behavior              |
| `CLAUDE.md`               | Claude entrypoint                 | Tool-specific pointer/adapter    | Secondary redirect to canon |
| `copilot-instructions.md` | Copilot entrypoint                | Tool-specific pointer/adapter    | Secondary redirect to canon |
| `SKILLS.md`               | Technical reference               | Supplemental runtime guidance    | Secondary reference         |
| `CONTRIBUTING.md`         | Contributor workflow              | Low-level workflow reminder      | Secondary reference         |

## `.ai/` Governance Surface

| File                             | Domain                        | Current Role                   | Canonical Owner Target                 |
| -------------------------------- | ----------------------------- | ------------------------------ | -------------------------------------- |
| `.ai/START_HERE.md`              | Read order + startup protocol | Canon startup sequence         | Read order                             |
| `.ai/CRITICAL_RULES.md`          | Non-negotiables               | Hard stop rules                | Critical non-negotiables               |
| `.ai/CONSTRAINTS.md`             | Technical boundaries          | Fragile zones + policy         | Technical boundaries                   |
| `.ai/VERIFICATION_REQUIRED.md`   | Verification contract         | Required evidence schema       | Verification contract                  |
| `.ai/CONTRACT.md`                | Collaboration behavior        | Human/AI operating contract    | Collaboration/approvals                |
| `.ai/DECISION_RIGHTS.md`         | Approval boundaries           | What AI can/cannot decide      | Collaboration/approvals                |
| `.ai/HANDOFF_PROTOCOL.md`        | Closeout/handoff schema       | Session completion contract    | Closeout/handoff                       |
| `.ai/FOUNDATION_CONTRACT.md`     | Redirect                      | Redirect to active constraints | Secondary redirect                     |
| `.ai/GUARDRAILS.md`              | Redirect                      | Redirect to active constraints | Secondary redirect                     |
| `.ai/CONSTRAINTS_TECHNICAL.md`   | Consolidated constraints copy | Secondary constraints mirror   | Secondary reference (must not diverge) |
| `.ai/README.md`                  | `.ai` entry stub              | Pointer to root README         | Secondary redirect                     |
| `.ai/AI_ENABLEMENT_BLUEPRINT.md` | Process/tooling governance    | Enablement-only policy layer   | Secondary reference                    |
| `.ai/USAGE.md`                   | Prompting pattern             | Goldilocks request template    | Secondary reference                    |
| `.ai/TESTING_PROTOCOL.md`        | Legacy testing contract       | Legacy all-4-gates style       | Candidate redirect/update              |
| `.ai/TESTING_CHECKLIST.md`       | QA guidance                   | Tactical QA checklist          | Secondary reference                    |
| `.ai/HANDOFF.md`                 | Context compression/handoff   | Extended context pack          | Secondary reference                    |
| `.ai/STATE.md`                   | Project state memory          | Canon snapshot                 | State memory                           |
| `.ai/BACKLOG.md`                 | Priority memory               | Canon priority queue           | Priority memory                        |
| `.ai/SESSION_LOG.md`             | Session memory                | Canon recent history           | Session memory                         |
| `.ai/LEARNINGS.md`               | Mistake memory                | Failure-prevention memory      | Learning memory                        |

## Governance-Adjacent Skills Surface

| File                                     | Domain                   | Current Role                      | Canonical Owner Target                                      |
| ---------------------------------------- | ------------------------ | --------------------------------- | ----------------------------------------------------------- |
| `docs/skills/README.md`                  | Skills index             | Entry to skill docs               | Secondary reference                                         |
| `docs/skills/task-completion-handoff.md` | Closeout helper          | Skill-level closeout guidance     | Must reference `HANDOFF_PROTOCOL` + `VERIFICATION_REQUIRED` |
| `docs/skills/ship-safely.md`             | Pre-push safety          | Skill-level verification reminder | Must reference lane model                                   |
| `docs/skills/local-dev-faststart.md`     | Runtime startup behavior | Port and local workflow guidance  | Must align with 3001 contract                               |
| `docs/skills/plan-canonicality.md`       | Plan governance          | Canonical plan enforcement        | Secondary reference                                         |
| `docs/skills/archive-first-prune.md`     | Archive governance       | Archive policy helper             | Secondary reference                                         |

## Governance Health Summary

1. Canonical owner domains were partially present but not explicit across all entrypoints.
2. Verification policy drift exists (lane model vs legacy "always all 4 gates").
3. Read-order drift exists (`README.md`/`START_HERE.md`/`.ai/README.md` not perfectly synchronized).
4. Architecture-truth drift exists in operational docs (legacy Google Sheets statements in active constraint docs).
5. Redirect pattern is already used for `.ai/FOUNDATION_CONTRACT.md` and `.ai/GUARDRAILS.md`, validating the strict-canon + redirect strategy.
