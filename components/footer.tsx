import Link from "next/link"

const sectionLinks = [
  { name: "What Are Pennies", href: "#what-are-pennies" },
  { name: "Clearance Lifecycle", href: "#clearance-lifecycle" },
  { name: "Digital Tools", href: "#pre-hunt-digital-tools" },
  { name: "In-Store Strategy", href: "#in-store-strategy" },
  { name: "Checkout", href: "#checkout" },
  { name: "FAQ", href: "#faq" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-[hsl(var(--surface))]">
      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-heading text-foreground">Home Depot Penny Items Guide</p>
            <p className="text-sm text-muted-foreground">
              Built for the Home Depot One Cent Items Facebook group. Calm, reference-first guidance so
              members aged 30–50 can learn the process without hype.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Browse</p>
            <div className="grid grid-cols-2 gap-2">
              {sectionLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-sm text-muted-foreground hover:text-foreground no-underline">
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground mb-2">Resources</p>
            <Link href="/Home-Depot-Penny-Guide.pdf" className="text-sm text-muted-foreground hover:text-foreground no-underline">
              Download PDF reference
            </Link>
            <p className="text-sm text-muted-foreground">Share responsibly. Verify SKUs in your local store before posting.</p>
          </div>
        </div>

        <div className="border-t border-border pt-4 text-sm text-muted-foreground">
          <p>Not affiliated with The Home Depot. Information is observational, for educational use in-store at your discretion.</p>
        </div>
      </div>
    </footer>
  )
}
