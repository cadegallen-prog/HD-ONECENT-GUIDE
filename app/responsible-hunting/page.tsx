import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AlertTriangle, Users, Volume2, Globe, Clock, DollarSign, XCircle, Sparkles, Target, Heart } from "lucide-react"

export default function ResponsibleHuntingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-red-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                Responsible Penny Hunting: Don't Ruin It for Everyone
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Penny hunting is a fun and rewarding hobby, but it requires respect, discretion, and realistic expectations. Follow these guidelines to be a responsible hunter.
              </p>
            </div>
          </div>
        </section>

        {/* Main Ethics Sections */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-12">

              {/* Section 1: Be Respectful to Store Employees */}
              <div className="bg-card border border-border rounded-xl p-8 shadow-lg card-lift">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-heading font-bold mb-2">Be Respectful to Store Employees</h2>
                    <p className="text-muted-foreground">They're just doing their job, and you're not entitled to penny deals.</p>
                  </div>
                </div>

                <div className="space-y-4 ml-16">
                  <ul className="space-y-3 text-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Don't argue or complain</strong> if they refuse a penny sale. Some stores have policies against it.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Don't make a scene</strong> if an item doesn't ring up as a penny. Mistakes happen.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Be polite and patient.</strong> A friendly attitude goes a long way.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Don't ask employees to check prices for you</strong> or pressure them to override the system.</span>
                    </li>
                  </ul>

                  <div className="bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded-r-lg mt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        <strong>Key Point:</strong> Store employees are not your personal penny-hunting assistants. Treat them with the same respect you'd want in your own job.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Don't Be Loud About Penny Finds */}
              <div className="bg-card border border-border rounded-xl p-8 shadow-lg card-lift">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-heading font-bold mb-2">Don't Be Loud About Penny Finds</h2>
                    <p className="text-muted-foreground">Broadcasting your finds can ruin the game for everyone.</p>
                  </div>
                </div>

                <div className="space-y-4 ml-16">
                  <ul className="space-y-3 text-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Don't post specific store locations</strong> in public groups or social media. "Dollar General on Main Street" = bad idea.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Don't brag loudly in-store.</strong> Other customers (and employees) are listening.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Share knowledge, not locations.</strong> Talk about strategies and patterns, not exact places.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Be mindful of who's watching.</strong> Corporate monitors social media and online communities.</span>
                    </li>
                  </ul>

                  <div className="bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded-r-lg mt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        <strong>Why This Matters:</strong> The more attention penny hunting gets, the more likely stores will crack down on policies, pull items earlier, or change their systems to prevent penny sales.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Use Community Resources, Don't Abuse Them */}
              <div className="bg-card border border-border rounded-xl p-8 shadow-lg card-lift">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-heading font-bold mb-2">Use Community Resources, Don't Abuse Them</h2>
                    <p className="text-muted-foreground">Facebook groups and forums exist to help hunters, but they're not a free-for-all.</p>
                  </div>
                </div>

                <div className="space-y-4 ml-16">
                  <ul className="space-y-3 text-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Follow group rules.</strong> If a group says "no store locations," respect it.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Contribute, don't just lurk.</strong> Share helpful tips and insights when you can.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Don't spam or beg for information.</strong> Build relationships, not a reputation as a mooch.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Be careful with screenshots.</strong> Remove identifiable info (store names, locations, employee names).</span>
                    </li>
                  </ul>

                  <div className="bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded-r-lg mt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        <strong>Community Etiquette:</strong> The penny hunting community thrives on mutual respect. Abuse the resources, and you'll find yourself locked out—or worse, destroy the hobby for everyone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Understand the Time Investment */}
              <div className="bg-card border border-border rounded-xl p-8 shadow-lg card-lift">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-heading font-bold mb-2">Understand the Time Investment</h2>
                    <p className="text-muted-foreground">Penny hunting isn't passive income—it takes time, gas, and effort.</p>
                  </div>
                </div>

                <div className="space-y-4 ml-16">
                  <ul className="space-y-3 text-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Driving to multiple stores</strong> costs gas money. Factor that into your "savings."</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Scanning shelves takes time.</strong> You might spend an hour and find nothing.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Success is inconsistent.</strong> Some weeks you'll hit gold, others you'll strike out.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Don't obsess.</strong> If penny hunting stresses you out or dominates your schedule, step back.</span>
                    </li>
                  </ul>

                  <div className="bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded-r-lg mt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        <strong>Reality Check:</strong> If you value your time at $15/hour and spend 2 hours to save $20, you've basically broken even. Do it for fun, not as a business.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Be Realistic About Value */}
              <div className="bg-card border border-border rounded-xl p-8 shadow-lg card-lift">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-heading font-bold mb-2">Be Realistic About Value</h2>
                    <p className="text-muted-foreground">Not every penny item is a goldmine for resale.</p>
                  </div>
                </div>

                <div className="space-y-4 ml-16">
                  <ul className="space-y-3 text-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Seasonal items go on clearance for a reason.</strong> Nobody wants Halloween decor in January.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Resale markets are saturated.</strong> If you found 20 of an item, so did 50 other hunters.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Factor in fees and shipping.</strong> eBay/Amazon take a cut, and shipping eats into profits.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Personal use is often the best value.</strong> Toiletries, cleaning supplies, and shelf-stable food are solid wins.</span>
                    </li>
                  </ul>

                  <div className="bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded-r-lg mt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        <strong>Pro Tip:</strong> The best penny finds are things you were going to buy anyway. Free toothpaste and laundry detergent? Win. 50 ugly garden gnomes you'll never sell? Loss.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 6: Know When to Walk Away */}
              <div className="bg-card border border-border rounded-xl p-8 shadow-lg card-lift">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-heading font-bold mb-2">Know When to Walk Away</h2>
                    <p className="text-muted-foreground">Not every trip will be a win, and that's okay.</p>
                  </div>
                </div>

                <div className="space-y-4 ml-16">
                  <ul className="space-y-3 text-foreground">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>If a store refuses penny sales, don't push it.</strong> Thank them and leave.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>If you're feeling frustrated or obsessive, take a break.</strong> Penny hunting should be fun, not stressful.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Don't hoard low-quality items.</strong> If you wouldn't buy it at full price, why grab 20 at a penny?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span><strong>Remember the bigger picture.</strong> Saving $10 isn't worth ruining your reputation or stressing yourself out.</span>
                    </li>
                  </ul>

                  <div className="bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded-r-lg mt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-900 dark:text-amber-200">
                        <strong>Healthy Mindset:</strong> Penny hunting is a hobby, not a hustle. If it stops being enjoyable, it's time to step away and reassess.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Conclusion Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                  Final Thoughts: Hunt Smart, Hunt Responsibly
                </h2>
                <p className="text-xl text-muted-foreground">
                  Whether you're just starting out or a seasoned pro, here's how to make the most of penny hunting.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* For Beginners */}
                <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold">For Beginners: Start Here</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-primary">Learn the Basics</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Understand store markdown schedules</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Read Section II to learn the systems</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Join a Facebook group and observe before posting</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-primary">Use the App/Website</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Download the official Dollar General app</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Check clearance sections online before going</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Use scanning apps to verify prices in-store</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-primary">In-Store Tips</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Be friendly and respectful to staff</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Start with seasonal sections</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Don't buy things you don't need just because they're cheap</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* For Experienced Hunters */}
                <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold">For Experienced Hunters: Refine Your Game</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-primary">Master the Cadences</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Track seasonal markdown patterns by month</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Know your local store's restock days</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Identify high-turnover vs. slow-moving locations</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-primary">Watch Community Trends</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Notice when certain categories start hitting penny lists</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Share insights without revealing specific locations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Help newcomers learn the ropes</span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-2 text-primary">Optimize Your Strategy</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Focus on items with real resale or personal value</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Build relationships with store managers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Know when a store is picked over and move on</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Final Mindset */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-heading font-bold">Final Mindset: It's Not Just About the Deal</h3>
                </div>

                <div className="space-y-4 text-foreground">
                  <p className="text-lg">
                    Penny hunting is part treasure hunt, part strategy game, and part community experience. The thrill of finding a $20 item for a penny is real, but so is the satisfaction of helping another hunter, learning a new trick, or simply enjoying the hunt itself.
                  </p>

                  <div className="bg-background/50 border border-border/50 rounded-lg p-6 space-y-3">
                    <p className="font-semibold text-primary">Remember:</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">✓</span>
                        <span><strong>Respect</strong> keeps stores from cracking down on penny sales</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">✓</span>
                        <span><strong>Discretion</strong> protects the hobby for everyone</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">✓</span>
                        <span><strong>Realism</strong> keeps expectations in check</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">✓</span>
                        <span><strong>Community</strong> makes the hunt more fun and sustainable</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-lg font-semibold text-center pt-4">
                    Hunt smart. Hunt responsibly. And most importantly—have fun.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
