import Link from "next/link"
import { ArrowLeft, ArrowRight, Home } from "lucide-react"

interface NavItem {
  slug: string
  title: string
}

interface ChapterNavigationProps {
  prev?: NavItem
  next?: NavItem
}

export function ChapterNavigation({ prev, next }: ChapterNavigationProps) {
  return (
    <nav
      className="mt-16 grid grid-cols-2 gap-4 border-t border-[var(--border-default)] pt-8"
      aria-label="Chapter navigation"
    >
      <div className="col-start-1">
        {prev ? (
          <Link
            href={`/${prev.slug}`}
            className="group flex flex-col items-start gap-1 p-4 -ml-4 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors text-left"
          >
            <span className="flex items-center text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
              <ArrowLeft className="mr-1 h-3 w-3 transition-transform group-hover:-translate-x-1" />
              Previous
            </span>
            <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--cta-primary)] transition-colors">
              {prev.title}
            </span>
          </Link>
        ) : (
          <Link
            href="/guide"
            className="group flex flex-col items-start gap-1 p-4 -ml-4 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors text-left"
          >
            <span className="flex items-center text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
              <Home className="mr-1 h-3 w-3" />
              Start Over
            </span>
            <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--cta-primary)] transition-colors">
              Guide Hub
            </span>
          </Link>
        )}
      </div>

      <div className="col-start-2 flex justify-end">
        {next && (
          <Link
            href={`/${next.slug}`}
            className="group flex flex-col items-end gap-1 p-4 -mr-4 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors text-right"
          >
            <span className="flex items-center text-xs font-medium text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
              Next
              <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--cta-primary)] transition-colors">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}
