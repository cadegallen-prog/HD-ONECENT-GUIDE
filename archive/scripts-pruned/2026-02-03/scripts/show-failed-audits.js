const fs = require("fs")
const path = require("path")

const file = process.argv[2]
const content = fs.readFileSync(file, "utf8")
const json = JSON.parse(content)

console.log(`Failed audits for ${file}:`)
Object.values(json.audits).forEach((audit) => {
  if (
    audit.score !== 1 &&
    audit.scoreDisplayMode !== "notApplicable" &&
    audit.scoreDisplayMode !== "informative"
  ) {
    console.log(`- ${audit.id}: ${audit.score} (${audit.title})`)
  }
})
