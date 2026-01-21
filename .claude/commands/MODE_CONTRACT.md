---
name: mode-contract
description: Foundational design discipline for all planning and implementation modes
---

# MODE CONTRACT - Design Discipline Framework

**Purpose:** Prevent implementation without proper planning. Eliminate structural ambiguities before writing code.

**Hard Rule:** NO IMPLEMENTATION without ZERO structural ambiguities AND explicit approval.

---

## Core Principles

### 1. Structural Ambiguity Definition

Any uncertainty in these areas blocks implementation:

| Category          | Examples of Ambiguity                                             |
| ----------------- | ----------------------------------------------------------------- |
| **Layout**        | Unclear column count, spacing, alignment, responsiveness          |
| **Interactions**  | Undefined click behavior, hover states, loading states            |
| **Data Rules**    | Unknown validation, edge cases, constraints                       |
| **Missing Data**  | How to handle null/empty values, fallback behavior                |
| **Performance**   | Unknown data limits, pagination needs, loading strategy           |
| **Accessibility** | Missing ARIA patterns, keyboard navigation, screen reader support |

**If you encounter ANY of these ambiguities during /architect or /implement, STOP and return to /plan.**

### 2. Best UX Rubric (Priority Order)

All design decisions must be evaluated against these criteria in order:

1. **Mobile Scan Speed** - Can user accomplish task in <5 seconds on phone?
2. **Contribution Clarity** - Is path to "Report Find" obvious and friction-free?
3. **Truth Constraints** - Does design prevent user errors and bad data?
4. **Consistency** - Does it follow existing patterns (color system, spacing, components)?

When options conflict, prioritize in this order.

### 3. Mode Violation Detection

| Mode           | Violation Examples                                          | What to Do                                    |
| -------------- | ----------------------------------------------------------- | --------------------------------------------- |
| **/plan**      | Writing code snippets, showing diffs, implementation phases | STOP. Stay in product decisions only.         |
| **/architect** | Finding structural ambiguities, unclear requirements        | STOP. Return to /plan to resolve ambiguities. |
| **/implement** | Discovering ambiguities, redesigning UI without approval    | STOP. Return to appropriate mode.             |

**Rule:** If you catch yourself doing implementation work in planning mode (or vice versa), stop immediately and flag the mode violation.

---

## Required Outputs by Mode

### /brainstorm

**Goal:** Explore possibilities quickly without locking decisions.

**Required Output:**

- Exactly 2-3 options (not more)
- For each option:
  - What it is (1-2 sentences)
  - Pros (2-3 bullet points)
  - Cons (2-3 bullet points)
  - Which UX dimension it optimizes (from rubric)
- No winner declared
- No implementation details

**Forbidden:**

- Choosing a winner
- Locking in decisions
- File lists or code patterns
- More than 3 options (analysis paralysis)

### /plan

**Goal:** Achieve ZERO structural ambiguities through concrete specification.

**Required Output:**

1. **CONCRETE SPEC**
   - Layout (columns, spacing, component hierarchy)
   - Typography (font sizes, weights, line clamps)
   - Tap targets (minimum 44x44px)
   - Colors (specific CSS variables to use)
   - Fallback behavior (what happens with null/empty/long values)
   - States (loading, error, empty, success)

2. **DECISION LOG**
   - Locked decisions (cannot change without returning to /plan)
   - Open decisions (must be resolved before /architect)
   - Maximum 5 open decisions to exit /plan mode

3. **STRUCTURAL AMBIGUITY REGISTER**
   - List all discovered ambiguities
   - Resolution for each
   - **Must be EMPTY to exit /plan mode**

4. **ACCEPTANCE CHECKLIST**
   - Objective pass/fail criteria
   - How to verify each requirement
   - No subjective criteria ("looks good")

**Forbidden:**

- Implementation phases
- File lists
- Code snippets or diffs
- Technical architecture details

**Exit Criteria:**

- Structural Ambiguity Register is EMPTY
- Open decisions ≤ 5 (ideally 0)
- Acceptance Checklist is complete and objective
- User explicitly approves: "This spec is approved, proceed to /architect"

### /architect

**Goal:** Design implementation approach for approved spec.

**Precondition:** Approved Concrete Spec from /plan must exist.

**Required Output:**

1. **IMPLEMENTATION PLAN**
   - Files to create/modify (absolute paths)
   - Change sequencing (what must happen first)
   - Technical approach for each file
   - Risk assessment per change

