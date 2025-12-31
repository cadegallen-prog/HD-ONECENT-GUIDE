import Link from "next/link"
import { PennyThumbnail } from "./penny-thumbnail"
import type { PennyItem } from "@/lib/fetch-penny-data"
import { formatRelativeDate } from "@/lib/penny-list-utils"

interface TodaysFindsProps {
  items: PennyItem[]
}

export function TodaysFinds({ items }: TodaysFindsProps) {
  if (!items || items.length === 0) return null

  return (
    <section className="section-padding px-4 sm:px-6 bg-[var(--bg-elevated)]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] mb-4">
          Today's Finds
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 md:overflow-visible">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-lg bg-[var(--bg-card)] shadow p-4 flex flex-col items-center min-w-[240px] snap-start md:min-w-0"
            >
              <div className="mb-2">
                <PennyThumbnail src={item.imageUrl} alt={item.name} size={72} />
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] text-center mb-1 line-clamp-2">
                {item.name}
              </h3>
              <div className="flex flex-wrap gap-1 justify-center mb-1">
                {Object.keys(item.locations).map((state) => (
                  <span
                    key={state}
                    className="badge bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-0.5 rounded text-xs"
                  >
                    {state}
                  </span>
                ))}
              </div>
              <span className="text-xs text-[var(--text-muted)] mb-2">
                {formatRelativeDate(item.dateAdded)}
              </span>
              <Link
                href={`/sku/${item.sku}`}
                className="btn-secondary text-xs px-3 py-1 rounded mt-auto"
              >
                View details
              </Link>
            </article>
          ))}
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
