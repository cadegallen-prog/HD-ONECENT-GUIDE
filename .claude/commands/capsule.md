---
name: capsule
description: Update exactly one topic capsule so topic-based carryover is deterministic
---

# /capsule

## Intent

Update exactly one topic capsule so topic-based carryover is deterministic and locked.

**Outcome:**
- `.ai/topics/<TOPIC>.md` becomes source of truth for that domain
- Next agent (same tool or different) can pick up context without re-reading full STATE.md
- Decisions are locked; open questions are explicit

---

## Read First

1. `.ai/CRITICAL_RULES.md`
2. `.ai/DECISION_RIGHTS.md`
3. `.ai/CONTRACT.md`
4. `.ai/STATE.md`
5. `.ai/topics/INDEX.md` (if present)

---

## Input Format

User supplies a topic name:
- `SEO`
- `MONETIZATION`
- `UI_DESIGN`
- `DATA_PIPELINE`
- Or other topic if it exists

File target must be:
- `.ai/topics/<TOPIC>.md`

---

## Scope

- Update **only** the single capsule file
- Do not touch application code
- Do not update other docs unless explicitly asked

---

## Process

### Step 1: Read Current Capsule

Open `.ai/topics/<TOPIC>.md` (if it exists) or use the template below (if new).

### Step 2: Refresh Content from Reality

Based on what happened this sprint:
- What is **truly** the current status of this topic?
- What decisions **are locked** and cannot change?
- What decisions **are still open** and need Cade input?
- What are the **next 3-5 concrete actions**?
- What docs/references are **canonical** for this topic?

### Step 3: Rewrite Using Standard Capsule Format

Update `.ai/topics/<TOPIC>.md` with these sections in order:

```markdown
# <TOPIC>

## CURRENT STATUS

- 5 to 12 bullets max
- Only what is true right now
- Use status icons: ✅ (done), 🔄 (in progress), ⏸️ (blocked), ❌ (broken)

---

## LOCKED DECISIONS

- Only approved and locked decisions
- Atomic, testable bullets
- Rationale brief (1 line max)

---

## OPEN QUESTIONS

- Max 5 questions
- If Cade decision needed: format as "A) [option], B) [option], C) [option]"
- What you need from Cade to move forward

---

## NEXT ACTIONS

- Ordered list, 3 to 10 items
- Each item is concrete and verifiable
- If blocked on Cade decision: note the open question blocking it

---

## POINTERS

- Links to canonical deep docs in `.ai/` root
- Links to relevant `.ai/impl/<FEATURE>.md` if implementing
- Links to proof reports if applicable
- Links to SESSION_LOG.md entries if recent work happened

---

## Archive References

- If this topic was archived/paused: link to `.ai/archive/` snapshots
- If this is new: leave this section empty

```

### Step 4: Verify Quality

Checklist before finishing:
- [ ] CURRENT STATUS is honest and up-to-date
- [ ] LOCKED DECISIONS reflect approved changes only
- [ ] OPEN QUESTIONS are clear (each has A/B/C if needed)
- [ ] NEXT ACTIONS are ordered by priority
- [ ] Each action is testable/verifiable
- [ ] POINTERS link to real files (run a quick link check)
- [ ] No fictional facts
- [ ] No narrative bloat (keep it scannable)

---

## Finish

After writing the capsule:

1. **Print NEXT ACTIONS list only** (copy/paste to Cade):
   ```
   NEXT ACTIONS for <TOPIC>:
   1. [Action]
   2. [Action]
   3. ...
   ```

2. **Recommend whether `/handoff` is needed:**
   - If switching tools: "Ready for `/handoff` before switching to [tool]."
   - If continuing in same tool: "Ready for next session in [tool]."
   - If work is complete: "This topic is stable. No immediate handoff needed."

---

## Example: Updating SEO Capsule

**Scenario:** Just finished adding FAQ schema to `/guide`.

**Before (Stale):**
```
## CURRENT STATUS
- ✅ Basic site structure + sitemap complete
- ✅ Homepage + Guide + Penny List indexed (3 target pages)
- ✅ Daily users: 680 (up 3.5x from Jan 9)
- 🔄 **P0-3 in progress:** Schema markup (FAQ, HowTo) + internal linking
- ❌ Zero non-branded organic clicks
```

**After (Updated):**
```
## CURRENT STATUS
- ✅ Basic site structure + sitemap complete
- ✅ Homepage + Guide + Penny List indexed (3 target pages)
- ✅ Daily users: 680 (up 3.5x from Jan 9)
- ✅ FAQ schema added to `/guide` (validated in Google Rich Results Test, Jan 18)
- 🔄 **P0-3 in progress:** HowTo schema + internal linking remaining
- ❌ Zero non-branded organic clicks (will improve once schema is live)
```

---

## Guardrails

- **Atomic updates:** Update one topic at a time
- **Honesty:** Only lock decisions that are actually approved
- **Link verification:** Test a few pointers to ensure they're accurate
- **No scope creep:** Don't invent work or add features to the action list
- **Respect DECISION_RIGHTS:** If a decision needs Cade approval, mark it as OPEN QUESTIONS, don't lock it

---

**When done:** Print NEXT ACTIONS and recommend handoff status.
