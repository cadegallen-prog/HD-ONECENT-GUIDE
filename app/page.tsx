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
      <main className="pt-16">
        <Hero />
        <CommunityBanner />

        {/* Main content with TOC sidebar */}
        <div className="container mx-auto px-4 max-w-7xl" id="sections">
          {/* Mobile TOC - Above content on mobile */}
          <div className="lg:hidden py-6 border-b border-border mb-6">
            <TableOfContents variant="mobile" />
          </div>

          <div className="grid lg:grid-cols-[250px_1fr] gap-8 lg:gap-12 py-8 lg:py-8">
            {/* Sticky TOC - Left sidebar on desktop */}
            <aside className="hidden lg:block">
              <TableOfContents variant="desktop" />
            </aside>

            {/* Main content */}
            <div className="min-w-0 max-w-4xl">
              <GuideContent />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
