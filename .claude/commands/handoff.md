---
name: handoff
description: Produce portable context pack for starting fresh chat or switching tools
---

# /handoff

## Intent

Produce a portable context pack for starting a fresh chat or switching tools (Claude → Codex → Copilot).

**Outcome:**

- Updates `.ai/HANDOFF.md` with current reality
- Prints ONE copy-paste block (the "New Session Primer") for Cade to paste into the next chat
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

- ✅ MCP: filesystem, github, playwright, supabase
- ✅ Skills: plan, architect, implement, test, review, debug, etc.
- ✅ Ideal for: Full feature development

### Codex (GPT-5.2)

- ✅ MCP: Same (if ~/.codex/config.toml synced)
- ✅ Ideal for: Full feature development, alternative to Claude

### Copilot Chat

- ✅ MCP: filesystem, github, playwright, supabase (via .vscode/mcp.json)
- ✅ Ideal for: Quick development + Supabase migrations
```

Include any additional context-specific sections the agent deems useful (e.g., "What Just Happened", "Uncommitted Changes", "Key Files by Purpose", "Emergency Checklist").

---

### Step 3: Generate Output Block

After updating `.ai/HANDOFF.md`, generate and print **one output block** to Cade:

#### New Session Primer

```
---
NEW SESSION PRIMER (Copy/Paste into Next Chat)
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

My goal: _______________________________________________
(Fill in what you want this session — e.g., "commit the store finder fix",
"design a plan for the visual pointing tool", "improve guide chapter 1")
```

**That's it.** One block. Cade pastes it, fills in his goal, and the next agent takes it from there.

The next agent will:

- Read the docs listed above
- Discover its role from `.ai/ORCHESTRATION.md` (Auto-Chain is default)
- Design + implement + test + review automatically
- If Cade wants design-only, he writes that in the goal field (e.g., "Design a plan for X, don't implement yet")

---

## Finish

1. **Confirm `.ai/HANDOFF.md` is updated** (print: "HANDOFF.md updated")
2. **Print the New Session Primer** so it's copy-paste ready
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

**When done:** Print the New Session Primer and confirm Cade is ready to switch tools or continue.
