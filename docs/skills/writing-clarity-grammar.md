# writing-clarity-grammar

## When to use

Use this when Cade asks for copy rewrites, clarity cleanup, grammar polish, founder-facing messaging, or user-facing trust copy updates.

## Goal

Produce plain-English, high-trust writing that is easy for Cade and community members to understand quickly.

## Writing standard

1. Keep language concrete and direct.
2. Define technical terms at first use.
3. Use short paragraphs and action-first sentences.
4. Prefer specific instructions over abstract advice.
5. Remove hype, fear language, and absolute guarantees.
6. Preserve legal/compliance accuracy (do not over-claim).

## PennyCentral tone constraints

- Respect founder-readable voice: practical, calm, clear.
- Use singular references for Cade (`you (Cade)` / `the founder`).
- Keep route-level copy aligned with trust and utility goals.
- For policy-sensitive pages, avoid legal certainty claims.

## Rewrite workflow

1. Identify audience and action for the section.
2. Rewrite for clarity first, style second.
3. Run a final grammar pass.
4. Check consistency of labels/terms across routes.

## Verification lane

- For docs-only edits: `npm run ai:memory:check` and `npm run ai:checkpoint`
- For runtime copy changes: `npm run verify:fast` and `npm run e2e:smoke`
- UI copy changes: include screenshots for before/after context

## Founder-safe output format

- Before summary (what was unclear)
- After summary (what is now clear)
- Why this helps real users
- What Cade should do next (or `No action needed`)
