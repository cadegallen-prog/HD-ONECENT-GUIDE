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
    <nav className="guide-toc grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 not-prose">
      {chapters.map((chapter, index) => (
        <Link
          key={chapter.slug}
          href={chapter.href}
          className="group flex flex-col p-5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] hover:border-[var(--cta-primary)] transition-all duration-200 h-full"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-md bg-[var(--bg-elevated)] text-[var(--cta-primary)] group-hover:bg-[var(--cta-primary)] group-hover:text-[var(--cta-text)] transition-colors">
              <chapter.icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-subtle)] px-2 py-1 rounded-sm group-hover:bg-[var(--bg-elevated)] transition-colors">
              Part {index + 1}
            </span>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--cta-primary)] transition-colors mb-2 leading-tight">
              {chapter.title}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-normal">{chapter.desc}</p>
          </div>
        </Link>
      ))}
    </nav>
  )
}
