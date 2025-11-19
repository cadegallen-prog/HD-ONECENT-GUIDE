"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Smartphone, Shield, Eye, FileText, UserX } from "lucide-react"
import { motion } from "framer-motion"

export default function InternalSystemsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
          </div>

          <div className="container mx-auto px-4 py-24">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8"
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Section VI</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight mb-6 leading-[1.1]"
              >
                The Inside Scoop:
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  How Home Depot Handles Penny Items Internally
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Understanding the internal systems, employee policies, and why management cares so much about penny items.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Warning Box */}
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-6 flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-destructive mb-2">Important Context</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    This information is for educational purposes only. Understanding internal systems helps you navigate clearance hunting responsibly. Always respect store policies and employees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">

              {/* Penny Items = Not Meant for Sale */}
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Penny Items = Not Meant for Sale (ZMA Explained)
                </h2>
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        In Home Depot's inventory system, penny items are designated with a special status code called <span className="font-semibold text-foreground">ZMA (Zero Merchandise Authorization)</span>. This is not a sales price—it's an internal flag that means:
                      </p>
                      <ul className="space-y-3 ml-6">
                        <li className="flex items-start gap-3">
                          <span className="text-primary font-bold">•</span>
                          <span className="text-muted-foreground">The item has been removed from active inventory</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-primary font-bold">•</span>
                          <span className="text-muted-foreground">It should have been returned to the vendor or destroyed</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-primary font-bold">•</span>
                          <span className="text-muted-foreground">The system no longer tracks it for replenishment</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-primary font-bold">•</span>
                          <span className="text-muted-foreground">Corporate considers it "gone" from store records</span>
                        </li>
                      </ul>
                      <div className="bg-muted/50 rounded-lg p-4 mt-4">
                        <p className="text-sm font-semibold mb-2">Why the Penny Price?</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          The $0.01 price exists because the system can't have "zero" or "null" values in the POS (Point of Sale) system. The penny acts as a placeholder to prevent system errors while flagging the item as end-of-life.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Employee Policy */}
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Employee Policy: Strict Rules
                </h2>
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed">
                        Home Depot has clear internal policies regarding penny items:
                      </p>
                      <div className="grid gap-4 mt-4">
                        <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                          <UserX className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold mb-1">No Employee Purchases</h4>
                            <p className="text-sm text-muted-foreground">Employees are strictly prohibited from purchasing penny items for themselves or immediate family. Violations can result in termination.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                          <Eye className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold mb-1">Management Discretion</h4>
                            <p className="text-sm text-muted-foreground">Store and department managers have the authority to refuse sales of penny items, even if they scan at checkout.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                          <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold mb-1">SOP Guidelines</h4>
                            <p className="text-sm text-muted-foreground">Standard Operating Procedures state that penny items should be pulled from shelves immediately and processed for return, donation, or disposal.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* FIRST Phones & Clearance App */}
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  FIRST Phones & Clearance App
                </h2>
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Smartphone className="w-8 h-8 text-primary flex-shrink-0" />
                        <div>
                          <h3 className="text-xl font-semibold mb-3">Internal Tools Employees Use</h3>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            Home Depot employees use specialized devices and apps that give them more visibility than customer-facing tools:
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="border-l-4 border-primary pl-4 py-2">
                          <h4 className="font-semibold mb-2">FIRST Phones</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Orange Zebra devices that show real-time inventory levels, exact aisle locations, markdown schedules, and ZMA status. They can see what customers cannot.
                          </p>
                        </div>

                        <div className="border-l-4 border-primary pl-4 py-2">
                          <h4 className="font-semibold mb-2">Clearance Management App</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Tracks items moving through markdown cadences, flags items approaching penny status, and generates pull lists for items that should be removed from the sales floor.
                          </p>
                        </div>

                        <div className="border-l-4 border-primary pl-4 py-2">
                          <h4 className="font-semibold mb-2">Markdown Alerts</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Department supervisors receive automated alerts when items hit penny status, with instructions to locate and remove them from inventory.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Why Management Cares */}
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Why Management Cares So Much
                </h2>
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        It's not about the lost revenue (a $300 item selling for $0.01 is a trivial loss). Management cares because:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-semibold mb-2 text-primary">Audit Compliance</h4>
                          <p className="text-sm text-muted-foreground">Corporate tracks how well stores follow ZMA procedures. Poor compliance affects store ratings.</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-semibold mb-2 text-primary">Loss Prevention Flags</h4>
                          <p className="text-sm text-muted-foreground">Multiple penny transactions look like internal theft patterns in their monitoring systems.</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-semibold mb-2 text-primary">Vendor Agreements</h4>
                          <p className="text-sm text-muted-foreground">Some discontinued items should be returned to vendors for credit. Selling them breaks vendor contracts.</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-semibold mb-2 text-primary">Customer Perception</h4>
                          <p className="text-sm text-muted-foreground">Word spreads fast. Stores become "penny hunting hotspots" which increases time spent on refusals and disputes.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* SOP Reality */}
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  SOP Reality: Policy vs. Practice
                </h2>
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        There's often a gap between what the policy says and what actually happens on the floor:
                      </p>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b-2 border-border">
                              <th className="text-left py-3 px-4 font-semibold">Official Policy</th>
                              <th className="text-left py-3 px-4 font-semibold">Reality</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm">
                            <tr className="border-b border-border">
                              <td className="py-3 px-4 text-muted-foreground">Pull all penny items immediately</td>
                              <td className="py-3 px-4 text-muted-foreground">Many stores are understaffed; items slip through for days or weeks</td>
                            </tr>
                            <tr className="border-b border-border">
                              <td className="py-3 px-4 text-muted-foreground">Never sell penny items to customers</td>
                              <td className="py-3 px-4 text-muted-foreground">If it scans, some cashiers will process it unless a manager intervenes</td>
                            </tr>
                            <tr className="border-b border-border">
                              <td className="py-3 px-4 text-muted-foreground">Daily clearance audits</td>
                              <td className="py-3 px-4 text-muted-foreground">Audits happen but vary by department and store traffic</td>
                            </tr>
                            <tr className="border-b border-border">
                              <td className="py-3 px-4 text-muted-foreground">Items returned to vendor or destroyed</td>
                              <td className="py-3 px-4 text-muted-foreground">Often sit in back storage for months due to logistics delays</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4 mt-4">
                        <p className="text-sm font-semibold mb-2">The Takeaway</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          The system is designed to prevent penny sales, but operational realities create gaps. Stores with better-trained staff and tighter inventory controls are harder to hunt successfully.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Line */}
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Bottom Line: Stay Under the Radar
                </h2>
                <Card className="border-2 border-primary/30 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Understanding the internal systems isn't about gaming them—it's about knowing when to walk away:
                      </p>
                      <ul className="space-y-3 ml-6">
                        <li className="flex items-start gap-3">
                          <span className="text-primary font-bold text-xl">✓</span>
                          <span className="text-muted-foreground"><span className="font-semibold text-foreground">Be respectful:</span> If an employee says no, accept it gracefully. Arguing damages the entire community.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-primary font-bold text-xl">✓</span>
                          <span className="text-muted-foreground"><span className="font-semibold text-foreground">Don't abuse access:</span> Buying carts full of penny items draws attention and gets policies tightened.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-primary font-bold text-xl">✓</span>
                          <span className="text-muted-foreground"><span className="font-semibold text-foreground">Know your stores:</span> Some locations are penny-friendly, others aren't. Learn which is which.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-primary font-bold text-xl">✓</span>
                          <span className="text-muted-foreground"><span className="font-semibold text-foreground">Keep it quiet:</span> Bragging on social media burns locations for everyone.</span>
                        </li>
                      </ul>
                      <div className="bg-background rounded-lg p-4 mt-4 border-2 border-border">
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                          "The best penny hunters are the ones nobody notices. They get their finds, say thank you, and leave without making a scene."
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between gap-4">
              <a href="/" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                ← Back to Home
              </a>
              <a href="/facts-vs-myths" className="text-primary hover:text-primary/80 font-semibold transition-colors text-right">
                Next: Facts vs Myths →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
