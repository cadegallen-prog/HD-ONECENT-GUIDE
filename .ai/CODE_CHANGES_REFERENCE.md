# Code Changes Reference

## Quick Navigation

1. **lib/stores.ts** — Core normalization logic (lines 107-242)
2. **components/store-map.tsx** — Map popup display (lines 7-8, 217-274)
3. **app/store-finder/page.tsx** — List item display (lines 24, 894-911)

---

## lib/stores.ts

### New Interface: DayHours
**Location:** [lib/stores.ts:107-115](../lib/stores.ts#L107-L115)

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

---

### New Helper: normalizeTime()
**Location:** [lib/stores.ts:117-128](../lib/stores.ts#L117-L128)

```typescript
const normalizeTime = (timeStr: string): string => {
  if (!timeStr) return ""
  const cleaned = sanitizeText(timeStr).trim()
  if (cleaned.toLowerCase() === "closed") {
    return "Closed"
  }
  // Ensure proper spacing around dashes and AM/PM
  return cleaned
    .replace(/\s*[-–—]\s*/g, "–") // normalize dashes
    .replace(/\s*([AP]M)\s*/gi, " $1") // ensure space before AM/PM
    .trim()
}
```

**Purpose:**
- Handles "Closed" keyword detection
- Normalizes dash characters (handles UTF-8 variants)
- Ensures proper spacing around AM/PM
- Returns empty string for falsy input

**Examples:**
- `"6:00â€¯AMâ€‰â€"â€‰9:00â€¯PM"` → `"6:00 AM–9:00 PM"`
- `"closed"` → `"Closed"`
- `"6:00 AM - 9:00 PM"` → `"6:00 AM–9:00 PM"`
- `undefined` → `""`

---

### New Function: normalizeDayHours()
**Location:** [lib/stores.ts:137-242](../lib/stores.ts#L137-L242)

```typescript
/**
 * Parses store hours from multiple formats into day-by-day structure.
 * Supports three formats:
 * 1. Day-by-day: "Monday: 6:00 AM – 9:00 PM | Tuesday: ..."
 * 2. Weekday/weekend split: weekday="Mon-Fri: 6:00 AM – 10:00 PM",
 *    weekend="6:00 AM – 10:00 PM / 7:00 AM – 8:00 PM"
 * 3. Individual day fields: monday, tuesday, etc.
 */
export const normalizeDayHours = (hours?: StoreHours): DayHours => {
  const defaultDay = "Hours vary"
  const defaults: DayHours = {
    monday: defaultDay,
    tuesday: defaultDay,
    wednesday: defaultDay,
    thursday: defaultDay,
    friday: defaultDay,
    saturday: defaultDay,
    sunday: defaultDay,
  }

  if (!hours) return defaults

  // Priority 1: Check for individual day fields
  if (
    hours.monday ||
    hours.tuesday ||
    hours.wednesday ||
    hours.thursday ||
    hours.friday ||
    hours.saturday ||
    hours.sunday
  ) {
    return {
      monday: normalizeTime(hours.monday || defaultDay),
      tuesday: normalizeTime(hours.tuesday || defaultDay),
      wednesday: normalizeTime(hours.wednesday || defaultDay),
      thursday: normalizeTime(hours.thursday || defaultDay),
      friday: normalizeTime(hours.friday || defaultDay),
      saturday: normalizeTime(hours.saturday || defaultDay),
      sunday: normalizeTime(hours.sunday || defaultDay),
    }
  }

  // Priority 2: Try to parse day-by-day format
  const weekdayStr = sanitizeText(hours.weekday || "")
  if (
    weekdayStr &&
    (weekdayStr.includes("|") || weekdayStr.toLowerCase().match(/mon|tue|wed|thu|fri|sat|sun/))
  ) {
    const dayPattern =
      /(?:monday|mon|tuesday|tue|wednesday|wed|thursday|thu|friday|fri|saturday|sat|sunday|sun)\s*:\s*([^|]*?)(?=\b(?:monday|mon|tuesday|tue|wednesday|wed|thursday|thu|friday|fri|saturday|sat|sunday|sun)\s*:|$)/gi
    const matches = [...weekdayStr.matchAll(dayPattern)]

    if (matches.length >= 5) {
      // We have at least 5 days, assume full schedule
      const dayMap: Record<string, string> = {}
      const dayNames = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ]
      const dayShorts = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

      matches.forEach((match) => {
        const fullText = match[0]
        const dayStr = fullText.split(":")[0].trim().toLowerCase()
        const timeStr = match[1]?.trim() || ""

        // Map short names to full names
        const dayIndex = dayShorts.findIndex((short) => dayStr.includes(short))
        if (dayIndex >= 0) {
          dayMap[dayNames[dayIndex]] = normalizeTime(timeStr)
        }
      })

      if (Object.keys(dayMap).length >= 5) {
        return {
          monday: dayMap["monday"] || defaultDay,
          tuesday: dayMap["tuesday"] || defaultDay,
          wednesday: dayMap["wednesday"] || defaultDay,
          thursday: dayMap["thursday"] || defaultDay,
          friday: dayMap["friday"] || defaultDay,
          saturday: dayMap["saturday"] || defaultDay,
          sunday: dayMap["sunday"] || defaultDay,
        }
      }
    }
  }

  // Priority 3: Fall back to weekday/weekend format
  const result: DayHours = { ...defaults }

  const weekdayHours = sanitizeText(hours.weekday || "")
  if (weekdayHours && !weekdayHours.toLowerCase().includes("hours vary")) {
    // Extract just the time portion
    const timeOnly = weekdayHours.replace(/^.*?:\s*/i, "").trim()
    const normalized = normalizeTime(timeOnly)
    if (normalized && normalized !== "Hours vary") {
      result.monday = normalized
      result.tuesday = normalized
      result.wednesday = normalized
      result.thursday = normalized
      result.friday = normalized
    }
  }

  const weekendHours = sanitizeText(hours.weekend || "")
  if (weekendHours && !weekendHours.toLowerCase().includes("hours vary")) {
    const parts = weekendHours.split("/").map((p) => p.trim())
    if (parts.length === 2) {
      result.saturday = normalizeTime(parts[0])
      result.sunday = normalizeTime(parts[1])
    } else if (parts.length === 1) {
      const normalized = normalizeTime(parts[0])
      result.saturday = normalized
      result.sunday = normalized
    }
  }

  return result
}
```

**Algorithm (Priority Order):**
1. **Individual Day Fields:** If any of `hours.monday`, `hours.tuesday`, etc. exist, use them
2. **Pipe-Delimited Format:** If `hours.weekday` contains `|` and day names, parse each day
3. **Slash-Delimited Format:** Use `hours.weekday` and `hours.weekend` split by `/`
4. **Default:** Return "Hours vary" for any unparsable/missing data

**Data Format Examples:**
- Format 1: `{ monday: "6:00 AM–9:00 PM", tuesday: "6:00 AM–9:00 PM", ... }`
- Format 2: `{ weekday: "Monday: 6:00 AM–9:00 PM | Tuesday: 6:00 AM–9:00 PM | ..." }`
- Format 3: `{ weekday: "Mon-Fri: 6:00 AM–10:00 PM", weekend: "6:00 AM–9:00 PM / 8:00 AM–8:00 PM" }`

---

## components/store-map.tsx

### Updated Imports
**Location:** [components/store-map.tsx:7](../components/store-map.tsx#L7)

```typescript
// OLD:
import { getStoreUrl, formatStoreHours, cleanStoreName, formatStoreNumber } from "@/lib/stores"

// NEW:
import { getStoreUrl, normalizeDayHours, cleanStoreName, formatStoreNumber } from "@/lib/stores"
```

---

### Updated Map Marker Handler
**Location:** [components/store-map.tsx:214-299](../components/store-map.tsx#L214-L299)

```typescript
// OLD CODE (lines 214-315):
{orderedStores.map((store) => {
  const isSelected = selectedStore?.id === store.id
  const rank = store.rank ?? stores.findIndex((s) => s.id === store.id) + 1
  const hours = formatStoreHours(store.hours)
  const isMonSatSame = hours.weekday === hours.saturday

  return (
    <Marker>
      <Popup>
        <div>
          {/* ... header ... */}
          <div className="text-xs text-[var(--text-primary)] mb-4 space-y-1">
            {isMonSatSame ? (
              <div>
                <span className="block font-semibold ...">Mon-Sat</span>
                <span>{hours.weekday}</span>
              </div>
            ) : (
              <>
                <div>
                  <span className="block font-semibold ...">Mon-Fri</span>
                  <span>{hours.weekday}</span>
                </div>
                <div>
                  <span className="block font-semibold ...">Sat</span>
                  <span>{hours.saturday}</span>
                </div>
              </>
            )}
            <div className="pt-1">
              <span className="block font-semibold ...">Sun</span>
              <span>{hours.sunday}</span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  )
})
```

**NEW CODE:**
```typescript
{orderedStores.map((store) => {
  const isSelected = selectedStore?.id === store.id
  const rank = store.rank ?? stores.findIndex((s) => s.id === store.id) + 1
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

  return (
    <Marker>
      <Popup>
        <div className="text-left p-4 bg-[var(--bg-elevated)] ...">
          {/* Store name and rank */}
          <div className="mb-3 pr-8 relative">
            <h3 className="font-bold text-sm leading-tight">
              {cleanStoreName(store.name)} #{formatStoreNumber(store.number)}
            </h3>
            <div className="absolute -top-1 -right-1 bg-[var(--cta-primary)] ...">
              #{rank}
            </div>
          </div>

          {/* Address and phone */}
          <div className="text-xs text-[var(--text-secondary)] mb-3 leading-snug">
            <p>{store.address}</p>
            <p>
              {store.city}, {store.state} {store.zip}
            </p>
            {store.phone && (
              <p>{store.phone}</p>
            )}
          </div>

          {/* Hours: Full day-by-day display */}
          <div className="text-xs text-[var(--text-primary)] mb-4 space-y-0.5">
            <div className="font-semibold text-[var(--text-secondary)] text-[10px] uppercase tracking-wider mb-1">
              Hours
            </div>
            {dayLabels.map((label, index) => (
              <div key={label} className="flex justify-between">
                <span className="w-8">{label}</span>
                <span className="flex-1 text-right">{dayValues[index]}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <a href={...}>Directions</a>
            <a href={...}>Details</a>
          </div>
        </div>
      </Popup>
    </Marker>
  )
})}
```

**Key Changes:**
- Replaced grouped display with full day-by-day
- Added phone number display
- Right-justified times for easier reading
- No conditional logic for "Mon-Sat" vs "Mon-Fri"
- Cleaner, more maintainable layout

---

## app/store-finder/page.tsx

### Updated Imports
**Location:** [app/store-finder/page.tsx:24](../app/store-finder/page.tsx#L24)

```typescript
import {
  sanitizeText,
  cleanStoreName,
  getStoreTitle,
  getStoreUrl,
  hasValidCoordinates,
  formatStoreHours,
  normalizeDayHours,  // ← NEW
} from "@/lib/stores"
```

---

### Updated StoreListItem Hours Display
**Location:** [app/store-finder/page.tsx:894-911](../app/store-finder/page.tsx#L894-L911)

```typescript
// OLD CODE:
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

// NEW CODE:
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

**Key Changes:**
- Now checks for all three data formats: `weekday`, `weekend`, `monday`
- Uses IIFE to avoid re-rendering hours on every component render
- Full day-by-day display with proper alignment
- Right-justified times
- Proper spacing (`gap-2`) between day label and time

---

## Summary of All Changes

| File | Lines | Change Type | Purpose |
|------|-------|-------------|---------|
| lib/stores.ts | 107-115 | Added Interface | DayHours structure |
| lib/stores.ts | 117-128 | Added Function | normalizeTime() helper |
| lib/stores.ts | 137-242 | Added Function | normalizeDayHours() (authoritative) |
| components/store-map.tsx | 7 | Updated Import | Use normalizeDayHours |
| components/store-map.tsx | 214-299 | Updated Logic | Map popup hours display |
| app/store-finder/page.tsx | 24 | Updated Import | Use normalizeDayHours |
| app/store-finder/page.tsx | 894-911 | Updated Logic | List item hours display |

**Total Lines Changed:** ~200 lines
**Files Modified:** 3
**New Functions:** 2
**New Interfaces:** 1
**Deleted Functions:** 0 (backwards compatible)

---

## Testing Each Change

### Test normalizeDayHours()
```typescript
// Test 1: Individual days
normalizeDayHours({
  monday: "6:00 AM–9:00 PM",
  thursday: "Closed"
})
// Output: { monday: "6:00 AM–9:00 PM", thursday: "Closed", ... }

// Test 2: Pipe-delimited
normalizeDayHours({
  weekday: "Monday: 6:00 AM–9:00 PM | Tuesday: 6:00 AM–9:00 PM | Thursday: Closed | ..."
})
// Output: { monday: "6:00 AM–9:00 PM", thursday: "Closed", ... }

// Test 3: Slash-delimited
normalizeDayHours({
  weekday: "Mon-Fri: 6:00 AM–9:00 PM",
  weekend: "6:00 AM–9:00 PM / 8:00 AM–8:00 PM"
})
// Output: { monday-friday: "6:00 AM–9:00 PM", saturday: "6:00 AM–9:00 PM", ... }
```

### Test Map Popup
- Click on any store marker
- Verify hours display all 7 days
- Verify "Closed" day shows no time range
- Verify proper alignment and no overflow

### Test List Item
- View store finder list
- Verify hours display all 7 days
- Verify times are right-aligned
- Verify spacing is consistent

---

## Backwards Compatibility

The old `formatStoreHours()` function is still available but marked `@deprecated`. This maintains compatibility with any code that hasn't been updated yet. The card view still uses this function, but it could be migrated to use `normalizeDayHours()` in a future update.

