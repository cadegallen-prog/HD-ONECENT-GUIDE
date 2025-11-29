import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Hero } from "./sections/Hero"
import { CommunityBanner } from "@/components/CommunityBanner"
import { GuideContent } from "../GuideContent"
import { TableOfContents } from "@/components/table-of-contents"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16 pb-20 bg-gradient-to-b from-slate-100 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950">
        <Hero />
        <CommunityBanner />

        {/* Main content with TOC sidebar */}
        <div className="container mx-auto px-5 md:px-6 lg:px-8 max-w-7xl" id="sections">
          {/* Mobile TOC - Above content on mobile */}
          <div className="lg:hidden py-6 border-b border-border mb-6">
            <TableOfContents variant="mobile" />
          </div>

          <div className="grid lg:grid-cols-[300px_minmax(0,1fr)] gap-10 lg:gap-16 py-12 lg:py-16">
            {/* Sticky TOC - Left sidebar on desktop */}
            <aside className="hidden lg:block">
              <TableOfContents variant="desktop" />
            </aside>

            {/* Main content */}
            <div className="min-w-0 max-w-5xl">
              <GuideContent />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
