#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Path to existing verified-pennies.json
const existingPath = path.join(__dirname, "..", "data", "verified-pennies.json")

// Find the latest exported file (assuming it's in the project root)
const projectRoot = path.join(__dirname, "..")
const files = fs
  .readdirSync(projectRoot)
  .filter((f) => f.startsWith("verified_pennies_") && f.endsWith(".json"))

if (files.length === 0) {
  console.error("No exported verified_pennies_*.json file found in the project root.")
  console.error("Expected file format: verified_pennies_<timestamp>.json")
  process.exit(1)
}

// Sort by modification time, take the latest
files.sort(
  (a, b) =>
    fs.statSync(path.join(projectRoot, b)).mtime - fs.statSync(path.join(projectRoot, a)).mtime
)
const exportedPath = path.join(projectRoot, files[0])

console.log(`\n📦 Merging ${files[0]} into verified-pennies.json\n`)

// Read files
const existing = JSON.parse(fs.readFileSync(existingPath, "utf8"))
const exported = JSON.parse(fs.readFileSync(exportedPath, "utf8"))

// Validation: ensure exported data has correct structure
const exportedSkus = Object.keys(exported)
if (exportedSkus.length === 0) {
  console.error("❌ Exported file is empty. Aborting.")
  process.exit(1)
}

// Validate structure of first entry
const firstSku = exportedSkus[0]
const firstEntry = exported[firstSku]
if (!firstEntry.sku || !firstEntry.name || !firstEntry.imageUrl) {
  console.error("❌ Exported data has invalid structure. Expected: {sku, name, imageUrl, ...}")
  console.error("   Found:", firstEntry)
  process.exit(1)
}

// Create backup before modifying
fs.mkdirSync(path.join(__dirname, "..", "archive"), { recursive: true })
const backupPath = path.join(
  __dirname,
  "..",
  "archive",
  `verified-pennies.backup.${new Date().toISOString().replace(/:/g, "-")}.json`
)
fs.writeFileSync(backupPath, JSON.stringify(existing, null, 2))
console.log(`✅ Backup created: ${path.basename(backupPath)}`)

// Show what will be added/updated
const newSkus = exportedSkus.filter((sku) => !existing[sku])
const updatedSkus = exportedSkus.filter((sku) => existing[sku])

console.log(`\n📊 Changes:`)
console.log(`   New entries: ${newSkus.length}`)
console.log(`   Updated entries: ${updatedSkus.length}`)
console.log(`   Total in file after merge: ${Object.keys(existing).length + newSkus.length}`)

if (newSkus.length > 0) {
  console.log(`\n🆕 New SKUs:`)
  newSkus.slice(0, 10).forEach((sku) => {
    console.log(`   - ${sku}: ${exported[sku].name}`)
  })
  if (newSkus.length > 10) {
    console.log(`   ... and ${newSkus.length - 10} more`)
  }
}

if (updatedSkus.length > 0) {
  console.log(`\n🔄 Updated SKUs:`)
  updatedSkus.slice(0, 5).forEach((sku) => {
    console.log(`   - ${sku}: ${exported[sku].name}`)
  })
  if (updatedSkus.length > 5) {
    console.log(`   ... and ${updatedSkus.length - 5} more`)
  }
}

// Merge exported into existing (exported takes precedence)
Object.assign(existing, exported)

// Write merged data
fs.writeFileSync(existingPath, JSON.stringify(existing, null, 2))

console.log(`\n✅ Merge complete! ${exportedSkus.length} products merged successfully.`)
console.log(`\n💡 Next steps:`)
console.log(`   1. Review changes: git diff data/verified-pennies.json`)
console.log(`   2. Test the site: npm run dev`)
console.log(`   3. Delete exported file: rm ${files[0]}`)
console.log(`   4. Commit: git add data/verified-pennies.json && git commit -m "Add images for X pennies"`)
