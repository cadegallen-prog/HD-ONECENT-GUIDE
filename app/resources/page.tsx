"use client"

import { Download, ExternalLink, Facebook, Search, MapPin, Calendar, ShoppingCart, BookOpen } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ResourcesPage() {
  const handleDownload = (type: string) => {
    const link = document.createElement('a')
    link.href = '/Home-Depot-Penny-Guide.pdf'
    link.download = 'Home-Depot-Penny-Guide.pdf'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const tools = [
    {
      icon: Search,
      name: "BrickSeek",
      description: "Check inventory and prices at your local Home Depot stores",
      url: "https://brickseek.com/home-depot-inventory-checker",
      category: "Price Checking"
    },
    {
      icon: MapPin,
      name: "Home Depot Store Finder",
      description: "Official store locator with hours and phone numbers",
      url: "https://www.homedepot.com/l/",
      category: "Store Locator"
    },
    {
      icon: ShoppingCart,
      name: "Home Depot App",
      description: "Official app for checking prices and product availability",
      url: "https://www.homedepot.com/c/mobile-app",
      category: "Mobile Tools"
    },
    {
      icon: Facebook,
      name: "Home Depot One Cent Items Group",
      description: "Active community sharing finds and tips",
      url: "https://www.facebook.com/groups/homedepotonecent",
      category: "Community"
    },
  ]

  const quickRef = [
    {
      title: "Clearance Price Endings",
      items: [
        "$.03, $.06, $.09 = Low markdown (10-25% off)",
        "$.33, $.66 = Medium markdown (25-50% off)",
        "$.97 = Full clearance (deep discount)",
        "$.01 = Penny items (discontinued)"
      ]
    },
    {
      title: "Best Times to Hunt",
      items: [
        "Weekday mornings (7-9 AM) - Less competition",
        "Tuesday/Wednesday - New markdowns often appear",
        "End of season - Major clearance cycles",
        "After inventory counts - Items get marked down"
      ]
    },
    {
      title: "What to Bring",
      items: [
        "Phone with Home Depot app installed",
        "Reusable shopping bags",
        "List of stores to check",
        "Patience and politeness"
      ]
    }
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-foreground">
                Resources & Tools
              </h1>
              <p className="text-lg text-muted-foreground">
                Essential guides, tools, and community resources for penny hunting
              </p>
            </div>

            {/* Download Section */}
            <div className="mb-12">
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/20 rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                    <Download className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-heading font-bold mb-2 text-foreground">
                      Complete HD Penny Guide
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Download the full PDF guide with all strategies, tips, and reference materials in one convenient document. Perfect for offline reading and printing.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleDownload('full')}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 font-heading font-semibold shadow-md hover:shadow-lg"
                      >
                        <Download className="h-5 w-5" />
                        Download Full Guide (PDF)
                      </button>
                      <a
                        href="/Home-Depot-Penny-Guide.pdf"
                        target="_blank"
                        className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95 font-heading font-semibold"
                      >
                        <ExternalLink className="h-5 w-5" />
                        Open in Browser
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* External Tools */}
            <div className="mb-12">
              <h2 className="text-3xl font-heading font-bold mb-6 text-foreground">
                Essential Tools
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {tools.map((tool, index) => (
                  <a
                    key={index}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-card border-2 border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <tool.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                            {tool.name}
                          </h3>
                          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {tool.description}
                        </p>
                        <span className="inline-block text-xs font-medium px-2 py-1 bg-accent rounded-md text-accent-foreground">
                          {tool.category}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Reference */}
            <div className="mb-12">
              <h2 className="text-3xl font-heading font-bold mb-6 text-foreground">
                Quick Reference
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {quickRef.map((section, index) => (
                  <div key={index} className="bg-card border border-border rounded-xl p-6">
                    <h3 className="font-heading font-semibold text-lg mb-4 text-foreground">
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Print-Friendly Cheat Sheet */}
            <div className="mb-12">
              <div className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-bold mb-2 text-foreground">
                      One-Page Cheat Sheet
                    </h2>
                    <p className="text-muted-foreground">
                      Essential info on a single page - perfect for keeping in your wallet or phone
                    </p>
                  </div>
                </div>

                <div className="bg-accent/50 rounded-lg p-6 border border-primary/20">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-heading font-semibold mb-2 text-foreground">Price Decoder</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">$.01</span><span className="font-medium text-primary">PENNY!</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">$.03/.06/.09</span><span className="font-medium">10-25% off</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">$.33/.66</span><span className="font-medium">25-50% off</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">$.97</span><span className="font-medium">Deep discount</span></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold mb-2 text-foreground">Pro Tips</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✓ Shop weekday mornings</li>
                        <li>✓ Check end caps & clearance aisles</li>
                        <li>✓ Use self-checkout</li>
                        <li>✓ Be polite to staff</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="mt-6 flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all font-heading font-medium"
                >
                  <Download className="h-4 w-4" />
                  Print This Page
                </button>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="callout-box info">
              <h3 className="font-heading font-semibold mb-3 text-foreground">Community Guidelines</h3>
              <div className="space-y-2 text-sm text-foreground">
                <p>
                  The penny hunting community thrives on respect, honesty, and sharing. Remember:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Always be courteous to store staff - they're just doing their job</li>
                  <li>Don't clear shelves - leave items for others</li>
                  <li>Share your finds to help the community</li>
                  <li>Never resell penny items for profit</li>
                  <li>Report outdated information to help keep resources current</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
