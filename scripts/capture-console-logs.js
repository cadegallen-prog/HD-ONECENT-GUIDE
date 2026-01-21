const { chromium } = require("playwright")

;(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  // Capture all console messages
  const consoleMessages = []
  page.on("console", (msg) => {
    const text = msg.text()
    consoleMessages.push({
      type: msg.type(),
      text: text,
    })
    console.log(`[${msg.type().toUpperCase()}] ${text}`)
  })

  // Navigate to the penny-list page
  console.log("Navigating to http://localhost:3001/penny-list...")
  await page.goto("http://localhost:3001/penny-list", {
    waitUntil: "networkidle",
    timeout: 30000,
  })

  // Wait a bit for any delayed console logs
  await page.waitForTimeout(3000)

  // Take a screenshot
  await page.screenshot({ path: "reports/penny-list-console-capture.png", fullPage: true })
  console.log("\nScreenshot saved to reports/penny-list-console-capture.png")

  // Filter and display ENRICH and CARD messages
  console.log("\n=== ENRICH Messages ===")
  const enrichMessages = consoleMessages.filter((msg) => msg.text.includes("ENRICH"))
  if (enrichMessages.length === 0) {
    console.log("No ENRICH messages found")
  } else {
    enrichMessages.forEach((msg) => console.log(msg.text))
  }

  console.log("\n=== CARD Messages ===")
  const cardMessages = consoleMessages.filter((msg) => msg.text.includes("CARD"))
  if (cardMessages.length === 0) {
    console.log("No CARD messages found")
  } else {
    cardMessages.forEach((msg) => console.log(msg.text))
  }

  console.log(`\n=== Total Console Messages: ${consoleMessages.length} ===`)

  await browser.close()
})()
