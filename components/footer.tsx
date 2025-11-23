import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
          {/* Community */}
          <div>
            <h3 className="font-heading font-semibold mb-4 text-sm">Community</h3>
            <ul className="space-y-2">
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

          {/* Created By */}
          <div>
            <h3 className="font-heading font-semibold mb-4 text-sm">Created By</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Built by Cade Allen for the Home Depot One Cent Items community.
            </p>
            <p className="text-xs text-muted-foreground">
              Group Admins: Spoe Jarky, Cade Allen, Jorian Wulf
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <span className="font-semibold">Disclaimer:</span> Community-run educational resource. Not affiliated with,
              endorsed by, or sponsored by The Home Depot, Inc. For informational use only. Retail policies vary and can
              change without notice. "Home Depot" is a registered trademark of Homer TLC, Inc.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Community resource maintained by volunteers. Not affiliated with The Home Depot, Inc.
          </p>
        </div>
      </div>
    </footer>
  )
}
