"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { US_STATES } from "@/lib/us-states"

interface StateBreakdownSheetProps {
  open: boolean
  onClose: () => void
  stateCounts: Record<string, number> | undefined
  windowLabel: string
  userState?: string
}

function getStateName(code: string): string {
  const state = US_STATES.find((s) => s.code === code)
  return state?.name || code
}

function buildStateBreakdownEntries(
  locations: Record<string, number> | undefined,
  userState?: string
): Array<[string, number]> {
  // Only include states that actually have reports (no 0-count entries)
  const entries = locations ? Object.entries(locations).filter(([, count]) => count > 0) : []
  const normalizedUserState = userState?.trim().toUpperCase()

  // Sort by count descending, then alphabetically
  entries.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

  // If user's state has reports, move it to top
  if (normalizedUserState) {
    const index = entries.findIndex(([state]) => state === normalizedUserState)
    if (index > 0) {
      entries.unshift(entries.splice(index, 1)[0])
    }
  }

  return entries
}

export function StateBreakdownSheet({
  open,
  onClose,
  stateCounts,
  windowLabel,
  userState,
}: StateBreakdownSheetProps) {
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

  if (!open || typeof document === "undefined") return null

  const hasLocationData = Boolean(stateCounts && Object.keys(stateCounts).length > 0)
  const entries = buildStateBreakdownEntries(stateCounts, userState)

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[var(--bg-hover)] opacity-80"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="state-breakdown-title"
      >
        <div className="w-full max-w-md rounded-t-2xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 shadow-[var(--shadow-card)] sm:rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2
                id="state-breakdown-title"
                className="text-base font-semibold text-[var(--text-primary)]"
              >
                State breakdown ({windowLabel})
              </h2>
              {!hasLocationData && (
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  No state data available for this item
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
              aria-label="Close state breakdown"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {entries.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm">
              {entries.map(([state, count]) => (
                <li
                  key={state}
                  className="flex items-center justify-between rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] px-3 py-2 text-[var(--text-secondary)]"
                  title={getStateName(state)}
                >
                  <span className="font-semibold text-[var(--text-primary)]">{state}</span>
                  <span>
                    {count} {count === 1 ? "report" : "reports"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
