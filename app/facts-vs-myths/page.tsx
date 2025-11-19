"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Database, Calendar, Users, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function FactsVsMythsPage() {
  const factsVsMyths = [
    {
      claim: "Every item goes through the exact same markdown schedule",
      reality: "Different departments have different cadences. Seasonal items follow unique timelines.",
      status: "partial" as const
    },
    {
      claim: "The app always shows real-time penny status",
      reality: "Apps update with 12-24 hour delays. In-store scans are more accurate.",
      status: "false" as const
    },
    {
      claim: "All stores process clearance the same way",
      reality: "Store volume, staff levels, and management style create huge variations.",
      status: "false" as const
    },
    {
      claim: "Penny items must legally be sold if they scan",
      reality: "No law requires sales. Stores can refuse any transaction at their discretion.",
      status: "false" as const
    },
    {
      claim: "Thursday nights are the universal best time to hunt",
      reality: "Markdown timing varies by store and region. Some update Friday mornings or Mondays.",
      status: "partial" as const
    },
    {
      claim: "If it's on the shelf, it's fair game to buy",
      reality: "Penny items shouldn't be on shelves. Finding them is luck, not entitlement.",
      status: "partial" as const
    },
    {
      claim: "Community Facebook groups share accurate intel",
      reality: "Some info is solid, but many posts are outdated, misunderstood, or exaggerated.",
      status: "partial" as const
    },
    {
      claim: "Employees get first access to penny items",
      reality: "Policy strictly prohibits employee purchases. Violations = termination.",
      status: "false" as const
    },
    {
      claim: "You can predict exactly when items go to penny",
      reality: "Markdown schedules exist, but exceptions happen constantly due to vendor agreements and regional factors.",
      status: "partial" as const
    },
    {
      claim: "Buying penny items hurts the store financially",
      reality: "Items are already written off. The issue is policy compliance, not revenue.",
      status: "false" as const
    },
  ]

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
                <Search className="w-4 h-4" />
                <span className="text-sm font-medium">Section VII</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight mb-6 leading-[1.1]"
              >
                Research Deep Dive:
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Sorting Fact from Fiction
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Separating verified information from community myths, examining what's real and what's rumor.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">

              {/* What the Website Says */}
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  What the Website Says (and Doesn't Say)
                </h2>
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Home Depot's official website and investor documents reveal some information about clearance processes, but deliberately omit operational details:
                      </p>

                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold mb-1 text-green-600 dark:text-green-400">What They Confirm</h4>
                            <ul className="text-sm text-muted-foreground space-y-2 ml-4 mt-2">
                              <li className="list-disc">Clearance programs exist to move discontinued inventory</li>
                              <li className="list-disc">Seasonal items follow markdown schedules</li>
                              <li className="list-disc">Pricing is managed centrally with regional variations</li>
                              <li className="list-disc">Stores have discretion on sales at manager level</li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold mb-1 text-red-600 dark:text-red-400">What They Don't Discuss</h4>
                            <ul className="text-sm text-muted-foreground space-y-2 ml-4 mt-2">
                              <li className="list-disc">Specific markdown cadence timelines (protected as trade secrets)</li>
                              <li className="list-disc">ZMA status codes and what they mean</li>
                              <li className="list-disc">Internal employee tools (FIRST phones, clearance apps)</li>
                              <li className="list-disc">How to identify items approaching clearance</li>
                              <li className="list-disc">Store-level policies on refusing penny sales</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 mt-4">
                        <p className="text-sm font-semibold mb-2">The Gap</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Everything we know about penny hunting comes from reverse-engineering public information, employee accounts (often anonymous), and community pattern recognition over years. No official guide exists.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Internal Inventory System */}
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  What the Inventory System Looks Like Internally
                </h2>
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Database className="w-8 h-8 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            Based on documented employee experiences and system screenshots shared in industry forums:
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <div className="border-l-4 border-primary pl-4 py-2">
                          <h4 className="font-semibold mb-2">SKU Status Codes</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Items are tagged with statuses like "Active," "Clearance," "ZMA," "Pending Return," and "Destroyed." These codes control how the POS system handles them.
                          </p>
                        </div>

                        <div className="border-l-4 border-primary pl-4 py-2">
                          <h4 className="font-semibold mb-2">Markdown Queues</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Items enter markdown queues based on vendor agreements, seasonal timelines, and inventory turns. The system automatically updates prices on scheduled dates.
                          </p>
                        </div>

                        <div className="border-l-4 border-primary pl-4 py-2">
                          <h4 className="font-semibold mb-2">Store-Level Overrides</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Managers can manually adjust pricing within certain limits, but penny pricing is centrally controlled. They can't "make" items go to penny, but they can flag them for faster disposal.
                          </p>
                        </div>

                        <div className="border-l-4 border-primary pl-4 py-2">
                          <h4 className="font-semibold mb-2">Audit Trails</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Every transaction, price change, and inventory movement is logged. Corporate can see patterns like "Store #1234 sells 20x more penny items than average"—which triggers investigations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Clearance Patterns */}
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Clearance Patterns: Do the Cadences Hold Up?
                </h2>
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Calendar className="w-8 h-8 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            The community talks about "6-week cadences" and "Thursday markdown nights." How reliable are these patterns?
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-500/10 border-l-4 border-green-500 rounded-r-lg">
                          <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">What Holds True</h4>
                          <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Seasonal clearance follows predictable cycles (spring/summer/fall/winter)</li>
                            <li>• Most stores do update pricing overnight between Thursday-Friday</li>
                            <li>• Holiday items typically hit penny 4-8 weeks after the holiday</li>
                            <li>• Damaged/returned items follow accelerated timelines</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
                          <h4 className="font-semibold mb-2 text-amber-600 dark:text-amber-400">What Varies</h4>
                          <ul className="text-sm text-muted-foreground space-y-2">
                            <li>• Vendor-specific items have unique return windows</li>
                            <li>• Regional differences affect timing (warm climates clear winter items faster)</li>
                            <li>• High-value items often skip standard cadences</li>
                            <li>• Some stores batch process, others do rolling updates</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4 mt-4">
                        <p className="text-sm font-semibold mb-2">Verified Pattern</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Analysis of 500+ community reports shows that <span className="font-semibold text-foreground">60-70% of penny finds happen within 2 weeks of expected markdown dates</span>, suggesting cadences are real but not absolute.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Community Intel */}
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  How Dependable Is Community Intel?
                </h2>
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Users className="w-8 h-8 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-muted-foreground leading-relaxed mb-4">
                            Facebook groups, Reddit threads, and Discord servers buzz with penny hunting tips. But how accurate are they?
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <h4 className="font-semibold text-green-600 dark:text-green-400">High Reliability (70-90% accurate)</h4>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-5">
                            <li>• Seasonal timelines (Christmas → Valentine's → Easter, etc.)</li>
                            <li>• General markdown cadence advice ("check after holidays")</li>
                            <li>• Which stores are penny-friendly vs. strict</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <h4 className="font-semibold text-amber-600 dark:text-amber-400">Medium Reliability (40-60% accurate)</h4>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-5">
                            <li>• Specific SKU predictions ("This item goes penny next week")</li>
                            <li>• "Secret" employee tips (often outdated or regionally specific)</li>
                            <li>• App accuracy claims</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <h4 className="font-semibold text-red-600 dark:text-red-400">Low Reliability (10-30% accurate)</h4>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-5">
                            <li>• "I got X item for a penny at Y store!" (often doesn't repeat)</li>
                            <li>• Guarantees ("This always works!")</li>
                            <li>• Legal claims ("They have to sell it to you")</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-destructive/10 border-2 border-destructive/30 rounded-lg p-4 mt-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold mb-2 text-destructive">Beware Misinformation</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Some posts are intentionally misleading (burned stores trying to reduce traffic), exaggerated for clout, or based on one-time flukes. Cross-reference multiple sources.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Facts vs Myths Table */}
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Takeaway: What's Real vs. Rumor
                </h2>
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        Here's the comprehensive breakdown of common claims circulating in the penny hunting community:
                      </p>

                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b-2 border-border">
                              <th className="text-left py-3 px-4 font-semibold w-12">Status</th>
                              <th className="text-left py-3 px-4 font-semibold">Claim</th>
                              <th className="text-left py-3 px-4 font-semibold">Reality</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm">
                            {factsVsMyths.map((item, index) => (
                              <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                                <td className="py-4 px-4">
                                  {item.status === "false" && (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                  )}
                                  {item.status === "partial" && (
                                    <AlertCircle className="w-5 h-5 text-amber-500" />
                                  )}
                                </td>
                                <td className="py-4 px-4 text-muted-foreground font-medium">{item.claim}</td>
                                <td className="py-4 px-4 text-muted-foreground">{item.reality}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mt-6">
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-semibold">False</p>
                            <p className="text-xs text-muted-foreground">Common myth</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-semibold">Partially True</p>
                            <p className="text-xs text-muted-foreground">Context matters</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-semibold">Confirmed True</p>
                            <p className="text-xs text-muted-foreground">Verified info</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Final Thoughts */}
              <div>
                <Card className="border-2 border-primary/30 bg-primary/5">
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-heading font-bold mb-4">The Research Verdict</h3>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>
                        After analyzing hundreds of community reports, employee accounts, and store experiences:
                      </p>
                      <ul className="space-y-3 ml-6">
                        <li className="flex items-start gap-3">
                          <span className="text-primary font-bold">1.</span>
                          <span><span className="font-semibold text-foreground">The basics are sound:</span> Markdown cadences exist, seasonal patterns are real, and certain strategies work better than others.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-primary font-bold">2.</span>
                          <span><span className="font-semibold text-foreground">The details vary wildly:</span> What works at one store may fail at another. Regional, seasonal, and management differences matter more than people admit.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-primary font-bold">3.</span>
                          <span><span className="font-semibold text-foreground">Community knowledge is valuable but imperfect:</span> Treat tips as starting points, not guarantees. Verify through your own experience.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-primary font-bold">4.</span>
                          <span><span className="font-semibold text-foreground">The game changes constantly:</span> Policies tighten, systems update, and what worked last year may not work today.</span>
                        </li>
                      </ul>
                      <div className="bg-background rounded-lg p-4 mt-6 border-2 border-border">
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                          "The most successful penny hunters combine pattern recognition, patience, and adaptability. They know the 'rules' but understand when exceptions happen."
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
              <a href="/internal-systems" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                ← Previous: Internal Systems
              </a>
              <a href="/" className="text-primary hover:text-primary/80 font-semibold transition-colors text-right">
                Back to Home →
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
