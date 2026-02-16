# Founder Autonomy Operating System (Canonical SOP)

**Audience:** Cade + all AI agents  
**Purpose:** Maximize agent autonomy, minimize founder workload, and preserve long-term continuity across context resets.

---

## Non-negotiable operating model

- Cade owns vision, priorities, and approvals that affect business risk.
- AI agents own technical execution, verification, and technical decisioning.
- If information is not stored in `.ai/` or generated artifacts, treat it as non-persistent.

---

## Multi-domain operating system (canonical)

Use this matrix when executing cross-domain work. Each domain must produce explicit artifacts so continuity survives tool/session changes.

| Domain          | Primary owner                | Cadence                                           | Cade involvement                                   | Required artifacts                                                             | Done criteria                                                           |
| --------------- | ---------------------------- | ------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| DevOps          | AI                           | every implementation cycle                        | approval only for release-risk tradeoffs           | `reports/verification/<ts>/summary.md`, relevant CI run links                  | FAST lane clean, deployment blockers resolved, rollback path documented |
| Security        | AI                           | weekly + any high-risk code change                | approval for high-impact policy/security tradeoffs | scan output, remediation note in `.ai/SESSION_LOG.md`                          | no unresolved critical security regressions introduced by session       |
| Marketing       | AI proposes, Cade decides    | weekly strategy pass                              | select option and priority                         | options A/B/C with tradeoffs in chat + logged decision in `.ai/SESSION_LOG.md` | approved option converted into scoped execution task                    |
| SEO             | AI                           | weekly + after SEO-sensitive route/meta updates   | priority input                                     | route/meta/schema evidence, internal-link diff, related test output            | indexability signals preserved/improved with no canonical regressions   |
| Affiliates      | AI                           | when affiliate links/CTAs/routes change           | approval for partner/compliance posture            | route/link validation evidence, disclosure checks, test output                 | affiliate paths function correctly and disclosures remain truthful      |
| Advertising     | AI                           | when ad eligibility/layout/policy surfaces change | approval for revenue-vs-UX tradeoffs               | policy matrix/eligibility evidence, verification output                        | ad changes stay policy-safe, excluded routes remain excluded            |
| Monetization    | AI                           | every monetization session                        | strategy and escalation decisions                  | `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md` updates + evidence links        | all open incidents have fresh status, next action, and deadline         |
| PRD             | AI drafts, Cade approves     | per initiative start/change                       | approve scope                                      | PRD-style scope block (GOAL/WHY/DONE/NOT DOING/constraints) in plan doc        | approved scope exists before implementation starts                      |
| Planning        | AI                           | before complex implementation                     | approval when required by decision rights          | canonical plan in `.ai/impl/<slug>.md` + sync/hash proof if planning task      | no plan drift, implementation follows approved plan boundaries          |
| Debugging       | AI                           | whenever blockers/bugs occur                      | none unless blocker is strategic                   | reproducible failure evidence + root-cause/fix evidence in session log         | root cause identified, fix verified, regression risk documented         |
| MVP             | AI drafts, Cade approves     | per new product slice                             | approve what to ship now vs later                  | explicit MVP scope + launch checklist in canonical docs                        | smallest viable slice shipped with proof and no scope creep             |
| Future Projects | AI curates, Cade prioritizes | weekly backlog hygiene                            | priority selection                                 | prioritized candidates in `.ai/BACKLOG.md` with why/impact notes               | next project queue remains clear, ranked, and actionable                |

---

## Service-level expectations (measurable)

1. **Recovery SLO:** Any fresh context window resumes in <= 5 minutes using `npm run ai:memory:pack` artifacts.
2. **Verification SLO:** 100% of meaningful changes include required proof per `.ai/VERIFICATION_REQUIRED.md`.
3. **Handoff SLO:** 100% of meaningful sessions include a complete next-agent handoff block.
4. **Founder-effort SLO:** founder action count stays <= 2 actions per cycle (approve decision, optional command).
5. **Memory Integrity SLO:** `npm run ai:checkpoint` passes (0 critical failures) before multi-session handoffs.

---

## Domain execution loop (every implementation cycle)

1. Read canon (`VISION_CHARTER.md` -> `.ai/START_HERE.md` -> required files).
2. Run baseline integrity check: `npm run ai:memory:check`.
3. Identify active domains from the matrix above and define domain-specific done criteria.
4. Execute scoped work with verification lanes (`verify:fast`, plus `e2e:smoke`/`e2e:full` as required).
5. Update persistent memory (`.ai/SESSION_LOG.md`, `.ai/STATE.md`, `.ai/BACKLOG.md` when priorities move).
6. Run handoff checkpoint: `npm run ai:checkpoint`.
7. Publish two outputs: founder summary + explicitly labeled block "for future AI agents."

---

## Required command contract (agent-facing)

- `npm run ai:memory:check` - validates memory integrity at session start and before done claims.
- `npm run verify:fast` - mandatory FAST lane.
- `npm run e2e:smoke` - required for route/form/API/navigation/UI-flow changes.
- `npm run e2e:full` - required only when FULL trigger policy applies.
- `npm run ai:checkpoint` - required before multi-session handoff.

---

## Escalation rules

Escalate to Cade only when:

- a decision changes trust/legal/compliance posture,
- a paid tool/service is required,
- a tradeoff changes business strategy.

Everything else defaults to agent execution.

---

## Founder workload contract

### Cade should do

- choose priorities and approve high-impact options,
- run `/doctor`, `/verify`, `/proof` when asked,
- validate business fit and user trust.

### Cade should not have to do

- debug code,
- resolve merge/test failures,
- translate technical output into implementation steps,
- reconstruct context from chat history.

---

## Success definition

This SOP is successful when a fresh agent can continue work without re-discovery, all active domains emit durable artifacts, and Cade only provides business direction rather than technical labor.
