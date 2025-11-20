import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Hero } from "./sections/Hero"
import { ContentSections } from "./sections/ContentSections"
import { TableOfContents } from "@/components/table-of-contents"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />

        {/* Main content with TOC sidebar */}
        <div className="container mx-auto px-4 max-w-7xl" id="sections">
          <div className="grid lg:grid-cols-[1fr_250px] gap-8 lg:gap-12 py-8">
            {/* Main content */}
            <div className="min-w-0 max-w-4xl">
              <ContentSections />
            </div>

            {/* Sticky TOC - Desktop only */}
            <aside className="hidden lg:block">
              <TableOfContents />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
