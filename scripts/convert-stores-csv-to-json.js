#!/usr/bin/env node

import fs from "fs"
import path from "path"
import readline from "readline"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const csvPath = path.join(__dirname, "../data/stores/store_directory.master.csv")
const jsonPath = path.join(__dirname, "../data/home-depot-stores.json")

function parseCSVLine(line) {
  const result = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

const clean = (v) => {
  if (!v) return ""
  return v
    .toString()
    .replace(/[\u2013-\u2015]/g, "-")
    .replace(/[\u2018-\u201B]/g, "'")
    .replace(/[\u201C-\u201F]/g, '"')
    .replace(/[\u00A0\u2002\u2003\u2009\u200A\u202F]/g, " ")
    .replace(/\u2026/g, "...")
    .replace(/\s+/g, " ")
    .trim()
}

async function convertCSVToJSON() {
  const stores = []
  const headers = []
  let lineNum = 0

  const rl = readline.createInterface({
    input: fs.createReadStream(csvPath),
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    lineNum++

    if (lineNum === 1) {
      headers.push(...parseCSVLine(line))
      continue
    }

    try {
      const values = parseCSVLine(line)
      if (values.length < headers.length) {
        console.warn(
          `⚠️  Line ${lineNum}: Skipping malformed row (expected ${headers.length} columns, got ${values.length})`
        )
        continue
      }

      const row = {}
      for (let i = 0; i < headers.length; i++) {
        row[headers[i]] = values[i]
      }

      let hours = {}
      if (row.hours) {
        try {
          const hoursStr = row.hours.startsWith("{") ? row.hours : JSON.parse(row.hours)
          hours = typeof hoursStr === "string" ? JSON.parse(hoursStr) : hoursStr
        } catch {
          console.warn(
            `⚠️  Line ${lineNum} (Store #${row.store_number}): Could not parse hours JSON`
          )
          hours = {}
        }
      }

      const store = {
        id: clean(row.store_number),
        number: clean(row.store_number),
        name: clean(row.store_name) || "Home Depot",
        address: clean(row.address),
        city: clean(row.city),
        state: clean(row.state),
        zip: clean(row.zip),
        phone: clean(row.phone),
        lat: Number.parseFloat(row.latitude),
        lng: Number.parseFloat(row.longitude),
        hours,
        services: ["Home Improvement Store", "Hardware", "Retail"],
        hoursLastChangedAt: new Date().toISOString(),
        hoursFetchedAt: new Date().toISOString(),
      }

      if (!Number.isFinite(store.lat) || !Number.isFinite(store.lng)) {
        console.warn(
          `⚠️  Line ${lineNum} (Store #${row.store_number}): Invalid coordinates, skipping`
        )
        continue
      }

      stores.push(store)
    } catch (error) {
      console.error(`❌ Line ${lineNum}: Error processing row:`, error.message)
    }
  }

  const jsonContent = JSON.stringify(stores, null, 2)
  fs.writeFileSync(jsonPath, jsonContent, "utf-8")

  console.log(`✅ Converted ${stores.length} stores from CSV to JSON`)
  console.log(`📁 Written to: ${jsonPath}`)
  console.log(`📊 File size: ${(Buffer.byteLength(jsonContent) / 1024 / 1024).toFixed(2)} MB`)
  console.log(`⏱️  Timestamp: ${new Date().toISOString()}`)
}

convertCSVToJSON().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
