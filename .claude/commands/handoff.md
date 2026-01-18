---
name: handoff
description: Produce portable context pack for starting fresh chat or switching tools
---

# /handoff

## Intent

Produce a portable context pack for starting a fresh chat or switching tools (Claude → Codex → Copilot).

**Outcome:**
- Updates `.ai/HANDOFF.md` with current reality
- Prints **New Chat Primer** (copy/paste into next session)
- Prints **ARCHITECT stub** (for designing implementations)
- Prints **IMPLEMENT stub** (for building approved plans)
- Enables next agent to load context fast, even on constrained tools

---

## Read First

1. `.ai/CRITICAL_RULES.md`
2. `.ai/DECISION_RIGHTS.md`
3. `.ai/CONTRACT.md`
4. `.ai/STATE.md`
5. `.ai/BACKLOG.md`
6. Relevant `.ai/topics/<TOPIC>.md` if a topic is specified

---

## Inputs

Optional: one or more topic(s) to focus

**Example:**
- `/handoff` (default: full sprint + BACKLOG top items)
- `/handoff SEO` (focus on SEO context only)
- `/handoff SEO MONETIZATION` (focus on multiple topics)

If none provided: default to current sprint and BACKLOG top 3 items.

---

## Process

### Step 1: Gather Current Reality

Read:
- `.ai/STATE.md` (current sprint)
- `.ai/BACKLOG.md` (top priorities)
- Relevant `.ai/topics/<TOPIC>.md` (if topic-specific)
- Recent `.ai/SESSION_LOG.md` entries (last 2-3)

### Step 2: Update `.ai/HANDOFF.md`

Rewrite `.ai/HANDOFF.md` with these sections in order:

#### 1) TL;DR (Compressed Reality)

```markdown
### What is Penny Central?

[1-line project description]

### Current Reality (YYYY-MM-DD)

- ✅ [Completed item 1]
- ✅ [Completed item 2]
- 🔄 [In progress item]
- ❌ [Broken item or dependency]
- 📊 [Key metric: X users, Y% conversion, Z blocking issue]

### Immediate Next Move

1. [Action 1]
2. [Action 2]
3. [Action 3, if applicable]
```

#### 2) Quick-start Read Order

```markdown
### Always First (5 min)
1. `.ai/START_HERE.md`
2. `.ai/CRITICAL_RULES.md`
3. `.ai/STATE.md`

### Always Second (2 min)
4. `.ai/HANDOFF.md` (this file)

### Contextual (Choose One)
- **For general:** `.ai/BACKLOG.md` + `.ai/GROWTH_STRATEGY.md`
- **For topic work:** `.ai/topics/INDEX.md` → `.ai/topics/<TOPIC>.md`
- **For implementation:** `.ai/impl/<FEATURE>.md`

### Before Implementation
- `.ai/CONTRACT.md`
- `.ai/DECISION_RIGHTS.md`
- `.ai/CONSTRAINTS.md`
```

#### 3) Tool Capability Notes (Brief)

```markdown
### Claude Code
- ✅ MCP: filesystem, github, playwright, supabase, vercel
- ✅ Agents: 14 skills (plan, architect, implement, test, review, debug, document, brainstorm, doctor, verify, proof, session-start, session-end, checkpoint, capsule, handoff)
- ✅ Ideal for: Full feature development

### Codex (GPT-5.2)
- ✅ MCP: Same (if ~/.codex/config.toml synced)
- ✅ Agents: Same (if configured)
- ✅ Ideal for: Full feature development, alternative to Claude

### Copilot Chat
- ❌ MCP: None
- ❌ Agents: None
- ✅ Ideal for: Q&A only
- ⚠️ Escalate when: >3 files, refactoring, major UX changes, proof needed
```

#### 4) New Chat Primer (Copy/Paste Block)

```markdown
## New Chat Primer (Copy/Paste into Chat)

**Use this when starting a fresh session:**

[Paste the primer from section E of AUDIT output or from previous session]

Or shorter version:

```
I'm starting fresh on Penny Central.

Read: .ai/START_HERE.md, .ai/CRITICAL_RULES.md, .ai/STATE.md, .ai/HANDOFF.md

Current: [TL;DR facts from above]

My goal: [GOAL / WHY / DONE MEANS]
```
```

#### 5) Stubs (ARCHITECT and IMPLEMENT Templates)

**ARCHITECT stub** (write to `.ai/impl/<feature-slug>.md`):

```markdown
## ARCHITECT Stub

Use this when you need to design before implementing:

[Include the /architect command text from earlier output, but adapted for this session's focus]

Key: Must write to `.ai/impl/<feature-slug>.md`, not just chat.
```

