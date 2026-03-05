# UX Redesign Requirements

**Status:** Not started — awaiting dedicated planning session
**Priority:** High — owner considers current state a "catastrophic failure"
**Source:** Owner feedback, 2026-03-05

---

## Owner's Core Complaints

1. **Guide page hierarchy is ambiguous** — condensed Step 1-7 guide AND expanded sections on `/guide` creates confusion. Users don't know where to start/stop.
2. **Decision paralysis** — too many options presented to users who, by definition, are beginners (they're reading the guide because they don't know how to find penny items).
3. **Link styling is tacky** — underlined text + different font color + `→` arrow. Needs consistent, professional link treatment.
4. **Report-find lacks credibility** — information presentation undermines trust.
5. **No cohesive visual design** — pages feel disconnected from each other.
6. **Information priority is wrong** — pages don't surface what matters most to the user's current task.
7. **Redundancy** — same information repeated in different formats without purpose.
8. **Homepage unsettled** — proof-first front door layout needs more work.

## Requirements (AI-enhanced)

- Redesign visual hierarchy and navigation flow for clear user path
- Consolidate guide into single progressive-disclosure interface (eliminate condensed vs expanded redundancy)
- Standardize link presentation: consistent, professional, no underlines/color variations/arrow decorations
- Restructure report-find to enhance credibility
- Implement guided experience that reduces decision paralysis for novices
- Establish clear content prioritization aligned with user needs
- Ensure cohesive visual design throughout all pages
- Apply UX best practices for information architecture
- Remove ambiguous navigation elements
- Create logical progression from basic concepts to advanced techniques

## Pages Affected

- `/` (homepage)
- `/guide` (guide hub + all chapter pages)
- `/faq`
- `/report-find`
- `/penny-list` (link styling only)

## Approach

This requires a `/plan` session with the Architect agent. Do NOT attempt ad-hoc fixes — the problems are systemic and interconnected.

## Cross-Device Issues (Separate but Related)

- Penny-list header clipping on iPhone XR (FIXED: viewport safe-area config added 2026-03-05)
- Device-specific spacing inconsistencies across iPhone models
- Need systematic cross-device audit once Chrome DevTools MCP is available
