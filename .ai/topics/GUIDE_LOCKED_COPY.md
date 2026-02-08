# Guide Locked Copy

**Status:** IMMUTABLE — do not modify these strings without founder approval
**Created:** 2026-02-08
**Source:** Extracted verbatim from chapter files before Phase 1 edits

---

## Purpose

These 5 strings are founder-crafted copy that must survive all edits unchanged. After any chapter modification, diff the live file against these strings to confirm exact preservation.

---

## Locked String #1

**Source file:** `app/digital-pre-hunt/page.tsx`
**Context:** Overhead hunting clues list item

```
Dusty boxes or items that look untouched for months
```

---

## Locked String #2

**Source file:** `app/in-store-strategy/page.tsx`
**Context:** UPC not yellow tag — verify steps, first item detail

```
Scan only the manufacturer barcode at self-checkout. Scanning the yellow tag can trigger a "customer needs assistance" alert that brings staff over. Exception: if there is no barcode, an employee must key in the SKU number, and they are likely to notice penny status, decline the sale, and take the item.
```

---

## Locked String #3

**Source file:** `app/in-store-strategy/page.tsx`
**Context:** QR code warning — verify steps, second item detail

```
There are occasionally QR codes placed near the manufacturer barcode. Cover those when scanning the UPC. If you scan the QR code, it can trigger a "customer needs assistance" alert that brings the SCO attendant over.
```

---

## Locked String #4

**Source file:** `app/in-store-strategy/page.tsx`
**Context:** Self-checkout vs employee verification paragraph

```
Verify the in-store price at self-checkout or with an employee store phone. Employee verification can be risky because if the item is a penny, they may take it away. They can scan a barcode photo from your phone or look up the SKU number without physically taking the item, but some associates may push back or ask more questions. The safest approach is usually to take the item to self-checkout and chance it there.
```

---

## Locked String #5

**Source file:** `app/in-store-strategy/page.tsx`
**Context:** Community-reported verification tips — filler item tip + FIRST/Zebra SCO notification

```
Community members report an easier checkout experience when they scan a filler item first, then the penny item, to draw less attention to a $0.01 screen result.
```

```
Note: self-checkout terminals can notify employees through the FIRST phone (store phone, also called Zebra) when a penny item is scanned. Some stores are more proactive than others.
```

---

## Verification Command

After edits, verify preservation with:

```powershell
# Quick check — search for each locked string in the source file
Select-String -Path "app/digital-pre-hunt/page.tsx" -Pattern "Dusty boxes or items that look untouched for months"
Select-String -Path "app/in-store-strategy/page.tsx" -Pattern "Scan only the manufacturer barcode at self-checkout"
Select-String -Path "app/in-store-strategy/page.tsx" -Pattern "Cover those when scanning the UPC"
Select-String -Path "app/in-store-strategy/page.tsx" -Pattern "The safest approach is usually to take the item to self-checkout"
Select-String -Path "app/in-store-strategy/page.tsx" -Pattern "scan a filler item first, then the penny item"
Select-String -Path "app/in-store-strategy/page.tsx" -Pattern "FIRST phone \(store phone, also called Zebra\)"
```

All 6 searches must return matches. If any returns empty, locked copy has been modified.
