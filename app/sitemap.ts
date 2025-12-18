import { MetadataRoute } from "next"
import { getVerifiedPennies } from "@/lib/verified-pennies"
import { getPennyList } from "@/lib/fetch-penny-data"
import { filterValidPennyItems } from "@/lib/penny-list-utils"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.pennycentral.com"
  const currentDate = new Date().toISOString()

  // Get all SKUs for dynamic pages
  const verifiedItems = getVerifiedPennies()
  const communityItems = filterValidPennyItems(await getPennyList())

  const allSkus = new Set([
    ...verifiedItems.map((item) => item.sku),
    ...communityItems.map((item) => item.sku),
  ])

  const skuPages: MetadataRoute.Sitemap = Array.from(allSkus).map((sku) => ({
    url: `${baseUrl}/sku/${sku}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
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
      url: `${baseUrl}/verified-pennies`,
      lastModified: currentDate,
      changeFrequency: "weekly",
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

    // Supporting Pages - Medium Priority
    {
      url: `${baseUrl}/report-find`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources`,
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

    // About Page - Lower Priority
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ]

  return [...staticPages, ...skuPages]
}
