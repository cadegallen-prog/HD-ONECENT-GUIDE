import { MetadataRoute } from "next"

/**
 * Sitemap Strategy: Pillar-Only Indexing
 *
 * This sitemap intentionally excludes dynamic pages (/sku/*, /pennies/*) to maintain
 * a high-quality indexed:unindexed ratio for ad network approval (AdSense, Monumetric, etc.).
 *
 * Dynamic pages are still accessible to users but are noindexed via their metadata.
 * This prevents Google from flagging the site as "low value content" due to thin
 * programmatic pages while preserving the full user experience.
 *
 * Traffic is primarily social/direct, so this has zero impact on visitor numbers.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.pennycentral.com"
  const currentDate = new Date().toISOString()

  return [
    // Home page - Highest priority
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },

    // Core Tools - Very High Priority
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
    {
      url: `${baseUrl}/store-finder`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },

    // Educational Content - High Priority
    {
      url: `${baseUrl}/clearance-lifecycle`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/facts-vs-myths`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/what-are-pennies`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/digital-pre-hunt`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/in-store-strategy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/inside-scoop`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    // Supporting Pages - Medium Priority
    {
      url: `${baseUrl}/report-find`,
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
    {
      url: `${baseUrl}/cashback`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },

    // Trust & Legal Pages - Lower Priority but important for E-E-A-T
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/support`,
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
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
