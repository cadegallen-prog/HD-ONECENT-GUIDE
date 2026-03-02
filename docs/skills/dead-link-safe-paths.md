# Skill: Dead-Link-Safe Paths

Use this when founder-facing replies need file references, proof artifact locations, or report folders that must be easy to use in chat.

## When to use

- Any final response that references local repo files
- Any response that points to proof screenshots, Playwright outputs, or verification artifacts
- Any chat surface where markdown local-file links may render as dead or non-openable

## Required output format

1. Use plain absolute Windows paths for local files and folders.
2. Add a line number when it materially helps.
3. If opening the file matters, include a one-line PowerShell command only when helpful.
4. Reserve clickable links for real web URLs only (`https://...`).

## Preferred examples

- `C:\Users\cadeg\Projects\HD-ONECENT-GUIDE\app\report-find\page.tsx:31`
- `C:\Users\cadeg\Projects\HD-ONECENT-GUIDE\reports\proof\2026-03-01T11-17-35\`
- `Get-Content 'C:\Users\cadeg\Projects\HD-ONECENT-GUIDE\app\report-find\page.tsx'`

## Avoid

- Markdown links to local repo files or artifact folders in founder-facing replies
- Phrases that imply a local path is clickable unless it is a real web URL
- Mixing local dead-link formatting with real web URLs in a way that hides which is which
