# Handoff: Post-Submission Gratification for Report Find

**Created:** 2026-02-20
**Priority:** High — directly reinforces the contribution flywheel
**Branch:** `dev` (current as of commit `cf09217`)

---

## Paste This Into a Fresh Session

````
/plan Post-submission gratification for Report Find

## Context

After a user submits a penny find via the Report Find form, the current success state is generic:
"Thanks — your find is now on the Penny List." It tells the user nothing about their impact.

The goal is to show personalized, data-driven gratification immediately after submission
so contributors feel their input was visible and valued — reinforcing repeat contributions.

## What Exists Today

### Report Find Form
- **Page:** `app/report-find/page.tsx` (server component, static content)
- **Form:** `components/report-find/ReportFindFormClient.tsx` (client component)
- **API:** `app/api/submit-find/route.ts`

### Current Submission Flow
1. User fills form (or it's prefilled from penny card via URL params `?sku=X&name=Y&src=card`)
2. Client POSTs to `/api/submit-find`
3. API validates, self-enriches from existing Penny List rows, inserts to Supabase "Penny List" table
4. API returns: `{ success: true, message: "Thanks — your find is now on the Penny List." }`
5. Client shows a green success panel with: "View on Penny List" / "Report Another Find" / "Share to Facebook"
6. Form resets

### Key Files
- `app/api/submit-find/route.ts` — lines ~640-768: main POST handler, self-enrichment lookup, insert, Item Cache RPC, SerpApi fire-and-forget
- `components/report-find/ReportFindFormClient.tsx` — `handleSubmit()`, `result` state, success/error panel rendering
- `lib/supabase/client.ts` — Supabase client helpers

### What the API Already Has Access To
- The `lookupSelfEnrichment()` function (line ~200) already queries existing Penny List rows for the same SKU
- The Supabase "Penny List" table contains all previous submissions with `sku`, `store_state`, and timestamps
- After insert, the API has `insertedRow.id` and the full `normalizedSku`

## The Feature

### Backend Change (API)
After the successful insert (line ~722-727), before returning the response:
1. Query the "Penny List" table for rows matching the submitted SKU
2. Count total rows (= total reports for this item, including the one just inserted)
3. Count distinct `store_state` values (= state spread)
4. Return this data in the success response alongside the existing message

New response shape:
```json
{
  "success": true,
  "message": "Thanks — your find is now on the Penny List.",
  "stats": {
    "totalReports": 12,
    "stateCount": 5,
    "isFirstReport": false
  }
}
````

If the query fails for any reason, fall back to current behavior (no stats, just the message).
Stats are enhancement, not critical path.

### Frontend Change (Form)

In the success panel of `ReportFindFormClient.tsx`:

- If `stats` is present in the response, show a personalized message:
  - First report: "You're the first to report this item! Your find is now live for the community."
  - Subsequent: "You're the Nth person to report this item across X states."
- Keep existing action buttons (View Penny List / Report Another / Share to Facebook)
- The message should feel warm but not over-the-top. No confetti. No emojis unless Cade asks.
- Use existing design tokens. The success panel already has a green left border — enhance its content, don't change its structure.

## Constraints

- Do NOT modify `globals.css` (constraint)
- Do NOT add new dependencies
- Do NOT change the form fields or validation logic
- The stats query must use the service role client (same as the insert)
- If the count query fails, silently fall back to generic message — never block submission success
- Follow existing code patterns (Zod, service role client, error handling)
- All 4 gates must pass: lint, typecheck, test:unit, build
- Run smoke e2e after implementation

## Philosophy (from owner)

- Trust > extraction. The gratification exists to reinforce contributions, not to manipulate.
- "You're the 12th person" is social proof that contributions matter.
- "You're the first" is recognition that early reporters are valued.
- This is 80% of gamification's psychological benefit at 5% of the complexity.
- No accounts, no points, no leaderboards — just immediate, honest feedback.

## Testing Considerations

- The existing unit tests for submit-find mock Supabase. New count query will need similar mocking.
- Test both first-report and subsequent-report response shapes.
- Test fallback when count query fails (should return success without stats).
- Frontend: verify success panel renders both "first report" and "Nth report" variants.

```

---

## Quick Reference for the Next Agent

| What | Where |
|------|-------|
| API endpoint | `app/api/submit-find/route.ts` |
| Form component | `components/report-find/ReportFindFormClient.tsx` |
| Self-enrichment function | `app/api/submit-find/route.ts` line ~200 (`lookupSelfEnrichment`) |
| Insert + response | `app/api/submit-find/route.ts` lines ~722-768 |
| Success panel UI | `components/report-find/ReportFindFormClient.tsx` (search for `result.success`) |
| Supabase table | `"Penny List"` |
| Service role client | `getSupabaseServiceRoleClient()` from `lib/supabase/client` |
| Unit tests | `tests/submit-find*.test.ts` (check for existing test files) |
| Design tokens | `app/globals.css` (read only, do not modify) |
```
