# Skill: Ship Safely (small scoped commits + verification + clean worktree)

## Workflow (dev -> main promotion)

1. `git checkout dev && git pull origin dev`
2. Run `git status --short` before new work.
3. If dirty, close carryover first (commit/push that scope) or stop and get one explicit scope decision from Cade.
4. Make the smallest possible change for one objective.
5. Stage intentionally (`git add <paths>`) and check staged scope: `git diff --cached --name-only`.
6. Run verification (below).
7. Commit with a clear message.
8. Push `dev`.
9. Re-run `git status --short`; clean is the expected end state before starting the next objective.
10. Promote to `main` only after required checks pass.

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
- This keeps history intact and is safe for shared branches (`dev` and `main`).

## Proof + memory updates

- Update `.ai/SESSION_LOG.md` (and `.ai/STATE.md` if meaningful work).
- Include branch hygiene evidence: branch, commit SHA(s), push status, session-end `git status --short`.
- Paste test outputs when claiming “done”.
