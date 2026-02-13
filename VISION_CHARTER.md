# Vision Charter

Last updated: 2026-02-11
Authority: Highest
Change control: Founder approval required

## 1) Mission and Product Vision

PennyCentral exists to be the most trusted, fastest utility for Home Depot penny-hunters.

The product is a dual system:

1. Utility: live Penny List + fast Report a Find loop + SKU detail pages.
2. Decision quality: clear guide and policy framing that improves in-store outcomes.

The compounding loop is:

1. Returning visitors check the list habitually.
2. Users submit high-quality finds with low friction.
3. Data trust increases, making the list more useful.
4. Utility strength compounds retention and long-term monetization viability.

## 2) Why This Vision Is Correct Now

1. Community demand is already proven; execution risk is operational consistency, not demand creation.
2. Utility accuracy and trust are the bottlenecks to compounding growth.
3. Governance drift across agents causes rework, contradiction, and founder time loss.
4. A single authority model reduces ambiguity and protects delivery speed.

## 3) Non-Negotiables

1. No false "done" claims. Proof is required.
2. Port 3001 is the founder preview runtime; do not thrash it.
3. Rule conflicts are resolved by documented authority, not agent preference.
4. No hidden policy forks across docs.
5. Changes must prioritize the core loop over side quests.
6. Founder approval is required for charter changes.

## 4) Anti-Goals

1. Do not optimize for novelty over reliability.
2. Do not expand scope beyond the approved objective.
3. Do not add process that increases friction without measurable quality gains.
4. Do not ship policy duplication that invites future drift.
5. Do not treat chat-only decisions as durable memory.

## 5) Decision Hierarchy (When Tradeoffs Exist)

1. Returning visitor habit and retention.
2. Submission quality and submission throughput.
3. Trust and verification integrity.
4. SEO/internal discoverability.
5. Monetization foundations.

If a proposal improves #5 while harming #1-#3, reject it or redesign it.

## 6) Mandatory Pushback Policy

Agents must push back by default when a request:

1. Conflicts with this charter or canonical constraints.
2. Weakens trust, verification rigor, or data quality.
3. Creates avoidable maintenance burden without core-loop benefit.
4. Adds ambiguity that will cause future drift.

Pushback style is direct, specific, and alternative-oriented:

1. State conflict/risk.
2. State why it matters for product outcomes.
3. Offer a safer option aligned with this charter.

## 7) Mandatory Session Alignment Gate

No code or doc mutation may occur until this block is complete:

- GOAL
- WHY
- DONE MEANS
- NOT DOING
- CONSTRAINTS
- ASSUMPTIONS
- CHALLENGES

Fail-closed rule: if any field is missing or contradictory, do not mutate files.

## 8) Rule Conflict Resolution

Authority order:

1. `VISION_CHARTER.md` (this file)
2. Canonical owner docs (read order, constraints, verification, approvals, handoff)
3. Secondary docs/skills/reference docs
4. Chat context

When conflicts exist, the higher authority wins and lower-layer docs must be corrected.

## 9) Explicit Rejection Criteria (Must Refuse Without Approval)

Reject by default when asked to:

1. Redefine canonical policy in non-canonical docs.
2. Bypass verification proof requirements.
3. Kill/restart a healthy port-3001 founder session.
4. Add destructive or high-risk changes outside approved scope.
5. Introduce architecture claims contradicted by current production reality.
6. Modify this charter without explicit founder approval.

## 10) Canonical Ownership Domains

1. Vision/authority: `VISION_CHARTER.md`
2. Read order: `README.md` and `.ai/START_HERE.md`
3. Agent behavior: `AGENTS.md`
4. Critical non-negotiables: `.ai/CRITICAL_RULES.md`
5. Technical boundaries: `.ai/CONSTRAINTS.md`
6. Verification contract: `.ai/VERIFICATION_REQUIRED.md`
7. Collaboration/approvals: `.ai/CONTRACT.md` and `.ai/DECISION_RIGHTS.md`
8. Closeout/handoff: `.ai/HANDOFF_PROTOCOL.md`

Secondary docs may reference policy, but may not redefine it.
