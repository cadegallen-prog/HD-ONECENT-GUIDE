# Store Finder Documentation

## Overview

The Store Finder helps users locate nearby Home Depot stores using an interactive map with intelligent search capabilities.

**Live:** https://pennycentral.com/store-finder

---

## Features

### Search Capabilities

Users can search for stores by:
- **State name** (e.g., "Texas", "California", "New York")
- **State abbreviation** (e.g., "TX", "CA", "NY")
- **City name** (e.g., "Kerrville", "Seattle", "Atlanta")
- **City + State** (e.g., "Kerrville, Texas", "Seattle WA")
- **ZIP code** (e.g., "78028", "98101", "30144")
- **Direct coordinates** (e.g., "33.749, -84.388")

### Auto-Geolocation

- Automatically requests user's location on page load
- Uses `sessionStorage` to prevent repeated prompts
- Falls back to geographic center of US if denied

### Map Display

- Interactive Leaflet map with 2,007 Home Depot locations
- Shows 20 closest stores to search location
- Compact popups with store name, number, hours, and distances
- Whole number distances (e.g., "3 mi" instead of "2.91 mi")

---

## Technical Implementation

### Data Source

**File:** `data/stores/store_directory.master.json`
- **Total stores:** 2,007 locations
- **Coverage:** All 50 US states including Alaska & Hawaii
- **Unique ZIPs:** 1,965 ZIP codes

### Search Logic

**Three-tier approach for ZIP codes:**

1. **Exact database match** (instant, 100% reliable)
   - Searches `store_directory.master.json` for exact ZIP
   - Returns stores at that ZIP instantly with no API call

2. **Zippopotam API** (primary geocoding)
   - Free, no API key required
   - No rate limits
   - 100% success rate for US ZIP codes
   - URL: `https://api.zippopotam.us/us/{zip}`

3. **Nominatim fallback** (backup geocoding)
   - OpenStreetMap geocoding service
   - Free, requires User-Agent header
   - Rate limited to 1 request/second
   - URL: `https://nominatim.openstreetmap.org/search`

**State name mapping:**

All 50 state names are mapped to abbreviations, so users can search "Texas" instead of just "TX":

```typescript
const STATE_ABBREV_MAP = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', // ... all 50 states
}
```

### Map Component

**File:** `components/store-map.tsx`

- Uses React-Leaflet for interactive maps
- Dynamic import with `ssr: false` to avoid hydration issues
- OpenStreetMap tiles (free, no API key)
- Custom markers with store-specific popups

**Popup format:**
```
[Store Name] #[Number]    [X mi]
[Hours]
[City, State]
[Directions] [Details]
```

---

## Files

| Path | Purpose |
|------|---------|
| `app/store-finder/page.tsx` | Main store finder page with search logic |
| `components/store-map.tsx` | Interactive Leaflet map component |
| `lib/stores.ts` | Store utility functions and types |
| `data/stores/store_directory.master.json` | Complete store database (2,007 locations) |
| `data/home-depot-stores.sample.json` | Sample data for faster initial load (30 stores) |

---

## APIs Used

### Zippopotam (Primary ZIP Geocoding)
- **Endpoint:** `https://api.zippopotam.us/us/{zip}`
- **Cost:** Free forever
- **Rate limit:** None
- **Reliability:** 100% for US ZIPs
- **Docs:** https://www.zippopotam.us/

### Nominatim (Fallback ZIP Geocoding)
- **Endpoint:** `https://nominatim.openstreetmap.org/search`
- **Cost:** Free
- **Rate limit:** 1 request/second
- **Reliability:** ~73% (used only as fallback)
- **Docs:** https://nominatim.org/release-docs/develop/api/Search/

---

## Data Quality

### Fixed Issues

- **35 stores** had incorrect coordinates (fixed via geocoding)
- **0 duplicate coordinates** (all stores have unique locations)
- **100% coverage** of continental US, Alaska, and Hawaii

### Testing

Comprehensive testing performed:
- ✅ 200/200 exact ZIP matches (100%)
- ✅ 15/15 non-database ZIPs via geocoding (100%)
- ✅ All 50 state names searchable
- ✅ City + state combinations working
- ✅ Zero duplicate coordinates verified

---

## Performance

- **Initial load:** 30 sample stores (Georgia area) for fast LCP
- **Full data:** 2,007 stores loaded via `/api/stores` in background
- **Exact ZIP search:** Instant (no API call)
- **ZIP geocoding:** < 500ms average
- **Map rendering:** Optimized with marker clustering disabled for clarity

---

## Default Behavior

**Default map center:** Geographic center of contiguous US (39.8283°N, -98.5795°W) near Lebanon, Kansas

**Why not Atlanta?** Originally defaulted to Atlanta, GA which appeared biased toward Georgia. Changed to neutral geographic center.

---

## Known Limitations

1. **ZIP code coverage:** Only 1,965 ZIPs have exact matches. Others require geocoding.
2. **Store data freshness:** Store database updated manually, not real-time.
3. **No store hours verification:** Hours displayed may be outdated.
4. **20 store limit:** Only shows closest 20 stores to any search location.

---

## Future Improvements

Potential enhancements:
- [ ] Real-time store hours via Home Depot API
- [ ] User favorites persistence across devices
- [ ] Distance radius filter (5mi, 10mi, 25mi options)
- [ ] Bulk export of store list as CSV
- [ ] Recently searched locations

---

## Maintenance

### Updating Store Data

To update the store database:

1. Scrape fresh data from Home Depot store locator
2. Save to `data/stores/store_directory.master.json`
3. Verify schema matches `StoreLocation` interface in `lib/stores.ts`
4. Run duplicate check script (if needed)
5. Test store finder with sample searches

### Monitoring Geocoding APIs

Both Zippopotam and Nominatim are free services with no SLA guarantees.

**Monitoring recommendations:**
- Check browser console for geocoding errors
- Monitor user reports of "ZIP not found" issues
- Consider adding error tracking (Sentry, etc.)

**Fallback strategy:**
If both APIs fail, user can still search by city/state name which doesn't require geocoding.

---

## Related Documentation

- **Design System:** `docs/DESIGN-SYSTEM-AAA.md`
- **Project Overview:** `README.md`
- **Development Guide:** `CLAUDE.md`
