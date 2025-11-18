"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Founder, DesignLab",
    content: "This template saved me 40+ hours of development. The attention to detail is incredible, and my clients can't tell it's a template. Worth every penny.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Freelance Developer",
    content: "I've used countless templates and this is the only one that actually delivers on the 'premium' promise. The code quality is exceptional.",
    rating: 5,
  },
  {
    name: "Emily Thompson",
    role: "Agency Owner",
    content: "We've built 15+ client sites with this starter. The one-click branding feature alone has saved us hundreds of hours. Game changer.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Product Designer",
    content: "Finally, a template that respects design systems. The OKLCH color implementation is brilliant. No more color inconsistencies.",
    rating: 5,
  },
  {
    name: "Lisa Anderson",
    role: "SaaS Founder",
    content: "The performance is insane. We went from 65 Lighthouse to 100 across all metrics. Our conversion rate improved by 23%.",
    rating: 5,
  },
  {
    name: "James Mitchell",
    role: "Tech Lead",
    content: "Best code quality I've seen in a template. TypeScript, proper separation of concerns, and actually maintainable. Impressed.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Loved by developers and designers
          </h2>
          <p className="text-xl text-muted-foreground">
            Join hundreds of professionals building better websites faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-base leading-relaxed mb-6 text-foreground">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
