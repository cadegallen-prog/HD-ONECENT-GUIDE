#!/usr/bin/env node

import { execSync, spawn, spawnSync } from "node:child_process"
import process from "node:process"

const PORT = 3001
const args = new Set(process.argv.slice(2))
const force = args.has("--force")
const noStart = args.has("--cleanup-only") || args.has("--no-start")
const help = args.has("--help") || args.has("-h")

function printHelp() {
  console.log(`Usage: npm run dev:reset-3001

Resets a stuck localhost:${PORT} dev server safely:
1) Checks port health
2) Kills stale ${PORT} listeners when needed
3) Starts npm run dev (unless --cleanup-only)

Options:
  node scripts/dev-reset-3001.mjs --force
  node scripts/dev-reset-3001.mjs --cleanup-only
  node scripts/dev-reset-3001.mjs --help
`)
}

function getListeningPidsWindows(port) {
  let output = ""
  try {
    output = execSync("netstat -ano -p tcp", { encoding: "utf8" })
  } catch {
    return []
  }

  const pids = new Set()
  for (const line of output.split(/\r?\n/)) {
    const parts = line.trim().split(/\s+/)
    if (parts.length < 5) continue
    const protocol = parts[0]?.toUpperCase()
    const local = parts[1] || ""
    const state = parts[3]?.toUpperCase()
    const pid = parts[4] || ""

    if (protocol !== "TCP") continue
    if (state !== "LISTENING") continue
    if (!local.endsWith(`:${port}`)) continue
    if (!/^\d+$/.test(pid)) continue

    pids.add(pid)
  }

  return [...pids]
}

function getListeningPidsPosix(port) {
  try {
    const output = execSync(`lsof -nP -iTCP:${port} -sTCP:LISTEN -t`, { encoding: "utf8" }).trim()
    if (!output) return []
    return output
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => /^\d+$/.test(line))
  } catch {
    return []
  }
}

function getListeningPids(port) {
  return process.platform === "win32" ? getListeningPidsWindows(port) : getListeningPidsPosix(port)
}

async function probePortHealth(port) {
  try {
    const response = await fetch(`http://localhost:${port}`, {
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
    })
    return {
      healthy: true,
      status: response.status,
      detail: `HTTP ${response.status}`,
    }
  } catch (error) {
    return {
      healthy: false,
      status: null,
      detail: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

function killPid(pid) {
  if (process.platform === "win32") {
    const result = spawnSync("taskkill", ["/PID", pid, "/F"], { stdio: "inherit", shell: true })
    return result.status === 0
  }

  const result = spawnSync("kill", ["-9", pid], { stdio: "inherit" })
  return result.status === 0
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function startDevServer() {
  const child = spawn("npm", ["run", "dev"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  })

  child.on("error", (error) => {
    console.error(`Failed to start dev server: ${error instanceof Error ? error.message : error}`)
    process.exit(1)
  })

  child.on("exit", (code) => {
    process.exit(code ?? 0)
  })
}

async function main() {
  if (help) {
    printHelp()
    process.exit(0)
  }

  const pidsBefore = getListeningPids(PORT)
  const hasListener = pidsBefore.length > 0
  const health = hasListener ? await probePortHealth(PORT) : { healthy: false, detail: "No listener" }

  if (hasListener && health.healthy && !force) {
    console.log(`Port ${PORT} is already healthy (${health.detail}).`)
    console.log("No reset needed. Use --force to restart anyway.")
    process.exit(0)
  }

  if (hasListener) {
    if (health.healthy && force) {
      console.log(`Force restart requested. Stopping healthy process(es) on port ${PORT}.`)
    } else {
      console.log(`Port ${PORT} is in use but unhealthy (${health.detail}). Resetting...`)
    }

    for (const pid of pidsBefore) {
      console.log(`Stopping PID ${pid}...`)
      const killed = killPid(pid)
      if (!killed) {
        console.error(`Failed to stop PID ${pid}.`)
        process.exit(1)
      }
    }

    await sleep(500)

    const stillListening = getListeningPids(PORT)
    if (stillListening.length > 0) {
      console.error(`Port ${PORT} is still in use by PID(s): ${stillListening.join(", ")}`)
      process.exit(1)
    }

    console.log(`Port ${PORT} is now free.`)
  } else {
    console.log(`Port ${PORT} is free.`)
  }

  if (noStart) {
    console.log("Skipping dev start (--cleanup-only).")
    process.exit(0)
  }

  console.log("Starting npm run dev...")
  startDevServer()
}

void main()
