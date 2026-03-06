"use client"

import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef } from "react"

import { getMonumetricSlotDomId, MONUMETRIC_LAUNCH_CONFIG } from "@/lib/ads/launch-config"
import { getActiveAdRoutePlan } from "@/lib/ads/slot-plan"

const MONUMETRIC_ENABLED = process.env.NEXT_PUBLIC_MONUMETRIC_ENABLED === "true"
const MOBILE_MAX_WIDTH_PX = 767
const TABLET_MAX_WIDTH_PX = 1023
const REFRESH_COOLDOWN_MS = 1500
const REFRESH_RETRY_DELAY_MS = 350
const REFRESH_RETRY_LIMIT = 8

type MonumetricViewportBand = "mobile" | "tablet" | "desktop"

interface RouteQueueState {
  pathname: string | null
  queuedKeys: Set<string>
  viewportBand: MonumetricViewportBand | null
  lastRefreshAtMs: number
  lastHardReloadBand: MonumetricViewportBand | null
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

export function getViewportBandForWidth(width: number): MonumetricViewportBand {
  if (width <= MOBILE_MAX_WIDTH_PX) {
    return "mobile"
  }
  if (width <= TABLET_MAX_WIDTH_PX) {
    return "tablet"
  }
  return "desktop"
}

export function refreshMonumetricRuntimeOnce(): boolean {
  const runtime = ensureMonumetricRuntime()
  if (!runtime) {
    return false
  }

  if (typeof runtime.setNumMonuAdUnits === "function") {
    try {
      runtime.setNumMonuAdUnits()
    } catch {
      // Ignore runtime-level ad-unit sizing errors and fall through to refresh attempts.
    }
  }

  if (typeof runtime.refreshOnce !== "function") {
    return false
  }

  try {
    runtime.refreshOnce()
    return true
  } catch {
    return false
  }
}

export function MonumetricRouteLifecycleCoordinator() {
  const pathname = usePathname() ?? "/"
  const queueStateRef = useRef<RouteQueueState>({
    pathname: null,
    queuedKeys: new Set(),
    viewportBand: null,
    lastRefreshAtMs: 0,
    lastHardReloadBand: null,
  })
  const routeDebounceTimeoutRef = useRef<number | null>(null)
  const resizeDebounceTimeoutRef = useRef<number | null>(null)
  const resizeFallbackTimeoutRef = useRef<number | null>(null)
  const refreshRetryTimeoutRef = useRef<number | null>(null)

  const runRefreshAttempt = useCallback((retriesRemaining: number) => {
    if (refreshMonumetricRuntimeOnce()) {
      return
    }

    if (retriesRemaining <= 0) {
      return
    }

    if (refreshRetryTimeoutRef.current !== null) {
      window.clearTimeout(refreshRetryTimeoutRef.current)
    }

    refreshRetryTimeoutRef.current = window.setTimeout(() => {
      refreshRetryTimeoutRef.current = null
      runRefreshAttempt(retriesRemaining - 1)
    }, REFRESH_RETRY_DELAY_MS)
  }, [])

  const scheduleMonumetricRefresh = useCallback(() => {
    const now = Date.now()
    if (now - queueStateRef.current.lastRefreshAtMs < REFRESH_COOLDOWN_MS) {
      return
    }

    queueStateRef.current.lastRefreshAtMs = now
    runRefreshAttempt(REFRESH_RETRY_LIMIT)
  }, [runRefreshAttempt])

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

    const plan = getActiveAdRoutePlan(pathname)
    if (plan.policy.eligibility === "exclude") {
      return
    }

    if (queueStateRef.current.pathname !== pathname) {
      queueStateRef.current.pathname = pathname
      queueStateRef.current.queuedKeys.clear()
    }

    if (routeDebounceTimeoutRef.current !== null) {
      window.clearTimeout(routeDebounceTimeoutRef.current)
    }

    routeDebounceTimeoutRef.current = window.setTimeout(() => {
      queueMonumetricSlotsForPathname(pathname, queueStateRef.current.queuedKeys)
      scheduleMonumetricRefresh()
    }, MONUMETRIC_LAUNCH_CONFIG.routeRequeue.debounceMs)

    return () => {
      if (routeDebounceTimeoutRef.current !== null) {
        window.clearTimeout(routeDebounceTimeoutRef.current)
        routeDebounceTimeoutRef.current = null
      }
    }
  }, [pathname, scheduleMonumetricRefresh])

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

    const syncViewportBand = () => {
      const nextBand = getViewportBandForWidth(window.innerWidth)
      if (queueStateRef.current.viewportBand === null) {
        queueStateRef.current.viewportBand = nextBand
        return
      }

      if (queueStateRef.current.viewportBand === nextBand) {
        return
      }

      const plan = getActiveAdRoutePlan(pathname)
      queueStateRef.current.viewportBand = nextBand

      if (plan.policy.eligibility === "exclude") {
        return
      }

      scheduleMonumetricRefresh()

      if (resizeFallbackTimeoutRef.current !== null) {
        window.clearTimeout(resizeFallbackTimeoutRef.current)
      }

      resizeFallbackTimeoutRef.current = window.setTimeout(
        () => {
          resizeFallbackTimeoutRef.current = null

          const runtime = ensureMonumetricRuntime()
          if (!runtime) {
            return
          }

          const runtimeDeviceType = runtime.deviceType
          const refreshAvailable = typeof runtime.refreshOnce === "function"
          if (
            runtimeDeviceType &&
            runtimeDeviceType !== nextBand &&
            !refreshAvailable &&
            queueStateRef.current.lastHardReloadBand !== nextBand
          ) {
            queueStateRef.current.lastHardReloadBand = nextBand
            window.location.reload()
          }
        },
        REFRESH_RETRY_DELAY_MS * (REFRESH_RETRY_LIMIT + 1)
      )
    }

    const handleResize = () => {
      if (resizeDebounceTimeoutRef.current !== null) {
        window.clearTimeout(resizeDebounceTimeoutRef.current)
      }

      resizeDebounceTimeoutRef.current = window.setTimeout(
        syncViewportBand,
        MONUMETRIC_LAUNCH_CONFIG.routeRequeue.debounceMs
      )
    }

    syncViewportBand()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (resizeDebounceTimeoutRef.current !== null) {
        window.clearTimeout(resizeDebounceTimeoutRef.current)
        resizeDebounceTimeoutRef.current = null
      }
    }
  }, [pathname, scheduleMonumetricRefresh])

  useEffect(() => {
    return () => {
      if (refreshRetryTimeoutRef.current !== null) {
        window.clearTimeout(refreshRetryTimeoutRef.current)
        refreshRetryTimeoutRef.current = null
      }
      if (routeDebounceTimeoutRef.current !== null) {
        window.clearTimeout(routeDebounceTimeoutRef.current)
        routeDebounceTimeoutRef.current = null
      }
      if (resizeDebounceTimeoutRef.current !== null) {
        window.clearTimeout(resizeDebounceTimeoutRef.current)
        resizeDebounceTimeoutRef.current = null
      }
      if (resizeFallbackTimeoutRef.current !== null) {
        window.clearTimeout(resizeFallbackTimeoutRef.current)
        resizeFallbackTimeoutRef.current = null
      }
    }
  }, [])

  return null
}
