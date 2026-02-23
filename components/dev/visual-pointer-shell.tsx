"use client"

import * as React from "react"
import VisualPointerToggle from "@/components/dev/visual-pointer-toggle"
import { VisualPointerOverlay } from "@/components/dev/visual-pointer-overlay"
import { VisualPointerDrawer } from "@/components/dev/visual-pointer-drawer"
import {
  isVisualPointerEnabledEnv,
  readVisualPointerMode,
  setVisualPointerMode,
  VISUAL_POINTER_MODE_EVENT,
} from "@/components/dev/visual-pointer-state"
import type { VisualPointerCapture } from "@/lib/visual-pointer/types"

export default function VisualPointerShell() {
  const [mounted, setMounted] = React.useState(false)
  const [armed, setArmed] = React.useState(false)
  const [capture, setCapture] = React.useState<VisualPointerCapture | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted) {
      return
    }

    const syncMode = () => setArmed(readVisualPointerMode())
    syncMode()

    window.addEventListener(VISUAL_POINTER_MODE_EVENT, syncMode as EventListener)
    window.addEventListener("storage", syncMode)

    return () => {
      window.removeEventListener(VISUAL_POINTER_MODE_EVENT, syncMode as EventListener)
      window.removeEventListener("storage", syncMode)
    }
  }, [mounted])

  const handleCapture = React.useCallback((nextCapture: VisualPointerCapture) => {
    setCapture(nextCapture)
    setVisualPointerMode(false)
    setArmed(false)
  }, [])

  if (!mounted || !isVisualPointerEnabledEnv()) {
    return null
  }

  return (
    <>
      <VisualPointerToggle />
      <VisualPointerOverlay armed={armed} onCapture={handleCapture} />
      <VisualPointerDrawer capture={capture} onClose={() => setCapture(null)} />
    </>
  )
}
