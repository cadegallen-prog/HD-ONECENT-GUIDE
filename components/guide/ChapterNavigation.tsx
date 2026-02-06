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
      className="mt-10 border-t border-[var(--border-default)] pt-5"
      aria-label="Chapter navigation"
    >
      <div className={`grid gap-5 ${next ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
        <div className="text-left">
          {prev ? (
            <>
              <span className="mb-1 flex items-center text-xs font-medium text-[var(--text-muted)]">
                <ArrowLeft className="mr-1 h-3.5 w-3.5" />
                Previous chapter
              </span>
              <Link
                href={`/${prev.slug}`}
                className="text-base font-semibold text-[var(--text-primary)] hover:text-[var(--cta-primary)] no-underline"
              >
                {prev.title}
              </Link>
            </>
          ) : (
            <>
              <span className="mb-1 flex items-center text-xs font-medium text-[var(--text-muted)]">
                <Home className="mr-1 h-3.5 w-3.5" />
                Guide index
              </span>
              <Link
                href="/guide"
                className="text-base font-semibold text-[var(--text-primary)] hover:text-[var(--cta-primary)] no-underline"
              >
                Guide Hub
              </Link>
            </>
          )}
        </div>

        {next && (
          <div className="text-left sm:text-right">
            <span className="mb-1 inline-flex items-center text-xs font-medium text-[var(--text-muted)]">
              Next chapter
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </span>
            <Link
              href={`/${next.slug}`}
              className="block text-base font-semibold text-[var(--text-primary)] hover:text-[var(--cta-primary)] no-underline"
            >
              {next.title}
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
