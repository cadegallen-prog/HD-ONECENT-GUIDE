export interface StoreHours {
  weekday?: string
  weekend?: string
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
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
  /** 1-based rank within the displayed result set */
  rank?: number
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

export interface DayHours {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

export interface MergedHours {
  ranges: Array<{
    days: string // "Mon–Fri", "Sat", "Sun", or single day if irregular
    hours: string // "6:00 AM–9:00 PM" or "Closed"
  }>
  isExpanded: boolean // true if store has irregular hours (different hours on different days)
}

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

/**
 * Parses store hours from multiple formats into day-by-day structure.
 * Supports three formats:
 * 1. Day-by-day: "Monday: 6:00 AM – 9:00 PM | Tuesday: ..."
 * 2. Weekday/weekend split: weekday="Mon-Fri: 6:00 AM – 10:00 PM", weekend="6:00 AM – 10:00 PM / 7:00 AM – 8:00 PM"
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

  // Check if we have individual day fields
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

  // Try to parse day-by-day format: "Mon: X | Tue: Y | ..." or "Monday: X | Tuesday: Y | ..."
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

  // Fall back to weekday/weekend format
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

/**
 * Converts normalized day hours into smart merged ranges.
 * Merges consecutive days with identical hours.
 * Only expands to individual days if store has irregular hours.
 *
 * Examples:
 * - Standard store: "Mon–Fri 6:00 AM–9:00 PM, Sat 6:00 AM–9:00 PM, Sun 8:00 AM–8:00 PM"
 * - Closed day: "Mon–Wed 6:00 AM–9:00 PM, Thu Closed, Fri–Sun 6:00 AM–9:00 PM"
 */
export const mergeConsecutiveDays = (dayHours: DayHours): MergedHours => {
  const dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Get hours for each day
  const hoursPerDay = dayNames.map((day) => dayHours[day as keyof DayHours])

  // Check if this store has irregular hours
  const uniqueHours = new Set(hoursPerDay)
  const isExpanded =
    uniqueHours.size > 1 || hoursPerDay.some((h) => h === "Closed" || h === "Hours vary")

  // Group consecutive days with same hours
  const ranges: Array<{ days: string; hours: string }> = []
  let rangeStart = 0

  for (let i = 0; i <= dayNames.length; i++) {
    const currentHours = hoursPerDay[i]
    const prevHours = i > 0 ? hoursPerDay[i - 1] : undefined

    // If hours changed or we reached the end, save the range
    if (i === dayNames.length || currentHours !== prevHours) {
      if (i > rangeStart) {
        const rangeEndIndex = i - 1
        const startLabel = dayLabels[rangeStart]
        const endLabel = dayLabels[rangeEndIndex]

        const daysStr =
          rangeStart === rangeEndIndex
            ? startLabel // Single day
            : `${startLabel}–${endLabel}` // Range like "Mon–Fri"

        ranges.push({
          days: daysStr,
          hours: hoursPerDay[rangeStart],
        })
      }

      rangeStart = i
    }
  }

  return { ranges, isExpanded }
}

/**
 * Legacy format for compact display (used in cards)
 * @deprecated Use normalizeDayHours() for full hours display
 */
export interface FormattedHours {
  saturday: string
  sunday: string
  weekday: string
  compact: string
}

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
 * @deprecated Use normalizeDayHours() for full hours display
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
