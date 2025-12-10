import type { Metadata } from "next"
import { getPennyList } from "@/lib/fetch-penny-data"
import { computeFreshnessMetrics, filterValidPennyItems } from "@/lib/penny-list-utils"
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
  const { newLast24h, totalLast30d } = computeFreshnessMetrics(validItems)

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
              className="inline-flex h-2 w-2 rounded-full bg-amber-500"
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
            <p className="text-sm text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">{newLast24h}</span> new
              reports in the last 24 hours;{" "}
              <span className="font-semibold text-[var(--text-primary)]">{totalLast30d}</span> total
              in 30 days.
            </p>
          </div>
          {feedUnavailable && (
            <div
              role="status"
              className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/10 dark:text-amber-100"
            >
              <h2 className="mb-1 font-semibold text-amber-900 dark:text-amber-100">
                Live penny list feed is temporarily unavailable
              </h2>
              <p className="text-amber-800 dark:text-amber-200">
                Our data source didn&apos;t return any items just now. Try again in a few minutes.
                If you recently submitted a find, it&apos;s still in the queue and will appear once
                the feed refreshes.
              </p>
            </div>
          )}
          <PennyListClient initialItems={validItems} initialSearchParams={resolvedSearchParams} />
        </div>
      </section>
    </div>
  )
}
