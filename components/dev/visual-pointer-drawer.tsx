"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import type { VisualPointerCapture } from "@/lib/visual-pointer/types"

interface VisualPointerDrawerProps {
  capture: VisualPointerCapture | null
  onClose: () => void
}

export function VisualPointerDrawer({ capture, onClose }: VisualPointerDrawerProps) {
  const [mounted, setMounted] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved" | "error">("idle")
  const [artifactPath, setArtifactPath] = React.useState<string | null>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!copied) {
      return
    }
    const timer = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timer)
  }, [copied])

  // Reset save state when capture changes
  React.useEffect(() => {
    setSaveStatus("idle")
    setArtifactPath(null)
  }, [capture])

  const handleCopy = React.useCallback(async () => {
    if (!capture) {
      return
    }
    await navigator.clipboard.writeText(JSON.stringify(capture, null, 2))
    setCopied(true)
  }, [capture])

  const handleSave = React.useCallback(async () => {
    if (!capture || saveStatus === "saving") {
      return
    }
    setSaveStatus("saving")
    try {
      const response = await fetch("/api/dev/visual-pointer/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capture }),
      })
      const data = (await response.json()) as { ok?: boolean; artifactPath?: string }
      if (data.ok && data.artifactPath) {
        setSaveStatus("saved")
        setArtifactPath(data.artifactPath)
      } else {
        setSaveStatus("error")
      }
    } catch {
      setSaveStatus("error")
    }
  }, [capture, saveStatus])

  if (!mounted || !capture) {
    return null
  }

  const preview = JSON.stringify(capture, null, 2)

  const saveLabel =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "saved"
        ? "Saved"
        : saveStatus === "error"
          ? "Save Failed"
          : "Save Local Artifact"

  return createPortal(
    <div data-visual-pointer-ui="true" className="fixed inset-x-0 bottom-0 z-[66] p-3 sm:p-4">
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--border-default)] px-4 py-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Visual Pointer Capture Ready
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] px-3 text-xs font-medium text-[var(--text-primary)]"
          >
            Close
          </button>
        </div>

        <div className="max-h-[40vh] overflow-auto p-4">
          <pre
            data-testid="visual-pointer-json"
            className="whitespace-pre-wrap break-words rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-3 text-xs text-[var(--text-secondary)]"
          >
            {preview}
          </pre>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border-default)] px-4 py-3">
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[44px] rounded-lg bg-[var(--cta-primary)] px-4 text-sm font-semibold text-[var(--cta-text)]"
          >
            {copied ? "Copied" : "Copy for AI"}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saveStatus === "saving" || saveStatus === "saved"}
            className="min-h-[44px] rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] px-4 text-sm font-medium text-[var(--text-primary)] disabled:text-[var(--text-muted)]"
          >
            {saveLabel}
          </button>
          {artifactPath && <span className="text-xs text-[var(--text-muted)]">{artifactPath}</span>}
        </div>
      </div>
    </div>,
    document.body
  )
}
