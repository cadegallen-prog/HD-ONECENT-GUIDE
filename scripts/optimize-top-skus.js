#!/usr/bin/env node
/**
 * optimize-top-skus.js
 * 
 * Analyzes penny-list.json and generates SEO optimization recommendations
 * for the top 20 SKUs by report count.
 * 
 * Usage: node scripts/optimize-top-skus.js
 * Output: JSON report with enhanced titles, descriptions, and JSON-LD templates
 */

import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'data', 'penny-list.json')

if (!fs.existsSync(dataPath)) {
  console.error(`❌ penny-list.json not found at ${dataPath}`)
  process.exit(1)
}

const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
const items = Array.isArray(rawData) ? rawData : rawData.items || []

// Calculate metrics per SKU
const skuMetrics = {}
items.forEach((item) => {
  const locations = item.locations || {}
  const reportCount = Object.values(locations).reduce((sum, val) => sum + (val || 0), 0)
  const states = Object.keys(locations).filter((s) => locations[s] > 0)

  skuMetrics[item.sku] = {
    sku: item.sku,
    name: item.name,
    brand: item.brand,
    reportCount,
    states,
    stateCount: states.length,
    item,
  }
})

// Sort by reportCount, then stateCount
const topSkus = Object.values(skuMetrics)
  .sort((a, b) => {
    if (b.reportCount !== a.reportCount) {
      return b.reportCount - a.reportCount
    }
    return b.stateCount - a.stateCount
  })
  .slice(0, 20)

// Generate SEO optimization templates
const optimizations = topSkus.map((sku, idx) => ({
  rank: idx + 1,
  sku: sku.sku,
  name: sku.name,
  brand: sku.brand,
  demand: {
    reportCount: sku.reportCount,
    states: sku.states,
    stateCount: sku.stateCount,
  },
  recommendations: {
    metaTitle: `${sku.name} - Home Depot Penny Item SKU ${sku.sku} | Penny Central`,
    metaDescription: `Community-verified Home Depot penny find: ${sku.name} (SKU ${sku.sku}). ${sku.reportCount} reports from ${sku.stateCount} states (${sku.states.slice(0, 2).join(', ')}). Verify in store.`,
    ogTitle: `${sku.name} - Home Depot Penny Deal`,
    keywordTargets: [
      `${sku.name} penny`,
      `SKU ${sku.sku}`,
      `${sku.name} Home Depot`,
      `penny find ${sku.brand}`,
    ],
  },
  jsonLdEnhancements: {
    productSchema: {
      name: sku.name,
      sku: sku.sku,
      description: `Community-reported penny lead for ${sku.name}. ${sku.reportCount} verified reports.`,
      brand: sku.brand || "Various",
      offers: {
        price: "0.01",
        priceCurrency: "USD",
        availability: "InStoreOnly",
        url: `https://www.pennycentral.com/sku/${sku.sku}`,
      },
      aggregateRating: {
        ratingValue: 4.5,
        reviewCount: sku.reportCount,
      },
    },
    breadcrumb: [
      { position: 1, name: "Home", url: "https://www.pennycentral.com" },
      { position: 2, name: "Penny List", url: "https://www.pennycentral.com/penny-list" },
      { position: 3, name: sku.name, url: `https://www.pennycentral.com/sku/${sku.sku}` },
    ],
  },
}))

// Write optimization report
const reportPath = path.join(process.cwd(), 'reports', 'sku-optimization-top20.json')
const reportsDir = path.dirname(reportPath)
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true })
}

fs.writeFileSync(reportPath, JSON.stringify(optimizations, null, 2))

console.log(`\n✅ Optimization Report Generated`)
console.log(`📊 Top 20 SKUs by Demand:`)
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

optimizations.forEach((opt) => {
  console.log(
    `${String(opt.rank).padEnd(3)} | ${opt.sku.padEnd(15)} | ${opt.name.substring(0, 30).padEnd(30)} | ${opt.demand.reportCount} reports | ${opt.demand.stateCount} states`
  )
})

console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
console.log(`\n📝 Detailed report saved to: ${reportPath}`)
console.log(`\nNext steps:`)
console.log(`  1. Review optimization recommendations`)
console.log(`  2. Deploy enhanced metadata to production`)
console.log(`  3. Monitor Google Search Console for CTR lift`)
console.log(`  4. Target: 5% CTR increase on marked SKUs within 4 weeks\n`)
