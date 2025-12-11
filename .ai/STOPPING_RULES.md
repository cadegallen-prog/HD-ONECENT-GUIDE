# Stopping Rules for AI Agents

**Purpose:** Define clear stopping criteria so agents know when work is "done" without over-optimizing.

**Problem this solves:** "Maximum capacity" instruction can be ambiguous — agents may continue indefinitely, adding marginal improvements instead of declaring success.

**Last updated:** Dec 10, 2025

---

## The Meta-Rule

**If you've accomplished the user's goal and passed quality gates, STOP.**

Don't add "bonus" improvements unless explicitly requested. Don't refactor working code. Don't optimize prematurely.

---

## Quality Gates (Must Pass Before Stopping)

### 1. Build Verification

```powershell
npm run build
```

**Must:** Complete with 0 errors

### 2. Lint Check

```powershell
npm run lint
```

**Must:** 0 warnings, 0 errors

### 3. Type Check

**Must:** 0 TypeScript errors (caught by build)

### 4. Unit Tests (if exist)

```powershell
npm run test:unit
```

**Must:** 100% pass rate

### 5. Git Branch Check

**Must:** Verify which branch changes are on

- If testing in `dev` locally, explicitly tell user changes need merge to `main` to deploy
- If user expects changes live but they're in `dev`, that's the problem

### 6. Feature Completeness

**Must:** User's stated goal accomplished

- If goal was "fix X", is X fixed?
- If goal was "add Y", does Y exist and work?
- If goal was "improve Z", is Z measurably better?

### 7. Documentation Updated

**Must:** Update relevant docs

- `PROJECT_ROADMAP.md` if features/priorities changed
- `CHANGELOG.md` for significant work
- `SESSION_LOG.md` for all work (brief summary)

---

## When to STOP Working

### ✅ STOP if:

1. User's goal accomplished
2. All quality gates passed
3. Documentation updated
4. User informed of what was done and next steps

### ⚠️ PROPOSE NEXT STEPS (but don't do them) if:

1. You notice related improvements that could be made
2. You see technical debt that should be addressed
3. You identify testing gaps

**How to propose:**

> "I've completed [goal]. Here are optional next steps if you want to continue:
>
> 1. [Related improvement]
> 2. [Technical debt item]
> 3. [Testing recommendation]
>
> Want me to proceed with any of these?"

### ❌ DON'T keep working if:

1. User's goal complete but you think of "nice to haves"
2. Code works but isn't "perfect"
3. You want to add tests "just in case"
4. You want to refactor working code
5. You're adding features user didn't ask for

---

## Interpreting "Maximum Capacity" Instructions

When user says "utilize maximum capacity" or "work until you run out of tokens":

**WRONG interpretation:**

- Keep coding until token limit
- Add every possible improvement
- Refactor everything you see
- Write exhaustive documentation
- Test every edge case imaginable

**CORRECT interpretation:**

- Maximize VALUE per token, not just token usage
- Focus on high-impact work first
- Stop when user's goal accomplished + quality gates passed
- Don't manufacture work to fill tokens
- "Maximum juice for the squeeze" means efficiency, not volume

---

## The 80/20 Rule

**80% of value comes from 20% of work.**

If you've delivered the 80%, STOP and ask before doing the 20%.

**Example:**

- User asks: "Fix the penny list table contrast"
- You do: Improve contrast, update colors, verify WCAG AAA compliance
- You DON'T do: Refactor entire table component, add sorting animations, rewrite tests
- Instead, you PROPOSE: "Table contrast fixed. Optional improvements: [list]. Want any of these?"

---

## Session End Checklist

Before ending your turn:

1. **User's goal accomplished?** [Yes/No]
   - If No: Explain what's blocking and ask for guidance

2. **Quality gates passed?** [Yes/No]
   - If No: Fix before declaring done

3. **Documentation updated?** [Yes/No]
   - If No: Update SESSION_LOG.md minimum

4. **User informed?** [Yes/No]
   - Summary of what was done
   - How to verify it works
   - What (if anything) needs manual steps

5. **Next steps proposed (optional)?** [Yes/No]
   - Only if relevant
   - Don't invent work

---

## Warning Signs You're Over-Optimizing

### 🚩 Red Flags:

- You're on iteration 5+ of the same file
- You're adding features user didn't mention
- You're refactoring working code "because it could be better"
- You're writing documentation longer than the code
- You're testing scenarios that will never happen
- You've passed the original goal but keep going
- You're thinking "just one more improvement..."

