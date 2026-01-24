import { MetadataRoute } from "next"
import { getPennyList } from "@/lib/fetch-penny-data"
import { filterValidPennyItems } from "@/lib/penny-list-utils"
import { STATES } from "@/lib/states"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.pennycentral.com"
  const now = Date.now()
  const currentDate = new Date(now).toISOString()
  const RECENT_WINDOW_MS = 45 * 24 * 60 * 60 * 1000 // 45 days keeps the sitemap focused on fresh SKUs

  const isRecent = (dateStr: string | null | undefined): boolean => {
    if (!dateStr) return false
    const ts = new Date(dateStr).getTime()
    if (Number.isNaN(ts)) return false
    const diff = now - ts
    return diff >= 0 && diff <= RECENT_WINDOW_MS
  }

  // Get all SKUs for dynamic pages
  const communityItems = filterValidPennyItems(await getPennyList())

  // Only include SKUs seen recently to avoid bloating the sitemap with stale items
  const recentItems = communityItems.filter((item) => isRecent(item.lastSeenAt ?? item.dateAdded))

  const sitemapItems = recentItems.length > 0 ? recentItems : communityItems

  const allSkus = new Set(sitemapItems.map((item) => item.sku))

  const skuPages: MetadataRoute.Sitemap = Array.from(allSkus).map((sku) => ({
    url: `${baseUrl}/sku/${sku}`,
    lastModified:
      sitemapItems.find((item) => item.sku === sku)?.lastSeenAt ??
      sitemapItems.find((item) => item.sku === sku)?.dateAdded ??
      currentDate,
    changeFrequency: "daily",
    priority: 0.6,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    // Home page - Highest priority
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },

    // Core Tools - Very High Priority
    {
      url: `${baseUrl}/store-finder`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/penny-list`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },

    // Guide Pages - High Priority
    {
      url: `${baseUrl}/clearance-lifecycle`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/checkout-strategy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/responsible-hunting`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // SEO Landing Pages (Intent Match) - High Priority
    {
      url: `${baseUrl}/home-depot-penny-items`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/how-to-find-penny-items`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/home-depot-penny-list`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.85,
    },

    // Supporting Pages - Medium Priority
    {
      url: `${baseUrl}/report-find`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cashback`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/trip-tracker`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // About Page - Lower Priority
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  const statePages: MetadataRoute.Sitemap = STATES.map((state) => ({
    url: `${baseUrl}/pennies/${state.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.5,
  }))

  return [...staticPages, ...statePages, ...skuPages]
}
