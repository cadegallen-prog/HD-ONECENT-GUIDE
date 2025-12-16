import type { Metadata } from "next"
import { getPennyList } from "@/lib/fetch-penny-data"
import { computeFreshnessMetrics, filterValidPennyItems } from "@/lib/penny-list-utils"
import { PennyListClient } from "@/components/penny-list-client"

export const metadata: Metadata = {
  title: "Penny List (Community Reports): Recent Penny Sightings - Penny Central",
  description:
    "Penny List: latest community-reported penny sightings at Home Depot. Search and filter by state, tier, and date. Always verify in store - your mileage may vary.",
}

export const revalidate = 3600

type PennyListPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function PennyListPage({ searchParams }: PennyListPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const pennyItems = await getPennyList()
  const validItems = filterValidPennyItems(pennyItems)
  const feedUnavailable = validItems.length === 0
  const nowMs =
    process.env.PLAYWRIGHT === "1" ? new Date("2025-12-10T12:00:00Z").getTime() : Date.now()
  const { newLast24h, totalLast30d } = computeFreshnessMetrics(validItems, nowMs)
  const latestTimestamp = validItems
    .map((item) => new Date(item.dateAdded).getTime())
    .filter((time) => !Number.isNaN(time))
    .sort((a, b) => b - a)[0]
  const updatedHoursAgo =
    latestTimestamp !== undefined
      ? Math.max(0, Math.round((nowMs - latestTimestamp) / 3600000))
      : null
  const lastUpdatedLabel =
    updatedHoursAgo === null
      ? "Update time unavailable"
      : updatedHoursAgo === 0
        ? "Updated just now"
        : `Updated ${updatedHoursAgo} hour${updatedHoursAgo === 1 ? "" : "s"} ago`
  const reportCounts = validItems.reduce(
    (acc, item) => {
      const totalReports = Object.values(item.locations || {}).reduce(
        (sum, count) => sum + count,
        0
      )
      if (totalReports > 1) {
        acc.multipleReports += 1
      } else {
        acc.singleReport += 1
      }
      return acc
    },
    { multipleReports: 0, singleReport: 0 }
  )
  const whatsNew = [...validItems]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* Header Section */}
      <section
        aria-labelledby="page-heading"
        className="section-padding-sm px-4 sm:px-6 border-b border-[var(--border-default)] bg-[var(--bg-muted)]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="pill pill-muted mx-auto w-fit mb-4">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-[var(--status-info)]"
              aria-hidden="true"
            ></span>
            Penny List (last 30 days)
          </div>
          <h1
            id="page-heading"
            className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4"
          >
            Penny List
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Community reports of recent penny sightings. Your mileage may vary - always verify at
            checkout.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding px-4 sm:px-6">
        <div className="container-wide">
          <div className="mb-6 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="pill pill-strong mr-2 sm:mr-3">
                  {newLast24h} new reports (24h)
                </span>
                <span className="pill pill-muted">Total last 30 days: {totalLast30d}</span>
              </p>
              <p className="text-xs text-[var(--text-muted)]">{lastUpdatedLabel}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <span className="pill pill-strong">
                Multiple reports: {reportCounts.multipleReports}
              </span>
              <span className="pill pill-muted">Single report: {reportCounts.singleReport}</span>
            </div>
          </div>
          {feedUnavailable && (
            <div
              role="status"
              className="mb-6 rounded-lg border border-[var(--border-default)] border-l-4 border-l-[var(--status-warning)] bg-[var(--bg-elevated)] p-4 text-sm text-[var(--text-primary)] dark:bg-[var(--bg-hover)]"
            >
              <h2 className="mb-1 font-semibold text-[var(--status-warning)]">
                Live penny list feed is temporarily unavailable
              </h2>
              <p className="text-[var(--text-secondary)]">
                Our data source didn&apos;t return any items just now. Try again in a few minutes.
                If you recently submitted a find, it&apos;s still in the queue and will appear once
                the feed refreshes.
              </p>
            </div>
          )}
          <PennyListClient
            initialItems={validItems}
            initialSearchParams={resolvedSearchParams}
            whatsNewCount={whatsNew.length}
            whatsNewItems={whatsNew}
            lastUpdatedLabel={lastUpdatedLabel}
          />
        </div>
      </section>
    </div>
  )
}
