# Skill: Plan Canonicality (Repo-First)

**When to use:** A plan was created in a tool-local folder (for example `.claude/plans`) and you need a single shared plan source for all agents.

## Goal

Keep one canonical plan in repo so Claude, Codex, Copilot, and future sessions all reference the same file.

Canonical location:

- `.ai/impl/<slug>.md`

Non-canonical scratch examples:

- `C:\Users\cadeg\.claude\plans\*.md`

---

## Required Workflow

1. Identify canonical target
   - Choose or create `.ai/impl/<slug>.md`.
2. Compare any tool-local draft to canonical
   - Use SHA256 for exact match.
   - If hashes differ, treat tool-local draft as unsynced.
3. Sync to canonical
   - Copy/merge meaningful content into `.ai/impl/<slug>.md`.
   - Continue editing only the repo file.
4. Closeout evidence (required for planning tasks)
   - Canonical plan path
   - Canonical SHA256
   - `No unsynced tool-local plan: YES/NO`
5. Handoff rule
   - Handoff prompts must reference repo paths only (no `.claude` paths).

---

## Hash Check Command (PowerShell)

```powershell
$repo = ".ai/impl/<slug>.md"
$local = "C:\Users\cadeg\.claude\plans\<draft>.md"

"repo_hash=$((Get-FileHash $repo -Algorithm SHA256).Hash)"
if (Test-Path $local) {
  "local_hash=$((Get-FileHash $local -Algorithm SHA256).Hash)"
  "in_sync=$(((Get-FileHash $repo -Algorithm SHA256).Hash) -eq ((Get-FileHash $local -Algorithm SHA256).Hash))"
} else {
  "local_file_missing_ok=True"
}
```
