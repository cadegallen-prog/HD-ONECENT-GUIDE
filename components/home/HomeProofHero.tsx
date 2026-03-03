import Link from "next/link"
import { ArrowRight, BookOpen, Clock3, MapPin, Users } from "lucide-react"
import { COMMUNITY_MEMBER_COUNT_DISPLAY } from "@/lib/constants"
import type { PennyItem } from "@/lib/fetch-penny-data"
import { PLACEHOLDER_IMAGE_URL, toThdImageVariant } from "@/lib/image-cache"
import { formatCurrency, formatRelativeDate, formatReportCount } from "@/lib/penny-list-utils"

function hasUsableName(item: PennyItem) {
  const name = item.name?.trim()
  return Boolean(name) && !/^SKU\s+\d+$/i.test(name)
}

function hasUsableImage(item: PennyItem) {
  const imageUrl = item.imageUrl?.trim()
  return Boolean(imageUrl) && imageUrl !== PLACEHOLDER_IMAGE_URL
}

function getRenderableItems(items: PennyItem[]) {
  return items.filter(hasUsableName)
}

function getStateCount(item: PennyItem) {
  return Object.keys(item.locations ?? {}).length
}

function getStateLabel(item: PennyItem) {
  const stateCount = getStateCount(item)
  if (stateCount <= 0) return "Location details on the SKU page"
  if (stateCount === 1) return "Seen in 1 state"
  return `Seen in ${stateCount} states`
}

function getQuantityLabel(item: PennyItem) {
  const quantity = Number(item.quantityFound)
  if (!Number.isFinite(quantity) || quantity <= 1) return null
  return `${quantity} reported`
}

