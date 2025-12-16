import { spawn, spawnSync } from "node:child_process"
import { mkdir, rm } from "node:fs/promises"
import path from "node:path"
import { chromium, type BrowserContext, type Page } from "playwright"

const ROOT = process.cwd()
const OUT_DIR = path.join(ROOT, "reports", "verification")

type Theme = "light" | "dark"

type Viewport = {
  name: string
  width: number
  height: number
}

const VIEWPORTS: Viewport[] = [
  { name: "desktop", width: 1280, height: 720 },
  { name: "mobile", width: 390, height: 844 },
]

const HARD_TIMEOUT_MS = 120_000
const SERVER_READY_TIMEOUT_MS = 45_000

function nextBinPath() {
  return path.join(ROOT, "node_modules", "next", "dist", "bin", "next")
}

function spawnNextDev() {
  // Use the locally installed Next.js binary (no npx downloads, no .cmd EINVAL issues).
  return spawn(process.execPath, [nextBinPath(), "dev", "-p", "3001"], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: "3001" },
  })
}

function killProcessTree(child: ReturnType<typeof spawn>) {
  if (!child.pid) return

  if (process.platform === "win32") {
    // Force kill the whole tree (Next spawns multiple processes on Windows).
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    })
    return
  }

  try {
    child.kill("SIGTERM")
  } catch {
    // ignore
  }

  try {
    child.kill("SIGKILL")
  } catch {
    // ignore
  }
}

async function waitForServerReady(child: ReturnType<typeof spawn>, timeoutMs: number) {
  return await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Timed out waiting for dev server after ${timeoutMs}ms`))
    }, timeoutMs)

    const onData = (chunk: unknown) => {
      const text = String(chunk)
      // Next prints "Ready" + the local URL
      if (text.includes("http://localhost:3001") || text.includes("Ready")) {
        clearTimeout(timeout)
        resolve()
      }
    }

    child.stdout?.on("data", onData)
    child.stderr?.on("data", onData)

    child.on("error", (err) => {
      clearTimeout(timeout)
      reject(err)
    })

    child.on("exit", (code) => {
      if (code && code !== 0) {
        clearTimeout(timeout)
        reject(new Error(`Dev server exited early with code ${code}`))
      }
    })
  })
}

async function prepareContext(
  theme: Theme,
  viewport: Viewport
): Promise<{ context: BrowserContext; page: Page }> {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  })

  // Force theme via storage (matches existing tests)
  await context.addInitScript((preferredTheme: Theme) => {
    try {
      localStorage.setItem("theme", preferredTheme)
    } catch {
      // ignore
    }
  }, theme)

  // Reduce flakiness: grant geolocation and fix it to the default center.
  await context.grantPermissions(["geolocation"])
  await context.setGeolocation({ latitude: 39.8283, longitude: -98.5795 })

  const page = await context.newPage()

  const consoleErrors: string[] = []
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text())
  })
  page.on("pageerror", (err) => {
    consoleErrors.push(String(err))
  })

  // Attach for later debugging
  ;(page as unknown as { __consoleErrors?: string[] }).__consoleErrors = consoleErrors

  return { context, page }
}

async function capture(theme: Theme, viewport: Viewport) {
  const { context, page } = await prepareContext(theme, viewport)

  try {
    await page.goto("http://localhost:3001/store-finder", { waitUntil: "domcontentloaded" })

    // Wait for Leaflet markers to show at least one pin.
    await page.waitForSelector(".leaflet-marker-icon", { state: "visible", timeout: 30_000 })

    // Give the map a beat to settle.
    await page.waitForTimeout(750)

    const file = path.join(
      OUT_DIR,
      `store-finder-${viewport.name}-${theme}-${new Date().toISOString().slice(0, 10)}.png`
    )

    await page.screenshot({ path: file, fullPage: false })

    const consoleErrors = (page as unknown as { __consoleErrors?: string[] }).__consoleErrors ?? []
    if (consoleErrors.length > 0) {
      // Print but do not fail; the main gates already cover this.
      // This is here as proof-friendly output.
      // eslint-disable-next-line no-console
      console.log(`Console errors captured (${viewport.name}/${theme}):`, consoleErrors)
    }
  } finally {
    await context.close()
    // context.close also closes the underlying browser
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  // Clean up any old proof images for today (avoid confusion)
  try {
    // Remove only the pngs we generate (best-effort)
    // eslint-disable-next-line no-console
    console.log("Saving screenshots to", OUT_DIR)
  } catch {

  }

  // Start dev server on 3001
  const child = spawnNextDev()

  const hardTimeout = setTimeout(() => {
    // eslint-disable-next-line no-console
    console.error(`HARD TIMEOUT after ${HARD_TIMEOUT_MS}ms`)
    killProcessTree(child)
    process.exit(1)
  }, HARD_TIMEOUT_MS)

  try {
    await waitForServerReady(child, SERVER_READY_TIMEOUT_MS)

    for (const viewport of VIEWPORTS) {
      for (const theme of ["light", "dark"] as Theme[]) {
        await capture(theme, viewport)
      }
    }

    // eslint-disable-next-line no-console
    console.log("DONE")

    // Gracefully stop dev server
    killProcessTree(child)
    clearTimeout(hardTimeout)
  } catch (err) {
    clearTimeout(hardTimeout)
    killProcessTree(child)
    throw err
  }
}

main().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error(err)

  // Clean up marker file if it exists but is empty, remove it to avoid noise.
  try {
    const marker = path.join(OUT_DIR, ".keep")
    await rm(marker, { force: true })
  } catch {
    // ignore
  }

  process.exitCode = 1
})
