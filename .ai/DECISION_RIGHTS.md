# Decision Rights Matrix

**Purpose:** Clear boundaries for what AI can decide autonomously vs. what requires Cade's approval.

**Authority note:** If any guidance here conflicts with `VISION_CHARTER.md`, the charter wins.
All implementation still requires a completed Alignment Gate before mutation.

---

## 🟢 AI Can Decide (No Approval Needed)

### Code Structure & Implementation

- Variable and function naming
- Code organization and file structure
- Performance optimizations
- Refactoring (as long as behavior stays the same)
- TypeScript type definitions
- Comment and documentation improvements

### Bug Fixes

- Fixing build errors
- Fixing TypeScript errors
- Fixing broken links
- Fixing console errors/warnings
- Security vulnerability patches (XSS, injection, etc.)

### Minor Styling

- Adjusting spacing/padding within existing design system
- Fixing responsive layout issues
- Improving accessibility (ARIA labels, contrast, focus states)
- Using existing color tokens from design system

### Documentation

- Updating technical docs
- Adding code comments
- Updating SESSION_LOG.md and LEARNINGS.md
- Creating how-to guides for Cade

### Testing & Verification

- Running build and lint checks
- Testing on different viewports
- Verifying existing functionality still works

---

## 🟡 AI Should Propose First (Get Approval Before Implementing)

**Proposal format (required):** Options **A/B/C** with tradeoffs (scope, time, risk), plus rollback plan and what proof will verify success.

### New Features

- Adding any new user-facing functionality
- Creating new pages or routes
- Adding form inputs or interactive elements
- Implementing filters, sorts, search

**Why:** Cade needs to ensure it aligns with community needs and project goals.

### UI/UX Changes

- Changing layout of existing pages
- Modifying navigation structure
- Changing button text or labels
- Altering user workflows

**Why:** Cade knows the community and what language/flow they expect.

### Dependencies

- Installing new npm packages
- Upgrading major versions of existing packages
- Adding new external APIs or services

**Why:** Dependencies add maintenance burden and potential security risks.

### Data Changes

- Modifying what data gets displayed
- Changing data fetching logic
- Altering privacy/security of data (what's sent to browser)

**Why:** Privacy and accuracy are critical for this community.

### Performance Trade-offs

- Decisions that trade speed for features
- Caching strategies
- Image optimization approaches

**Why:** Cade needs to understand the cost-benefit.

---

## 🔴 AI Must NEVER Do Without Explicit Permission

### High-Risk Technical Changes

- ❌ Modifying `globals.css`
- ❌ Changing the React-Leaflet map component (`store-map.tsx`)
- ❌ Removing "use client" directives
- ❌ Changing build configuration (next.config.js, tsconfig.json)
- ❌ Modifying environment variable usage

**Why:** These areas are fragile and have broken things before.

### Design System Changes

- ❌ Adding new colors outside existing palette
- ❌ Changing typography scale
- ❌ Modifying spacing tokens
- ❌ Changing dark mode behavior

**Why:** Design consistency is a core value of this project.

### Data Privacy & Security

- ❌ Exposing user emails or personal info
- ❌ Changing what data gets logged or tracked
- ❌ Adding analytics or tracking without disclosure
- ❌ Committing secrets or API keys

**Why:** Legal and ethical obligations to community.

### Cost-Incurring Changes

- ❌ Adding paid APIs or services
- ❌ Enabling features that cost money per-use
- ❌ Database or hosting upgrades

**Why:** Cade manages budget and needs to approve expenses.

### Deployment & Git

- ❌ Force-pushing to main branch
- ❌ Deploying to production without Cade's "ship it"
- ❌ Deleting branches
- ❌ Modifying git history (rebase, amend on shared commits)

**Why:** Production stability is non-negotiable.

---

## Decision-Making Framework

When in doubt, ask yourself:

1. **Could this break something?** → Propose first
2. **Would Cade need to explain this to users?** → Propose first
3. **Does this cost money or add maintenance?** → Get permission
4. **Is this in the "NEVER" list in CLAUDE.md?** → Stop, get permission
5. **Is this a pure code improvement with no user impact?** → Proceed

---

## Examples

### ✅ AI Can Decide

- "I'm fixing a TypeScript error in the penny list component"
- "I'm adding better error handling to the CSV fetch function"
- "I'm improving the mobile layout of the trip tracker"
- "I'm adding comments to explain how the store search works"

### 🟡 AI Proposes First

- "I want to add a 'sort by date' option to the penny list. Here's how it would work..."
- "I recommend changing the homepage hero section to highlight the new penny list feature. Mockup: ..."
- "We could speed up page loads by 20% if we lazy-load the map. Trade-off is..."

### 🔴 AI Asks Permission

- "The design system uses too many grays. Should I consolidate?"
- "I need to modify globals.css to fix a z-index issue. Can I proceed?"
- "I found a better geocoding API but it costs $5/month. Want to switch?"

---

## Override Protocol

If AI believes something in the "NEVER" category absolutely must be done:

1. Explain WHY it's necessary
2. Explain the RISK of not doing it
3. Explain HOW you'll mitigate the risk
4. Wait for explicit "Yes, proceed"

**Example:**
"I need to modify globals.css to fix a critical accessibility issue (text contrast failing WCAG AAA). The risk of not fixing this is legal/ethical. I'll make the smallest possible change and test thoroughly. Approve?"

---

## Version History

- **v1.0 (Dec 7, 2025):** Initial decision rights matrix

---

## Decisions (2025-12-13)

- Canonical entrypoint: root [README.md](../README.md) is the single canon for humans and AI; `.ai/README.md` is a stub that points back to it.
- Palette refresh permission: future “Palette Refresh” may update tokens/colors only if WCAG AA minimum (target AAA) is preserved and before/after screenshots (light/dark, key routes) are captured; update lint:colors baseline when intentional.
- Lighthouse cadence: only re-run Lighthouse when making performance-critical or visual/token/layout changes, or during scheduled reviews; record outputs in [LIGHTHOUSE_RESULTS.md](../LIGHTHOUSE_RESULTS.md) and associated artifacts under `test-results/` (mobile JSON currently `lighthouse-mobile.json`).
- Operational rules reaffirmed: default to no new dependencies; avoid orphan one-off files (add only when retiring or merging an obsolete one and log it); update `SESSION_LOG.md` and refresh `STATE.md` (and `BACKLOG.md` if priorities move) at the end of meaningful work.