2. **REGRESSION GUARD PLAN**
   - What could break from these changes
   - Prevention strategies
   - Testing approach

3. **VERIFICATION PLAN**
   - Map each Acceptance Checklist item to verification steps
   - How to test (manual steps, automated tests, visual regression)
   - Success criteria per item

**Forbidden:**

- Changing product decisions from approved spec
- Adding features not in spec
- Writing actual code
- Starting implementation

**Failure Mode:**

- If you discover structural ambiguities during architecture, STOP
- Return to /plan to resolve them
- Do NOT proceed to /implement

**Exit Criteria:**

- Implementation plan is clear and sequenced
- Risks are identified and mitigated
- User explicitly approves: "This plan is approved, proceed to /implement"

### /implement

**Goal:** Execute approved plan exactly as specified.

**Precondition:** Approved /architect plan must exist.

**Required Output:**

1. **Implementation Summary**
   - Files modified (list with line counts changed)
   - Key changes per file
   - Any deviations from plan (must be justified)

2. **Evidence**
   - Screenshots (before/after for UI changes)
   - Test output (all 4 quality gates)
   - Console output (no errors)

3. **Testing Checklist**
   - Each Acceptance Checklist item tested
   - Results per item (pass/fail)

4. **Deviation Log**
   - Any deviations from approved plan
   - Justification for each
   - Request approval if significant

**Forbidden:**

- Redesigning UI mid-implementation
- Expanding scope beyond approved plan
- "Improving" things not in spec
- Silent deviations (always document and justify)

**Exit Criteria:**

- All Acceptance Checklist items pass
- All 4 quality gates pass (lint, build, unit, e2e)
- Deviations approved by user
- Ready for /review

### /test

**Goal:** Validate implementation against Acceptance Checklist.

**Required Output:**

1. **Checklist Results**
   - Each acceptance criterion tested
   - Pass/fail per item
   - Evidence (screenshots, console output)

2. **Reproduction Steps**
   - For any failures, clear repro steps
   - Expected vs actual behavior

3. **Fix Suggestions**
   - For failures, suggest minimal fix
   - Reference specific files/lines

**Forbidden:**

- Modifying source code (only test files)
- Subjective assessments ("looks good")
- Skipping items from checklist

### /debug

**Goal:** Find root cause and propose minimal fix.

**Required Output:**

1. **Hypothesis List**
   - Top 3 most likely causes
   - Evidence for each

2. **Reproduction Steps**
   - Clear, numbered steps
   - Expected vs actual outcome

3. **Minimal Fix Plan**
   - Root cause identified
   - Smallest possible change
   - Why this is minimal

4. **Risk Assessment**
   - What else could this break
   - How to verify no regressions

### /review

**Goal:** Verify spec compliance and quality before merge.

**Required Output:**

1. **Spec Compliance Check**
   - Each Acceptance Checklist item reviewed
   - Pass/fail per item
   - Evidence review

2. **UX Rubric Evaluation**
   - Score against 4 UX criteria
   - Any concerns flagged

3. **Constraint Compliance**
   - Check against CONSTRAINTS.md
   - Color system compliance (no raw Tailwind)
   - Fragile area checks (globals.css, store-map)

4. **Deviation Review**
   - Evaluate any documented deviations
   - Approve or reject with rationale

**Exit:**

- "Approved for merge" (all criteria pass)
- OR "Requires changes" (specific list)

### /document

**Goal:** Update documentation to reflect changes.

**Required Output:**

1. **Files to Update**
   - List of .ai/ files needing updates
   - STATE.md (if significant change)
   - SESSION_LOG.md (always)
   - BACKLOG.md (if priorities changed)
   - LEARNINGS.md (if unexpected issues)

2. **Change Summary**
   - What was done (high-level)
   - Decisions made
   - Next steps

---

## Integration with Owner Context

**Remember:** Cade cannot code. This means:

- **In /plan:** Explain what you're specifying and why, not how to implement it
- **In /architect:** Describe approach in plain English before technical details
- **In /implement:** Summarize changes in terms of user-visible behavior
- **Ask for approval:** At mode boundaries, explicitly request permission to proceed

---

## North Star Compliance Check

Before exiting any mode, ask:

1. Does this preserve report counts and state distribution as CORE signals?
2. Does this reduce friction for contributions?
3. Does this serve all 4 user phases (Research, Hunt, Discover, Contribute)?
4. Does this complement (not compete with) Facebook?

If any answer is "no" or "uncertain," stop and reassess.
