import type { PennyItem } from "./fetch-penny-data"

export function getFreshestHomeProofTimestamp(
  items: Array<Pick<PennyItem, "dateAdded" | "lastSeenAt">>
): string | null {
  let freshestValue: string | null = null
  let freshestTimestamp = Number.NEGATIVE_INFINITY

  for (const item of items) {
    const candidates = [item.dateAdded, item.lastSeenAt]
    for (const candidate of candidates) {
      if (!candidate) continue
      const timestamp = new Date(candidate).getTime()
      if (Number.isNaN(timestamp) || timestamp <= freshestTimestamp) continue
      freshestTimestamp = timestamp
      freshestValue = candidate
    }
  }

  return freshestValue
}
