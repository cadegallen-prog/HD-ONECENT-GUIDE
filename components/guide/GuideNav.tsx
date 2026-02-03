import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GuideNavProps {
  prev?: { label: string; href: string }
  next?: { label: string; href: string }
}

export function GuideNav({ prev, next }: GuideNavProps) {
  return (
    <nav className="flex flex-col sm:flex-row gap-4 justify-between mt-12 pt-8 border-t border-[var(--border-primary)]">
      {prev ? (
        <Button
          variant="secondary"
          asChild
          className="h-auto py-4 px-6 justify-start text-left bg-[var(--bg-elevated)] border border-[var(--border-default)]"
        >
          <Link href={prev.href} className="group">
            <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
                Previous
              </span>
              <span className="text-[var(--text-primary)] font-medium text-wrap">{prev.label}</span>
            </div>
          </Link>
        </Button>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Button
          variant="secondary"
          asChild
          className="h-auto py-4 px-6 justify-end text-right bg-[var(--bg-elevated)] border border-[var(--border-default)]"
        >
          <Link href={next.href} className="group">
            <div className="flex flex-col gap-0.5 items-end">
              <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">
                Next
              </span>
              <span className="text-[var(--text-primary)] font-medium text-wrap">{next.label}</span>
            </div>
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      ) : (
        <div className="hidden sm:block" />
      )}
    </nav>
  )
}
