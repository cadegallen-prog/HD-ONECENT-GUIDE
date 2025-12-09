import type { Metadata } from "next"
import Image from "next/image"
import { AlertTriangle, Calendar, Package } from "lucide-react"
import { SUBMIT_FIND_FORM_URL, NEWSLETTER_URL } from "@/lib/constants"
import { getPennyList, type PennyItem } from "@/lib/fetch-penny-data"
import { CopySkuButton } from "@/components/copy-sku-button"
import { TrackableLink } from "@/components/trackable-link"

export const metadata: Metadata = {
  title: "Crowd Reports: Penny Leads - Penny Central",
  description:
    "Unverified crowd-sourced reports of penny items at Home Depot stores. YMMV - always verify in store.",
}

export default async function PennyListPage() {
  const pennyItems = await getPennyList()

  const RECENT_WINDOW_DAYS = 30
  const HOT_WINDOW_DAYS = 14
  const today = new Date()

  const normalizeDate = (value: string) => {
    const parsed = new Date(`${value}T00:00:00Z`)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }

  const withMeta = (pennyItems as PennyItem[])
    .map((item) => {
      const parsedDate = normalizeDate(item.dateAdded)
      return {
        ...item,
        parsedDate,
        tier: item.tier ?? "Rare",
      }
    })
    .filter((item) => item.parsedDate)

  const isWithinDays = (date: Date, window: number) => {
    const diffMs = today.getTime() - date.getTime()
    const days = diffMs / (1000 * 60 * 60 * 24)
    return days >= 0 && days <= window
  }

  const recentItems = withMeta
    .filter((item) => item.parsedDate && isWithinDays(item.parsedDate, RECENT_WINDOW_DAYS))
    .sort((a, b) => b.parsedDate!.getTime() - a.parsedDate!.getTime())

  const hotItems = recentItems
    .filter(
      (item) =>
        item.tier === "Very Common" &&
        item.parsedDate &&
        isWithinDays(item.parsedDate, HOT_WINDOW_DAYS)
    )
    .slice(0, 6)

  const commonnessTone = (tier?: string) => {
    if (tier === "Very Common")
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
    if (tier === "Common")
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
    return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* Header Section */}
      <section className="section-padding px-4 sm:px-6 border-b border-[var(--border-default)] bg-[var(--bg-elevated)]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[var(--text-secondary)] text-sm font-medium mb-4">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-amber-500"
              aria-hidden="true"
            ></span>
            Crowd reports (last 30 days)
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
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
          {/* Hot Right Now */}
          {hotItems.length > 0 && (
            <div className="mb-10 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Hot Right Now</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Very Common finds reported in the last {HOT_WINDOW_DAYS} days. YMMV.
                  </p>
                </div>
                <span className="text-xs font-medium rounded-full px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                  Fresh signal
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotItems.map((item) => (
                  <div
                    key={`hot-${item.id}`}
                    className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`text-xs font-medium px-2 py-1 rounded-full ${commonnessTone(item.tier)}`}
                      >
                        {item.tier}
                      </div>
                      <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.dateAdded}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-2">
                      {item.name}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">
                      SKU: {item.sku}
                    </div>
                    {item.locations && Object.keys(item.locations).length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {Object.entries(item.locations).map(([state, count]) => (
                          <span
                            key={`${item.id}-${state}`}
                            className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[var(--text-secondary)] text-xs"
                          >
                            {state} ({count})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer Card */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-semibold mb-2">Please Read:</p>
              <p className="mb-2">
                This page shows crowd-sourced reports from PennyCentral users. Submissions are added
                automatically and are not vetted or guaranteed.
              </p>
              <ul className="list-disc pl-4 space-y-1 mb-2">
                <li>Prices and availability are YMMV.</li>
                <li>Items may be mistyped, mis-scanned, or already pulled from the shelf.</li>
                <li>
                  Always double-check in store and use the Facebook group for proof-of-purchase
                  posts and discussion.
                </li>
              </ul>
              <p>
                The Facebook group remains the gold standard for verified hauls, receipts, and
                conversation. This list is a fast, experimental radar for possible leads.
              </p>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.length === 0 && (
              <div className="col-span-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 text-[var(--text-secondary)]">
                No penny reports in the last {RECENT_WINDOW_DAYS} days. Check back soon or submit a
                find!
              </div>
            )}
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
              >
                {/* Image Placeholder */}
                <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 relative">
                  <Image
                    src={item.imageUrl || "/images/placeholder-product.jpg"}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.status && item.status !== item.tier && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {item.status}
                        </span>
                      )}
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${commonnessTone(item.tier)}`}
                      >
                        {item.tier}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.dateAdded}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-1 line-clamp-2">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4 font-mono bg-zinc-100 dark:bg-zinc-800/50 px-2 py-1 rounded w-fit">
                    <span className="select-all">SKU: {item.sku}</span>
                    <CopySkuButton sku={item.sku} />
                  </div>

                  {/* Quantity Found Badge */}
                  {item.quantityFound && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-3">
                      <Package className="w-3.5 h-3.5" />
                      <span>{item.quantityFound}</span>
                    </div>
                  )}

                  <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-3">{item.notes}</p>

                  {/* Location Data */}
                  {"locations" in item &&
                    item.locations &&
                    Object.keys(item.locations).length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                          Found in:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(item.locations as unknown as Record<string, number>).map(
                            ([state, count]) => (
                              <span
                                key={state}
                                className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[var(--text-secondary)] text-xs font-medium"
                              >
                                {state} ({count})
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  <div className="pt-4 border-t border-[var(--border-default)] flex items-center justify-between">
                    <span className="text-xs text-[var(--text-muted)]">Unverified report</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                      $0.01
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* About This List */}
          <div className="mt-12 mb-12 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              How This List Works
            </h2>
            <div className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-2">
              <p>Members submit penny finds through the Report a Find form on PennyCentral.</p>
              <p>Submissions are added to this page automatically, usually within about an hour.</p>
              <p>
                <strong>No admin reviews each entry before it appears here.</strong>
              </p>
              <p>
                Use the Facebook group to look for haul posts, photos, and real-time feedback on
                these SKUs.
              </p>
              <p>
                Think of this as a <strong>lead board</strong>, not a guarantee board.
              </p>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            {/* Submit a Find */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                Found a Penny Item?
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Help the community by reporting your finds. Your submission will appear on this list
                automatically.
              </p>
              <a
                href={SUBMIT_FIND_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[var(--cta-primary)] text-white font-medium hover:opacity-90 transition-opacity"
              >
                Submit a Find
              </a>
            </div>

            {/* Newsletter */}
            <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                Get Penny Alerts
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Don't miss out. Get the weekly list of confirmed penny items delivered to your
                inbox.
              </p>
              <TrackableLink
                href={NEWSLETTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                eventName="newsletter_click"
                eventParams={{ location: "penny-list" }}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-lg bg-[var(--text-primary)] text-[var(--bg-page)] font-medium hover:opacity-90 transition-opacity"
              >
                Subscribe to Alerts
              </TrackableLink>
              <p className="text-xs text-[var(--text-muted)] mt-3">
                We respect your inbox. No spam, ever.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
