"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

interface BarcodeModalProps {
  open: boolean
  upc: string
  onClose: () => void
}

export function BarcodeModal({ open, upc, onClose }: BarcodeModalProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!open || !upc || !svgRef.current) return
    let cancelled = false

    import("jsbarcode").then((module) => {
      if (cancelled) return
      module.default(svgRef.current!, upc, {
        format: "UPC",
        displayValue: false,
        width: 2,
        height: 90,
        margin: 0,
      })
    })

    return () => {
      cancelled = true
    }
  }, [open, upc])

  useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKey)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener("keydown", handleKey)
    }
  }, [open, onClose])

  if (!open || !upc || typeof document === "undefined") return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
        <button
          type="button"
          onClick={() => onClose()}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
          aria-label="Close barcode"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Scan this UPC</h2>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Show this to a cashier or scanner app
        </p>
        <div className="mt-5 rounded-2xl border border-[var(--border-default)] bg-white p-4 text-center">
          <svg ref={svgRef} className="mx-auto h-24 w-full" aria-hidden="true" />
        </div>
        <p className="mt-3 text-center text-sm font-mono text-[var(--text-secondary)]">{upc}</p>
        <button
          type="button"
          onClick={() => onClose()}
          className="mt-5 w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-muted)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--cta-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  )
}
