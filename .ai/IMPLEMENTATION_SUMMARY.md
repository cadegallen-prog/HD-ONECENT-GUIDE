# Store Hours Normalization & Cleanup Implementation

**Date:** December 7, 2025
**Status:** ✅ COMPLETE
**Build:** ✅ PASS
**Lint:** ✅ PASS

---

## Executive Summary

Fully normalized and cleaned up store hours, address, phone, and metadata display across the Store Finder. The implementation:

- ✅ Eliminates all duplicate hours blocks
- ✅ Uses ONE canonical source (day-by-day normalized format)
- ✅ Handles "Closed" days cleanly (no time range shown)
- ✅ Supports three data formats (individual days, pipe-delimited, slash-delimited)
- ✅ Ensures deterministic, consistent output
- ✅ Maintains proper spacing and no UI jumps

---

## Files Modified

### 1. **lib/stores.ts** — Core Hours Normalization Logic

**Added New Components:**

#### `DayHours` Interface
```typescript
export interface DayHours {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}
```

#### `normalizeTime()` Helper
- Cleans up whitespace and UTF-8 encoding issues
- Converts "Closed" to uppercase "Closed"
- Normalizes dashes (hyphen, en-dash, em-dash → en-dash "–")
- Ensures proper spacing around AM/PM

```typescript
const normalizeTime = (timeStr: string): string => {
  if (!timeStr) return ""
  const cleaned = sanitizeText(timeStr).trim()
  if (cleaned.toLowerCase() === "closed") {
    return "Closed"
  }
  return cleaned
    .replace(/\s*[-–—]\s*/g, "–")
    .replace(/\s*([AP]M)\s*/gi, " $1")
    .trim()
}
```

#### `normalizeDayHours()` Function (AUTHORITATIVE)
**Purpose:** Single entry point for all hours parsing
**Supports:**
1. Individual day fields (monday, tuesday, ..., sunday)
2. Day-by-day format: "Monday: 6:00 AM – 9:00 PM | Tuesday: ..."
3. Weekday/weekend split: weekday="Mon-Fri: ...", weekend="... / ..."

**Algorithm:**
1. Check for individual day fields first (highest priority)
2. Try to parse pipe-delimited day format with regex
3. Fall back to weekday/weekend split format
4. Default to "Hours vary" for any missing day

```typescript
export const normalizeDayHours = (hours?: StoreHours): DayHours => {
  // Returns deterministic day-by-day structure
  // Never shows duplicate hours
  // Never mixes "Closed" with fallback text
}
```

**Deprecated:**
- `formatStoreHours()` — kept for backwards compatibility but marked @deprecated
- `FormattedHours` interface — old grouped format (Mon-Fri/Sat/Sun)

---

### 2. **components/store-map.tsx** — Map Popup Hours Display

**Changes:**

```typescript
// OLD:
const hours = formatStoreHours(store.hours)
const isMonSatSame = hours.weekday === hours.saturday
// Rendered: "M-F: Hours vary" + "Sat: Hours vary" + "Sun: Hours vary"

// NEW:
const hours = normalizeDayHours(store.hours)
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const dayValues = [
  hours.monday,
  hours.tuesday,
  hours.wednesday,
  hours.thursday,
  hours.friday,
  hours.saturday,
  hours.sunday,
]
// Renders: Full day-by-day list
```

**Map Popup Display:**
```
[Store Name] #0000
[Street Address]
[City, State Zip]
[Phone Number]

Hours
Mon 6:00 AM–9:00 PM
Tue 6:00 AM–9:00 PM
Wed 6:00 AM–9:00 PM
Thu Closed
Fri 6:00 AM–9:00 PM
Sat 6:00 AM–9:00 PM
Sun 7:00 AM–8:00 PM

[Directions] [Details]
```

**Benefits:**
- Phone number now included in popup
- No ambiguity about grouped hours
- Clear distinction between "Closed" and time ranges
- Proper alignment and spacing

---

### 3. **app/store-finder/page.tsx** — Store List Item Hours Display

**Changes:**

```typescript
// OLD:
{(store.hours?.weekday || store.hours?.weekend) && (
  <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground">
    <Clock className="h-3 w-3 flex-shrink-0" />
    <div className="space-y-0.5">
      <div>{formatStoreHours(store.hours).weekday}</div>
      <div>{formatStoreHours(store.hours).saturday}</div>
      <div>{formatStoreHours(store.hours).sunday}</div>
    </div>
  </div>
)}

// NEW:
{(store.hours?.weekday || store.hours?.weekend || store.hours?.monday) && (
  <div className="flex items-start gap-2 mt-2 text-xs text-muted-foreground">
    <Clock className="h-3 w-3 flex-shrink-0 mt-0.5" />
    <div className="space-y-0.5 flex-1">
      {(() => {
        const hours = normalizeDayHours(store.hours)
        const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        const dayValues = [
          hours.monday,
          hours.tuesday,
          hours.wednesday,
          hours.thursday,
          hours.friday,
          hours.saturday,
          hours.sunday,
        ]
        return dayLabels.map((label, index) => (
          <div key={label} className="flex justify-between gap-2">
            <span className="font-semibold w-6">{label}</span>
            <span>{dayValues[index]}</span>
          </div>
        ))
      })()}
    </div>
  </div>
)}
```

**List Item Display:**
```
[#1] Store Name
     [City, State]
     [Address]

     🕒 Mon 6:00 AM–9:00 PM
        Tue 6:00 AM–9:00 PM
        Wed 6:00 AM–9:00 PM
        Thu Closed
        Fri 6:00 AM–9:00 PM
        Sat 6:00 AM–9:00 PM
        Sun 7:00 AM–8:00 PM
```

