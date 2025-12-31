export type StateInfo = {
  code: string
  name: string
  slug: string
}

export const STATES: StateInfo[] = [
  { code: "AL", name: "Alabama", slug: "alabama" },
  { code: "AK", name: "Alaska", slug: "alaska" },
  { code: "AZ", name: "Arizona", slug: "arizona" },
  { code: "AR", name: "Arkansas", slug: "arkansas" },
  { code: "CA", name: "California", slug: "california" },
  { code: "CO", name: "Colorado", slug: "colorado" },
  { code: "CT", name: "Connecticut", slug: "connecticut" },
  { code: "DE", name: "Delaware", slug: "delaware" },
  { code: "FL", name: "Florida", slug: "florida" },
  { code: "GA", name: "Georgia", slug: "georgia" },
  { code: "HI", name: "Hawaii", slug: "hawaii" },
  { code: "ID", name: "Idaho", slug: "idaho" },
  { code: "IL", name: "Illinois", slug: "illinois" },
  { code: "IN", name: "Indiana", slug: "indiana" },
  { code: "IA", name: "Iowa", slug: "iowa" },
  { code: "KS", name: "Kansas", slug: "kansas" },
  { code: "KY", name: "Kentucky", slug: "kentucky" },
  { code: "LA", name: "Louisiana", slug: "louisiana" },
  { code: "ME", name: "Maine", slug: "maine" },
  { code: "MD", name: "Maryland", slug: "maryland" },
  { code: "MA", name: "Massachusetts", slug: "massachusetts" },
  { code: "MI", name: "Michigan", slug: "michigan" },
  { code: "MN", name: "Minnesota", slug: "minnesota" },
  { code: "MS", name: "Mississippi", slug: "mississippi" },
  { code: "MO", name: "Missouri", slug: "missouri" },
  { code: "MT", name: "Montana", slug: "montana" },
  { code: "NE", name: "Nebraska", slug: "nebraska" },
  { code: "NV", name: "Nevada", slug: "nevada" },
  { code: "NH", name: "New Hampshire", slug: "new-hampshire" },
  { code: "NJ", name: "New Jersey", slug: "new-jersey" },
  { code: "NM", name: "New Mexico", slug: "new-mexico" },
  { code: "NY", name: "New York", slug: "new-york" },
  { code: "NC", name: "North Carolina", slug: "north-carolina" },
  { code: "ND", name: "North Dakota", slug: "north-dakota" },
  { code: "OH", name: "Ohio", slug: "ohio" },
  { code: "OK", name: "Oklahoma", slug: "oklahoma" },
  { code: "OR", name: "Oregon", slug: "oregon" },
  { code: "PA", name: "Pennsylvania", slug: "pennsylvania" },
  { code: "RI", name: "Rhode Island", slug: "rhode-island" },
  { code: "SC", name: "South Carolina", slug: "south-carolina" },
  { code: "SD", name: "South Dakota", slug: "south-dakota" },
  { code: "TN", name: "Tennessee", slug: "tennessee" },
  { code: "TX", name: "Texas", slug: "texas" },
  { code: "UT", name: "Utah", slug: "utah" },
  { code: "VT", name: "Vermont", slug: "vermont" },
  { code: "VA", name: "Virginia", slug: "virginia" },
  { code: "WA", name: "Washington", slug: "washington" },
  { code: "WV", name: "West Virginia", slug: "west-virginia" },
  { code: "WI", name: "Wisconsin", slug: "wisconsin" },
  { code: "WY", name: "Wyoming", slug: "wyoming" },
]

const byCode = new Map(STATES.map((s) => [s.code, s]))
const bySlug = new Map(STATES.map((s) => [s.slug, s]))
const byName = new Map(STATES.map((s) => [s.name.toLowerCase(), s]))

export function normalizeStateParam(param: string): StateInfo | undefined {
  const trimmed = param.trim().toLowerCase()
  const asCode = trimmed.toUpperCase()
  if (byCode.has(asCode)) return byCode.get(asCode)
  if (bySlug.has(trimmed)) return bySlug.get(trimmed)
  if (byName.has(trimmed)) return byName.get(trimmed)
  return undefined
}
