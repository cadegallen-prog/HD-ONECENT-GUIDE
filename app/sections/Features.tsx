"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Search, Store, CreditCard, Scale, Users } from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Understand Clearance Cycles",
    description: "Learn exactly when Home Depot marks items to penny. Master the timing, patterns, and seasonal cycles to hunt at the perfect moment.",
  },
  {
    icon: Search,
    title: "Digital Scouting Strategies",
    description: "Discover how to pre-scout inventory online, identify high-probability stores, and plan your hunting routes for maximum efficiency.",
  },
  {
    icon: Store,
    title: "In-Store Tactics",
    description: "Navigate aisles like a pro. Learn where penny items hide, how to scan efficiently, and what signals indicate fresh markdowns.",
  },
  {
    icon: CreditCard,
    title: "Checkout Best Practices",
    description: "Handle transactions smoothly and professionally. Know your rights, avoid common mistakes, and build positive relationships with staff.",
  },
  {
    icon: Scale,
    title: "Legal & Ethical Practices",
    description: "Hunt responsibly and legally. Understand store policies, quantity limits, and the difference between savvy shopping and policy violations.",
  },
  {
    icon: Users,
    title: "Community Knowledge",
    description: "Join 32,000+ hunters sharing real-time finds, store-specific tips, and proven strategies. Learn from collective experience.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Everything you need to find pennies
          </h2>
          <p className="text-xl text-muted-foreground">
            A complete system from beginner basics to advanced tactics. Start finding penny items today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                hover
                className="group border-2 hover:border-primary/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
