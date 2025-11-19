"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AlertTriangle, CheckCircle2, XCircle, ArrowLeft, ArrowRight, ShoppingCart, Lock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CheckoutStrategyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Hero Section with Gradient Background */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background py-20">
          {/* Background gradient orbs */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
          </div>

          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                The Checkout Challenge
              </h1>
              <p className="text-2xl md:text-3xl text-muted-foreground mb-8">
                How to Successfully Buy Penny Items
              </p>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                The checkout process is where many penny hunters stumble. This guide walks you through proven strategies for successfully purchasing penny items, handling employee interactions, and knowing your rights as a customer.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="space-y-8">

              {/* 1. Preferred Method: Self-Checkout */}
              <Card className="bg-card border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-3xl">Preferred Method: Self-Checkout (SCO)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-lg">
                    Self-checkout is your best friend for penny purchases. It's anonymous, quick, and minimizes awkward interactions. Here's the 7-step process:
                  </p>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Locate an available SCO terminal</h4>
                        <p className="text-muted-foreground">Preferably one that's not directly visible to attendants or service desk staff.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Scan your penny item(s)</h4>
                        <p className="text-muted-foreground">The system will ring it up as $0.01 per item (or whatever the marked price is).</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Act natural</h4>
                        <p className="text-muted-foreground">Don't celebrate, don't look around nervously. You're just another customer buying clearance.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">4</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Pay with any method</h4>
                        <p className="text-muted-foreground">Card, cash, or mobile payment all work. For penny items, cash is fastest.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">5</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Take your receipt</h4>
                        <p className="text-muted-foreground">ALWAYS take it. This is proof of purchase and protects you legally.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">6</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Bag your item(s) normally</h4>
                        <p className="text-muted-foreground">Place in a bag just like any other purchase.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">7</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Exit calmly</h4>
                        <p className="text-muted-foreground">Walk out at a normal pace. You've done nothing wrong.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-primary/10 border-l-4 border-primary">
                    <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      Pro Tip
                    </p>
                    <p className="text-sm text-muted-foreground">
                      If the SCO flags your item for "attendant approval" (rare for penny items), stay calm. Often the attendant will just override without checking the price closely.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Optional Trick: Use a "Keeper Item" */}
              <Card className="bg-card border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-3xl">Optional Trick: Use a "Keeper Item"</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-lg">
                    This technique makes your transaction look more "normal" and diverts attention from the penny item.
                  </p>

                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">What It Is:</h4>
                      <p className="text-muted-foreground">
                        Purchase a small regular-priced item (a "keeper") along with your penny item(s). This could be a pack of screws, a candy bar, a cleaning sponge—anything cheap and ordinary.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">Why It Works:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Your total is no longer suspiciously low (e.g., $2.87 instead of $0.01)</li>
                        <li>Employees/attendants glance at receipts and see a "normal" transaction</li>
                        <li>You blend in with regular customers</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">When to Use:</h4>
                      <p className="text-muted-foreground">
                        This is especially useful if you're buying multiple penny items at once, or if the store has been "burned" by penny hunters before and staff are more vigilant.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Multiple Penny Items? Know the Limit */}
              <Card className="bg-card border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-3xl">Multiple Penny Items? Know the Limit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-lg">
                    Can you buy 10 penny items in one transaction? 20? 100? The answer: it depends on the store and the situation.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <h4 className="font-semibold flex items-center gap-2 mb-3 text-green-700 dark:text-green-400">
                        <CheckCircle2 className="w-5 h-5" />
                        Safe Zone (1-5 items)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        This quantity rarely raises eyebrows. Most penny hunters stick to this range to avoid attention. Easy to conceal in a basket.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <h4 className="font-semibold flex items-center gap-2 mb-3 text-yellow-700 dark:text-yellow-400">
                        <AlertTriangle className="w-5 h-5" />
                        Caution Zone (6-15 items)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        You might get questioned, especially at a staffed register. Self-checkout is your friend here. Consider splitting into multiple transactions.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <h4 className="font-semibold flex items-center gap-2 mb-3 text-red-700 dark:text-red-400">
                        <XCircle className="w-5 h-5" />
                        Danger Zone (16+ items)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        High risk of intervention. You'll likely be stopped and questioned. Store policy may be invoked (even if no official policy exists). Not recommended.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <h4 className="font-semibold flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        The Golden Rule
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        <strong>Don't be greedy.</strong> Taking every penny item in sight damages the practice for everyone. Leave some for other hunters and return another day if you want more.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4. What If It's in a Locked Case or Cage? */}
              <Card className="bg-card border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-3xl">What If It's in a Locked Case or Cage?</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-lg">
                    Power tools, some plumbing fixtures, and high-value items are often locked up. Here's how to handle it:
                  </p>

                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Request assistance politely</h4>
                        <p className="text-muted-foreground">"Excuse me, could you help me get this item from the cage?" Don't mention the price.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">If they check the price and question you</h4>
                        <p className="text-muted-foreground">Play it cool: "Oh really? The scanner showed that price. I'd still like to try purchasing it if that's okay."</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">If they refuse to retrieve it</h4>
                        <p className="text-muted-foreground">Don't argue. Thank them and walk away. You can try again later with a different employee, or skip it.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">4</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">If they retrieve it for you</h4>
                        <p className="text-muted-foreground">Head straight to self-checkout. Don't give them time to radio ahead or flag you.</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">5</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">Complete the purchase quickly</h4>
                        <p className="text-muted-foreground">Scan, pay, bag, and exit. The longer you linger, the more likely someone will intervene.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border-l-4 border-yellow-500">
                    <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      Reality Check
                    </p>
                    <p className="text-sm text-muted-foreground">
                      High-value locked items (power tools, expensive fixtures) are the most likely to be challenged. Some stores have gotten wise to this and will refuse to sell penny items from cages regardless of what the system says. Know when to walk away.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 5. If You're Stopped by an Employee */}
              <Card className="bg-card border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-3xl">If You're Stopped by an Employee</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground text-lg">
                    Sometimes an employee will notice and question you—either before or after scanning. Here's how to handle it professionally:
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle2 className="w-5 h-5" />
                        DO This:
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Remain calm and polite</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Say: "The scanner showed this price. I'm happy to purchase it at that rate."</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">If pressed, add: "I believe the price in your system is the legal selling price."</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Offer to speak with a manager calmly</span>
                        </li>
                        <li className="flex gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Know when to walk away gracefully</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                        <XCircle className="w-5 h-5" />
                        Do NOT Do This:
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex gap-2">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Get aggressive or argumentative</span>
                        </li>
                        <li className="flex gap-2">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Say: "I know what I'm doing" or mention "penny shopping"</span>
                        </li>
                        <li className="flex gap-2">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Lie about not knowing the price</span>
                        </li>
                        <li className="flex gap-2">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Record the employee without permission (varies by state)</span>
                        </li>
                        <li className="flex gap-2">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Demand they sell it or cite "the law"</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-primary/10 border-l-4 border-primary">
                    <p className="text-sm font-semibold mb-2">Remember:</p>
                    <p className="text-sm text-muted-foreground">
                      The employee is doing their job. Being respectful increases your chances of a successful purchase and keeps the practice sustainable for everyone.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 6. If They Demand the Item Back After Purchase */}
              <Card className="bg-card border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-3xl">If They Demand the Item Back After Purchase</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-lg">
                    This is rare, but it happens. You've completed the transaction, received your receipt, and are heading for the exit when an employee or manager stops you and demands the item back.
                  </p>

                  <div className="space-y-4 mt-4">
                    <div className="p-4 rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">What's Happening:</h4>
                      <p className="text-muted-foreground">
                        The employee realized the item sold for $0.01 and is trying to reverse the sale. This is legally murky—the transaction is complete, and you have proof of purchase.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">Your Response:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                        <li><strong>Stay calm.</strong> Don't run or hide the item.</li>
                        <li><strong>Show your receipt.</strong> "I have a receipt showing I purchased this item."</li>
                        <li><strong>Politely decline.</strong> "I've completed my purchase. I'd like to leave with my item."</li>
                        <li><strong>Ask for a manager.</strong> If they persist, request to speak with a store manager.</li>
                        <li><strong>Stand your ground (politely).</strong> You are not legally obligated to return a purchased item unless you agree to a return/refund.</li>
                      </ol>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">When to Walk Away:</h4>
                      <p className="text-muted-foreground">
                        If the situation escalates (they threaten to call police, block your exit, etc.), use your judgment. The item isn't worth a legal battle or being banned from the store. You can return the item, request a refund, and leave peacefully.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border-l-4 border-yellow-500">
                    <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      Legal Note
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Once a transaction is complete, the store generally cannot force you to return an item. However, this varies by local law and circumstances. If you feel threatened or unsafe, prioritize your safety over the item.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 7. Manager Interaction Tips */}
              <Card className="bg-card border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-3xl">Manager Interaction Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-lg">
                    If a manager gets involved, it's a different ballgame. Managers have more authority and are often more knowledgeable about company policy (or lack thereof).
                  </p>

                  <div className="space-y-3 mt-4">
                    <div className="p-4 rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">Scenario 1: Manager Approves the Sale</h4>
                      <p className="text-muted-foreground">
                        Sometimes managers understand clearance pricing and will honor the system price. They may even override employee objections. Thank them and complete your purchase.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">Scenario 2: Manager Refuses the Sale</h4>
                      <p className="text-muted-foreground">
                        The manager decides "that price is a mistake" and won't sell it to you. This is frustrating but within their discretion. Don't argue extensively—it won't work and may get you banned. Politely ask if there's another manager available (shift change, different location, etc.). If not, walk away.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">Scenario 3: Manager Offers a Compromise</h4>
                      <p className="text-muted-foreground">
                        "I'll sell it to you for $5 instead of a penny." This is technically not the system price, but it's still a great deal. Your call: take the deal or walk away. Many hunters will take it rather than leave empty-handed.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <h4 className="font-semibold">Key Phrases to Use:</h4>
                    <ul className="space-y-1 text-muted-foreground ml-4">
                      <li>• "I understand this is unusual, but that's what your system is showing."</li>
                      <li>• "I'm happy to purchase it at the listed price if you'll allow it."</li>
                      <li>• "Is there a store policy I can reference?"</li>
                      <li>• "I appreciate your time. If it's not possible today, I understand."</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* 8. Legal & Policy Considerations */}
              <Card className="bg-card border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-3xl">Legal & Policy Considerations (Briefly)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-lg">
                    Understanding the legal landscape helps you stay confident and informed.
                  </p>

                  <div className="space-y-4 mt-4">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <h4 className="font-semibold flex items-center gap-2 mb-3 text-green-700 dark:text-green-400">
                        <CheckCircle2 className="w-5 h-5" />
                        What IS Legal:
                      </h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Purchasing items at the price displayed in the store's system</li>
                        <li>• Using clearance hunting techniques to find deals</li>
                        <li>• Taking items once you've paid and have a receipt</li>
                        <li>• Shopping at multiple stores or returning multiple times</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <h4 className="font-semibold flex items-center gap-2 mb-3 text-red-700 dark:text-red-400">
                        <XCircle className="w-5 h-5" />
                        What Could Get You In Trouble:
                      </h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>• Tampering with price tags or barcodes (fraud/theft)</li>
                        <li>• Trespassing after being banned from a store</li>
                        <li>• Harassing or threatening employees</li>
                        <li>• Reselling stolen goods (if you obtained them improperly)</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">Store Policy vs. Law:</h4>
                      <p className="text-muted-foreground mb-2">
                        <strong>Important:</strong> Home Depot (or any retailer) has the right to refuse service to anyone for any reason (with some exceptions like discrimination). This means:
                      </p>
                      <ul className="space-y-1 text-muted-foreground ml-4">
                        <li>• They can refuse to sell you a penny item even if the system says $0.01</li>
                        <li>• They can ban you from the store if they suspect abuse</li>
                        <li>• "Store policy" is whatever the manager decides in that moment</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">The Bottom Line:</h4>
                      <p className="text-muted-foreground">
                        Penny shopping exists in a grey area. It's not illegal, but it's not explicitly sanctioned either. The store's system creates the price, but the store also has discretion to refuse the sale. Your best defense is <strong>courtesy, knowledge, and knowing when to walk away.</strong>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Navigation */}
            <div className="mt-12 flex flex-col sm:flex-row justify-between gap-4">
              <Button variant="outline" asChild className="group">
                <Link href="/in-store-strategy">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Previous: In-Store Strategy
                </Link>
              </Button>
              <Button asChild className="group">
                <Link href="/internal-systems">
                  Next: Internal Systems
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