**IMPLEMENT stub** (read from `.ai/impl/<feature-slug>.md`):

```markdown
## IMPLEMENT Stub

Use this after a plan is approved:

[Include the /implement command text, but adapted for this session's focus]

Key: Must read the approved `.ai/impl/<feature-slug>.md` plan first.
```

---

### Step 3: Generate Output Blocks

After updating `.ai/HANDOFF.md`, generate and print **three output blocks** to Cade:

#### Block A: New Chat Primer

```
---
NEW CHAT PRIMER (Copy/Paste into Next Session)
---

I'm starting fresh on Penny Central.

Read in order:
1. .ai/START_HERE.md
2. .ai/CRITICAL_RULES.md
3. .ai/STATE.md
4. .ai/HANDOFF.md

Current reality (YYYY-MM-DD):
- [TL;DR bullet 1]
- [TL;DR bullet 2]
- ...

My goal: [GOAL / WHY / DONE MEANS]

What should I read or do next?
```

#### Block B: ARCHITECT Stub

```
---
ARCHITECT STUB (Design before implementing)
---

I'm ready to architect a feature for Penny Central.

Read:
- .ai/CRITICAL_RULES.md
- .ai/DECISION_RIGHTS.md
- .ai/CONTRACT.md
- .ai/STATE.md
- .ai/BACKLOG.md
- Relevant: .ai/topics/<TOPIC>.md

Task:
Design the implementation plan for: [FEATURE]

Deliverable:
Write the plan to: .ai/impl/<feature-slug>.md

Plan must include:
1) Goal + Done Means (testable)
2) Constraints and non-negotiables
3) Files to touch (create vs modify)
4) Step sequence (small steps)
5) Risks + mitigations
6) Verification plan (lint, build, unit, e2e, proof if UI)
7) Rollback plan
8) Open questions (max 5) with A/B/C when needed

Stop and ask for approval to implement.
```

#### Block C: IMPLEMENT Stub

```
---
IMPLEMENT STUB (Build approved plan)
---

I'm ready to implement from an approved plan.

Read:
- .ai/CRITICAL_RULES.md
- .ai/DECISION_RIGHTS.md
- .ai/CONTRACT.md
- .ai/STATE.md
- Plan: .ai/impl/<feature-slug>.md

Task:
Implement exactly what the plan specifies.

Guardrails:
- No scope creep. No refactors.
- If plan is ambiguous, stop and present A/B/C.
- Provide traceable edits: list each file touched and why.

Verification:
- Run npm run ai:verify and report results.
- If UI changed, run proof workflow and link artifacts.

After:
- Update .ai/SESSION_LOG.md with changes + proof links.
- Run /checkpoint to compress context.
- Run /capsule <TOPIC> if it changed that topic's current reality.
```

---

## Finish

1. **Confirm `.ai/HANDOFF.md` is updated** (print: "✅ HANDOFF.md updated")
2. **Print the three output blocks** (A, B, C above) so they're copy-paste ready
3. **Recommend next step:**
   - "Ready to switch to [tool name]" (if user is switching)
   - "Ready for `/checkpoint` to compress context further" (if staying)
   - "All set. Handoff complete." (if nothing else needed)

---

## Constraints

- **Keep HANDOFF.md small** (~5K words, fits in context on constrained tools)
- **Prefer pointers over duplication** (link to deep docs, don't rewrite)
- **Do not invent facts** (only include what is verifiably true in STATE/BACKLOG/topics)
- **Tool neutrality** (all three tools should be able to use HANDOFF.md)

---

## Example Handoff Session

**Scenario:** Just finished P0-4c (weekly email digest). Switching from Claude to Codex.

**TL;DR Before:**
```
- ✅ Core product working
- ✅ Retention features live (email, PWA)
- 🔄 Next: SEO schema markup
```

**TL;DR After:**
```
- ✅ Core product working
- ✅ Retention features live (email signup, PWA install, weekly digest cron)
- 🔄 Next: SEO schema markup (P0-3, ready to architect)
- 📊 680 daily users, 26% conversion, 100% Facebook dependency
- ❌ Blocked: Mediavine approval (awaiting 30-day analytics, ~25 days remaining)
```

**Immediate Next Move:**
```
1. Add FAQ schema to `/guide` (validate in Google Rich Results Test)
2. Add HowTo schema to `/guide` (same PR)
3. Wire internal links (guide ↔ penny-list ↔ homepage)
```

---

**When done:** Paste the 3 output blocks (New Chat Primer, ARCHITECT Stub, IMPLEMENT Stub) and confirm Cade is ready to switch tools or continue.
