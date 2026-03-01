---
description: "Read-only code review and constraint audit"
agent: reviewer
---

Perform a read-only adversarial review of recent changes. Do not modify any files.

## Steps

1. Require an explicit review surface from the orchestrator:
   - exact file list, or
   - staged diff explicitly declared as the review scope.
2. Run `git status --short` to detect unrelated uncommitted changes.
3. If scope is missing, or the repo is dirty beyond the declared scope, stop and report `BLOCKED`.
4. Review only the declared files against the checklist below.
5. Run `npm run lint:colors` when relevant to the scoped files.
6. Run `npm run security:scan` when relevant to the scoped files.
7. Report `APPROVED`, `ISSUES FOUND`, or `BLOCKED` with specific citations.

## Review Checklist

- No raw Tailwind colors
- No hardcoded secrets, API keys, or PII
- No fragile-file modifications without approval
- Semantic HTML used correctly
- Existing code patterns followed
- `internet_sku` not exposed in client-side code or UI
- Touch targets and text sizes remain within project rules

## Report Format

```text
## Review: [APPROVED / ISSUES FOUND / BLOCKED]

### Files Reviewed
- path/to/file.tsx — Clean

### Blockers
- Why review cannot proceed safely

### Critical Issues
- File and line citation

### Suggestions
- Non-blocking improvement

### Summary
1-2 sentence overall assessment
```

## Rules

- Do not read the whole repo by default.
- If no explicit scope exists, stop and ask for it.
- Be specific and cite file paths plus line numbers.
