# Monumetric DOM Target Audit

**Date:** 2026-03-06
**Rule under test:** Container = `.py-8`, BEFORE every 3rd `<h2>`
**Scope:** All ad-receiving routes

---

## Key Finding: `.py-8` Only Matches Guide Chapters

The `.py-8` class appears as a **direct Tailwind utility class** only on elements rendered by `PageShell` with `padding="sm"`. The homepage and penny-list use custom CSS classes (`section-padding`, `section-padding-sm`) that apply the same CSS properties via `@apply` but do **not** add `py-8` as an HTML class name. Monumetric's DOM selector `.py-8` will not match `@apply`-based equivalents.

### How padding works in the codebase

| Source                              | CSS output                                 | Has `.py-8` class in DOM? |
| ----------------------------------- | ------------------------------------------ | ------------------------- |
| `PageShell padding="sm"`            | Inline Tailwind: `py-8 sm:py-12`           | **Yes**                   |
| `PageShell padding="lg"`            | Inline Tailwind: `py-12 sm:py-16 lg:py-20` | No                        |
| `.section-padding` (globals.css)    | `@apply py-12 sm:py-16 lg:py-20`           | No                        |
| `.section-padding-sm` (globals.css) | `@apply py-8 sm:py-12`                     | No                        |

---

## Route-by-Route Audit

### `/` (Homepage)

| Check                 | Result                                                                                |
| --------------------- | ------------------------------------------------------------------------------------- |
| `.py-8` present?      | **No.** Uses `section-padding` and `section-padding-sm` custom classes. No PageShell. |
| `<h2>` count          | **6** (5 in page.tsx sections + 1 in `<TodaysFinds>`)                                 |
| Auto-insertion fires? | **No.** No `.py-8` ancestor exists. Rule cannot match.                                |

**DOM structure:** `<> -> <section class="section-padding ..."> -> <h2>` repeated per section. The `<h2>` elements are spread across separate `<section>` siblings, not grouped under one `.py-8` container.

---

### `/penny-list`

