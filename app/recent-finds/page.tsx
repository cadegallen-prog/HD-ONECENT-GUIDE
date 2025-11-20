import { Breadcrumb } from "@/components/breadcrumb"
import { RecentFindsFeed } from "@/components/recent-finds-feed"

export default function RecentFindsPage() {
  return (
    <>
      <Breadcrumb />
      <main className="min-h-screen pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Recent Penny Finds
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              See what 32,000+ hunters are finding in real-time. Submit your own finds to help the community!
            </p>

            <RecentFindsFeed />
          </div>
        </div>
      </main>
    </>
  )
}
