import { User, Calendar, Info } from "lucide-react"

export function EditorialBlock() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)] border-y border-[var(--border-default)] py-4 not-prose bg-[var(--bg-card)] px-4 rounded-sm">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-[var(--cta-primary)]" />
        <span className="font-medium text-[var(--text-primary)]">
          Written by PennyCentral Editorial Team
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <span>Last updated: February 2026</span>
      </div>
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4" />
        <span>Purpose: Community-verified educational guide</span>
      </div>
    </div>
  )
}
