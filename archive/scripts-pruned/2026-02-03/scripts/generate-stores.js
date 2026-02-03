const fs = require("fs")
const path = require("path")

const src = path.join(__dirname, "../data/stores/store_directory.master.json")
const dst = path.join(__dirname, "../data/home-depot-stores.json")

const clean = (v) => {
  if (!v) return ""
  return v
    .toString()
    .replace(/[\u2013\u2014\u2015]/g, "-")
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u00A0\u2002\u2003\u2009\u200A\u202F]/g, " ")
    .replace(/\u2026/g, "...")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
}

const raw = JSON.parse(fs.readFileSync(src, "utf8"))
const stores = raw
  .map((r) => ({
    id: clean(r.store_number || r.id || ""),
    number: clean(r.store_number || r.number || ""),
    name: clean(r.store_name || r.name || "Home Depot"),
    address: clean(r.address),
    city: clean(r.city),
    state: clean(r.state),
    zip: clean(r.zip),
    phone: clean(r.phone),
    lat: Number(r.latitude ?? r.lat),
    lng: Number(r.longitude ?? r.lng),
    hours: r.hours,
  }))
  .filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng))

fs.writeFileSync(dst, JSON.stringify(stores, null, 2), "utf8")
console.log(
  "wrote",
  stores.length,
  "stores",
  "sizeMB",
  (fs.statSync(dst).size / 1024 / 1024).toFixed(2)
)
