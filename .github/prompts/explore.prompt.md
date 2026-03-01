---
description: "Explore options without modifying files — brainstorm mode"
agent: orchestrator
---

Exploration mode — **no file modifications allowed.**

## Steps

1. @researcher gathers relevant codebase context (≤500 words with citations)
2. Present 2-3 options with clear pros/cons for each
3. For each option, evaluate:
   - Does it align with the North Star (Penny List + Report a Find compounding loop)?
   - Does it improve returning visitors, submission quality, or stability?
   - Does it conflict with documented constraints?
   - What's the effort vs. impact tradeoff?
   - How does it affect mobile experience?
4. Present options in **plain English** (code only if specifically helpful)
5. Ask Cade which direction to pursue

## Option Format

```
### Option A: [Name]
**What:** [1-2 sentence description]
**Pros:** [Why this is good]
**Cons:** [What could go wrong or what's hard]
**Effort:** Low / Medium / High
**Impact:** Low / Medium / High
```

## Rules

- **Do NOT modify any files** — exploration only
- **Do NOT make decisions** — present options and let Cade choose
- Keep options actionable and specific (not abstract or hand-wavy)
- If all options have significant risk, say so clearly and honestly
- Consider mobile-first perspective in all options
- If there's an obvious winner, say so (but still present alternatives)

## Product Context

- **North Star:** Penny List + Report a Find compounding loop
- **Priority order:** Returning visitors > High-quality submissions > Verification > Stability > Performance > Mobile-first > Monetization
- **Live at:** pennycentral.com
