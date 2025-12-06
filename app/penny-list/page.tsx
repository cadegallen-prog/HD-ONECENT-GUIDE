import type { Metadata } from "next"
import { AlertTriangle, Calendar, Package } from "lucide-react"
import pennyItems from "@/data/penny-list.json"
import { SUBMIT_FIND_FORM_URL, NEWSLETTER_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Potential Penny List - Penny Central",
  description:
    "A curated list of items that have recently dropped to $0.01 at Home Depot stores nationwide.",
}

export default function PennyListPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      {/* Header Section */}
      <section className="section-padding px-4 sm:px-6 border-b border-[var(--border-default)] bg-[var(--bg-elevated)]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Updated Weekly
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Potential Penny List
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Items that have been confirmed as $0.01 in multiple regions. Remember:{" "}
            <strong>YMMV (Your Mileage May Vary)</strong>. Not every store marks down at the same
            time.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding px-4 sm:px-6">
        <div className="container-wide">
          {/* Disclaimer Card */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-semibold mb-1">Please Read Before Hunting:</p>
              <p>
                These items were found for a penny by other members.
                <strong>Do not ask employees to check prices or look for these items.</strong>
                Use the Home Depot app to check the SKU, but remember the app price often shows full
                price even if it scans for $0.01 in-store.
              </p>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pennyItems.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image Placeholder */}
                <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[var(--text-muted)]">
                  {/* In a real app, use next/image here */}
                  <span className="text-sm">Product Image</span>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.status === "Nationwide"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {item.status}
                    </span>
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
                  </div>

                  {/* Quantity Found Badge */}
                  {item.quantityFound && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 mb-3">
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
                                className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium"
                              >
                                {state} ({count})
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  <div className="pt-4 border-t border-[var(--border-default)] flex items-center justify-between">
                    <span className="text-xs text-[var(--text-muted)]">Verified by Community</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                      $0.01
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* About This List */}
          <div className="mb-12 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              How This List Works
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              This is a <strong>community-verified list</strong> of items that members have found
              for $0.01 at Home Depot stores. New items are reviewed and added weekly based on
              community submissions. Each item shows the quantity found and locations reported to
              help you hunt smarter. <strong>YMMV (Your Mileage May Vary)</strong> — just because it
              was found at one store doesn't mean yours has it, but it's a strong signal to check.
            </p>
          </div>

          {/* Call to Action Section */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            {/* Submit a Find */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                Found a Penny Item?
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Help the community by reporting your finds. We verify all submissions before
                posting.
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
            <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-[var(--border-default)] rounded-xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                Get Penny Alerts
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                Don't miss out. Get the weekly list of confirmed penny items delivered to your
                inbox.
              </p>
              <a
                href={NEWSLETTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-lg bg-[var(--text-primary)] text-[var(--bg-page)] font-medium hover:opacity-90 transition-opacity"
              >
                Subscribe to Alerts
              </a>
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
