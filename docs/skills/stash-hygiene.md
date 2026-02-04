# Skill: Stash Hygiene (Kill Hidden WIP)

Use this when git stashes (or untracked junk) are creating "invisible state" that confuses AI agents and blocks clean commits.

## Goal

- Keep `git status` clean and `git stash list` near-zero.
- If you must delete stashes, **bundle them first** so restores are possible.

## Safety Rules

- Do **not** `pop` random old stashes onto `main`.
- Prefer extracting specific files from a stash (`git checkout <rev> -- <paths>`) instead of applying the whole thing.
- If dropping stashes, **always create a local bundle backup first** (stored in `.cache/`, which is gitignored).

## Inventory Commands

```bash
git stash list
git stash show --name-only "stash@{0}"
git stash show -p "stash@{0}"
```

## Best-Practice Workflow

### 1) Promote "real work" into a commit

If a stash represents real work you want shipped, apply it surgically:

```bash
# See what's inside
git stash show --name-only "stash@{0}"

# Extract only the files you actually want
git checkout "stash@{0}" -- app/... components/...

# Then commit normally
git add -A
git commit -m "..."
```

### 2) Bundle + drop the rest (keeps repo clean for agents)

Create a local bundle backup, then drop the stashes. This keeps the repo free of hidden WIP while preserving a restore path.

High-level steps:

1. Create `.cache/stash-bundles/<YYYY-MM-DD>/`
2. Create temporary refs pointing at each stash commit
3. `git bundle create ... <refs> ^main`
4. Delete the temporary refs
5. Drop stashes (descending index)

Restore later:

```bash
# List what the bundle contains
git bundle list-heads .cache/stash-bundles/<date>/stashes.bundle

# Fetch one ref back into the repo
git fetch .cache/stash-bundles/<date>/stashes.bundle \
  refs/stash-backup/<date>/stash-07:refs/stash-restored/stash-07

# Inspect or apply selectively
git show refs/stash-restored/stash-07
git checkout refs/stash-restored/stash-07 -- <paths...>
```

## Notes

- `.cache/` is ignored, so bundles won't affect deploys or PR diffs.
- If a stash includes untracked files, you may need to recreate them manually or fetch the stash commit and extract those paths explicitly.
