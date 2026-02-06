import Link from "next/link"
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Search,
  ShoppingCart,
  Store,
} from "lucide-react"

const chapters = [
  {
    title: "What Are Penny Items? (Start Here)",
    slug: "what-are-pennies",
    icon: BookOpen,
    desc: "Definitions, why pennies exist, and the ethics that keep the hobby alive.",
    href: "/what-are-pennies",
  },
  {
    title: "Clearance Lifecycle & Cadence",
    slug: "clearance-lifecycle",
    icon: Calendar,
    desc: "Common price endings, cadence patterns, and how to read tag dates without guessing.",
    href: "/clearance-lifecycle",
  },
  {
    title: "Labels, Overhead, & Pre-Hunt",
    slug: "digital-pre-hunt",
    icon: Search,
    desc: "Label recognition, overhead cues, and digital checks before you drive.",
    href: "/digital-pre-hunt",
  },
  {
    title: "Verify & In-Store Strategy",
    slug: "in-store-strategy",
    icon: Store,
    desc: "How to verify penny status, where to look, and how to checkout without drama.",
    href: "/in-store-strategy",
  },
  {
    title: "Inside Scoop (2026 Context)",
    slug: "inside-scoop",
    icon: ShoppingCart,
    desc: "Community-reported signals, internal terms, and what to treat as unconfirmed.",
    href: "/inside-scoop",
  },
  {
    title: "Facts vs. Myths",
    slug: "facts-vs-myths",
    icon: CheckCircle2,
    desc: "Myth-busting and how to vet claims before you waste a trip.",
    href: "/facts-vs-myths",
  },
  {
    title: "FAQ & Quick Reference",
    slug: "faq",
    icon: HelpCircle,
    desc: "Fast answers, common pitfalls, and a quick reference cheat sheet.",
    href: "/faq",
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
            <span className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-subtle)] px-2 py-1 rounded-sm group-hover:bg-[var(--bg-elevated)] transition-colors">
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
