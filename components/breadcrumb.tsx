"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { usePathname } from "next/navigation"

export function Breadcrumb() {
  const pathname = usePathname()

  // Don't show breadcrumb on homepage
  if (pathname === "/") return null

  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split("/").filter(Boolean)

  // Convert path segments to readable labels
  const formatLabel = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>

          {pathSegments.map((segment, index) => {
            const path = "/" + pathSegments.slice(0, index + 1).join("/")
            const isLast = index === pathSegments.length - 1

            return (
              <li key={path} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                {isLast ? (
                  <span className="font-medium text-foreground">{formatLabel(segment)}</span>
                ) : (
                  <Link
                    href={path}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {formatLabel(segment)}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
