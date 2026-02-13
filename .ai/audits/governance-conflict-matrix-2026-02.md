# Governance Conflict Matrix (2026-02)

Date: 2026-02-11
Method: direct file inspection of canonical and secondary governance docs in scope.

## Conflict Records

| Source file                              | Conflicting file                                         | Conflict                                                                                                 | Risk impact | Recommended canonical owner                                | Keep / Modify / Remove | Rationale                                                                      |
| ---------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------ |
| `.ai/CONTRACT.md`                        | `.ai/VERIFICATION_REQUIRED.md`                           | Contract hard-codes legacy all-4-gates commands while verification canon uses FAST/SMOKE/FULL lane model | High        | `.ai/VERIFICATION_REQUIRED.md`                             | Modify                 | Contract should describe collaboration behavior, not redefine lane policy.     |
| `.ai/HANDOFF_PROTOCOL.md`                | `.ai/VERIFICATION_REQUIRED.md`                           | Handoff protocol requires old all-4 command set as mandatory baseline                                    | High        | `.ai/VERIFICATION_REQUIRED.md`                             | Modify                 | Handoff should reference verification canon and required applicable lanes.     |
| `.ai/README.md`                          | `README.md` + `.ai/START_HERE.md`                        | Stub includes outdated read sequence and legacy verification command language                            | High        | `README.md` + `.ai/START_HERE.md`                          | Modify                 | Stub must redirect without policy fork.                                        |
| `README.md` (Branch Strategy section)    | `.ai/VERIFICATION_REQUIRED.md`                           | Branch workflow still says `lint + build` only before push                                               | Medium      | `.ai/VERIFICATION_REQUIRED.md`                             | Modify                 | Branch workflow should mirror current lane model policy.                       |
| `docs/skills/task-completion-handoff.md` | `.ai/VERIFICATION_REQUIRED.md`                           | Skill prescribes legacy all-4-gates workflow                                                             | Medium      | `.ai/VERIFICATION_REQUIRED.md` + `.ai/HANDOFF_PROTOCOL.md` | Modify                 | Skills must point to canonical policy instead of duplicating old requirements. |
| `docs/skills/ship-safely.md`             | `.ai/VERIFICATION_REQUIRED.md`                           | Skill checklists legacy all-4-gates commands instead of lane model                                       | Medium      | `.ai/VERIFICATION_REQUIRED.md`                             | Modify                 | Prevents future agent drift from outdated skill prompts.                       |
| `.ai/CONSTRAINTS.md`                     | `.ai/CONSTRAINTS_TECHNICAL.md` + current runtime reality | Mixed architecture statements include deprecated Google Sheets positioning in active operational context | High        | `.ai/CONSTRAINTS.md`                                       | Modify                 | Active constraints must reflect Supabase-first production truth.               |
| `.ai/START_HERE.md`                      | `VISION_CHARTER.md` (new authority)                      | Startup sequence did not yet enforce Charter-first authority gate                                        | Medium      | `VISION_CHARTER.md` + `.ai/START_HERE.md`                  | Modify                 | Must make authority explicit and deterministic at session start.               |
| `AGENTS.md`                              | `VISION_CHARTER.md` (new authority)                      | AGENTS lacked explicit "charter wins on conflict" clause                                                 | Medium      | `VISION_CHARTER.md` + `AGENTS.md`                          | Modify                 | Avoid silent policy collisions between behavior contract and charter.          |
| `.ai/TESTING_PROTOCOL.md`                | `.ai/VERIFICATION_REQUIRED.md`                           | Legacy testing contract framed as universal gate instead of lane-conditional model                       | Medium      | `.ai/VERIFICATION_REQUIRED.md`                             | Modify                 | Keep testing checklist utility but remove canonical-policy duplication.        |

## Resolution Policy Applied

1. Charter-first authority model.
2. Single-owner rule domains.
3. Secondary docs convert to redirects/references where feasible.
4. CI drift checks enforce recurring consistency.

## Post-Refactor Exit Condition

No high-severity conflicts remain among canonical owner docs:

- `VISION_CHARTER.md`
- `README.md`
- `.ai/START_HERE.md`
- `AGENTS.md`
- `.ai/CRITICAL_RULES.md`
- `.ai/CONSTRAINTS.md`
- `.ai/VERIFICATION_REQUIRED.md`
- `.ai/CONTRACT.md`
- `.ai/DECISION_RIGHTS.md`
- `.ai/HANDOFF_PROTOCOL.md`
