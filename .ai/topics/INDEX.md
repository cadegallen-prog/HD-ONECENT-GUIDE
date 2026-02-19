# Topics Index

**Purpose:** Navigate topic-specific context capsules. Each capsule is the source of truth for its domain.

---

## Available Topics

### [FOUNDER_AUTONOMY](.ai/topics/FOUNDER_AUTONOMY_CURRENT.md)

**Status:** 🔄 In progress (memory foundation shipped)
**Focus:** Persistent-memory reliability + founder-effort minimization operating model
**Quick link:** See `.ai/impl/founder-autonomy-memory-hardening.md` and `.ai/FOUNDER_AUTONOMY_OPERATING_SYSTEM.md`

### [RESILIENCE_GROWTH](.ai/topics/RESILIENCE_GROWTH_CURRENT.md)

**Status:** 🔄 In progress (contingency/diversification planning active)
**Focus:** De-risk traffic/revenue concentration and build additive growth beyond penny-only dependency
**Quick link:** See `.ai/impl/pennycentral-resilience-diversification-plan.md`

### [MY_LIST](.ai/topics/MY_LIST_FEATURE_CURRENT.md)

**Status:** Planning (Phases 1-3 documented)
**Focus:** Saved items / "My List" elevation roadmap + infra reuse constraints
**Quick link:** See `.ai/plans/my-list-elevation.md` for the canonical plan

### [SEO](.ai/topics/SEO.md)

**Status:** 🔄 In progress (P0-3)
**Focus:** Schema markup, internal linking, organic search lift
**Quick link:** See `.ai/SEO_FOUNDATION_PLAN.md` for detailed plan

### [SITE_MONETIZATION](.ai/topics/SITE_MONETIZATION_CURRENT.md)

**Status:** 🔄 Planning baseline (sitewide)
**Focus:** Route eligibility, thin URL lifecycle, and UX-safe ad architecture
**Quick link:** See `.ai/plans/sitewide-monetization-readiness.md`

### [MONETIZATION](.ai/topics/MONETIZATION.md)

**Status:** ✅ Historical bridge context
**Focus:** Ad networks, revenue strategy, timeline
**Quick link:** See `.ai/plans/sitewide-monetization-readiness.md` for current canonical planning

### [ADSENSE_APPROVAL](.ai/topics/ADSENSE_APPROVAL_CURRENT.md)

**Status:** 🔄 In progress (hardening)
**Focus:** Low-value-content recovery, canonical/index hygiene, approval evidence
**Quick link:** See `.ai/STATE.md` for implemented changes and verification

### [MONETIZATION_INCIDENT_REGISTER](.ai/topics/MONETIZATION_INCIDENT_REGISTER.md)

**Status:** 🔄 Active command center (do not close until all incidents resolved)
**Focus:** Cross-network incident tracking (AdSense, Ad Manager, Monumetric, Journey), evidence locking, deadlines, and close criteria
**Quick link:** Update this register at session open/close whenever monetization work is touched

### [MONETIZATION_POLICY_MATRIX](.ai/topics/MONETIZATION_POLICY_VIOLATION_MATRIX.md)

**Status:** 🔄 Active gate (must pass before AdSense re-review)
**Focus:** Fixed policy risk dimensions, required route audit set, and go/no-go criteria for re-review
**Quick link:** Resolve all `Critical/High` findings before requesting review

### [ANALYTICS_CONTRACT](.ai/topics/ANALYTICS_CONTRACT.md)

**Status:** ✅ Active guardrail
**Focus:** GA4 single-source tracking, pageview/user/session verification protocol
**Quick link:** Run `npm run ai:analytics:verify` before/after analytics changes

### [UI_DESIGN](.ai/topics/UI_DESIGN.md)

**Status:** ✅ Frozen (Penny List redesign complete)
**Focus:** Design system, card hierarchy, responsive behavior
**Quick link:** See `.ai/PENNY-LIST-REDESIGN.md` for frozen spec

### [DATA_PIPELINE](.ai/topics/DATA_PIPELINE.md)

**Status:** ✅ Stable (auto-enrich active)
**Focus:** Scrape → Enrichment → Auto-enrich workflow
**Quick link:** See `.ai/CONSTRAINTS_TECHNICAL.md` for system details

### [CONSOLE_AUDIT](.ai/topics/CONSOLE_AUDIT.md)

**Status:** ✅ Available (run on-demand)
**Focus:** Live site console error monitoring via Playwright
**Quick link:** Run after deploys or weekly to catch production issues

---

## How to Use This Index

**For topic work:**

1. Read relevant capsule (this index → specific topic)
2. Follow NEXT ACTIONS from the capsule
3. After session, run `/capsule <TOPIC>` to update

**For switching tools:**

1. Read `.ai/HANDOFF.md` first
2. Then read relevant topic(s)
3. Then read `.ai/impl/<FEATURE>.md` if implementing

**For new sessions:**

1. Always read `.ai/STATE.md` and `.ai/BACKLOG.md` first
2. If topic-specific: read this index, then the topic capsule
3. If implementing: read `.ai/impl/<FEATURE>.md`

---

## Adding New Topics

When a new domain emerges:

1. Create `.ai/topics/<NEW_TOPIC>.md` using the standard capsule template
2. Update this INDEX.md with a brief entry
3. Link from relevant `.ai/impl/` files and SESSION_LOG entries
