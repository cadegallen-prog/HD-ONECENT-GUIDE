# Plan: Autonomous Data Enrichment & Scraping Hardening

## Problem

The current process relies on a manual bookmarklet to extract product details (Image URL, Internet SKU) from Home Depot. This is:

1.  **Labor Intensive:** Requires manually visiting each page and clicking a bookmarklet.
2.  **Fragile:** Prone to rate limiting due to rapid manual navigation.
3.  **Inefficient:** Hard to scale for new batches of penny items.

## Goal

Create a "layered" autonomous solution that:

1.  Takes a list of SKUs (from user input/paste file).
2.  Automatically navigates to product pages using a "respectful" browser automation.
3.  Extracts the same high-quality data as the bookmarklet.
4.  Saves data to the enrichment file automatically.
5.  Minimizes detection risk via throttling and human-like behavior.

## Proposed Solution: `scripts/auto-enrich.ts`

We will build a Playwright-based script that acts as a "Virtual Assistant" to run the bookmarklet logic automatically.

### 1. Architecture

- **Language:** TypeScript (Node.js) to match project stack.
- **Engine:** Playwright (Headed mode) to mimic a real user.
- **Input:** Reads SKUs from `data/skus-to-enrich.txt` (or identifies missing SKUs from `enriched-penny-list.csv`).
- **Logic:**
  1.  Launch Browser (Headed).
  2.  Loop through SKUs.
  3.  Navigate to `homedepot.com/p/{sku}` or search.
  4.  **Wait:** Random delay (e.g., 15-45 seconds) to mimic reading.
  5.  **Extract:** Inject the extraction logic (from the bookmarklet) into the page context.
  6.  **Save:** Append result to `.local/enrichment-upload.csv` immediately (so progress isn't lost).
  7.  **Error Handling:** Log 404s or captchas. Pause if captcha detected to let user solve it.

### 2. "Respectful" Features (Anti-Detection)

- **Headed Mode:** Runs a visible browser window.
- **Randomized Delays:** Never click at exact intervals.
- **Human-like Interaction:** Scroll the page before extracting.
- **Session Persistence:** (Optional) Can use existing Chrome profile to look like a logged-in user.

### 3. Workflow Integration

1.  **Identify:** User pastes new SKUs into `data/skus-to-enrich.txt`.
2.  **Run:** `npm run enrich:auto`
    - Opens browser.
    - Visits pages.
    - Updates `.local/enrichment-upload.csv`.
3.  **Merge:** Run existing `enrich-penny-list.py` to combine everything.

## Pros & Cons

| Option                    | Pros                                   | Cons                                                     |
| :------------------------ | :------------------------------------- | :------------------------------------------------------- |
| **Current (Bookmarklet)** | Low tech, hard to block completely.    | High effort, repetitive, rate-limited.                   |
| **Proposed (Playwright)** | Autonomous, consistent data, scalable. | Higher risk of blocking (if too fast), requires setup.   |
| **Pure API (Python)**     | Fast.                                  | Very high risk of blocking, complex to maintain headers. |

## Implementation Steps

1.  **Create `scripts/auto-enrich.ts`**:
    - Implement the scraping loop.
    - Port bookmarklet logic to Playwright `page.evaluate()`.
2.  **Create `data/skus-to-enrich.txt`**:
    - Simple file for input.
3.  **Update `package.json`**:
    - Add `enrich:auto` script.
4.  **Test**:
    - Run with a small batch (3-5 SKUs) to verify "respectful" timing.

## Immediate Action

I will generate the `scripts/auto-enrich.ts` script and the necessary configuration to enable this workflow.
