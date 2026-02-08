# Guide Format Contract

**Status:** ACTIVE
**Created:** 2026-02-08
**Last updated:** 2026-02-08
**Source:** Phase 3.0 in `.ai/impl/guide-recovery.md`

---

## Purpose

Prevent guide drift by locking one canonical structure, one voice standard, one concept order, and one forbidden-regression list for all seven chapter routes.

---

## 1) Canonical Chapter Template

All chapter routes (`/what-are-pennies`, `/clearance-lifecycle`, `/digital-pre-hunt`, `/in-store-strategy`, `/inside-scoop`, `/facts-vs-myths`, `/faq`) follow this skeleton:

```tsx
import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import { ChapterNavigation } from "@/components/guide/ChapterNavigation"

export const metadata: Metadata = {
  title: "...",
  description: "...",
  alternates: { canonical: "/route-slug" },
}

export default function ChapterPage() {
  return (
    <PageShell width="default" padding="sm" gap="md">
      <div className="w-full max-w-[68ch] mx-auto">
        <PageHeader title="..." subtitle="..." />
      </div>

      <EditorialBlock className="w-full max-w-[68ch] mx-auto" />

      <Section className="w-full max-w-[68ch] mx-auto">
        <Prose variant="guide">{/* chapter content */}</Prose>

        <ChapterNavigation
          prev={{ slug: "...", title: "..." }}
          next={{ slug: "...", title: "..." }}
        />
      </Section>
    </PageShell>
  )
}
```

Template invariants:

- One centered 68ch column for header, editorial block, and main section.
- `Prose` must use `variant="guide"` for typography and spacing consistency.
- Exactly one `ChapterNavigation` block per chapter, at the end.
- No ad-hoc per-page style systems that bypass guide template patterns.

---

## 2) Voice Rules

Apply across all guide chapter bodies:

1. Lead with action.
2. Use "you" language.
3. Use section-level caveats, not per-bullet caveats.
4. Keep confident tone; do not write uncertainty spam.
5. Explain WHY then WHAT for system terms.
6. Max `community-reported` usage: 1 per chapter.
7. Banned hedge patterns:
   - `many hunters report`
   - `hunters report`
   - `some reports describe`
   - `some reports`

---

## 3) Locked Copy Reference

Locked founder strings live in `.ai/topics/GUIDE_LOCKED_COPY.md`.

Rules:

- Treat all locked strings as immutable.
- Any edit to a locked string requires explicit founder approval first.
- If chapter text is refactored, run lock checks against that file before claiming completion.

---

## 4) 2026 Intel Distribution Map

| Concept                                         | Primary chapter (first full treatment) | Secondary chapter(s)                                     | Rule                                                              |
| ----------------------------------------------- | -------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------- |
| Store Pulse (replaced IMS)                      | Ch 1 `/what-are-pennies`               | Ch 5 `/inside-scoop`                                     | Ch 1 introduces foundation; Ch 5 uses it as advanced context only |
| ZMA (Zero Margin Adjustment)                    | Ch 1 `/what-are-pennies`               | Ch 4 `/in-store-strategy`, Ch 5 `/inside-scoop`          | Ch 1 defines; later chapters expand operational implications      |
| Zero-Comm                                       | Ch 1 `/what-are-pennies` (brief)       | Ch 4 `/in-store-strategy` (detail), Ch 5 `/inside-scoop` | Ch 4 is the main checkout-friction explanation                    |
| ICE (Inactive/Clearance/E-velocity)             | Ch 2 `/clearance-lifecycle`            | Ch 5 `/inside-scoop`                                     | Ch 2 owns cadence mechanics                                       |
| Speed-to-Penny (compressed 14-day path)         | Ch 2 `/clearance-lifecycle`            | Ch 6 `/facts-vs-myths` (consistency checks)              | Never first-introduce outside Ch 2                                |
| $.02 48-hour MET pull signal                    | Ch 2 `/clearance-lifecycle`            | Ch 4 `/in-store-strategy`                                | Ch 2 defines logic; Ch 4 applies practical timing                 |
| No Home status + signal stack                   | Ch 2 `/clearance-lifecycle`            | Ch 3 `/digital-pre-hunt`, Ch 5 `/inside-scoop`           | Ch 3 can only reference after Ch 2 definition                     |
| Home Bay replacing endcaps                      | Ch 3 `/digital-pre-hunt`               | Ch 4 `/in-store-strategy`, Ch 6 `/facts-vs-myths`        | Ch 3 introduces shift; Ch 4 applies to search workflow            |
| MET reset timing                                | Ch 4 `/in-store-strategy`              | Ch 5 `/inside-scoop`                                     | Ch 4 owns practical in-store timing guidance                      |
| BOLT + Ghost Inventory + DS de-skilling context | Ch 5 `/inside-scoop`                   | none                                                     | Keep advanced-only context in Ch 5                                |

---

## 5) Concept Introduction Order (Hard Gate)

Required first-introduction flow:

1. Store Pulse (Ch 1)
2. ZMA (Ch 1)
3. Zero-Comm brief (Ch 1)
4. ICE framework (Ch 2)
5. Speed-to-Penny (Ch 2)
6. No Home definition + stacked signals (Ch 2)
7. $.02 buffer as 48-hour MET signal (Ch 2)
8. Home Bay/endcap shift (Ch 3)
9. Checkout friction + MET timing + lock behavior detail (Ch 4)
10. Advanced internal context only (Ch 5)
11. Myth correction + consistency checks (Ch 6)
12. Visible workflow Q&A reinforcement (Ch 7 `/faq`)

No chapter may reference a concept before the chapter listed above introduces it.

---

## 6) Forbidden Reintroductions

Do not reintroduce:

- `<details>` dropdowns in FAQ
- "Sources" blocks in chapter body
- Dual/conflicting nav cues at chapter bottom
- Dead-space gaps greater than 80px between content blocks
- Per-bullet `community-reported` labeling
- Ad-hoc per-page styling that breaks template symmetry
- Hedging patterns:
  - `many hunters report`
  - `hunters report`
  - `some reports describe`

---

## 7) Drift Check Command

Run:

```bash
npm run ai:guide:guardrails
```

The generated report in `reports/guide-guardrails/` is the canonical drift-check artifact.
