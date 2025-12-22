import type { Metadata } from "next"
import Link from "next/link"
import { getPennyList } from "@/lib/fetch-penny-data"
import { computeFreshnessMetrics, filterValidPennyItems } from "@/lib/penny-list-utils"
import { PennyListClient } from "@/components/penny-list-client"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Home Depot Penny List: Latest $0.01 Item Sightings | Penny Central",
  description:
    "Latest community-reported Home Depot penny list. Search and filter by state, tier, and date. Updated hourly with the freshest penny sightings.",
  openGraph: {
    type: "website",
    url: "https://www.pennycentral.com/penny-list",
    title: "Home Depot Penny List ($0.01 Finds)",
    description:
      "Latest community-reported penny sightings at Home Depot. Search and filter by state, tier, and date.",
    images: [ogImageUrl("penny-list")],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl("penny-list")],
  },
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

  const trendingItems = [...validItems]
    .map((item) => ({
      ...item,
      totalReports: Object.values(item.locations || {}).reduce((sum, count) => sum + count, 0),
      stateCount: item.locations ? Object.keys(item.locations).length : 0,
    }))
    .sort(
      (a, b) =>
        b.totalReports - a.totalReports ||
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    )
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.pennycentral.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Penny List",
                item: "https://www.pennycentral.com/penny-list",
              },
            ],
          }),
        }}
      />
      {/* Dataset Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "Home Depot Penny List",
            description:
              "A community-sourced list of items currently priced at $0.01 at Home Depot stores.",
            url: "https://www.pennycentral.com/penny-list",
            creator: {
              "@type": "Organization",
              name: "Penny Central",
            },
            isAccessibleForFree: true,
            keywords: ["home depot penny items", "penny list", "clearance items"],
            license: "https://creativecommons.org/licenses/by-sa/4.0/",
          }),
        }}
      />
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
            Penny List
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
          <div className="mt-4">
            <a
              href="/guide"
              className="inline-flex items-center gap-1 text-sm text-[var(--link-default)] hover:text-[var(--link-hover)] font-medium underline underline-offset-4"
            >
              New to penny hunting? Read the Complete Guide →
            </a>
          </div>
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

          {trendingItems.length > 0 && (
            <div className="mb-6 rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Trending SKUs</h2>
                <span className="pill pill-muted text-xs">Top reports</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {trendingItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/sku/${item.sku}`}
                    className="p-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] hover:border-[var(--cta-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                  >
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                      SKU {item.sku}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-2">
                      {item.totalReports} report{item.totalReports === 1 ? "" : "s"} ·{" "}
                      {item.stateCount} state{item.stateCount === 1 ? "" : "s"}
                    </p>
                  </Link>
                ))}
              </div>
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
            whatsNewItems={whatsNew}
            lastUpdatedLabel={lastUpdatedLabel}
          />
        </div>
      </section>
    </div>
  )
}
