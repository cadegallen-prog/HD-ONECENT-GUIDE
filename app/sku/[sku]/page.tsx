import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, Calendar } from "lucide-react"
import { getPennyList } from "@/lib/fetch-penny-data"
import { filterValidPennyItems, formatRelativeDate } from "@/lib/penny-list-utils"
import { validateSku } from "@/lib/sku"

type PageProps = {
  params: Promise<{ sku: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sku } = await params
  return {
    title: `SKU ${sku} - Penny List - PennyCentral`,
    description: `Community-reported penny lead for SKU ${sku}. Verify in store — YMMV.`,
  }
}

export default async function SkuDetailPage({ params }: PageProps) {
  const { sku: rawSku } = await params
  const skuCheck = validateSku(rawSku)
  if (skuCheck.error) notFound()

  const items = filterValidPennyItems(await getPennyList())
  const item = items.find((i) => i.sku === skuCheck.normalized)
  if (!item) notFound()

  const totalReports = item.locations
    ? Object.values(item.locations).reduce((sum, count) => sum + count, 0)
    : 0

  return (
    <div className="min-h-screen bg-[var(--bg-page)] section-padding px-4 sm:px-6">
      <div className="container-wide max-w-3xl">
        <Link href="/penny-list" className="text-sm text-[var(--cta-primary)] hover:underline">
          ← Back to Penny List
        </Link>

        <div className="mt-4 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                width={160}
                height={160}
                className="rounded-xl object-cover border border-[var(--border-default)] bg-[var(--bg-elevated)]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-40 h-40 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-default)]" />
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-snug">
                {item.name}
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)] font-mono">SKU {item.sku}</p>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  Last reported {formatRelativeDate(item.dateAdded)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  {totalReports} {totalReports === 1 ? "report" : "reports"} across{" "}
                  {item.locations ? Object.keys(item.locations).length : 0}{" "}
                  {item.locations && Object.keys(item.locations).length === 1 ? "state" : "states"}
                </span>
              </div>
            </div>
          </div>

          {item.locations && Object.keys(item.locations).length > 0 && (
            <div className="mt-6 pt-6 border-t border-[var(--border-default)]">
              <h2 className="text-base font-semibold text-[var(--text-primary)] mb-3">
                Reported in
              </h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(item.locations)
                  .sort(([, a], [, b]) => b - a)
                  .map(([state, count]) => (
                    <span
                      key={state}
                      className="px-3 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] text-sm font-semibold text-[var(--text-primary)]"
                    >
                      {state} × {count}
                    </span>
                  ))}
              </div>
            </div>
          )}

          <div className="mt-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] p-4 text-sm text-[var(--text-secondary)]">
            Community-reported lead. Verify in store — YMMV.
          </div>
        </div>
      </div>
    </div>
  )
}
