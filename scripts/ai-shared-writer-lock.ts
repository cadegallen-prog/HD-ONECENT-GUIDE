#!/usr/bin/env tsx

import fs from "node:fs"
import os from "node:os"
import path from "node:path"

type Command = "status" | "claim" | "heartbeat" | "release"

interface LockRecord {
  version: number
  owner: string
  startedAt: string
  heartbeatAt: string
  files: string[]
  pid: number
  host: string
  note?: string
  takeoverFrom?: string
}

interface Args {
  command: Command
  owner?: string
  note?: string
  staleMinutes: number
  force: boolean
}

const ROOT = process.cwd()
const LOCK_RELATIVE_PATH = ".ai/.shared-writer-lock.json"
const LOCK_ABSOLUTE_PATH = path.join(ROOT, LOCK_RELATIVE_PATH)
const DEFAULT_STALE_MINUTES = 30
const SHARED_MEMORY_FILES = [
  ".ai/HANDOFF.md",
  ".ai/STATE.md",
  ".ai/SESSION_LOG.md",
  ".ai/BACKLOG.md",
]

const usage = () => {
  console.log(`Usage:
  npm run ai:writer-lock:status [-- --stale-minutes 30]
  npm run ai:writer-lock:claim [-- <owner> "<note>"]
  npm run ai:writer-lock:claim [-- --owner codex --note "report-find slice" --stale-minutes 30]
  npm run ai:writer-lock:heartbeat [-- <owner>]
  npm run ai:writer-lock:heartbeat [-- --owner codex]
  npm run ai:writer-lock:release [-- <owner>]
  npm run ai:writer-lock:release [-- --owner codex]
  npm run ai:writer-lock:release [-- --force]
`)
}

const parseArgs = (argv: string[]): Args => {
  const commandRaw = (argv[0] || "status").toLowerCase()
  const command: Command =
    commandRaw === "claim" || commandRaw === "heartbeat" || commandRaw === "release"
      ? commandRaw
      : "status"

  let owner: string | undefined
  let note: string | undefined
  let staleMinutes = DEFAULT_STALE_MINUTES
  let force = false
  const positional: string[] = []

  for (let index = 1; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === "--owner") {
      owner = argv[index + 1]
      index += 1
      continue
    }

    if (arg === "--note") {
      note = argv[index + 1]
      index += 1
      continue
    }

    if (arg === "--stale-minutes") {
      const parsed = Number(argv[index + 1])
      if (Number.isFinite(parsed) && parsed > 0) {
        staleMinutes = parsed
      }
      index += 1
      continue
    }

    if (arg === "--force") {
      force = true
      continue
    }

    if (arg === "--help" || arg === "-h") {
      usage()
      process.exit(0)
    }

    if (!arg.startsWith("-")) {
      positional.push(arg)
    }
  }

  if (!owner && positional.length > 0) {
    ;[owner] = positional
  }

  if (!note && positional.length > 1) {
    note = positional.slice(1).join(" ")
  }

  return {
    command,
    owner,
    note,
    staleMinutes,
    force,
  }
}

const resolveOwner = (explicitOwner?: string) => {
  return (
    explicitOwner?.trim() ||
    process.env.AI_WRITER_OWNER?.trim() ||
    process.env.AGENT_NAME?.trim() ||
    process.env.USERNAME?.trim() ||
    process.env.USER?.trim() ||
    "unknown-agent"
  )
}

const ensureLockDirectory = () => {
  fs.mkdirSync(path.dirname(LOCK_ABSOLUTE_PATH), { recursive: true })
}

const readLock = (): LockRecord | null => {
  if (!fs.existsSync(LOCK_ABSOLUTE_PATH)) {
    return null
  }

  const raw = fs.readFileSync(LOCK_ABSOLUTE_PATH, "utf8")
  return JSON.parse(raw) as LockRecord
}

const writeLock = (record: LockRecord) => {
  ensureLockDirectory()
  fs.writeFileSync(LOCK_ABSOLUTE_PATH, `${JSON.stringify(record, null, 2)}\n`, "utf8")
}

const ageMinutes = (record: LockRecord) => {
  const heartbeatMs = Date.parse(record.heartbeatAt)
  const nowMs = Date.now()

  if (!Number.isFinite(heartbeatMs)) {
    return Number.POSITIVE_INFINITY
  }

  return Math.max(0, (nowMs - heartbeatMs) / 60000)
}

