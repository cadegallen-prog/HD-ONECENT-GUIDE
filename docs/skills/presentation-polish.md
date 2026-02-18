# presentation-polish

## When to use

Use this when Cade asks for better page structure, scanability, section flow, or overall content presentation quality.

## Goal

Make long pages easier to skim and act on, especially on mobile, without changing core product behavior.

## Presentation workflow

1. Build a message map:
   - What this page is
   - Why it matters now
   - What user should do next
2. Reorder sections from highest-value action to supporting detail.
3. Add clear section labels and short summaries.
4. Trim redundancy and repeated headings.
5. Confirm each section has one clear purpose.

## PennyCentral page priorities

Focus first on these pages when relevant:

- `/guide`
- `/faq`
- `/inside-scoop`
- `/transparency`
- `/privacy-policy`

## Quality guardrails

- Keep body text readable on mobile (16px minimum for body).
- Do not create decorative complexity that hides core actions.
- Keep internal-link paths obvious and useful.
- Preserve trust-first tone on legal and transparency pages.

## Verification lane

- `npm run verify:fast` for runtime edits
- `npm run e2e:smoke` for route/UI flow edits
- Playwright screenshots for changed routes (mobile + desktop)

## Founder-safe output format

- What was reorganized
- Why it is now easier to scan
- Where the key CTA now lives
- What Cade should do next (or `No action needed`)
