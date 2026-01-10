"use client"

import { useEffect, useRef } from "react"
import { Check, X } from "lucide-react"

interface SaveToastProps {
  show: boolean
  message: string
  type: "added" | "removed"
  position: { x: number; y: number }
  onClose: () => void
}

export function SaveToast({ show, message, type, position, onClose }: SaveToastProps) {
  const toastRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div
      ref={toastRef}
      className="fixed z-50 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-sm text-[var(--text-primary)] animate-in fade-in slide-in-from-bottom-2 duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translateX(-50%)",
      }}
    >
      {type === "added" ? (
        <Check className="w-4 h-4 text-[var(--cta-primary)]" />
      ) : (
        <X className="w-4 h-4 text-[var(--text-muted)]" />
      )}
      <span>{message}</span>
    </div>
  )
}
