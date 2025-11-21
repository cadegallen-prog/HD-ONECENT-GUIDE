import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="callout-box warning">
            <h3 className="font-heading font-semibold mb-3 text-sm">Disclaimer</h3>
            <div className="text-xs space-y-2 text-foreground">
              <p>
                This guide is an educational resource created by and for the "Home Depot One Cent Items"
                community. It is not affiliated with, endorsed by, or sponsored by The Home Depot, Inc.
              </p>
              <p>
                PLACEHOLDER_FOOTER_DISCLAIMER: All information is provided for educational purposes.
                Retail policies vary by location and are subject to change. Store managers have
                discretion to refuse any sale. Always respect store staff and policies. The creators
                of this guide assume no liability for actions taken based on this information.
              </p>
              <p>
                "Home Depot" is a registered trademark of Homer TLC, Inc. This guide is a
                community-created educational resource and makes fair use of the trademark for
                descriptive purposes only.
              </p>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid md:grid-cols-3 gap-8 mb-8 max-w-4xl mx-auto">
          <div>
            <h3 className="font-heading font-semibold mb-4 text-sm">Reference Sections</h3>
            <ul className="space-y-2">
              <li>
                <a href="#what-are-pennies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  What Are Pennies
                </a>
              </li>
              <li>
                <a href="#clearance-lifecycle" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Clearance Lifecycle
                </a>
              </li>
              <li>
                <a href="#digital-tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Digital Tools
                </a>
              </li>
              <li>
                <a href="#in-store-strategies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  In-Store Strategies
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold mb-4 text-sm">Best Practices</h3>
            <ul className="space-y-2">
              <li>
                <a href="#checkout" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Checkout Procedures
                </a>
              </li>
              <li>
                <a href="#responsible-hunting" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Responsible Hunting
                </a>
              </li>
              <li>
                <a href="#facts-vs-myths" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Facts vs Myths
                </a>
              </li>
              <li>
                <a href="#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

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
                <p className="text-xs text-muted-foreground mt-1">
                  Community chats are going away starting October 5. Download messages in Accounts Center and stay
                  connected in the group on Facebook.
                </p>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">32,000+ active members</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} HD Penny Guide Community Resource. Not affiliated with The Home Depot, Inc.
            Built with Next.js & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  )
}
