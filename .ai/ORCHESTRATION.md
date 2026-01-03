# Agent Orchestration Patterns

**Purpose:** How to coordinate multiple agents for complex tasks.

**Key principle:** Each agent has a focused job. Chain them together for full workflows.

---

## Pattern A: Sequential (Most Common)

Use for: Standard feature development

```
You → Architect → [approval] → Implementer → Tester → Reviewer → Done
```

### How to run it:

**Step 1:** "Act as the architect agent. I want to add [feature]."
- Wait for the plan
- Review it (does it make sense?)
- Say "Approved" or ask questions

**Step 2:** "Approved. Act as the implementer agent and build this."
- Wait for code to be written
- You'll see file changes

**Step 3:** "Act as the tester agent and verify the changes."
- Wait for tests + verification
- Should see all 4 gates pass

**Step 4:** "Act as the reviewer agent and check everything."
- Wait for review
- Should say "Approved" or list issues

**Step 5:** If approved, you can commit.

---

## Pattern B: Parallel (For Speed)

Use for: Large features where UI, tests, and docs can happen simultaneously

```
You → Architect → [approval] → Implementer (code) ─┐
                             → Tester (tests) ────┼→ Reviewer → Done
                             → Documenter (docs) ─┘
```

### How to run it:

**Step 1:** Same as Sequential - get architecture approved

**Step 2:** "I want parallel work.
- Implementer: build the UI in components/
- Tester: write tests in tests/
- Documenter: update STATE.md"

**Important:** Tell each agent which files are THEIRS. They shouldn't touch each other's files.

**Step 3:** Wait for all to complete, then review.

---

## Pattern C: Debug Loop

Use for: Fixing bugs that might need multiple attempts

```
You → Debugger → [finds issue] → Implementer → Tester → [pass?] → Done
                                             → [fail?] → back to Debugger
```

### How to run it:

**Step 1:** "Act as the debugger agent. [Describe the problem]"
- Provide error messages, screenshots, steps to reproduce
- Wait for root cause analysis

**Step 2:** "Act as the implementer agent and fix this."
- Wait for the fix

**Step 3:** "Act as the tester agent and verify."
- If passes: Done!
- If fails: "The fix didn't work. Act as the debugger agent again."

---

## Pattern D: Exploration (No Code)

Use for: Brainstorming before committing to an approach

```
You → Brainstormer → [options] → You decide → Architect → ...
```

### How to run it:

**Step 1:** "Act as the brainstormer agent. I'm thinking about [idea]."
- Get 2-3 options with pros/cons
- No code is written

**Step 2:** Pick an option

**Step 3:** "I like option B. Act as the architect agent and design it."

---

## Pattern E: Review-First (Safety)

Use for: Risky changes or unfamiliar areas

```
You → Architect → Reviewer (review plan) → [approval] → Implementer → ...
```

### How to run it:

**Step 1:** Get the architecture plan

**Step 2:** "Before implementing, act as the reviewer agent and check this plan against CONSTRAINTS.md."
- Catches issues before code is written

**Step 3:** If approved, proceed to implementation

---

## Pattern F: Auto-Chain (DEFAULT - No Manual Invocation)

Use for: Most work after Cade says "build it"

```
Cade: "Build X" → AI automatically chains:
  Implementer → Tester → Reviewer → Documenter → Done
```

### Why this exists:

The other patterns require Cade to manually invoke each agent ("Act as implementer...", "Act as tester..."). This creates friction and cognitive load.

**Auto-Chain is the default.** When Cade says "build it" / "do it" / "go", the AI should:

1. **Implement** the feature/fix
2. **Run all 4 quality gates** (lint, build, test:unit, test:e2e)
3. **Fix any failures** automatically (within green zone authority)
4. **Check constraints** (colors, fragile areas, security)
5. **Update docs** (SESSION_LOG, STATE, BACKLOG)
6. **Report back** with proof: "Done. All gates pass. Here's the output."

### When to break out of Auto-Chain:

- A gate fails and the fix requires yellow/red zone changes → STOP, escalate to Cade
- Touching fragile areas (globals.css, store-map.tsx) → STOP, confirm first
- The scope expanded beyond original ask → STOP, confirm before continuing

### Example:

**Before (manual):**
- Cade: "Add a filter to penny list"
- AI: "I'll implement. Act as implementer?"
- Cade: "Yes"
- AI: [implements]
- AI: "Done implementing. Act as tester?"
- Cade: "Yes"
- AI: [runs tests]
- AI: "Tests pass. Act as reviewer?"
- Cade: "Yes"
- AI: [reviews]
- Cade: "Ugh, 6 back-and-forths for one feature"

**After (auto-chain):**
- Cade: "Add a filter to penny list. Go."
- AI: [implements] → [tests] → [reviews] → [updates docs]
- AI: "Done. Filter implemented. All 4 gates pass. Here's proof: [output]. SESSION_LOG updated."
- Cade: "Nice."

### Rule:

**Auto-Chain is ON by default.** Only fall back to manual patterns when:
- Cade explicitly invokes an agent ("Act as the architect agent...")
- The task is purely exploratory (Brainstormer mode)
- Something goes wrong that needs human decision

---

## File Ownership During Parallel Work

When multiple agents work simultaneously, each owns specific files:

| Agent | Owns | Does NOT touch |
|-------|------|----------------|
| Implementer | `components/`, `lib/`, `app/` | `tests/`, `.ai/` |
| Tester | `tests/` | `components/`, `lib/`, `app/` |
| Documenter | `.ai/` | Everything else |

**Rule:** If Agent A needs to change a file Agent B owns, Agent A must WAIT for Agent B to finish.

---

## Common Workflows

### "I want to add a feature"
1. Architect → 2. Implementer → 3. Tester → 4. Reviewer → 5. Commit

### "Something is broken"
1. Debugger → 2. Implementer (fix) → 3. Tester → 4. Commit

### "I have an idea but not sure how"
1. Brainstormer → 2. You decide → 3. Architect → ...

### "Session is ending"
1. Documenter (update logs) → 2. Tester (run verify) → 3. Commit if clean

### "I need to understand the codebase"
1. Brainstormer (exploration mode) - no code changes

---

## Anti-Patterns (Don't Do This)

**Don't:** Ask one agent to do everything
- "Implement this feature, write tests, and update docs"
- This leads to drift and missed steps

**Do:** Chain agents
- "Act as implementer" → "Act as tester" → "Act as documenter"

**Don't:** Let agents modify files outside their scope
- Implementer touching test files
- Tester modifying source code

**Do:** Keep scopes clean
- Each agent stays in their lane

**Don't:** Skip the review step
- Bugs slip through, constraints get violated

**Do:** Always review before commit
- Even for small changes
