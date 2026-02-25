"use client"

import * as React from "react"
import {
  isVisualPointerEnabledEnv,
  readVisualPointerMode,
  setVisualPointerMode,
  VISUAL_POINTER_MODE_EVENT,
} from "@/components/dev/visual-pointer-state"

export default function VisualPointerToggle() {
  const [armed, setArmed] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    setArmed(readVisualPointerMode())
  }, [])

  React.useEffect(() => {
    if (!mounted) {
      return
    }

    setVisualPointerMode(armed)
  }, [armed, mounted])

  React.useEffect(() => {
    if (!mounted) {
      return
    }

    const syncMode = () => setArmed(readVisualPointerMode())
    window.addEventListener(VISUAL_POINTER_MODE_EVENT, syncMode as EventListener)
    return () => window.removeEventListener(VISUAL_POINTER_MODE_EVENT, syncMode as EventListener)
  }, [mounted])

  if (!mounted || !isVisualPointerEnabledEnv()) {
    return null
  }

  const label = armed ? "Feedback Mode: On" : "Feedback Mode: Off"

  return (
    <div
      data-visual-pointer-ui="true"
      className="fixed bottom-4 right-4 z-[60]"
      role="region"
      aria-label="Visual pointer controls"
      data-testid="visual-pointer-toggle"
    >
      <button
        type="button"
        onClick={() => setArmed((current) => !current)}
        aria-pressed={armed}
        className="min-h-11 min-w-11 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] shadow-sm transition-colors hover:bg-[var(--bg-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cta-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-page)]"
      >
        {label}
      </button>
    </div>
  )
}
