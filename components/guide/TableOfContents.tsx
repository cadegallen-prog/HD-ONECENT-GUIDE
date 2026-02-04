import Link from "next/link"
import { BookOpen, CheckCircle2, Search, ShoppingCart, Store } from "lucide-react"

const chapters = [
  {
    title: "Understanding the Clearance Lifecycle",
    slug: "clearance-lifecycle",
    icon: BookOpen,
    desc: "Store Pulse, ICE metrics, the $.02 buffer, and how items reach $0.01 in 2026.",
    href: "/clearance-lifecycle",
  },
  {
    title: "Pre-Hunt Intelligence",
    slug: "digital-pre-hunt",
    icon: Search,
    desc: "Using the app and digital tools to scout before you drive.",
    href: "/digital-pre-hunt",
  },
  {
    title: "In-Store Strategy",
    slug: "in-store-strategy",
    icon: Store,
    desc: "Home Bay focus, MET timing, and checkout tactics that actually work.",
    href: "/in-store-strategy",
  },
  {
    title: "The Inside Scoop",
    slug: "inside-scoop",
    icon: ShoppingCart,
    desc: "MET, “No Home”, Zero-Comm, and what happens to items after ZMA.",
    href: "/inside-scoop",
  },
  {
    title: "Fact vs. Fiction",
    slug: "fact-vs-fiction",
    icon: CheckCircle2,
    desc: "The 2026 myth-busters: cadence rumors, $.02 confusion, and register reality.",
    href: "/facts-vs-myths",
  },
  {
    title: "Responsible Hunting",
    slug: "responsible-hunting",
    icon: CheckCircle2,
    desc: "Etiquette, community rules, and long-term success.",
    href: "/what-are-pennies",
  },
]

export function TableOfContents() {
  return (
    <nav className="guide-toc grid gap-4 md:grid-cols-2 lg:grid-cols-3 not-prose">
      {chapters.map((chapter, index) => (
        <Link
          key={chapter.slug}
          href={chapter.href}
          className="group block p-5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] hover:border-[var(--cta-primary)] transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 rounded-md bg-[var(--bg-elevated)] text-[var(--cta-primary)] group-hover:bg-[var(--cta-primary)] group-hover:text-[var(--cta-text)] transition-colors">
              <chapter.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Chapter {index + 1}
              </div>
              <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--cta-primary)] transition-colors mb-2">
                {chapter.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{chapter.desc}</p>
            </div>
          </div>
        </Link>
      ))}
    </nav>
  )
}
