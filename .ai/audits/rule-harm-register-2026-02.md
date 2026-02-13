# Rule Harm Register (2026-02)

Date: 2026-02-11
Scope: high-impact governance rules affecting architecture truth, delivery speed, product outcomes, and misuse risk.

Scales:

- Architecture truth alignment: High / Medium / Low
- Delivery speed impact: Positive / Neutral / Negative
- Product outcome impact: High / Medium / Low
- Misuse risk by future agents: High / Medium / Low

## Register

| Rule / Policy                                                    | Architecture truth alignment | Delivery speed impact | Product outcome impact | Misuse risk | Decision | Evidence note                                                                                    |
| ---------------------------------------------------------------- | ---------------------------- | --------------------- | ---------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------ |
| Charter as highest authority                                     | High                         | Positive              | High                   | Medium      | KEEP     | Required to end multi-doc policy collisions and ambiguous overrides.                             |
| Mandatory Alignment Gate before mutation                         | High                         | Neutral               | High                   | Medium      | KEEP     | Prevents scope drift and premature edits without shared intent lock.                             |
| Port 3001 persistent founder preview contract                    | High                         | Positive              | High                   | Medium      | KEEP     | Repeated historical thrash failure mode; preserving preview stability protects founder velocity. |
| Verification lanes (FAST/SMOKE/FULL)                             | High                         | Positive              | High                   | Medium      | KEEP     | Matches current CI architecture and reduces over-testing friction while preserving quality.      |
| Legacy "always run lint/build/unit/e2e for every task" wording   | Low                          | Negative              | Medium                 | High        | MODIFY   | Conflicts with lane model and creates false policy forks.                                        |
| No raw Tailwind palette colors                                   | High                         | Neutral               | Medium                 | Low         | KEEP     | Preserves established visual quality system and design token integrity.                          |
| Plan canonicality in `.ai/impl`                                  | High                         | Positive              | Medium                 | Low         | KEEP     | Prevents tool-local plan drift and cross-agent divergence.                                       |
| Main-only workflow                                               | High                         | Neutral               | Medium                 | Low         | KEEP     | Aligns with deployment model and reduces branch overhead for solo founder.                       |
| No mutation when alignment gate incomplete (fail-closed)         | High                         | Neutral               | High                   | Medium      | KEEP     | Explicitly prevents edits with unresolved scope ambiguity.                                       |
| Duplicate policy definitions in secondary skill docs             | Medium                       | Negative              | Medium                 | High        | MODIFY   | Secondary docs should reference canon to avoid stale guidance replication.                       |
| Stale architecture statements (Google Sheets as primary backend) | Low                          | Negative              | High                   | High        | MODIFY   | Active operational docs must represent Supabase-first production truth.                          |
| "No new one-off files" as absolute rule                          | Medium                       | Neutral               | Low                    | Medium      | MODIFY   | Needs pragmatic exception for required audit/proof artifacts in governance work.                 |
| Overly broad "never touch config" without escalation path        | Medium                       | Negative              | Medium                 | Medium      | MODIFY   | Keep safety intent but preserve explicit escalation route for necessary fixes.                   |

## Required KEEP Evidence (per policy)

1. Every KEEP item above maps to an existing failure mode already observed in `.ai/LEARNINGS.md`, `.ai/STATE.md`, or `AGENTS.md`.
2. Every KEEP item directly protects either:
   - retention/submission trust loop quality, or
   - deterministic execution for a solo founder workflow.

## Red-Team Summary

1. Most harmful drift currently comes from duplicate policy copies, not from missing policy.
2. The highest risk rule harms are stale architecture statements and contradictory verification instructions.
3. Canonical owner mapping + drift checks is the lowest-risk correction path.
