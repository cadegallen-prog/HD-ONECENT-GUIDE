#!/usr/bin/env node
const fs = require("fs")
const path = require("path")

const dataPath = path.resolve(__dirname, "../data/penny-list.json")
if (!fs.existsSync(dataPath)) {
  console.error("penny-list.json not found")
  process.exit(1)
}

const list = JSON.parse(fs.readFileSync(dataPath, "utf8"))

const skuStats = list.map((item) => {
  const locations = item.locations || {}
  const totalReports = Object.values(locations).reduce((s, v) => s + (Number(v) || 0), 0)
  return { sku: item.sku, name: item.name, totalReports, stateCount: Object.keys(locations).length }
})

skuStats.sort((a, b) => b.totalReports - a.totalReports || b.stateCount - a.stateCount)

console.log("Top SKUs (by reports)")
console.table(skuStats.slice(0, 20))

const stateCounts = {}
list.forEach((item) => {
  const locations = item.locations || {}
  Object.entries(locations).forEach(([state, count]) => {
    stateCounts[state] = (stateCounts[state] || 0) + Number(count || 0)
  })
})

const stateEntries = Object.entries(stateCounts).map(([state, total]) => ({ state, total }))
stateEntries.sort((a, b) => b.total - a.total)

console.log("\nTop States (by total reports)")
console.table(stateEntries.slice(0, 40))
