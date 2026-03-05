"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

import { getMonumetricSlotDomId, MONUMETRIC_LAUNCH_CONFIG } from "@/lib/ads/launch-config"
import { getActiveAdRoutePlan } from "@/lib/ads/slot-plan"

const MONUMETRIC_ENABLED = process.env.NEXT_PUBLIC_MONUMETRIC_ENABLED === "true"

interface RouteQueueState {
  pathname: string | null
  queuedKeys: Set<string>
}

function ensureMonumetricRuntime(): NonNullable<Window["$MMT"]> | null {
  if (typeof window === "undefined") {
    return null
  }

  window.$MMT = window.$MMT ?? {}
  window.$MMT.cmd = window.$MMT.cmd ?? []
  return window.$MMT
}

function queueMonumetricSlot(slotId: string): boolean {
  const runtime = ensureMonumetricRuntime()
  if (!runtime || !runtime.cmd) {
    return false
  }

  runtime.cmd.push(() => {
    if (!window.$MMT) {
      return
    }

    window.$MMT.display = window.$MMT.display ?? {}
    window.$MMT.display.slots = window.$MMT.display.slots ?? []
    window.$MMT.display.slots.push([slotId])
  })

  return true
}

export function buildRouteQueueKey(pathname: string, slotId: string): string {
  return `${pathname}::${slotId}`
}

export function queueMonumetricSlotsForPathname(pathname: string, queuedKeys: Set<string>): number {
  if (typeof document === "undefined") {
    return 0
  }

  const plan = getActiveAdRoutePlan(pathname)
  let queuedCount = 0

  for (const slotId of plan.requeueSlotIds) {
    const queueKey = buildRouteQueueKey(plan.pathname, slotId)
    if (queuedKeys.has(queueKey)) {
      continue
    }

    const slotContainerId = getMonumetricSlotDomId(slotId)
    if (!document.getElementById(slotContainerId)) {
      continue
    }

    if (queueMonumetricSlot(slotId)) {
      queuedKeys.add(queueKey)
      queuedCount += 1
    }
  }

  return queuedCount
}

export function MonumetricRouteLifecycleCoordinator() {
  const pathname = usePathname() ?? "/"
  const queueStateRef = useRef<RouteQueueState>({ pathname: null, queuedKeys: new Set() })
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!MONUMETRIC_ENABLED) {
      return
    }

    if (!MONUMETRIC_LAUNCH_CONFIG.routeRequeue.enabled) {
      return
    }

    if (MONUMETRIC_LAUNCH_CONFIG.experimentalSpa.enabled) {
      return
    }

    if (queueStateRef.current.pathname !== pathname) {
      queueStateRef.current.pathname = pathname
      queueStateRef.current.queuedKeys.clear()
    }

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      queueMonumetricSlotsForPathname(pathname, queueStateRef.current.queuedKeys)
    }, MONUMETRIC_LAUNCH_CONFIG.routeRequeue.debounceMs)

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [pathname])

  return null
}
