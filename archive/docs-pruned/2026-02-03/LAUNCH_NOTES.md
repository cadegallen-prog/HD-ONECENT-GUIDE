# LAUNCH NOTES - December 4, 2025

## Summary of Changes

This document summarizes the pre-launch fixes made to PennyCentral.com.

---

## 1. Map Bug Fix

### What was changed:

- **File:** `components/store-map.tsx`
  - Added `map.invalidateSize()` call after mount to ensure tiles load properly when the container becomes visible
  - Added a ref to track if invalidation has occurred to prevent repeated calls
  - Improved loading state with animated spinner

- **File:** `app/store-finder/layout.tsx`
  - Added preconnect hints for OpenStreetMap tile servers (`a.tile.openstreetmap.org`, `b.tile.openstreetmap.org`, `c.tile.openstreetmap.org`)
  - This speeds up map tile loading by establishing connections early

### Verification (LOCAL PRODUCTION):

1. Navigate to http://localhost:3001/store-finder
2. Map view should be selected by default
3. Confirm:
   - ✅ Map tiles are visible (not blank)
   - ✅ You can pan and zoom
   - ✅ Store markers appear on the map
   - ✅ No recurring errors in browser console related to Leaflet/map

---

## 2. BeFrugal Redirect

### What was created:

- **New file:** `app/go/befrugal/route.ts`
  - Implements a 301 permanent redirect to `https://www.befrugal.com/rs/NJIKJUB/`

### What was updated:

All direct BeFrugal referral URLs replaced with `/go/befrugal`:

- `app/page.tsx` (homepage support section)
- `app/about/page.tsx` (support section)
- `app/cashback/page.tsx` (signup link in step 1)
- `components/SupportAndCashbackCard.tsx` (reusable component)
- `components/footer.tsx` (footer link)

### Verification (LOCAL PRODUCTION):

1. Visit http://localhost:3001/go/befrugal directly
2. Confirm:
   - ✅ HTTP 301 redirect occurs
   - ✅ Redirects to https://www.befrugal.com/rs/NJIKJUB/

To test with curl:

```bash
curl -sI http://localhost:3001/go/befrugal
```

Expected output includes:

```
HTTP/1.1 301 Moved Permanently
location: https://www.befrugal.com/rs/NJIKJUB/
```

---

## 3. How to Run LOCAL PRODUCTION Build

### Step 1: Build

```bash
cd C:\path\to\HD-ONECENT-GUIDE
npm run build
```

### Step 2: Start Production Server

```bash
npm run start
```

This starts the server at http://localhost:3001

### Step 3: Verify

- Open http://localhost:3001 in Chrome
- Pages should load without errors

---

## 4. How to Run Lighthouse Tests

### Mobile Test

1. Open Chrome and navigate to http://localhost:3001
2. Open DevTools (F12 or Ctrl+Shift+I)
3. Go to the "Lighthouse" tab
4. Settings:
   - **Mode:** Navigation
   - **Device:** Mobile
   - **Throttling:** Simulated throttling (default)
   - **Categories:** ✅ Performance, ✅ Accessibility, ✅ Best Practices, ✅ SEO
5. Click "Analyze page load"
6. Record the scores

### Desktop Test

1. Same URL in Chrome (http://localhost:3001)
2. Open DevTools → Lighthouse tab
3. Settings:
   - **Mode:** Navigation
   - **Device:** Desktop
   - **Throttling:** No throttling (or default)
   - **Categories:** ✅ Performance, ✅ Accessibility, ✅ Best Practices, ✅ SEO
4. Click "Analyze page load"
5. Record the scores

### Target Scores

| Category       | Mobile (Slow 4G) | Desktop |
| -------------- | ---------------- | ------- |
| Performance    | ≥ 80             | ≥ 95    |
| Accessibility  | ≥ 95             | ≥ 95    |
| Best Practices | ≥ 95             | ≥ 95    |
| SEO            | ≥ 90             | ≥ 90    |

---

## 5. Performance Optimizations Applied

### a) Map Tile Lazy Loading

- The map component is already dynamically imported with `ssr: false`
- Map initializes after the component mounts
- Added `invalidateSize()` to ensure tiles render correctly

### b) Preconnect to Tile Servers

- Added to `app/store-finder/layout.tsx`:

```tsx
<link rel="preconnect" href="https://a.tile.openstreetmap.org" />
<link rel="preconnect" href="https://b.tile.openstreetmap.org" />
<link rel="preconnect" href="https://c.tile.openstreetmap.org" />
```

### c) fetchpriority for LCP

- The homepage uses text-based hero (no hero image), so `fetchpriority="high"` is not applicable
- No images are the LCP element on the homepage

---

## 6. Additional Fixes

### Trip Tracker Page Corruption Fix

- **File:** `app/trip-tracker/page.tsx`
- Fixed syntax corruption in the stores display section (lines 573-584)
- Fixed whitespace corruption in the date input section (lines 330-350)

---

## 7. Files Changed in This Session

| File                                    | Change                             |
| --------------------------------------- | ---------------------------------- |
| `components/store-map.tsx`              | Added map invalidation on mount    |
| `app/store-finder/layout.tsx`           | Added preconnect for tile servers  |
| `app/go/befrugal/route.ts`              | Created - 301 redirect to BeFrugal |
| `app/page.tsx`                          | BeFrugal URL → /go/befrugal        |
| `app/about/page.tsx`                    | BeFrugal URL → /go/befrugal        |
| `app/cashback/page.tsx`                 | BeFrugal URL → /go/befrugal        |
| `components/SupportAndCashbackCard.tsx` | BeFrugal URL → /go/befrugal        |
| `components/footer.tsx`                 | BeFrugal URL → /go/befrugal        |
| `app/trip-tracker/page.tsx`             | Fixed syntax corruption            |
| `package.json`                          | Added port 3001 to start script    |

---

## 8. Known Limitations

- Lighthouse CLI in headless mode has issues connecting to localhost on Windows
- Manual DevTools Lighthouse is recommended for accurate scores
- Mobile throttling simulation may vary based on machine specs

---

## 9. Post-Launch Checklist

After deploying to Vercel:

1. [ ] Visit https://pennycentral.com/store-finder and verify map loads
2. [ ] Visit https://pennycentral.com/go/befrugal and verify redirect
3. [ ] Check all BeFrugal buttons/links redirect correctly
4. [ ] Run Lighthouse on the live site for final scores
5. [ ] Test on actual mobile device

---

Generated: December 4, 2025
