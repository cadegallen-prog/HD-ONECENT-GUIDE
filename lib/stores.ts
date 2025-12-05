export interface StoreHours {
  weekday?: string
  weekend?: string
  [key: string]: string | undefined
}

export interface StoreLocation {
  id: string
  number?: string
  name: string
  address: string
  city: string
  state: string
  zip?: string
  phone?: string
  lat: number
  lng: number
  hours?: StoreHours
  services?: string[]
  distance?: number
}

export const sanitizeText = (value?: string): string => {
  if (!value) return ""
  return (
    value
      // Fix UTF-8 dashes and hyphens
      .replace(/[\u2013\u2014\u2015]/g, "-") // en-dash, em-dash, horizontal bar
      // Fix UTF-8 quotes
      .replace(/[\u2018\u2019\u201A\u201B]/g, "'") // single quotes
      .replace(/[\u201C\u201D\u201E\u201F]/g, '"') // double quotes
      // Fix UTF-8 spaces
      .replace(/[\u00A0\u2002\u2003\u2009\u200A\u202F]/g, " ") // various spaces
      // Fix ellipsis
      .replace(/\u2026/g, "...")
      // Fix mangled UTF-8 sequences (double-encoded)
      .replace(/â€¯/g, " ") // U+202F narrow no-break space
      .replace(/â€‰/g, " ") // U+2009 thin space
      .replace(/â€"/g, "-") // U+2013 en-dash
      .replace(/â€œ/g, '"') // U+201C left double quote
      .replace(/â€/g, '"') // U+201D right double quote
      // Remove any remaining non-printable ASCII characters
      .replace(/[^\x20-\x7E]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  )
}

export const cleanStoreName = (value?: string): string => {
  const sanitized = sanitizeText(value)
  if (!sanitized) return "Home Depot"
  const noPrefix = sanitized
    .replace(/^the home depot\s*/i, "")
    .replace(/^home depot\s*/i, "")
    .trim()
  const noNumber = noPrefix.replace(/\s*(store)?\s*#?\s*\d{3,5}\s*$/i, "").trim()
  return noNumber || "Home Depot"
}

export const hasValidStoreNumber = (num?: string): boolean => {
  if (!num) return false
  return /^\d{1,5}$/.test(num.trim())
}

export const formatStoreNumber = (num?: string): string => {
  if (!hasValidStoreNumber(num)) return ""
  return num!.trim().padStart(4, "0")
}

export const getStoreUrlNumber = (num?: string): string => {
  if (!hasValidStoreNumber(num)) return ""
  return parseInt(num!.trim(), 10).toString()
}

export const getStoreTitle = (store: StoreLocation): string => {
  const name = cleanStoreName(store.name)
  const formattedNumber = formatStoreNumber(store.number)
  if (formattedNumber) {
    return `${name} #${formattedNumber}`
  }
  return name
}

export const getStoreUrl = (store: StoreLocation): string => {
  const storeSlug = (cleanStoreName(store.name) || store.city || "Store").replace(/\s+/g, "-")
  const state = sanitizeText(store.state) || "GA"
  const city = sanitizeText(store.city) || "Atlanta"
  const zip = sanitizeText(store.zip)
  const storeNum = getStoreUrlNumber(store.number)
  const baseUrl = `https://www.homedepot.com/l/${storeSlug}/${state}/${city}/${zip}`
  return storeNum ? `${baseUrl}/${storeNum}` : baseUrl
}

export const hasValidCoordinates = (store: Pick<StoreLocation, "lat" | "lng">): boolean => {
  return Number.isFinite(store.lat) && Number.isFinite(store.lng)
}

export interface FormattedHours {
  saturday: string
  sunday: string
  weekday: string
  /** Compact single-line format for tight spaces */
  compact: string
}

/**
 * Formats time string to be more compact (e.g., "6:00 AM - 10:00 PM" -> "6AM-10PM")
 */
const compactTime = (timeStr: string): string => {
  return timeStr
    .replace(/:00/g, "")
    .replace(/\s*AM/gi, "AM")
    .replace(/\s*PM/gi, "PM")
    .replace(/\s*-\s*/g, "-")
}

/**
 * Parses store hours from master data format into user-friendly structure.
 * Master weekend format: "6:00 AM - 10:00 PM / 7:00 AM - 8:00 PM" (Sat / Sun)
 */
export const formatStoreHours = (hours?: StoreHours): FormattedHours => {
  const defaultHours: FormattedHours = {
    saturday: "Sat: Hours vary",
    sunday: "Sun: Hours vary",
    weekday: "M-F: Hours vary",
    compact: "Hours vary",
  }

  if (!hours) return defaultHours

  // Clean weekday hours
  let weekday = sanitizeText(hours.weekday)
  let weekdayTime = ""
  if (weekday) {
    // Extract just the time portion for compact display
    weekdayTime = weekday.replace(/^mon.*?:\s*/i, "").trim()
    // Ensure M-F prefix exists
    if (!weekday.toLowerCase().includes("mon")) {
      weekday = `M-F: ${weekday}`
    } else {
      // Shorten "Mon-Fri" to "M-F"
      weekday = weekday.replace(/mon(?:day)?[\s-]*fri(?:day)?:?\s*/i, "M-F: ")
    }
  } else {
    weekday = defaultHours.weekday
  }

  // Parse weekend hours - format is "SAT_HOURS / SUN_HOURS"
  let saturday = defaultHours.saturday
  let sunday = defaultHours.sunday

  const weekendRaw = sanitizeText(hours.weekend)
  if (weekendRaw) {
    const parts = weekendRaw.split("/").map((p) => p.trim())

    if (parts.length === 2) {
      saturday = `Sat: ${parts[0]}`
      sunday = `Sun: ${parts[1]}`
    } else if (parts.length === 1) {
      saturday = `Sat: ${parts[0]}`
      sunday = `Sun: ${parts[0]}`
    }
  }

  // Build compact version (just shows weekday hours as most stores have same hours)
  const compact = weekdayTime ? compactTime(weekdayTime) : defaultHours.compact

  return { saturday, sunday, weekday, compact }
}
