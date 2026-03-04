# Skill: Ship Safely (small scoped commits + verification + clean worktree)

## Workflow (feature -> develop -> main promotion)

1. `git checkout develop && git pull origin develop`
2. Run `git status --short` before new work.
3. If dirty, close carryover first (commit/push that scope) or stop and get one explicit scope decision from Cade.
4. Create a `feature/<slug>` branch or worktree from `develop`.
5. Make the smallest possible change for one objective.
6. Stage intentionally (`git add <paths>`) and check staged scope: `git diff --cached --name-only`.
7. Run verification (below).
8. Commit with a clear message.
9. Push the `feature/*` branch and open a PR to `develop`.
10. Re-run `git status --short`; clean is the expected end state before starting the next objective.
11. Promote `develop` to `main` only after required checks pass.

**Never** force-push or rewrite history. Do not stack unrelated local changes across objectives.

## Required verification

Follow the canonical lane model from `.ai/VERIFICATION_REQUIRED.md`:

```bash
npm run verify:fast
```

If the change touches route/form/API/navigation/UI flows, also run:

```bash
npm run e2e:smoke
```

Run full e2e only when trigger policy applies (or when explicitly requested):

```bash
npm run e2e:full
```

If you touched colors/styles, also run:

```bash
npm run lint:colors
```

Related scripts (fast/full): `npm run qa:fast`, `npm run qa:full`.

## UI changes = Playwright proof

- Required for any UI/UX change.
- Artifacts go to `reports/playwright/**` (see `playwright.config.ts`).

## Smoke checks (manual)

Hit the core loop quickly after changes:

- `/penny-list`
- `/report-find`
- `/sku/[sku]` (use a known SKU from `ROUTE-TREE.txt`)
- `/store-finder`

## Rollback plan (safe)

- **Preferred:** `git revert <commit_sha>`
- This keeps history intact and is safe for protected branches (`develop` and `main`).

## Proof + memory updates

- Update `.ai/SESSION_LOG.md` (and `.ai/STATE.md` if meaningful work).
- Include branch hygiene evidence: branch, commit SHA(s), push status, session-end `git status --short`.
- Paste test outputs when claiming “done”.
