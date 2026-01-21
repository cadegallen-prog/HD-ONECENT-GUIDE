---
name: checkpoint
description: Compress and stabilize project context so it stays portable across tools
---

# /checkpoint

## Intent

Compress and stabilize project context so it stays portable across tools.

**Outcome:**

- `.ai/STATE.md` becomes "current sprint only" and small (target: <5K lines)
- History lives in pointers (SESSION_LOG, archives, topic capsules, impl plans)
- Next agent can load context fast, even on constrained tools (Copilot)

---

## Read First

1. `.ai/CRITICAL_RULES.md`
2. `.ai/DECISION_RIGHTS.md`
3. `.ai/CONTRACT.md`
4. `.ai/START_HERE.md`

---

## Inputs

Optional user input:

- Topic focus (example: `SEO` or `UI_DESIGN`)

If none provided: checkpoint the whole sprint (compress all of STATE).

---

## Process

### Step 1: Analyze Current STATE.md

Read what's currently in `.ai/STATE.md`. Identify:

- What happened this sprint (last 7 days)?
- What was the state before this sprint?
- Which items are stale (>30 days old)?
- Which items should archive?

### Step 2: Required Edits to STATE.md

Rewrite `.ai/STATE.md` to this exact structure:

```markdown
# Project State (Living Snapshot)

**Last updated:** YYYY-MM-DD
This file is the **single living snapshot** of where the project is right now.

---

## Current Sprint (Last 7 Days)

- ✅ [Status icon] [1-line truth] ([optional pointer])
- 🔄 [Status icon] [1-line truth] ([optional pointer])
- ⏸️ [Status icon] [1-line truth] ([optional pointer])
- [5-15 items max]

---

## Blockers

[Only real blockers that prevent forward progress]

- **Blocker 1:** [What is blocked]
  - Options: A) [Fastest], B) [Balanced], C) [Ambitious]
  - Need from Cade: [Decision or approval]

---

## Next Actions

1. [Ordered list, 3-7 items max]
2. [Each item is concrete + testable]
3. ...

---

## Pointers

- **Topic capsules:** See `.ai/topics/INDEX.md`
- **Implementation plans:** See `.ai/impl/` directory
- **Relevant deep docs:** `.ai/[TOPIC].md` (if applicable)
- **Proof artifacts:** [Link to recent reports/verification/ or reports/proof/]
- **Session history:** See `.ai/SESSION_LOG.md` [date range]

---

## Archive References

- See `.ai/archive/state-history/` for previous sprint snapshots
- Latest archive: `.ai/archive/state-history/STATE_YYYY-MM-DD.md`
```

### Step 3: Move Old Content (Optional Safe Archive)

If STATE contains history older than 7 days:

1. Export older content to `.ai/archive/state-history/STATE_YYYY-MM-DD.md` with timestamp
2. Replace in STATE with a link to the archive
3. Keep a pointer in "Archive References" section

**Never delete history without archiving it first.**

### Step 4: Verify Compression

- STATE.md word count: target <2K words (down from current ~5K)
- All external links work (test a few)
- Pointers accurately reflect current reality
- No broken references

---

## Finish

After updating STATE:

1. **Report what changed (5 bullets max):**

   ```
   ✅ STATE.md compressed: [X words] → [Y words]
   ✅ [N] old items archived to state-history/
   ✅ Topic pointers added: [list topics]
   ✅ Implementation plan pointers added: [list features]
   ✅ Next actions clarity improved
   ```

2. **Recommend next step:**
   - If topic-specific: "Consider running `/capsule <TOPIC>` next to lock decisions."
   - If switching tools: "Ready to run `/handoff` before switching."
   - If continuing: "STATE is ready for next session."

---

## Guardrails

- **Honesty:** Only put true statements in STATE
- **No deletion:** Archive before removing old content
- **Pointers over duplication:** Prefer links to other docs over rewriting content
- **Testability:** Every action item must be verifiable
- **Keep it small:** Target is fast load time on constrained tools

---

## Example Before/After

**Before (Bloated):**

```
## Current Sprint

- 2026-01-17: Added Ezoic bridge for monetization...
- 2026-01-16: Implemented email signup form...
- 2026-01-15: Added PWA install prompt...
[15+ lines of narrative]
```

**After (Compressed):**

```
## Current Sprint

- ✅ Ezoic bridge active (temporary, awaiting Mediavine approval Feb 11)
- ✅ Email signup + PWA install + weekly digest (retention features, all gates passing)
- 🔄 P0-3 SEO schema markup (ready to architect)
- ❌ Mediavine approval pending (need 30 days analytics, ~25 days remaining)

## Pointers
- **Monetization details:** `.ai/topics/MONETIZATION.md`
- **SEO plan:** `.ai/topics/SEO.md` or `.ai/SEO_FOUNDATION_PLAN.md`
- **Session history:** `.ai/SESSION_LOG.md` (2026-01-17 entry)
```

---

**When done:** Paste the 5-bullet report to Cade and recommend next step.
