import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { getPennyListFiltered } from "@/lib/fetch-penny-data"
import { filterValidPennyItems, formatRelativeDate } from "@/lib/penny-list-utils"
import { normalizeStateParam } from "@/lib/states"
import { RouteAdSlots } from "@/components/ads/route-ad-slots"

type PageParams = {
  params: Promise<{ state: string }>
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { state } = await params
  const stateInfo = normalizeStateParam(state)
  if (!stateInfo) return {}

  const title = `Home Depot Penny Items in ${stateInfo.name} | Penny Central`
  const description = `See the latest community-reported Home Depot penny finds in ${stateInfo.name}. Filtered list, recent drops, and tips to hunt smarter.`

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `https://www.pennycentral.com/pennies/${stateInfo.slug}`,
    },
    alternates: {
      canonical: `https://www.pennycentral.com/pennies/${stateInfo.slug}`,
    },
  }
}

export default async function StatePennyPage({ params }: PageParams) {
  const { state } = await params
  const stateInfo = normalizeStateParam(state)
  if (!stateInfo) notFound()

  // Use a 6m window for freshness while keeping the Supabase pull smaller
  const items = await getPennyListFiltered("6m")
  const valid = filterValidPennyItems(items)
  const stateItems = valid.filter((item) => item.locations[stateInfo.code] !== undefined)
  const total = stateItems.length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <RouteAdSlots pathname={`/pennies/${stateInfo.slug}`} />
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          State Spotlight
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mt-2">
          {total} {total === 1 ? "find" : "finds"} in {stateInfo.name} (last 6 months)
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] mt-3">
          Community-reported penny items filtered to {stateInfo.code}. Data refreshes hourly.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/penny-list?state=${stateInfo.code}`}
            className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg"
          >
            View full penny list for {stateInfo.code}
          </Link>
          <Link
            href="/report-find"
            className="btn-secondary inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg border-2 border-[var(--border-default)]"
          >
            Report a new find
          </Link>
        </div>
      </div>

      {stateItems.length === 0 ? (
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg p-6 text-center">
          <p className="text-base text-[var(--text-secondary)]">
            No recent penny finds reported in {stateInfo.name}. Check back soon or browse the full
            list.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stateItems.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-4 shadow-sm flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-semibold text-[var(--text-primary)] leading-snug line-clamp-2">
                  {item.name}
                </h2>
                <span className="text-xs font-semibold text-[var(--cta-primary)]">
                  {stateInfo.code}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-3">{item.notes}</p>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>{formatRelativeDate(item.dateAdded)}</span>
                <span className="font-semibold">{item.sku}</span>
              </div>
              <Link
                href={`/sku/${item.sku}`}
                className="mt-auto inline-flex items-center justify-center text-sm font-semibold text-[var(--link-default)] hover:text-[var(--link-hover)] underline"
              >
                View SKU details
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
