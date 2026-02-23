"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { createSelectorFingerprint } from "@/lib/visual-pointer/selector-fingerprint"
import { lookupSource } from "@/lib/visual-pointer/source-registry"
import type { VisualPointerCapture } from "@/lib/visual-pointer/types"

interface HighlightRect {
  top: number
  left: number
  width: number
  height: number
}

interface VisualPointerOverlayProps {
  armed: boolean
  onCapture: (capture: VisualPointerCapture) => void
}

function toCaptureId(): string {
  const time = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 8)
  return `vpt_${time}_${random}`
}

function detectTheme(): "light" | "dark" | "unknown" {
  if (typeof document === "undefined") {
    return "unknown"
  }
  const classList = document.documentElement.classList
  if (classList.contains("dark")) return "dark"
  if (classList.contains("light")) return "light"
  return "unknown"
}

function isVisualPointerUiElement(target: Element | null): boolean {
  if (!target) {
    return false
  }
  return Boolean(target.closest('[data-visual-pointer-ui="true"]'))
}

function buildCapture(target: Element): VisualPointerCapture {
  const fingerprint = createSelectorFingerprint(target)
  const url = window.location.href
  const pathname = window.location.pathname
  const query = window.location.search

  return {
    captureId: toCaptureId(),
    capturedAt: new Date().toISOString(),
    url,
    pathname,
    query,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    dpr: window.devicePixelRatio || 1,
    theme: detectTheme(),
    targetTag: fingerprint.targetTag,
    targetTextSnippet: fingerprint.targetTextSnippet,
    targetRole: fingerprint.targetRole,
    targetLabel: fingerprint.targetLabel,
    primarySelector: fingerprint.primarySelector,
    selectorCandidates: fingerprint.selectorCandidates,
    pcId: fingerprint.pcId,
    source: fingerprint.pcId ? lookupSource(fingerprint.pcId) : "source_unavailable",
  }
}

export function VisualPointerOverlay({ armed, onCapture }: VisualPointerOverlayProps) {
  const [rect, setRect] = React.useState<HighlightRect | null>(null)
  const [mounted, setMounted] = React.useState(false)
  const hoveredElementRef = React.useRef<Element | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const updateRect = React.useCallback((target: Element | null) => {
    hoveredElementRef.current = target
    if (!target) {
      setRect(null)
      return
    }
    const bounds = target.getBoundingClientRect()
    setRect({
      top: bounds.top,
      left: bounds.left,
      width: bounds.width,
      height: bounds.height,
    })
  }, [])

  React.useEffect(() => {
    if (!mounted || !armed) {
      setRect(null)
      hoveredElementRef.current = null
      return
    }

    const handlePointerMove = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null
      if (!target || isVisualPointerUiElement(target)) {
        updateRect(null)
        return
      }
      updateRect(target)
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null
      if (!target || isVisualPointerUiElement(target)) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()

      const capture = buildCapture(target)
      onCapture(capture)
      updateRect(null)
    }

    const refreshHighlight = () => {
      if (!hoveredElementRef.current) {
        return
      }
      updateRect(hoveredElementRef.current)
    }

    document.addEventListener("pointermove", handlePointerMove, true)
    document.addEventListener("click", handleClick, true)
    window.addEventListener("resize", refreshHighlight)
    window.addEventListener("scroll", refreshHighlight, true)

    return () => {
      document.removeEventListener("pointermove", handlePointerMove, true)
      document.removeEventListener("click", handleClick, true)
      window.removeEventListener("resize", refreshHighlight)
      window.removeEventListener("scroll", refreshHighlight, true)
    }
  }, [armed, mounted, onCapture, updateRect])

  if (!mounted || !armed) {
    return null
  }

  return createPortal(
    <div data-visual-pointer-ui="true" className="pointer-events-none fixed inset-0 z-[65]">
      {rect && (
        <div
          className="absolute rounded-md border-2 border-[var(--cta-primary)] bg-[var(--bg-hover)] opacity-70"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
        />
      )}

      <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] shadow-[var(--shadow-card)]">
        Tap an element to capture a precise reference.
      </div>
    </div>,
    document.body
  )
}
