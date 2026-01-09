#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const dataPath = path.resolve(__dirname, '../data/penny-list.json')
const outPath = path.resolve(__dirname, '../data/seeded-hauls.json')

if (!fs.existsSync(dataPath)) {
  console.error('penny-list.json not found')
  process.exit(1)
}

const list = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

// Select top states
const stateCounts = {}
list.forEach((item) => {
  const locations = item.locations || {}
  Object.entries(locations).forEach(([state, count]) => {
    stateCounts[state] = (stateCounts[state] || 0) + Number(count || 0)
  })
})
const states = Object.entries(stateCounts).sort((a,b) => b[1]-a[1]).slice(0,5).map(s=>s[0])

const hauls = states.map((state)=>({
  state,
  finds: list.filter(i => (i.locations || {})[state]).slice(0,25).map(i => ({ sku: i.sku, name: i.name, notes: i.notes, imageUrl: i.imageUrl }))
}))

fs.writeFileSync(outPath, JSON.stringify(hauls, null, 2))
console.log(`Seeded hauls written to ${outPath}`)
