import { X, Check, AlertTriangle } from "lucide-react"

interface ComparisonRow {
  claim: string
  verdict: "true" | "false" | "complicated"
  reality: string
}

interface TruthMatrixProps {
  title?: string
  rows: ComparisonRow[]
}

export function TruthMatrix({ title = "2026 Reality Check", rows }: TruthMatrixProps) {
  return (
    <div className="my-8 overflow-hidden rounded-lg border border-[var(--border-default)]">
      {title && (
        <div className="bg-[var(--bg-muted)] px-4 py-3 border-b border-[var(--border-default)]">
          <h3 className="font-bold text-[var(--text-primary)]">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[var(--bg-subtle)] border-b border-[var(--border-default)]">
              <th className="px-4 py-3 font-medium text-[var(--text-secondary)] w-1/3">
                Old Rule / Myth
              </th>
              <th className="px-4 py-3 font-medium text-[var(--text-secondary)] w-24 text-center">
                Verdict
              </th>
              <th className="px-4 py-3 font-medium text-[var(--text-secondary)]">2026 Reality</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)] bg-[var(--bg-card)]">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-[var(--bg-subtle)]/50 transition-colors">
                <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{row.claim}</td>
                <td className="px-4 py-3 text-center">
                  <VerdictBadge variant={row.verdict} />
                </td>
                <td className="px-4 py-3 text-[var(--text-secondary)] leading-relaxed">
                  {row.reality}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function VerdictBadge({ variant }: { variant: "true" | "false" | "complicated" }) {
  if (variant === "true") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <Check className="h-3 w-3" /> Still True
      </span>
    )
  }
  if (variant === "false") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400">
        <X className="h-3 w-3" /> Dead
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
      <AlertTriangle className="h-3 w-3" /> Changed
    </span>
  )
}
