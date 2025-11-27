import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Penny Central | HD Penny Guide",
  description: "Learn about Penny Central, the official companion site for the Home Depot One Cent Items Facebook community.",
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8">
              About Penny Central
            </h1>

            <div className="space-y-8">
              <section className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  Penny Central is the official companion site for the{" "}
                  <Link
                    href="https://www.facebook.com/groups/homedepotonecent"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Home Depot One Cent Items
                  </Link>{" "}
                  Facebook community-a group of 32,000+ members dedicated to finding clearance items
                  marked down to $0.01 at Home Depot stores.
                </p>
              </section>

              <section className="bg-muted/40 dark:bg-muted/10 border border-border rounded-xl p-6 md:p-8 space-y-4">
                <h2 className="text-2xl font-heading font-semibold">What This Guide Covers</h2>
                <ul className="space-y-2 text-foreground text-sm md:text-base">
                  <li>
                    <strong>What pennies are</strong> - How Home Depot's clearance system works and why items get marked to $0.01
                  </li>
                  <li>
                    <strong>Clearance lifecycle</strong> — Understanding markdown patterns and timing to predict penny status
                  </li>
                  <li>
                    <strong>Digital tools</strong> — Using the Home Depot app for pre-hunt research and inventory checking
                  </li>
                  <li>
                    <strong>In-store strategies</strong> — Physical store tactics for finding clearance items efficiently
                  </li>
                  <li>
                    <strong>Checkout procedures</strong> — What to expect at the register and how to handle common situations
                  </li>
                  <li>
                    <strong>Facts vs myths</strong> — Separating accurate information from common misconceptions
                  </li>
                  <li>
                    <strong>Responsible hunting</strong> - Community guidelines for ethical penny shopping
                  </li>
                </ul>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-4">
                <h2 className="text-2xl font-heading font-semibold">Join the Community</h2>
                <p className="text-foreground">
                  Connect with fellow penny hunters, share finds, and get the latest tips:
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="https://www.facebook.com/groups/homedepotonecent"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Join Facebook Group
                  </Link>
                  <Link
                    href="https://m.me/cm/AbYH-T88smeOjfsT/"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Join Messenger Chat
                  </Link>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
