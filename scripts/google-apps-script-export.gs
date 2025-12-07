/**
 * Google Apps Script: Export approved sheet rows to JSON file in Drive
 * Steps:
 * 1) Open the Google Sheet -> Extensions -> Apps Script
 * 2) Copy/paste this script and run `exportApprovedToJSON()` once to create a file.
 * 3) Optionally, set a time-driven trigger to auto-run daily.
 */

function exportApprovedToJSON() {
  const SHEET_NAME = "Form Responses 1" // adjust if your form has a different name
  const APPROVED_COL = "Approved"
  const TIER_COL = "Tier"
  const TODAY = new Date()
  const WINDOW_DAYS = 30

  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(SHEET_NAME)
  if (!sheet) throw new Error("Sheet not found: " + SHEET_NAME)

  const dataRange = sheet.getDataRange()
  const values = dataRange.getValues()
  const headers = values.shift()

  const rows = values.map((r) => {
    const obj = {}
    headers.forEach((h, i) => {
      obj[h] = r[i]
    })
    return obj
  })

  const approvedRows = rows.filter((row) => row[APPROVED_COL] === true)
  const recentRows = approvedRows.filter((row) => {
    const dateApproved = row["Date Approved"] || row["Date Found"] || new Date()
    const parsed = new Date(dateApproved)
    return (TODAY - parsed) / (1000 * 60 * 60 * 24) <= WINDOW_DAYS
  })

  // aggregate by SKU
  const grouped = {}
  recentRows.forEach((r) => {
    const sku = r["SKU"]
    if (!sku) return
    if (!grouped[sku]) {
      grouped[sku] = {
        id: sku,
        name: r["Item Name"] || "",
        sku: sku,
        price: 0.01,
        dateAdded: r["Date Found"] || "",
        tier: r[TIER_COL] || "Rare",
        status: r["Status"] || "",
        quantityFound: r["Quantity Seen"] || "",
        imageUrl: r["Photo Proof"] || "/images/placeholder-product.jpg",
        notes: r["Notes"] || "",
        locations: {},
      }
    }
    const s = (r["State"] || "").toString().toUpperCase()
    if (s) grouped[sku].locations[s] = (grouped[sku].locations[s] || 0) + 1

    // pick max tier (Very Common > Common > Rare)
    const order = { Rare: 1, Common: 2, "Very Common": 3 }
    if (order[r[TIER_COL]] > order[grouped[sku].tier]) grouped[sku].tier = r[TIER_COL]

    // latest date
    if (!grouped[sku].dateAdded || grouped[sku].dateAdded < (r["Date Found"] || "")) {
      grouped[sku].dateAdded = r["Date Found"] || grouped[sku].dateAdded
    }
  })

  const output = Object.values(grouped)
  const fileName = "penny-list.json"

  const folder = DriveApp.getRootFolder()
  // find existing file and remove
  const files = folder.getFilesByName(fileName)
  while (files.hasNext()) {
    const f = files.next()
    f.setTrashed(true)
  }
  const created = folder.createFile(fileName, JSON.stringify(output, null, 2), "application/json")
  Logger.log("Exported %s rows to %s", output.length, created.getUrl())
}
