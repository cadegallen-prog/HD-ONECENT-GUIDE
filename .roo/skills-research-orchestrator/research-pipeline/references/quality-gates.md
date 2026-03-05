# Quality Gates — Orchestrator Reference

Use these checklists to verify each completed section in the session file. Quality gates are simple yes/no checks — not judgment calls.

## Topic Analysis Quality Gate

After a `youtube-researcher` completes a topic analysis section:

```
[] "What it is" is non-empty (at least 2 sentences)
[] "Relevant codebase files" lists at least 2 file paths
[] "Current state" contains a file path reference (proves they read code)
[] "Recommendation" contains a file path AND a specific action verb
   (implement, replace, add, remove, refactor, extract)
[] Priority, Effort, Risk are all filled in (not blank or "_")
```

All 5 pass → **PASS** — mark Quality Gate as PASS
Any fail → **FAIL** — note which criteria failed, spawn fix task

## Audit Area Quality Gate

After a `codebase-auditor` completes an area audit section:

```
[] "Findings" section is non-empty
[] At least 1 positive pattern listed
[] Each issue has a file path
[] At least 3 total findings (positive + issues combined)
```

All 4 pass → **PASS**
Any fail → **FAIL**

## Technology Research Quality Gate

After a `docs-researcher` completes a technology section:

```
[] "Our version" is filled in (not blank)
[] "Current version" is filled in
[] At least 1 pattern to adopt with file path reference
[] Section is at least 100 words
```

All 4 pass → **PASS**
Any fail → **FAIL**

## Fix Task Protocol

When a quality gate FAILS:

1. Note which specific criteria failed
2. Spawn `new_task` to the SAME mode with message:
   ```
   Fix task: Section [X] in session file [path] failed quality gate.
   Missing: [list specific failed criteria].
   Read the section, fix ONLY the missing parts.
   Do NOT rewrite parts that are already good.
   Use the same skill as the original task.
   ```
3. **Maximum 1 fix attempt per section**
4. If the fix also fails, mark Quality Gate as `FAILED — MANUAL REVIEW` and move on
5. Never loop — one original attempt + one fix attempt = done
