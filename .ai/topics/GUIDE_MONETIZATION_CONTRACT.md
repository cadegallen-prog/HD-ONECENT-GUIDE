# Guide Monetization Contract

**Status:** ACTIVE
**Created:** 2026-02-08
**Last updated:** 2026-02-08

---

## 1. Route Eligibility

| Route                  | Monetization Status | Condition                                                                          |
| ---------------------- | ------------------- | ---------------------------------------------------------------------------------- |
| `/what-are-pennies`    | Eligible            | Must meet 800+ visible-word internal threshold                                     |
| `/clearance-lifecycle` | Eligible            | Must meet 800+ visible-word internal threshold                                     |
| `/digital-pre-hunt`    | Eligible            | Must meet 800+ visible-word internal threshold                                     |
| `/in-store-strategy`   | Eligible            | Must meet 800+ visible-word internal threshold                                     |
| `/inside-scoop`        | Eligible            | Must meet 800+ visible-word internal threshold                                     |
| `/facts-vs-myths`      | Eligible            | Must meet 800+ visible-word internal threshold                                     |
| `/faq`                 | Eligible            | Must meet 800+ visible-word internal threshold; all answers visible (no accordion) |
| `/guide`               | Conditional         | Monetized ONLY if hub reaches 800+ substantive words; otherwise ads OFF            |
| `/privacy-policy`      | **Excluded**        | Legal/compliance page — never monetized                                            |
| `/terms-of-service`    | **Excluded**        | Legal/compliance page — never monetized                                            |
| `/support`             | **Excluded**        | Transparency/disclosure page — never monetized                                     |
| `/contact`             | **Excluded**        | Utility page — never monetized                                                     |

---

## 2. Mobile-First Slot Map

### Chapter routes (7 pages)

| Slot             | Position                                                                     | Notes                                         |
| ---------------- | ---------------------------------------------------------------------------- | --------------------------------------------- |
| **Intro ad**     | After the opening educational paragraph (never before useful content begins) | First ad must appear below meaningful content |
| **In-article 1** | Between 2nd and 3rd H2 section                                               | Natural content break                         |
| **In-article 2** | Between 4th and 5th H2 section (if page is long enough)                      | Only on pages with 5+ H2 sections             |
| **Terminal ad**  | After ChapterNavigation, before footer                                       | Low-disruption placement                      |

### Guide hub (`/guide`)

| Slot            | Position                                     | Notes                                 |
| --------------- | -------------------------------------------- | ------------------------------------- |
| **Intro ad**    | After triage section, before TableOfContents | Only if hub meets 800+ word threshold |
| **Terminal ad** | After chapter list, before footer            | Only if hub is monetized              |

### Explicitly blocked positions

- Before the page title or subtitle
- Inside the ChapterNavigation component
- Between tightly coupled instructional steps (e.g., self-checkout flow steps)
- Inside tables or data arrays
- Inside callout boxes

---

## 3. Frequency Guardrails

| Device      | Max in-article ads | Max sticky units      | Notes                                     |
| ----------- | ------------------ | --------------------- | ----------------------------------------- |
| **Mobile**  | 3 per chapter page | 1 (anchor/bottom)     | No two ads within 300px vertical distance |
| **Desktop** | 3 per chapter page | 1 (sidebar or anchor) | Sidebar preferred if layout allows        |

### Ad cluster prohibition

Back-to-back ad units with fewer than 2 substantive paragraphs of content between them are prohibited. "Substantive" means educational/informational content — not spacers, disclaimers, or navigation elements.

---

## 4. Policy-Safe Messaging Guardrails

### In-Store Strategy (Chapter 4) — highest AdSense risk

All checkout and verification guidance must:

- Frame actions as **understanding the system**, not circumventing employees
- Use professional, explanatory tone: "The register may prompt for assistance because of the Zero-Comm flag. This is a standard inventory procedure."
- **Never** use framing like: "Here's how to avoid the employee catching it"
- Explain WHY store behavior happens (system logic) rather than HOW to exploit it

### All chapters

- No encouraging dishonest behavior (AdSense policy: "Encouraging Dishonest Behavior")
- No framing that implies exploiting employee workflows
- Community-reported content uses section-level caveats, not per-bullet disclaimers
- Max 1x "community-reported" per chapter (the section-level caveat counts)

---

## 5. Content Quality Floor

Monetized pages must maintain an internal target of **800+ visible words** of substantive, non-filler content. This is not a Google requirement — it is an internal quality floor to ensure ad-adjacent content is genuinely useful.

**What counts:** Educational paragraphs, explanatory lists, data tables with context, actionable guidance.

**What does not count:** Navigation elements, disclaimers, headers/footers, repeated boilerplate, filler sentences.

---

## 6. Experiment Design (Future)

When ready to test higher ad load:

1. **Baseline:** Current slot map (max 3 in-article + 1 terminal per chapter)
2. **Variant:** +1 in-article slot (max 4) on longest chapters only
3. **Promote variant only if:**
   - No material drop in scroll depth or session duration
   - No meaningful CLS regression
   - No increase in thin/non-content page risk

---

## Version History

- **v1.0 (2026-02-08):** Initial contract created per Phase 0.1 of guide-recovery.md
