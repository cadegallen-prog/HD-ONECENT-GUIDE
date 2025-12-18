import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { MapPin, Calendar, BadgeCheck, ExternalLink, ShoppingBag } from "lucide-react"
import { getPennyList } from "@/lib/fetch-penny-data"
import { filterValidPennyItems, formatRelativeDate } from "@/lib/penny-list-utils"
import { validateSku } from "@/lib/sku"
import { getVerifiedPennyBySku, getVerifiedPennies } from "@/lib/verified-pennies"
import { getHomeDepotProductUrl } from "@/lib/home-depot"
import { getLatestDateFromArray, getDateCount, getFreshness } from "@/lib/freshness-utils"
import { ogImageUrl } from "@/lib/og"

type PageProps = {
  params: Promise<{ sku: string }>
}

export async function generateStaticParams() {
  const verifiedItems = getVerifiedPennies()
  const communityItems = filterValidPennyItems(await getPennyList())

  // Combine all unique SKUs
  const allSkus = new Set([
    ...verifiedItems.map((item) => item.sku),
    ...communityItems.map((item) => item.sku),
  ])

  return Array.from(allSkus).map((sku) => ({
    sku,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sku: rawSku } = await params
  const skuCheck = validateSku(rawSku)
  if (skuCheck.error) return { title: "Invalid SKU" }

  const sku = skuCheck.normalized
  const verifiedItem = getVerifiedPennyBySku(sku)
  const communityItems = filterValidPennyItems(await getPennyList())
  const communityItem = communityItems.find((i) => i.sku === sku)

  const name = verifiedItem?.name || communityItem?.name || `SKU ${sku}`
  const description = verifiedItem
    ? `Verified Home Depot penny item: ${name}. SKU ${sku}. See photos and verification details.`
    : `Community-reported Home Depot penny lead for ${name}. SKU ${sku}. Verify in store — YMMV.`

  return {
    title: `${name} - Home Depot Penny Item SKU ${sku} | Penny Central`,
    description,
    openGraph: {
      title: `${name} - Home Depot Penny Item`,
      description,
      images: [ogImageUrl(name)],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl(name)],
    },
  }
}

export default async function SkuDetailPage({ params }: PageProps) {
  const { sku: rawSku } = await params
  const skuCheck = validateSku(rawSku)
  if (skuCheck.error) notFound()

  const sku = skuCheck.normalized
  const verifiedItem = getVerifiedPennyBySku(sku)
  const communityItems = filterValidPennyItems(await getPennyList())
  const communityItem = communityItems.find((i) => i.sku === sku)

  if (!verifiedItem && !communityItem) notFound()

  // Merge data
  const name = verifiedItem?.name || communityItem?.name || "Unknown Item"
  const imageUrl = verifiedItem?.imageUrl || communityItem?.imageUrl
  const brand = verifiedItem?.brand
  const model = verifiedItem?.model
  const internetNumber = verifiedItem?.internetNumber

  const homeDepotUrl = getHomeDepotProductUrl({
    sku,
    internetNumber,
  })

  const totalReports = communityItem?.locations
    ? Object.values(communityItem.locations).reduce((sum, count) => sum + count, 0)
    : 0

  const latestDate = verifiedItem ? getLatestDateFromArray(verifiedItem.purchaseDates) : null
  const purchaseCount = verifiedItem ? getDateCount(verifiedItem.purchaseDates) : 0
  const freshness = latestDate ? getFreshness(latestDate) : null

  const freshnessColorClass = {
    fresh: "pill pill-success",
    moderate: "pill pill-accent",
    old: "pill pill-strong",
  }[freshness || "old"]

  // Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: name,
    image: imageUrl,
    description: verifiedItem
      ? `Verified Home Depot penny item: ${name}.`
      : `Community-reported Home Depot penny lead for ${name}.`,
    sku: sku,
    brand: {
      "@type": "Brand",
      name: brand || "Home Depot",
    },
    offers: {
      "@type": "Offer",
      url: homeDepotUrl,
      priceCurrency: "USD",
      price: "0.01",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStoreOnly",
    },
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] section-padding px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-wide max-w-4xl mx-auto">
        <nav className="mb-6">
          <Link
            href="/verified-pennies"
            className="text-sm text-[var(--cta-primary)] hover:underline inline-flex items-center gap-1"
          >
            ← Back to Browse
          </Link>
        </nav>

        <div className="bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-[var(--bg-muted)] aspect-square relative flex items-center justify-center p-8">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="max-w-full max-h-full object-contain drop-shadow-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-[var(--text-muted)] flex flex-col items-center gap-2">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <span>No image available</span>
                </div>
              )}

              {verifiedItem && (
                <div className="absolute top-4 left-4">
                  <span className="pill pill-success flex items-center gap-1.5 shadow-sm">
                    <BadgeCheck className="w-4 h-4" />
                    Verified Penny
                  </span>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col">
              <div className="flex-1">
                {brand && (
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-2 block">
                    {brand}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] leading-tight mb-4">
                  {name}
                </h1>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">
                      SKU
                    </span>
                    <span className="font-mono text-lg text-[var(--text-primary)]">{sku}</span>
                  </div>
                  {model && (
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">
                        Model
                      </span>
                      <span className="text-[var(--text-primary)]">{model}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  {latestDate && (
                    <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                      <div className={`p-2 rounded-lg ${freshnessColorClass} bg-opacity-10`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[var(--text-muted)]">
                          Last Verified
                        </p>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {formatRelativeDate(latestDate)}
                          {purchaseCount > 1 && (
                            <span className="ml-1 text-[var(--text-muted)] font-normal">
                              ({purchaseCount}× found)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {totalReports > 0 && (
                    <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                      <div className="p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)]">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[var(--text-muted)]">
                          Community Reports
                        </p>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {totalReports} sightings in{" "}
                          {communityItem?.locations
                            ? Object.keys(communityItem.locations).length
                            : 0}{" "}
                          states
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border-default)] flex flex-col gap-3">
                <a
                  href={homeDepotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform"
                >
                  View on Home Depot
                  <ExternalLink className="w-5 h-5" />
                </a>
                <p className="text-[10px] text-center text-[var(--text-muted)] px-4">
                  Prices and availability vary by store. Penny items are often removed from shelves
                  once they hit $0.01.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Community Details */}
        {communityItem?.locations && Object.keys(communityItem.locations).length > 0 && (
          <div className="mt-8 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--cta-primary)]" />
              Where it was found
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {Object.entries(communityItem.locations)
                .sort(([, a], [, b]) => b - a)
                .map(([state, count]) => (
                  <div
                    key={state}
                    className="flex flex-col p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-default)]"
                  >
                    <span className="text-xs font-bold text-[var(--text-muted)] mb-1">{state}</span>
                    <span className="text-lg font-bold text-[var(--text-primary)]">
                      {count}{" "}
                      <span className="text-xs font-normal text-[var(--text-muted)]">reports</span>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Educational Footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/guide"
            className="p-6 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-default)] hover:border-[var(--cta-primary)] transition-colors group"
          >
            <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--cta-primary)] transition-colors">
              New to Penny Hunting?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Read our complete guide on how to find these items in the wild.
            </p>
          </Link>
          <Link
            href="/report-find"
            className="p-6 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-default)] hover:border-[var(--cta-primary)] transition-colors group"
          >
            <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--cta-primary)] transition-colors">
              Found this item?
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Help the community by reporting your find and keeping the list fresh.
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