const isStale = (record: LockRecord, staleMinutes: number) => {
  return ageMinutes(record) > staleMinutes
}

const printStatus = (record: LockRecord | null, staleMinutes: number) => {
  if (!record) {
    console.log("Writer lock: UNLOCKED")
    console.log(`Lock file: ${LOCK_RELATIVE_PATH}`)
    return
  }

  const stale = isStale(record, staleMinutes)
  const age = ageMinutes(record)

  console.log(`Writer lock: ${stale ? "STALE" : "ACTIVE"}`)
  console.log(`Owner: ${record.owner}`)
  console.log(`Started: ${record.startedAt}`)
  console.log(`Heartbeat: ${record.heartbeatAt} (${age.toFixed(1)}m ago)`)
  console.log(`Scope: ${record.files.join(", ")}`)
  console.log(`Process: pid=${record.pid} host=${record.host}`)
  if (record.note) {
    console.log(`Note: ${record.note}`)
  }
  if (record.takeoverFrom) {
    console.log(`Takeover from stale owner: ${record.takeoverFrom}`)
  }
  console.log(`Lock file: ${LOCK_RELATIVE_PATH}`)
}

const claim = (args: Args) => {
  const owner = resolveOwner(args.owner)
  const nowIso = new Date().toISOString()
  const existing = readLock()

  if (existing && existing.owner !== owner && !isStale(existing, args.staleMinutes)) {
    const age = ageMinutes(existing)
    console.error(
      `Cannot claim writer lock. Active owner is "${existing.owner}" (last heartbeat ${age.toFixed(1)}m ago).`
    )
    console.error(`Use "npm run ai:writer-lock:status" for details.`)
    process.exitCode = 1
    return
  }

  const takeoverFrom = existing && existing.owner !== owner ? existing.owner : undefined
  const record: LockRecord = {
    version: 1,
    owner,
    startedAt: existing && existing.owner === owner ? existing.startedAt : nowIso,
    heartbeatAt: nowIso,
    files: SHARED_MEMORY_FILES,
    pid: process.pid,
    host: os.hostname(),
    note: args.note?.trim() || existing?.note,
    takeoverFrom,
  }

  writeLock(record)

  if (!existing) {
    console.log(`Writer lock claimed by "${owner}".`)
    return
  }

  if (existing.owner === owner) {
    console.log(`Writer lock refreshed by "${owner}".`)
    return
  }

  console.log(`Writer lock taken over by "${owner}" from stale owner "${existing.owner}".`)
}

const heartbeat = (args: Args) => {
  const owner = resolveOwner(args.owner)
  const existing = readLock()

  if (!existing) {
    console.error(
      `No writer lock exists. Claim one first with "npm run ai:writer-lock:claim -- --owner ${owner}".`
    )
    process.exitCode = 1
    return
  }

  if (existing.owner !== owner) {
    console.error(`Cannot heartbeat. Current lock owner is "${existing.owner}", not "${owner}".`)
    process.exitCode = 1
    return
  }

  const updated: LockRecord = {
    ...existing,
    heartbeatAt: new Date().toISOString(),
    pid: process.pid,
    host: os.hostname(),
  }

  writeLock(updated)
  console.log(`Writer lock heartbeat updated for "${owner}".`)
}

const release = (args: Args) => {
  const owner = resolveOwner(args.owner)
  const existing = readLock()

  if (!existing) {
    console.log("No writer lock to release.")
    return
  }

  if (!args.force && existing.owner !== owner) {
    console.error(
      `Cannot release lock owned by "${existing.owner}" as "${owner}". Use --force only for stale cleanup.`
    )
    process.exitCode = 1
    return
  }

  fs.rmSync(LOCK_ABSOLUTE_PATH, { force: true })
  console.log(args.force ? "Writer lock force-released." : `Writer lock released by "${owner}".`)
}

const main = () => {
  const args = parseArgs(process.argv.slice(2))

  switch (args.command) {
    case "status": {
      printStatus(readLock(), args.staleMinutes)
      return
    }
    case "claim": {
      claim(args)
      return
    }
    case "heartbeat": {
      heartbeat(args)
      return
    }
    case "release": {
      release(args)
      return
    }
    default: {
      usage()
      process.exitCode = 1
    }
  }
}

main()
