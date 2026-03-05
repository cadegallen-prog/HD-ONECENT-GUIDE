"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"

import { MONUMETRIC_LAUNCH_CONFIG } from "@/lib/ads/launch-config"

interface SlotCollapseOptions {
  enabled: boolean
  slotDomId: string
  collapseEnabled: boolean
  collapseAfterMs: number
}

const CREATIVE_SELECTOR = "iframe,ins,embed,object,video,canvas,img"

function hasRenderedCreative(slotElement: HTMLElement): boolean {
  if (slotElement.querySelector(CREATIVE_SELECTOR)) {
    return true
  }

  if (slotElement.childElementCount > 0) {
    return true
  }

  const text = slotElement.textContent?.trim() ?? ""
  return text.length > 0
}

export function useMonumetricSlotCollapse(options: SlotCollapseOptions): boolean {
  const [collapsed, setCollapsed] = useState(false)
  const timeoutReachedRef = useRef(false)
  const collapseTimerRef = useRef<number | null>(null)
  const observerDebounceRef = useRef<number | null>(null)

  useEffect(() => {
    if (!options.enabled || !options.collapseEnabled) {
      setCollapsed(false)
      return
    }

    timeoutReachedRef.current = false

    const evaluate = () => {
      const slotElement = document.getElementById(options.slotDomId)
      if (!slotElement) {
        setCollapsed(false)
        return
      }

      if (hasRenderedCreative(slotElement)) {
        setCollapsed(false)
        return
      }

      if (timeoutReachedRef.current) {
        setCollapsed(true)
      }
    }

    const scheduleEvaluate = () => {
      if (observerDebounceRef.current !== null) {
        window.clearTimeout(observerDebounceRef.current)
      }

      observerDebounceRef.current = window.setTimeout(
        evaluate,
        MONUMETRIC_LAUNCH_CONFIG.slotShell.observerDebounceMs
      )
    }

    collapseTimerRef.current = window.setTimeout(() => {
      timeoutReachedRef.current = true
      evaluate()
    }, options.collapseAfterMs)

    const slotElement = document.getElementById(options.slotDomId)
    const observer = slotElement
      ? new MutationObserver(() => {
          scheduleEvaluate()
        })
      : null

    if (slotElement && observer) {
      observer.observe(slotElement, {
        childList: true,
        subtree: true,
      })
      scheduleEvaluate()
    }

    return () => {
      if (collapseTimerRef.current !== null) {
        window.clearTimeout(collapseTimerRef.current)
        collapseTimerRef.current = null
      }
      if (observerDebounceRef.current !== null) {
        window.clearTimeout(observerDebounceRef.current)
        observerDebounceRef.current = null
      }
      observer?.disconnect()
      timeoutReachedRef.current = false
    }
  }, [options.collapseAfterMs, options.collapseEnabled, options.enabled, options.slotDomId])

  return collapsed
}

interface MonumetricSlotShellProps {
  enabled: boolean
  slotId: string
  slotDomId: string
  reserveMinHeightPx: number
  collapseAfterMs: number
  collapseEnabled: boolean
  className?: string
  containerClassName?: string
  label?: string
  children?: ReactNode
}

export function MonumetricSlotShell({
  enabled,
  slotId,
  slotDomId,
  reserveMinHeightPx,
  collapseAfterMs,
  collapseEnabled,
  className = "",
  containerClassName = "",
  label = "Advertisement",
  children,
}: MonumetricSlotShellProps) {
  const collapsed = useMonumetricSlotCollapse({
    enabled,
    slotDomId,
    collapseEnabled,
    collapseAfterMs,
  })

  if (!enabled) {
    return null
  }

  const isCollapsed = collapseEnabled && collapsed

  return (
    <section
      aria-label={label}
      className={`my-8 overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-3 transition-all duration-200 sm:p-4 ${className}`.trim()}
      data-ad-slot={slotId}
      data-ad-slot-collapsed={isCollapsed ? "true" : "false"}
      style={
        isCollapsed
          ? {
              borderWidth: 0,
              height: 0,
              marginBottom: 0,
              marginTop: 0,
              opacity: 0,
              overflow: "hidden",
              paddingBottom: 0,
              paddingTop: 0,
            }
          : undefined
      }
    >
      <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
        {label}
      </p>
      <div
        id={slotDomId}
        className={`mx-auto w-full overflow-hidden ${containerClassName}`.trim()}
        style={{
          minHeight: isCollapsed ? 0 : reserveMinHeightPx,
        }}
      />
      {children}
    </section>
  )
}
