export default function RecentFindsPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Recent Penny Finds
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            See what 32,000+ hunters are finding in real-time. Submit your own finds to help the community!
          </p>
          {/* Component will be added from Browser Claude Tab 8 */}
          <div className="bg-muted/30 rounded-lg p-8 text-center">
            <p className="text-muted-foreground">Tracker component loading...</p>
          </div>
        </div>
      </div>
    </main>
  )
}
