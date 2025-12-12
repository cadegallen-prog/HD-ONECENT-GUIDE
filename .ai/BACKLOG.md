# Backlog (AI‑Driven, Ordered)

**Last updated:** Dec 12, 2025  
Keep this list short and ruthless (≤10 items).  
Each AI session should:

1. Read `.ai/STATE.md`
2. Take the top **P0** item (unless Cade gives a different GOAL)
3. Propose approach in plain English
4. Implement + test
5. Update `.ai/SESSION_LOG.md`, `.ai/STATE.md`, and this file

---

## Completed Recently

- **Dec 12, 2025:** Updated `.ai/PENNY_LIST_PLAN.md` to reflect Phase 1 shipped.
- **Dec 12, 2025:** CI (`.github/workflows/quality.yml`) now runs lint + Playwright smoke with fixtures.

---

## P0 — Do Next

1. **Add tiny “30‑second submit” callout on Penny List**
   - **Why:** makes the loop obvious and reduces anxiety about submitting.
   - **Done means:** short, non‑annoying copy above filters; no new UI chrome.
   - **Prompt for next AI:**
     ```
     GOAL: Add a short “Report a Find takes ~30 seconds” callout near the top of /penny-list.
     WHY: Users should instantly understand the loop and feel it’s easy.
     DONE MEANS:
     - Copy is visible on mobile/desktop
     - No new colors or layout clutter
     - npm run build/lint/test:e2e pass
     ```

2. **No‑code weekly digest setup (Zapier/Kit)**
   - **Why:** reinforces habit without Cade posting repeatedly.
   - **Done means:** simple weekly email of top SKUs; link back to Penny List.

## P2 — Later / Only If Volume Justifies

5. **Optional moderation gate**
   - Add “Approved” column in Sheet and filter server‑side.
   - Only do this if spam/junk exceeds ~10%.

6. **Regional breakdown**
   - First step: simple state grouping + “Top states this week.”
   - Map/heatmap stays deferred until volume is real.
