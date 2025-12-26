---
name: verify
description: Run all quality gates and generate proof bundle
---

Run verification to prove your work:

1. Execute `npm run ai:verify`
2. Check the output for any failures
3. If all gates pass, proof is saved to `reports/verification/`
4. Copy the summary from `reports/verification/[timestamp]/summary.md`

Gates run:
- npm run lint (0 errors required)
- npm run build (must succeed)
- npm run test:unit (all tests pass)
- npm run test:e2e (all tests pass)
