import Link from "next/link"
import { ArrowRight, Clock3, MapPin, Users } from "lucide-react"
import { COMMUNITY_MEMBER_COUNT_DISPLAY } from "@/lib/constants"
import type { PennyItem } from "@/lib/fetch-penny-data"
import { PLACEHOLDER_IMAGE_URL, toThdImageVariant } from "@/lib/image-cache"
import { formatCurrency, formatRelativeDate } from "@/lib/penny-list-utils"

function hasUsableName(item: PennyItem) {
  const name = item.name?.trim()
  return Boolean(name) && !/^SKU\s+\d+$/i.test(name)
}

function hasUsableImage(item: PennyItem) {
  const imageUrl = item.imageUrl?.trim()
  return Boolean(imageUrl) && imageUrl !== PLACEHOLDER_IMAGE_URL
}

function getStateLabel(item: PennyItem) {
  const stateCount = Object.keys(item.locations ?? {}).length
  if (stateCount <= 0) return "Location details on the SKU page"
  if (stateCount === 1) return "Seen in 1 state"
  return `Seen in ${stateCount} states`
}

export function HomeProofStrip({ items }: { items: PennyItem[] }) {
  const sourceItems = items.filter(hasUsableName).filter(hasUsableImage)
  const proofItems = sourceItems.length > 3 ? sourceItems.slice(1, 5) : sourceItems.slice(0, 4)

  if (proofItems.length < 2) return null

  return (
    <section className="px-4 pb-12 sm:px-6 sm:pb-16 bg-[var(--bg-page)]">
      <div className="container-wide">
        <div className="rounded-[28px] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-card)] sm:p-8">
          <div className="flex flex-col gap-4 border-b border-[var(--border-default)] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Recent proof from the list
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-[var(--text-primary)]">
                Real items reported by shoppers, organized into usable SKU pages.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-[var(--text-secondary)]">
                These cards pull from recent community finds with real product imagery, recent
                timing, and state coverage instead of generic homepage filler.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-1.5">
                <Users className="h-4 w-4 text-[var(--cta-primary)]" aria-hidden="true" />
                {COMMUNITY_MEMBER_COUNT_DISPLAY} member community
              </span>
              <Link
                href="/report-find"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-page)] px-4 py-2 font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-subtle)]"
              >
                Report a find
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {proofItems.map((item) => (
              <article
                key={item.sku}
                className="overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--bg-page)]"
              >
                <div className="aspect-[4/3] bg-[var(--bg-recessed)]">
                  <img
                    src={toThdImageVariant(item.imageUrl, 1000)}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                      {formatRelativeDate(item.lastSeenAt ?? item.dateAdded)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" aria-hidden="true" />
                      {getStateLabel(item)}
                    </span>
                  </div>

                  <h3 className="mt-3 line-clamp-3 text-lg font-semibold leading-snug text-[var(--text-primary)]">
                    {item.name}
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.retailPrice ? (
                      <span className="pill pill-strong">
                        Was {formatCurrency(item.retailPrice)}
                      </span>
                    ) : null}
                    <span className="pill">{item.sku}</span>
                  </div>

                  <Link
                    href={`/sku/${item.sku}`}
                    className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[var(--link-default)] underline underline-offset-4"
                  >
                    Open SKU page
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