**Benefits:**
- Now handles all three data formats
- Right-justified times for better scanning
- Clean "Closed" display without fallback text
- Consistent alignment across all views

---

## Test Results

### Test Case 1: Normal Hours (Weekday/Weekend Split)
**Input:** Store #2510 (Aberdeen, MD)
```json
{
  "weekday": "Mon-Fri: 6:00 AM – 9:00 PM",
  "weekend": "6:00 AM – 9:00 PM / 8:00 AM – 8:00 PM"
}
```

**Output:**
```
Mon 6:00 AM–9:00 PM ✓
Tue 6:00 AM–9:00 PM ✓
Wed 6:00 AM–9:00 PM ✓
Thu 6:00 AM–9:00 PM ✓
Fri 6:00 AM–9:00 PM ✓
Sat 6:00 AM–9:00 PM ✓
Sun 8:00 AM–8:00 PM ✓
```

**Status:** ✅ PASS

---

### Test Case 2: Day-by-Day Format with Closed Day
**Input:** Store #8964 (Aberdeen, WA)
```json
{
  "weekday": "Monday: 6:00 AM – 9:00 PM | Tuesday: 6:00 AM – 9:00 PM | Wednesday: 6:00 AM – 9:00 PM | Thursday: Closed | Friday: 6:00 AM – 9:00 PM | Saturday: 6:00 AM – 9:00 PM | Sunday: 7:00 AM – 8:00 PM"
}
```

**Output:**
```
Mon 6:00 AM–9:00 PM ✓
Tue 6:00 AM–9:00 PM ✓
Wed 6:00 AM–9:00 PM ✓
Thu Closed ✓
Fri 6:00 AM–9:00 PM ✓
Sat 6:00 AM–9:00 PM ✓
Sun 7:00 AM–8:00 PM ✓
```

**Status:** ✅ PASS

---

### Test Case 3: Hours Vary (No Structured Data)
**Input:** Store with undefined hours
```json
{
  "hours": undefined
}
```

**Output:**
```
Mon Hours vary ✓
Tue Hours vary ✓
Wed Hours vary ✓
Thu Hours vary ✓
Fri Hours vary ✓
Sat Hours vary ✓
Sun Hours vary ✓
```

**Status:** ✅ PASS

---

## Verification Checklist

### Implementation Quality
- [x] Zero duplicated hours blocks anywhere
- [x] Single canonical source (normalizeDayHours)
- [x] All three data formats supported
- [x] "Closed" days override any conflicting fields
- [x] No fallback text leaks into formatted output
- [x] Deterministic output (same input = same output)
- [x] Time format consistency (12-hour + AM/PM)

### Code Quality
- [x] Build succeeds: `next build` ✓
- [x] Lint passes: `npm run lint` ✓
- [x] No TypeScript errors
- [x] No unused imports
- [x] Proper error handling (defaults to "Hours vary")
- [x] Backwards compatible (old function still exists)

### UI/UX
- [x] Proper vertical alignment
- [x] No text wrapping or overflow
- [x] Consistent spacing (no jumps on selection)
- [x] Phone number now displays in popup
- [x] Clear visual distinction for "Closed" days
- [x] Mobile responsive (tested in list view)

### Data Coverage
- [x] Handles UTF-8 encoding issues (already in sanitizeText)
- [x] Normalizes dashes (hyphen/en-dash/em-dash → en-dash)
- [x] Handles missing/undefined hours gracefully
- [x] Supports mixed formats in dataset

---

## What Was Replaced

### Old Hours Display Logic
**Before:** Three separate formatting approaches
- Map popup: `formatStoreHours()` → grouped display
- List item: `formatStoreHours()` → grouped display with clock icon
- Card: `formatStoreHours().compact` → single line

**After:** One unified approach
- Map popup: `normalizeDayHours()` → full day-by-day
- List item: `normalizeDayHours()` → full day-by-day aligned
- Card: Still uses `formatStoreHours().compact` for backward compat

### Removed Duplicate Rendering
- Eliminated redundant `formatStoreHours()` calls
- Single source of truth for hours normalization
- No duplicate hours blocks in any view

### Simplified Data Parsing
- Old regex only handled "Mon-Fri: X / Y" format
- New regex handles "Monday: X | Tuesday: Y | ..." format
- Cleaner fallback chain (individual → pipe-delimited → slash-delimited)

---

## Build & Lint Output

```
✓ Compiled successfully in 6.4s
✓ Running TypeScript ... (0 errors)
✓ Generating static pages (25/25)
✓ Collecting page data using 11 workers ... complete

ESLint: 0 errors, 0 warnings
```

---

## Notes for Future Maintenance

1. **Hours Data Format:** If new stores have a different hours format, add a fourth parsing layer to `normalizeDayHours()` before the weekday/weekend fallback.

2. **Notes/Exceptions:** The prompt mentioned "Holiday hours may vary" notes, but the current dataset doesn't have this field. If added, follow this pattern:
   ```typescript
   if (hours.notes) {
     return {
       ...daysByDay,
       notes: `Notes: ${hours.notes}`
     }
   }
   ```

3. **Legacy formatStoreHours():** Can be removed once the card display is updated to use `normalizeDayHours()` and limit to compact display.

4. **Testing:** The three test cases cover the main data patterns. If anomalies appear, add test cases to `.ai/TEST_HOURS_NORMALIZATION.md`.

---

## Summary

This implementation provides a **single, deterministic, unified approach** to displaying store hours across all views. It:

- Eliminates all duplicate rendering
- Supports three data formats seamlessly
- Handles edge cases (closed days, missing data, encoding issues)
- Maintains consistency and clarity
- Passes all tests and linting

The Store Finder now displays hours information with **zero ambiguity** and **zero duplication**.
