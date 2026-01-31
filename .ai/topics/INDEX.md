# Topics Index

**Purpose:** Navigate topic-specific context capsules. Each capsule is the source of truth for its domain.

---

## Available Topics

### [MY_LIST](.ai/topics/MY_LIST_FEATURE_CURRENT.md)

**Status:** Planning (Phases 1-3 documented)
**Focus:** Saved items / "My List" elevation roadmap + infra reuse constraints
**Quick link:** See `.ai/plans/my-list-elevation.md` for the canonical plan

### [SEO](.ai/topics/SEO.md)

**Status:** 🔄 In progress (P0-3)
**Focus:** Schema markup, internal linking, organic search lift
**Quick link:** See `.ai/SEO_FOUNDATION_PLAN.md` for detailed plan

### [MONETIZATION](.ai/topics/MONETIZATION.md)

**Status:** ✅ Bridge active (Ezoic + Mediavine)
**Focus:** Ad networks, revenue strategy, timeline
**Quick link:** See SESSION_LOG for Ezoic integration details

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
