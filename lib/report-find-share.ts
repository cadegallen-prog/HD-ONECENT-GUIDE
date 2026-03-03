import { formatSkuForDisplay } from "@/lib/sku"

export type ReportFindShareItem = {
  sku: string
  quantity: number | null
}

export type ReportFindShareContext = {
  storeCity: string
  storeState: string
  dateFound: string
}

function buildLocationLabel({ storeCity, storeState }: ReportFindShareContext): string {
  const city = storeCity.trim()
  const state = storeState.trim()

  if (city && state) return `${city}, ${state}`
  return city || state
}

export function buildFacebookShareText(
  items: ReportFindShareItem[],
  context: ReportFindShareContext
): string {
  const locationLabel = buildLocationLabel(context)
  const contextLine = locationLabel
    ? context.dateFound
      ? `${locationLabel} on ${context.dateFound}`
      : locationLabel
    : context.dateFound
      ? `Found on ${context.dateFound}`
      : "PennyCentral report"

  const lines = items.map((item) => {
    const quantityText = item.quantity !== null && item.quantity > 1 ? ` x${item.quantity}` : ""
    return `- ${formatSkuForDisplay(item.sku)}${quantityText}`
  })

  return [
    contextLine,
    "",
    "SKUs:",
    ...lines,
    "",
    "Report your own finds: https://www.pennycentral.com/report-find",
  ].join("\n")
}
