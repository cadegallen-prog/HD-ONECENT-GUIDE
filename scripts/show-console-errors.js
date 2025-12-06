const fs = require("fs")
const file = process.argv[2]
const content = fs.readFileSync(file, "utf8")
const json = JSON.parse(content)
const audit = json.audits["errors-in-console"]
if (audit && audit.details && audit.details.items) {
  console.log("Console Errors:")
  audit.details.items.forEach((item) => console.log(item.description || item.message))
} else {
  console.log("No console errors found in audit details.")
}