| Check                 | Result                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.py-8` present?      | **No.** Uses `section-padding-sm` and `section-padding` custom classes.                                                                                      |
| `<h2>` count          | **5 total** (2 in server page: feed-unavailable warning + methodology; 3 in client component: filter sheet modal, sort sheet modal, "Hot Right Now" section) |
| Auto-insertion fires? | **No.** No `.py-8` ancestor exists.                                                                                                                          |

**DOM notes:** The 3 client-side `<h2>` elements are inside fixed-position modal sheets (filter/sort) and a collapsible "Hot Right Now" card. Even if `.py-8` matched, these h2s are not article-flow headings -- they're UI chrome. The 2 server-side h2s are in separate `<section>` elements with no shared `.py-8` parent.

---

### `/guide` (Guide Hub)

| Check                 | Result                                                                              |
| --------------------- | ----------------------------------------------------------------------------------- |
| `.py-8` present?      | **No.** Uses custom `px-4 py-7 md:px-6 md:py-9` on its container div. No PageShell. |
| `<h2>` count          | **1** ("Guide Chapters")                                                            |
| Auto-insertion fires? | **No.** No `.py-8` ancestor, and only 1 `<h2>` (rule needs at least 3).             |

---

### `/what-are-pennies` (Chapter 1)

| Check                 | Result                                                                            |
| --------------------- | --------------------------------------------------------------------------------- |
| `.py-8` present?      | **Yes.** `<PageShell padding="sm">` renders `<section class="... py-8 sm:py-12">` |
| `<h2>` count          | **11** (all inside `<Prose variant="guide">`)                                     |
| Auto-insertion fires? | **Yes.** 3 ad slots injected (before h2 #3, #6, #9)                               |

**Expected placements:**

1. Before "How the system works (2026)" (h2 #3)
2. Before "Can you actually buy penny items?" (h2 #6)
3. Before "For beginners: start here" (h2 #9)

**Quality:** Reasonable spacing. Content between h2s is substantial enough that ads won't feel stacked.

---

### `/clearance-lifecycle` (Chapter 2)

| Check                 | Result                                          |
| --------------------- | ----------------------------------------------- |
| `.py-8` present?      | **Yes.** PageShell `padding="sm"`               |
| `<h2>` count          | **12**                                          |
| Auto-insertion fires? | **Yes.** 4 ad slots (before h2 #3, #6, #9, #12) |

**Expected placements:**

1. Before "What drives the cadence (2026 context)" (h2 #3)
2. Before "The $.02 buffer signal" (h2 #6)
3. Before "Understanding 'No Home' status" (h2 #9)
4. Before "How to use tag dates without guessing" (h2 #12)

**Quality:** Good. This is the longest chapter with tables and data-rich sections. 4 ads may be borderline on mobile but content density supports it.

---

### `/digital-pre-hunt` (Chapter 3)

| Check                 | Result                                     |
| --------------------- | ------------------------------------------ |
| `.py-8` present?      | **Yes.** PageShell `padding="sm"`          |
| `<h2>` count          | **10**                                     |
| Auto-insertion fires? | **Yes.** 3 ad slots (before h2 #3, #6, #9) |

**Expected placements:**

1. Before "Digital pre-hunt steps" (h2 #3)
2. Before "Limitations to keep in mind" (h2 #6)
3. Before "When to go in-store" (h2 #9)

**Quality:** Good spacing. Content between sections is substantial.

---

### `/in-store-strategy` (Chapter 4)

| Check                 | Result                                     |
| --------------------- | ------------------------------------------ |
| `.py-8` present?      | **Yes.** PageShell `padding="sm"`          |
| `<h2>` count          | **10**                                     |
| Auto-insertion fires? | **Yes.** 3 ad slots (before h2 #3, #6, #9) |

**Expected placements:**

1. Before "The right way vs. the wrong way" (h2 #3)
2. Before "What to look for (penny-prone categories)" (h2 #6)
3. Before "The $.02 signal in practice" (h2 #9)

**Quality:** Good. Content sections are meaty enough for ad spacing.

---

### `/inside-scoop` (Chapter 5)

| Check                 | Result                                          |
| --------------------- | ----------------------------------------------- |
| `.py-8` present?      | **Yes.** PageShell `padding="sm"`               |
| `<h2>` count          | **13**                                          |
| Auto-insertion fires? | **Yes.** 4 ad slots (before h2 #3, #6, #9, #12) |

**Expected placements:**

1. Before "Why management cares" (h2 #3)
2. Before "Policy vs. practice" (h2 #6)
3. Before "How to use this section safely" (h2 #9)
4. Before "2026 operational signals" (h2 #12)

**Quality:** Good. Longest chapter by section count. 4 ads is reasonable given content volume.

---

### `/facts-vs-myths` (Chapter 6)

| Check                 | Result                                     |
| --------------------- | ------------------------------------------ |
| `.py-8` present?      | **Yes.** PageShell `padding="sm"`          |
| `<h2>` count          | **10**                                     |
| Auto-insertion fires? | **Yes.** 3 ad slots (before h2 #3, #6, #9) |

**Expected placements:**

1. Before "How we decide what is real" (h2 #3)
2. Before "Why timeline myths spread so fast" (h2 #6)
3. Before "Example: strong report vs. weak report" (h2 #9)

**Quality:** Good. The "Common misconceptions" section (h2 #1) is very long (11 fact/myth pairs in a grid), so the first ad won't appear until well into the page.

---

### `/faq` (Chapter 7)

| Check                 | Result                                                                   |
| --------------------- | ------------------------------------------------------------------------ |
| `.py-8` present?      | **Yes.** PageShell `padding="sm"`                                        |
| `<h2>` count          | **5** (4 dynamic from `faqFlow` categories + 1 static "Quick reference") |
| Auto-insertion fires? | **Yes.** 1 ad slot (before h2 #3 = "Step 3: Checkout & Policy")          |

**Quality:** Marginal. FAQ sections are short (question/answer pairs). One ad placement is low-impact but the content density per section is thin compared to guide chapters.

---

## Summary Table

| Route                  | `.py-8`? | h2 count | Auto-insert slots   | Quality  |
| ---------------------- | -------- | -------- | ------------------- | -------- |
| `/`                    | No       | 6        | 0 (rule can't fire) | N/A      |
| `/penny-list`          | No       | 5        | 0 (rule can't fire) | N/A      |
| `/guide`               | No       | 1        | 0 (rule can't fire) | N/A      |
| `/what-are-pennies`    | Yes      | 11       | 3                   | Good     |
| `/clearance-lifecycle` | Yes      | 12       | 4                   | Good     |
| `/digital-pre-hunt`    | Yes      | 10       | 3                   | Good     |
| `/in-store-strategy`   | Yes      | 10       | 3                   | Good     |
| `/inside-scoop`        | Yes      | 13       | 4                   | Good     |
| `/facts-vs-myths`      | Yes      | 10       | 3                   | Good     |
| `/faq`                 | Yes      | 5        | 1                   | Marginal |

**Total auto-insertion capable routes:** 7 (all guide chapters)
**Total auto-insertion incapable routes:** 3 (homepage, penny-list, guide hub)

---

## Implications

1. **Homepage and penny-list get zero auto-inserted ads** from this rule. These are the two highest-traffic pages. Any in-content ad revenue from these routes must come from manually placed `<MonumetricInContentSlot>` components (which already exist).

2. **Guide chapters are well-served** by the rule. Content is long-form, h2-dense, and the every-3rd-h2 cadence produces reasonable spacing.

3. **If Monumetric changes the container selector** from `.py-8` to something broader (e.g., any element, or a different class), the homepage and penny-list could start receiving auto-insertions in unexpected locations (modal dialogs, card headers, etc.). Monitor for selector changes.

4. **The `@apply` gap is load-bearing.** If the codebase migrates `section-padding-sm` from `@apply py-8` to inline Tailwind `py-8` (e.g., during a responsive foundations refactor), the homepage and penny-list would suddenly match the `.py-8` selector and start receiving auto-inserted ads. This should be treated as a regression risk during any CSS refactor.
