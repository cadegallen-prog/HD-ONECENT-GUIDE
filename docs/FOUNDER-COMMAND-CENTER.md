# Founder Command Center (Keep This Open)

Use this page as your always-open second-monitor guide.

## Rule 0

You do **not** need to remember skill names.

## If You Forget Everything, Send This

```text
Read docs/skills/README.md first. Choose and run whatever skills are needed automatically. Do the work end-to-end, run verification, and give me a plain-English summary with what changed, why, and what I need to do next.
```

## Quick Decision Tree

1. Is something broken right now (bug, page missing, wrong behavior)?
   Send:

```text
Something is broken. Find root cause, fix it, verify it, and show me proof.
```

2. Is this a copy/wording/clarity issue?
   Send:

```text
Rewrite this for clarity and trust in plain English, keep legal accuracy, and keep the existing product behavior.
```

3. Is this legal/trust/privacy/compliance content?
   Send:

```text
Audit legal/trust pages for accuracy and consistency with what is actually live. Fix mismatches, verify, and summarize risks by severity.
```

4. Did monetization channels change (added, paused, retired)?
   Send:

```text
Monetization status changed. Update all related legal/disclosure copy and tests to match live reality, remove stale claims, verify, and show proof.
```

5. Is this UX/UI polish or layout cleanup?
   Send:

```text
Improve UX/UI for this flow without changing scope. Keep design tokens and accessibility standards. Verify and include screenshots.
```

6. Is this color/typography/readability consistency?
   Send:

```text
Refine color and typography consistency using existing tokens only, keep contrast-safe output, and verify no regressions.
```

7. Is this a manual data update with JSON payload?
   Send:

```text
/manual
<paste JSON here>
```

8. Not sure what category this is?
   Send:

```text
I’m not sure what this is. Diagnose it, choose the right workflow, execute end-to-end, and explain in plain English.
```

## Non-Negotiables You Can Reuse Anytime

Add one line to any request when you want strict execution:

```text
Do not ask me to pick skills or process steps. Make the choices, execute, verify, and report.
```

## 3 Commands You May Run Yourself (Optional)

- `/doctor` = quick environment health check
- `/verify` = run verification bundle
- `/proof` = take screenshot proof after UI changes

If you do not run these yourself, ask the agent to run the equivalent checks.

## What Good Output Looks Like

Ask for this exact format when needed:

```text
Give me:
1) what changed
2) why it changed
3) proof it works
4) what I need to do next (or “No action needed”)
```
