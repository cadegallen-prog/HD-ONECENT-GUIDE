import Link from "next/link"
import { PennyThumbnail } from "./penny-thumbnail"
import type { PennyItem } from "@/lib/fetch-penny-data"
import { formatRelativeDate } from "@/lib/penny-list-utils"
import { PLACEHOLDER_IMAGE_URL } from "@/lib/image-cache"

interface TodaysFindsProps {
  items: PennyItem[]
}

export function TodaysFinds({ items }: TodaysFindsProps) {
  const featured = (items ?? [])
    .filter((item) => {
      const name = item.name?.trim()
      if (!name) return false
      if (/^SKU\s+\d+$/.test(name)) return false

      const imageUrl = item.imageUrl?.trim()
      if (!imageUrl || imageUrl === PLACEHOLDER_IMAGE_URL) return false

      return true
    })
    .slice(0, 8)

  // Avoid showing a sparse/low-quality module (looks broken and undermines trust).
  if (featured.length < 2) return null

  return (
    <section className="section-padding px-4 sm:px-6 bg-[var(--bg-elevated)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-4">
          Today's Finds
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 md:overflow-visible">
          {featured.map((item) => {
            const states = Object.keys(item.locations ?? {})
            const visibleStates = states.slice(0, 3)
            const remainingStates = Math.max(0, states.length - visibleStates.length)

            return (
              <article
                key={item.id}
                className="rounded-xl bg-[var(--bg-card)] elevation-card p-4 flex flex-col items-center min-w-[240px] snap-start md:min-w-0 border border-[var(--border-default)]"
              >
                <div className="mb-2">
                  <PennyThumbnail src={item.imageUrl} alt={item.name} size={72} />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] text-center mb-1 line-clamp-2">
                  {item.name}
                </h3>
                <div className="flex flex-wrap gap-1 justify-center mb-1">
                  {visibleStates.map((state) => (
                    <span
                      key={state}
                      className="badge bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-0.5 rounded text-xs"
                    >
                      {state}
                    </span>
                  ))}
                  {remainingStates > 0 && (
                    <span className="badge bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-0.5 rounded text-xs">
                      +{remainingStates}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[var(--text-muted)] mb-2">
                  {formatRelativeDate(item.dateAdded)}
                </span>
                <Link
                  href={`/sku/${item.sku}`}
                  className="btn-secondary text-xs px-3 py-2 min-h-[44px] rounded mt-auto"
                >
                  View details
                </Link>
              </article>
            )
          })}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/penny-list"
            className="btn-primary inline-block px-6 py-2 rounded font-semibold"
          >
            See all penny finds &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
