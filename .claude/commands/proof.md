---
name: proof
description: Capture screenshots of routes for UI verification
---

Capture screenshots for UI changes:

1. Execute `npm run ai:proof -- [routes]`
   Example (Linux/Mac): `npm run ai:proof -- /penny-list /store-finder`
   Example (Windows): `MSYS_NO_PATHCONV=1 npx tsx scripts/ai-proof.ts /penny-list /store-finder`
2. Screenshots saved to `reports/proof/[timestamp]/`
3. Each route gets light and dark mode screenshots
4. Console errors are recorded

Use before AND after making UI changes to show the diff.

**Windows Note:** Git bash converts paths starting with `/`. Use the npx command with MSYS_NO_PATHCONV=1 prefix.
