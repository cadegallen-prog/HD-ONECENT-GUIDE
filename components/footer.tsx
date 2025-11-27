import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://www.facebook.com/groups/homedepotonecent"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Facebook Group: Home Depot One Cent Items
                </Link>
              </li>
              <li>
                <Link
                  href="https://m.me/cm/AbYH-T88smeOjfsT/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Messenger Chat: Home Depot One Cent Items
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">About</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Built by members of the Home Depot One Cent Items community.
            </p>
            <p className="text-sm text-muted-foreground">
              Community-run educational resource made for HDOCI.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            <span className="font-semibold">Disclaimer:</span>{" "}
            Not affiliated with, endorsed by, or sponsored by The Home Depot, Inc. For informational use only. Retail
            policies vary and can change without notice. &quot;Home Depot&quot; is a registered trademark of Homer TLC,
            Inc.
          </p>
        </div>
      </div>
    </footer>
  )
}
