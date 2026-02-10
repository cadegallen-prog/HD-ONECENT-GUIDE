# Contributing

## Local Verification (Required)

Run this before every push:

```bash
npm run verify:fast
```

Run smoke e2e when changing routes, forms, API handlers, navigation, or other user flows:

```bash
npm run e2e:smoke
```

Run full e2e only for risky work or explicit requests:

```bash
npm run e2e:full
```

## CI Gates

- `Quality Checks (Fast)` runs on `push` and `pull_request`.
- `E2E Smoke` runs on `pull_request` and `push` to `main`.
- `Full QA Suite` runs when any trigger matches:
  - PR targets `main`
  - merge queue (`merge_group`)
  - PR label `run-full-e2e`
  - risky paths changed (`.github/workflows/full-qa.yml`)
  - nightly schedule
  - manual `workflow_dispatch`

## Forcing Full E2E

Use either method:

1. Add the `run-full-e2e` label to a PR.
2. Run `Full QA Suite` from GitHub Actions `workflow_dispatch`.
