import type { Metadata } from "next"
import { getPennyListFiltered } from "@/lib/fetch-penny-data"
import { filterValidPennyItems, formatWindowLabel } from "@/lib/penny-list-utils"
import { queryPennyItems, getHotItems } from "@/lib/penny-list-query"
import { PennyListClient } from "@/components/penny-list-client"
import { getCanonicalUrl } from "@/lib/canonical"
import { RouteAdSlots } from "@/components/ads/route-ad-slots"

const VALID_PER_PAGE = [25, 50, 100] as const
const DEFAULT_PER_PAGE = 50

export const metadata: Metadata = {
  title: "Live Home Depot Penny List ($0.01 Finds) by State | Penny Central",
  description:
    "Live $0.01 items reported by the community, organized by state and recency. See what's being found right now.",
  openGraph: {
    type: "website",
    url: "https://www.pennycentral.com/penny-list",
    title: "Live $0.01 Penny List",
    description: "Live community-reported penny items by state and recency.",
    images: [
      {
        url: "/api/og?page=penny-list",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live $0.01 Penny List",
    description: "Live community-reported penny items by state and recency.",
    images: ["/api/og?page=penny-list"],
  },
  alternates: {
    canonical: getCanonicalUrl("/penny-list"),
  },
}

export const revalidate = 300 // 5 minutes - public freshness target (server render)

type PennyListPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function getFirstParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | null {
  const value = params[key]
  if (Array.isArray(value)) return value[0] ?? null
  return typeof value === "string" ? value : null
}

function parsePerPage(value: string | null): number {
  if (!value) return DEFAULT_PER_PAGE
  const parsed = Number(value)
  if (VALID_PER_PAGE.includes(parsed as (typeof VALID_PER_PAGE)[number])) return parsed
  return DEFAULT_PER_PAGE
}

function parsePage(value: string | null): number {
  if (!value) return 1
  const parsed = Number(value)
  if (Number.isInteger(parsed) && parsed >= 1) return parsed
  return 1
}

export default async function PennyListPage({ searchParams }: PennyListPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const state = getFirstParam(resolvedSearchParams, "state") || undefined
  const photo = getFirstParam(resolvedSearchParams, "photo") === "1"
  const q = getFirstParam(resolvedSearchParams, "q") || undefined
  const sortParam = getFirstParam(resolvedSearchParams, "sort")
  const sort =
    sortParam === "oldest" || sortParam === "most-reports" || sortParam === "alphabetical"
      ? sortParam
      : "newest"
  const daysParam = getFirstParam(resolvedSearchParams, "days")
  const days = (() => {
    if (daysParam === "7" || daysParam === "14" || daysParam === "30") return "1m"
    if (
      daysParam === "1m" ||
      daysParam === "3m" ||
      daysParam === "6m" ||
      daysParam === "12m" ||
      daysParam === "18m" ||
      daysParam === "24m" ||
      daysParam === "all"
    ) {
      return daysParam
    }
    return "1m"
  })()
  const perPage = parsePerPage(getFirstParam(resolvedSearchParams, "perPage"))
  const requestedPage = parsePage(getFirstParam(resolvedSearchParams, "page"))

  const nowMs =
    process.env.PLAYWRIGHT === "1" ? new Date("2025-12-10T12:00:00Z").getTime() : Date.now()

  const pennyItems = await getPennyListFiltered(days, nowMs, { includeNotes: false })
  const validItems = filterValidPennyItems(pennyItems)
  const feedUnavailable = validItems.length === 0

  // Summary metrics
  // - "New reports (24h)" should reflect actual submission freshness (dateAdded).
  // - "Items in view" should reflect the selected window (already applied at DB level).
  const windowLabel = formatWindowLabel(days)
  const windowTotal = validItems.length
  const newReportsLast24h = validItems.reduce((acc, item) => {
    const timestamp = new Date(item.dateAdded).getTime()
    if (Number.isNaN(timestamp)) return acc
    const diff = nowMs - timestamp
    if (diff >= 0 && diff <= 24 * 60 * 60 * 1000) return acc + 1
    return acc
  }, 0)
  const windowLabelSuffix = windowLabel.toLowerCase() === "all time" ? "" : ` (${windowLabel})`
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
  // Compute initial page slice from URL params (so reloads/bookmarks show the correct results)
  const { items: filteredItems, total: initialTotal } = queryPennyItems(
    validItems,
    // Date filtering is already done at DB level via getPennyListFiltered(days).
    { state, photo, q, sort, days: "all" },
    nowMs
  )
  const pageCount = Math.max(1, Math.ceil(initialTotal / perPage))
  const clampedPage = Math.min(Math.max(requestedPage, 1), pageCount)
  const startIndex = (clampedPage - 1) * perPage
  const initialSlice = filteredItems.slice(startIndex, startIndex + perPage)

  // Compute hot items (Very Common in last 14 days)
  const hotItems = getHotItems(validItems, 14, 6, nowMs)

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
      {/* ItemList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Home Depot Penny List",
            description:
              "Live community-reported penny finds at Home Depot, filtered by state, recency, and report strength.",
            itemListOrder: "https://schema.org/ItemListOrderDescending",
            numberOfItems: windowTotal,
            url: "https://www.pennycentral.com/penny-list",
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
      <RouteAdSlots pathname="/penny-list" />
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
            Home Depot Penny Items List (Live $0.01 Finds)
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Community-submitted reports of items currently scanning at $0.01 at Home Depot stores
            nationwide. Filter by your state, sort by recency or report strength, and build a
            shortlist before your next store run. Each entry includes the SKU, department, and how
            many independent hunters have confirmed it.
          </p>
          <p className="mt-3 text-sm text-[var(--text-muted)] max-w-2xl mx-auto">
            This is a live lead board — not a guaranteed checkout list. Always verify in-store
            before purchasing.{" "}
            <a
              href="/guide"
              className="text-[var(--link-default)] hover:text-[var(--link-hover)] underline underline-offset-4"
            >
              New to penny shopping? Start with the guide.
            </a>
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
                  {newReportsLast24h} new reports (24h)
                </span>
                <span className="pill pill-muted">
                  Items in view{windowLabelSuffix}: {windowTotal}
                </span>
              </p>
              <p className="text-xs text-[var(--text-muted)]">{lastUpdatedLabel}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <span className="pill pill-strong">
                SKUs with 2+ reports{windowLabelSuffix}: {reportCounts.multipleReports}
              </span>
              <span className="pill pill-muted">
                SKUs with 1 report{windowLabelSuffix}: {reportCounts.singleReport}
              </span>
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
            initialItems={initialSlice}
            initialTotal={initialTotal}
            hotItems={hotItems}
            initialSearchParams={resolvedSearchParams}
          />

          <section
            aria-labelledby="penny-list-methodology"
            className="mt-12 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 sm:p-6"
          >
            <h2
              id="penny-list-methodology"
              className="text-2xl font-semibold text-[var(--text-primary)]"
            >
              How to use this list effectively
            </h2>
            <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
              This page is a live lead board, not a guaranteed checkout board. Reports are
              community-submitted and time-sensitive, which means the value comes from signal
              interpretation and execution discipline. Use this list to prioritize where to look and
              what to verify first, then validate each item in-store with UPC-based checks. The best
              outcomes come from consistent process, not one-off luck.
            </p>
            <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
              Start by filtering to your state and the most recent window that still gives you
              enough volume. If you only have one store run planned, bias toward newer and
              higher-confidence signals. If you are doing recon across multiple stores, widen the
              range to capture trend continuity. Items with multiple independent reports are
              generally stronger candidates than one-off submissions, but verification at your
              specific store is still required.
            </p>
            <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
              Before leaving home, build a short route plan instead of a long wish list. Pick the
              top candidates, then open the operational guide sections that match your next
              decisions: clearance lifecycle interpretation, pre-hunt targeting, and checkout
              verification. Treat this page and the guide as one system. The list gives you target
              density, while the guide gives you decision quality.
            </p>
            <div className="mt-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                Practical workflow for each store run
              </h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[var(--text-secondary)]">
                <li>
                  Filter by your state, then sort by recency or report strength based on your time
                  budget.
                </li>
                <li>
                  Build a focused shortlist and verify each candidate with in-store scans, not shelf
                  assumptions.
                </li>
                <li>
                  Log what you observe, including misses, so future decisions improve for you and
                  for the community.
                </li>
                <li>
                  Submit confirmed findings through{" "}
                  <a
                    href="/report-find?src=penny-list-inline"
                    className="text-[var(--link-default)] hover:text-[var(--link-hover)] underline underline-offset-4"
                  >
                    Report a Find
                  </a>{" "}
                  to strengthen the live signal base.
                </li>
              </ul>
            </div>
            <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
              If you are new, read{" "}
              <a
                href="/guide"
                className="text-[var(--link-default)] hover:text-[var(--link-hover)] underline underline-offset-4"
              >
                the full guide
              </a>{" "}
              before making decisions from this page alone. If you already know the basics, use this
              list as your live targeting interface and return to the guide only when signals
              conflict or checkout behavior is unclear.
            </p>
          </section>
        </div>
      </section>
    </div>
  )
}