### 🛑 If you notice these, STOP and ask:

> "I've completed [original goal]. I'm noticing [additional improvements I could make]. Should I proceed with those, or is the original goal sufficient?"

---

## Common Scenarios

### Scenario 1: Bug Fix Request

**User says:** "Fix the table overflow on mobile"

**You should:**

1. Identify the overflow cause
2. Fix it
3. Test mobile viewport
4. Verify build passes
5. Update SESSION_LOG
6. STOP

**You should NOT:**

- Refactor entire table component
- Add responsive utilities to every page
- Rewrite mobile CSS architecture
- Optimize all mobile experiences

### Scenario 2: Feature Addition

**User says:** "Add a filter to penny list"

**You should:**

1. Add filter dropdown
2. Implement filtering logic
3. Test filtering works
4. Verify build passes
5. Update SESSION_LOG
6. STOP

**You should NOT:**

- Add advanced filtering (unless requested)
- Refactor existing filters
- Add filter presets
- Optimize filter performance (unless slow)

### Scenario 3: Documentation Request

**User says:** "Document the MCP servers"

**You should:**

1. Create comprehensive MCP_SERVERS.md
2. Update AI-TOOLS-SETUP.md with MCP references
3. Update SKILLS.md with MCP quick reference
4. Update README.md with new file listings
5. Verify all documentation consistent
6. STOP

**You should NOT:**

- Rewrite all existing documentation
- Create 50 new documentation files
- Add examples to every doc file
- Reorganize entire .ai/ directory

---

## The "Is This Done?" Test

Ask yourself:

1. **Can the user verify success?** (Is there a clear way to check?)
2. **Did I pass quality gates?** (Build, lint, tests)
3. **Is there a remaining blocker?** (Something preventing ship)
4. **Did I update the log?** (SESSION_LOG.md at minimum)

If all 4 are YES, you're done. STOP.

---

## Exception: "Hack Away" Sessions

When user explicitly says:

- "Work until you run out of tokens"
- "Do as much as possible"
- "Hack away at [large task]"

**Then you may:**

- Work through multiple related tasks
- Go beyond immediate goal IF related to stated task
- Make broader improvements IF within scope

**But you must STILL:**

- Pass quality gates for each change
- Update docs as you go
- Not manufacture unrelated work
- Provide periodic status updates if working long

**And you should NOT:**

- Change unrelated systems
- Violate CONSTRAINTS.md
- Skip testing
- Over-engineer solutions

---

## The Founder Relationship Rule

Remember: The founder is **not** a coder. They trust you to:

1. Solve problems efficiently
2. Not create new problems
3. Be honest about tradeoffs
4. STOP when done (don't waste their time)

**They would rather you:**

- Deliver quickly and move on
- Ask when uncertain
- Propose improvements rather than implement them
- Respect their time and cognitive load

**They do NOT want:**

- Endless iterations
- Over-engineered solutions
- Surprise refactors
- Features they didn't ask for (even if "better")

---

## Calibration: What "Done" Looks Like

### ✅ Good "Done"

```
Task: Fix mobile menu bug
Work done:
- Identified z-index conflict
- Fixed z-index in navbar.tsx
- Tested mobile menu open/close
- Verified build passes
- Updated SESSION_LOG

Result: Mobile menu works. Deployed. Move on.
```

### ❌ Bad "Done" (Over-optimization)

```
Task: Fix mobile menu bug
Work done:
- Identified z-index conflict
- Fixed z-index in navbar.tsx
- Refactored entire z-index system
- Created new CSS architecture for layering
- Rewrote all components to use new system
- Added Storybook for component testing
- Documented z-index standards in 20-page guide
- Created automated z-index linting
- Tested on 50 devices
- Optimized mobile menu animations
- Added accessibility improvements
- Redesigned mobile navigation

Result: Still working after 8 hours. Original bug fixed in step 2.
```

---

## Summary: The Three-Question Stop Test

Before continuing work, ask:

1. **Is the user's goal accomplished?**
2. **Have I passed quality gates?**
3. **Is there a blocker preventing ship?**

If answers are YES, YES, NO → You're done. STOP.

Anything else is optional. Propose it, don't do it.

---

## Version History

- **v1.0 (Dec 10, 2025):** Initial stopping rules
  - Quality gates definition
  - When to stop vs propose
  - Over-optimization warning signs
  - Common scenarios
  - "Is This Done?" test
  - Founder relationship context
