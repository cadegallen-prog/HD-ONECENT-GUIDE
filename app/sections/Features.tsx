"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Shield, Palette, Rocket, Code2, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for performance with Next.js 15 and React Server Components. Zero runtime JS by default.",
  },
  {
    icon: Shield,
    title: "100% Accessible",
    description: "WCAG 2.1 AA compliant out of the box. Semantic HTML, ARIA labels, and keyboard navigation built-in.",
  },
  {
    icon: Palette,
    title: "One-Click Branding",
    description: "Change a single CSS variable to rebrand your entire site. OKLCH color system for perfect consistency.",
  },
  {
    icon: Rocket,
    title: "SEO Optimized",
    description: "Perfect Lighthouse scores. Automatic sitemap, meta tags, Open Graph, and structured data included.",
  },
  {
    icon: Code2,
    title: "Developer Experience",
    description: "TypeScript, Tailwind CSS, and shadcn/ui. Beautiful code that's a joy to maintain and extend.",
  },
  {
    icon: TrendingUp,
    title: "Conversion Focused",
    description: "Designed with micro-interactions and psychology principles that drive engagement and conversions.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Everything you need to launch fast
          </h2>
          <p className="text-xl text-muted-foreground">
            Built with modern best practices and optimized for real business results.
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
