# Handoff: Barcode Modal Cleanup

**Branch:** `dev` (start from latest)
**Scope:** UI-only — 3 files, ~15 lines removed, 0 lines added
**Risk:** Low — removing duplicate text and unused prop plumbing

---

## Goal

Clean up the barcode modal so it shows one UPC number (inside the barcode SVG via `displayValue: true`) instead of showing it twice. Also remove the "Penny price $0.01" line since it adds no value (everything is $0.01).

## Changes

### 1. `components/barcode-modal.tsx`

**Remove the duplicate UPC text below the barcode container (line 181):**

```
<p className="mt-3 text-center text-sm font-mono text-[var(--text-secondary)]">{upc}</p>
```

Delete this entire line. The UPC digits already render inside the barcode SVG via `displayValue: true` (line 66).

**Remove the penny price display (lines 169-171):**

```
{formattedPrice && (
  <p className="text-xs text-[var(--text-secondary)]">Penny price {formattedPrice}</p>
)}
```

Delete this block.

**Remove the penny price prop and formatting logic:**

- Remove `pennyPrice?: number` from `BarcodeModalProps` interface (line 13)
- Remove `pennyPrice` from the destructured props (line 43)
- Remove the `formattedPrice` const (lines 45-48)
- Remove `formattedPrice` from the `!productName && !formattedPrice` conditional (line 172) — simplify to just `!productName`
- Remove the `import { formatCurrency } from "@/lib/penny-list-utils"` import (line 6) — no longer used

### 2. `components/penny-list-card.tsx`

**Remove `pennyPrice` prop from BarcodeModal usage (line 337):**

```
pennyPrice={item.price}
```

Delete this line. The remaining props (`open`, `upc`, `onClose`, `productName`) stay.

### 3. `components/penny-list-table.tsx`

**Remove `pennyPrice` prop from BarcodeModal usage (line 299):**

```
pennyPrice={barcodeItem?.price}
```

Delete this line.

## What stays as-is

- "Scan this UPC" heading
- Product name display
- Scannable barcode SVG with `displayValue: true` (digits inside barcode)
- Close button (X) and Close text button
- "Show this to a cashier or scanner app" fallback text (when no product name)
- All barcode format detection logic (UPC-A, EAN-13, CODE128 fallback)

## Verification

1. Open barcode modal from **card view** (mobile/default) — confirm:
   - One UPC number only (inside barcode container)
   - No duplicate UPC text below the barcode
   - No "Penny price" text
   - Barcode renders normally

2. Open barcode modal from **table view** (desktop) — same checks

3. Run gates:

   ```
   npm run verify:fast
   npm run e2e:smoke
   ```

4. Visual proof via `/proof` or Playwright screenshot of the modal in both views
