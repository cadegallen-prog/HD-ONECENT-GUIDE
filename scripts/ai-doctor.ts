#!/usr/bin/env tsx

import { execSync } from "child_process"
import net from "net"

interface HealthCheck {
  name: string
  status: "pass" | "fail" | "warn"
  message: string
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function isHttpOkWithRetries(
  url: string,
  options: { attempts: number; timeoutMs: number; delayMs: number }
): Promise<{ ok: boolean; status?: number; error?: string }> {
  for (let attempt = 1; attempt <= options.attempts; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), options.timeoutMs)
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeout)

      if (response.ok) return { ok: true, status: response.status }
      return { ok: false, status: response.status }
    } catch (err: any) {
      const message = err?.name === "AbortError" ? "timeout" : String(err?.message || err)
      if (attempt === options.attempts) return { ok: false, error: message }
      await sleep(options.delayMs)
    }
  }

  return { ok: false, error: "unknown" }
}

async function checkPort3001(): Promise<HealthCheck> {
  // First check if port is in use
  const portInUse = await new Promise<boolean>((resolve) => {
    const server = net.createServer()
    server.once("error", () => {
      server.close()
      resolve(true) // Port is in use
    })
    server.once("listening", () => {
      server.close()
      resolve(false) // Port is free
    })
    server.listen(3001)
  })

  if (!portInUse) {
    return {
      name: "Port 3001",
      status: "warn",
      message: 'Not running (run "npm run dev")',
    }
  }

  // Port is in use - verify server is actually RESPONDING
  const status = await isHttpOkWithRetries("http://localhost:3001/", {
    attempts: 3,
    timeoutMs: 5000,
    delayMs: 2000,
  })

  if (status.ok) {
    return {
      name: "Port 3001",
      status: "pass",
      message: "Running and responding (reuse it)",
    }
  }

  // Server is on port but not responding - likely stuck or crashed
  if (status.status) {
    return {
      name: "Port 3001",
      status: "fail",
      message: `Unhealthy HTTP (${status.status}) - restart only if you own it`,
    }
  }

  {
    return {
      name: "Port 3001",
      status: "fail",
      message: "Unresponsive - find PID via netstat; kill only if you own it",
    }
  }
}

function checkEnvVars(): HealthCheck {
  const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

  const missing = required.filter((v) => !process.env[v])

  if (missing.length === 0) {
    return {
      name: "Env vars",
      status: "pass",
      message: "All present",
    }
  } else {
    const message =
      missing.length === 1
        ? `Missing: ${missing[0]}`
        : `Missing ${missing.length} vars (check .env.local)`
    return {
      name: "Env vars",
      status: "fail",
      message,
    }
  }
}

function checkPlaywright(): HealthCheck {
  try {
    execSync("npx playwright --version", { stdio: "pipe" })
    return {
      name: "Playwright",
      status: "pass",
      message: "Chromium ready",
    }
  } catch {
    return {
      name: "Playwright",
      status: "fail",
      message: 'Run "npx playwright install chromium"',
    }
  }
}

function checkNodeVersion(): HealthCheck {
  const version = process.version
  const majorVersion = parseInt(version.slice(1).split(".")[0])

  if (majorVersion >= 18) {
    return {
      name: "Node version",
      status: "pass",
      message: version,
    }
  } else {
    return {
      name: "Node version",
      status: "warn",
      message: `${version} (v18+ recommended)`,
    }
  }
}

function formatStatus(status: "pass" | "fail" | "warn"): string {
  switch (status) {
    case "pass":
      return "✅"
    case "fail":
      return "❌"
    case "warn":
      return "⚠️"
  }
}

async function main() {
  console.log("╔════════════════════════════════════════════════════════════╗")
  console.log("║              AI Doctor Health Check                        ║")
  console.log("╠════════════════════════════════════════════════════════════╣")

  const checks: HealthCheck[] = [
    await checkPort3001(),
    checkEnvVars(),
    checkPlaywright(),
    checkNodeVersion(),
  ]

  // Print results
  for (const check of checks) {
    const statusIcon = formatStatus(check.status)
    const paddedName = check.name.padEnd(14)
    const paddedMessage = check.message.padEnd(40)
    console.log(`║ ${paddedName} ${statusIcon} ${paddedMessage}║`)
  }

  console.log("╠════════════════════════════════════════════════════════════╣")

  // Determine overall status
  const hasFailures = checks.some((c) => c.status === "fail")
  const hasWarnings = checks.some((c) => c.status === "warn")

  if (hasFailures) {
    console.log("║ Status: FIX ISSUES BEFORE CODING                           ║")
    console.log("╚════════════════════════════════════════════════════════════╝")
    process.exit(1)
  } else if (hasWarnings) {
    console.log("║ Status: READY (with warnings)                              ║")
    console.log("╚════════════════════════════════════════════════════════════╝")
    process.exit(0)
  } else {
    console.log("║ Status: READY TO CODE                                      ║")
    console.log("╚════════════════════════════════════════════════════════════╝")
    process.exit(0)
  }
}

main().catch((err) => {
  console.error("Error running health check:", err)
  process.exit(1)
})