export function HomeProofHero({ items }: { items: PennyItem[] }) {
  const renderableItems = getRenderableItems(items)
  const imageBackedItems = renderableItems.filter(hasUsableImage)
  const primaryItem = imageBackedItems[0] ?? renderableItems[0] ?? null
  const supportingItems = renderableItems
    .filter((item) => item.sku !== primaryItem?.sku)
    .slice(0, 2)

  const uniqueStateCount = new Set(
    renderableItems.flatMap((item) => Object.keys(item.locations ?? {}))
  ).size

  const heroStats =
    renderableItems.length > 0
      ? [
          {
            label: "Recent finds",
            value: formatReportCount(renderableItems.length),
            detail: "reported in the last 48 hours",
          },
          {
            label: "State coverage",
            value: formatReportCount(uniqueStateCount),
            detail: uniqueStateCount === 1 ? "state represented" : "states represented",
          },
          {
            label: "Freshest report",
            value: formatRelativeDate(
              renderableItems[0].lastSeenAt ?? renderableItems[0].dateAdded
            ),
            detail: "based on the newest list activity",
          },
        ]
      : [
          {
            label: "Community size",
            value: COMMUNITY_MEMBER_COUNT_DISPLAY,
            detail: "shoppers in the Home Depot One Cent Items group",
          },
          {
            label: "Primary utility",
            value: "Penny List",
            detail: "live reports, SKU pages, and state coverage",
          },
          {
            label: "Beginner path",
            value: "Guide",
            detail: "the step-by-step route for new hunters",
          },
        ]

  return (
    <section className="section-padding px-4 sm:px-6 bg-[var(--bg-page)]">
      <div className="container-wide">
        <div className="overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-card)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-start">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--bg-page)] px-3 py-1.5 text-sm font-semibold text-[var(--text-primary)]">
                <span className="live-dot" aria-hidden="true" />
                Live community proof
              </div>

              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-[3.6rem]">
                See live Home Depot penny finds before you make the trip.
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
                Penny Central turns recent community finds into a faster way to judge whether a trip
                is worth it, then gives beginners a clear path to learn how the markdown cycle
                works.
              </p>

              <dl className="mt-6 grid gap-3 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-page)] p-4"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                      {stat.label}
                    </dt>
                    <dd className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                      {stat.value}
                    </dd>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      {stat.detail}
                    </p>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/guide"
                  className="btn-primary inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[var(--cta-primary)] px-6 py-3 text-base font-semibold text-[var(--cta-text)]"
                >
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                  Learn how it works
                </Link>
                <Link
                  href="/penny-list"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[var(--border-strong)] bg-transparent px-6 py-3 text-base font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-page)]"
                >
                  Check the Penny List
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </div>

              <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                <Users
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--cta-primary)]"
                  aria-hidden="true"
                />
                Built from reports shared by shoppers in the {COMMUNITY_MEMBER_COUNT_DISPLAY} member
                Home Depot One Cent Items community.
              </p>
            </div>

            <div className="grid gap-4">
              <article className="overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--bg-page)] shadow-[var(--shadow-card)]">
                {primaryItem && hasUsableImage(primaryItem) ? (
                  <div className="aspect-[4/3] bg-[var(--bg-recessed)]">
                    <img
                      src={toThdImageVariant(primaryItem.imageUrl, 1000)}
                      alt={primaryItem.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="border-b border-[var(--border-default)] bg-[var(--bg-subtle)] px-5 py-4 sm:px-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                      Proof snapshot
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                      Live reports feed into SKU pages and the Penny List so the homepage can prove
                      value before it asks for trust.
                    </p>
                  </div>
                )}

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
                    <span className="pill pill-strong">$0.01 proof</span>
                    {primaryItem ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-4 w-4" aria-hidden="true" />
                        {formatRelativeDate(primaryItem.lastSeenAt ?? primaryItem.dateAdded)}
                      </span>
                    ) : null}
                  </div>

                  <h2 className="mt-4 text-2xl font-semibold leading-snug text-[var(--text-primary)]">
                    {primaryItem
                      ? primaryItem.name
                      : "Use the live list when you want proof, and the guide when you need context."}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                    {primaryItem
                      ? `${getStateLabel(primaryItem)}. Open the SKU page to see where it was spotted, how recent it is, and whether the retail price makes the trip worth it.`
                      : "The homepage now leads into the two routes that matter most: learn the system first, or jump straight into current community finds."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {primaryItem?.retailPrice ? (
                      <span className="pill pill-strong">
                        Was {formatCurrency(primaryItem.retailPrice)}
                      </span>
                    ) : null}
                    <span className="pill">
                      {primaryItem ? getStateLabel(primaryItem) : "Guide + Penny List"}
                    </span>
                    {primaryItem ? (
                      <span className="pill">
                        {getQuantityLabel(primaryItem) ?? "Open the SKU page for details"}
                      </span>
                    ) : (
                      <span className="pill">Built for first-time and returning hunters</span>
                    )}
                  </div>

                  <Link
                    href={primaryItem ? `/sku/${primaryItem.sku}` : "/penny-list"}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--link-default)] underline underline-offset-4"
                  >
                    {primaryItem ? "Open this SKU page" : "Open the live list"}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </article>

              <div className="grid gap-3 sm:grid-cols-2">
                {supportingItems.length > 0
                  ? supportingItems.map((item) => (
                      <Link
                        key={item.sku}
                        href={`/sku/${item.sku}`}
                        className="group flex gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-page)] p-4 transition-colors hover:bg-[var(--bg-subtle)]"
                      >
                        {hasUsableImage(item) ? (
                          <img
                            src={toThdImageVariant(item.imageUrl, 400)}
                            alt={item.name}
                            className="h-20 w-20 flex-shrink-0 rounded-xl bg-[var(--bg-recessed)] object-cover"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--bg-recessed)] text-[var(--text-muted)]">
                            <MapPin className="h-5 w-5" aria-hidden="true" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                            {formatRelativeDate(item.lastSeenAt ?? item.dateAdded)}
                          </p>
                          <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-[var(--text-primary)]">
                            {item.name}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                            {getStateLabel(item)}
                          </p>
                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--link-default)] underline underline-offset-4">
                            Open SKU page
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </span>
                        </div>
                      </Link>
                    ))
                  : [
                      {
                        icon: Clock3,
                        title: "Start with proof, not theory",
                        copy: "Use the live list when you need to know what shoppers are reporting right now.",
                      },
                      {
                        icon: BookOpen,
                        title: "Use the guide when you need the why",
                        copy: "The beginner path explains the clearance cycle, verification rules, and checkout reality.",
                      },
                    ].map((card) => (
                      <div
                        key={card.title}
                        className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-page)] p-4"
                      >
                        <card.icon
                          className="h-5 w-5 text-[var(--cta-primary)]"
                          aria-hidden="true"
                        />
                        <h3 className="mt-3 text-base font-semibold leading-snug text-[var(--text-primary)]">
                          {card.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                          {card.copy}
                        </p>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
