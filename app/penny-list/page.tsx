import type { Metadata } from "next"
import { getPennyList } from "@/lib/fetch-penny-data"
import {
  computeFreshnessMetrics,
  filterValidPennyItems,
  formatRelativeDate,
} from "@/lib/penny-list-utils"
import { PennyListClient } from "@/components/penny-list-client"

export const metadata: Metadata = {
  title: "Crowd Reports: Penny Leads - Penny Central",
  description:
    "Unverified crowd-sourced reports of penny items at Home Depot stores. Filter by state, tier, and more. YMMV - always verify in store.",
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
  const nowDate = new Date(nowMs)
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
  const confidence = validItems.reduce(
    (acc, item) => {
      const totalReports = Object.values(item.locations || {}).reduce(
        (sum, count) => sum + count,
        0
      )
      if (totalReports > 1) {
        acc.verified += 1
      } else {
        acc.unverified += 1
      }
      return acc
    },
    { verified: 0, unverified: 0 }
  )
  const whatsNew = [...validItems]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* Header Section */}
      <section
        aria-labelledby="page-heading"
        className="section-padding px-4 sm:px-6 border-b border-[var(--border-default)] bg-[var(--bg-elevated)]"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[var(--text-secondary)] text-sm font-medium mb-4">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-[var(--status-info)]"
              aria-hidden="true"
            ></span>
            Crowd reports (last 30 days)
          </div>
          <h1
            id="page-heading"
            className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4"
          >
            Crowd Reports: Recent Penny Leads (Unverified)
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Recent penny finds reported by PennyCentral users. These are unverified leads —{" "}
            <strong>YMMV (Your Mileage May Vary)</strong>.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding px-4 sm:px-6">
        <div className="container-wide">
          <div className="mb-6 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-primary)]">{newLast24h}</span> new
                reports in the last 24 hours;{" "}
                <span className="font-semibold text-[var(--text-primary)]">{totalLast30d}</span>{" "}
                total in 30 days.
              </p>
              <p className="text-xs text-[var(--text-muted)]">{lastUpdatedLabel}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                Verified: <span className="text-[var(--text-primary)]">{confidence.verified}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                Unverified:{" "}
                <span className="text-[var(--text-primary)]">{confidence.unverified}</span>
              </span>
            </div>
          </div>
          {whatsNew.length > 0 && (
            <div className="mb-8 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <h2 className="text-base font-semibold text-[var(--text-primary)]">
                  What’s new this week (top 10)
                </h2>
                <span className="text-xs text-[var(--text-muted)]">{lastUpdatedLabel}</span>
              </div>
              <ul className="divide-y divide-[var(--border-default)]">
                {whatsNew.map((item) => (
                  <li
                    key={item.id}
                    className="py-2 flex items-center justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--text-primary)] truncate">
                        {item.name}
                      </p>
                      <p className="text-[var(--text-muted)] text-xs">SKU {item.sku}</p>
                    </div>
                    <div className="text-right text-xs text-[var(--text-secondary)] whitespace-nowrap">
                      <time dateTime={item.dateAdded}>
                        {formatRelativeDate(item.dateAdded, nowDate)}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
          />
        </div>
      </section>
    </div>
  )
}
