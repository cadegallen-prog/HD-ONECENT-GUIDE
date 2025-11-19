"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQItem {
  question: string
  answer: string
}

const faqData: FAQItem[] = [
  {
    question: "Is it legal to buy penny items at Home Depot?",
    answer: "Yes, it is completely legal. When an item rings up at a price in the store's system, Home Depot is legally obligated to sell it at that price. Penny items are clearance merchandise that has been marked down to $0.01 by corporate. However, store policies may vary, and some employees may not be aware of this practice."
  },
  {
    question: "How do I find penny items at Home Depot?",
    answer: "Finding penny items requires a combination of digital scouting and in-store hunting. Use the Home Depot app to check local inventory, look for items with unusual stock quantities (like 1-3 units), scan items with the app's barcode scanner, and physically check clearance endcaps and discontinued sections. Items marked down to pennies won't show as $0.01 online - you must scan them in-store."
  },
  {
    question: "What should I do if the cashier refuses to sell me a penny item?",
    answer: "Stay polite and calm. If an item scans at $0.01, it should be sold at that price. Politely ask to speak with a manager or head cashier. Never argue or cause a scene. Some stores have policies about penny items, and it's important to respect store staff. If refused, accept it gracefully and try another store or time."
  },
  {
    question: "Can Home Depot employees buy penny items?",
    answer: "Home Depot policy typically prohibits employees from purchasing penny items, especially while on duty. This prevents conflicts of interest and ensures items are available for customers. Employees found hoarding or hiding penny items can face disciplinary action. Always respect these policies."
  },
  {
    question: "What do price endings mean at Home Depot?",
    answer: "Price endings can indicate clearance status: prices ending in $0.06 often indicate first markdown, $0.03 typically indicates deeper clearance, and $0.01 means final clearance (penny item). However, these patterns can vary by region and department. Not all clearance items follow this pattern, but it's a helpful guideline."
  },
  {
    question: "Will penny items show up as $0.01 on the Home Depot website or app?",
    answer: "No. Penny items will never display as $0.01 on the website or app. They typically show the last regular clearance price or may show as out of stock. The only way to confirm a penny item is to scan the barcode in-store using the Home Depot app or at a price checker kiosk."
  },
  {
    question: "Can I buy penny items online for pickup or delivery?",
    answer: "No. Penny items cannot be purchased online, even for store pickup. They must be purchased in-store after scanning to confirm the $0.01 price. Online inventory systems show different prices than the in-store point-of-sale system."
  },
  {
    question: "How many penny items can I buy at once?",
    answer: "There is no official limit, but use common sense and courtesy. Buying hundreds of the same item may raise red flags and is generally frowned upon by the community. Take what you need or can reasonably resell, and leave some for other hunters. Excessive buying can lead to policy changes that hurt everyone."
  },
  {
    question: "What are the best days to find penny items?",
    answer: "Penny items can appear any day, but Monday through Wednesday mornings are often best. This is when markdown cycles typically complete and inventory updates occur. Additionally, end-of-season transitions (spring to summer, fall to winter) often yield more clearance items that eventually become pennies."
  },
  {
    question: "Why do some stores have more penny items than others?",
    answer: "Store demographics, location, sales volume, and management practices all affect penny item availability. High-volume urban stores may cycle through clearance faster, while suburban or rural stores may have items linger longer. Some managers are more aggressive about clearing old inventory than others."
  },
  {
    question: "Can I return penny items for store credit?",
    answer: "Technically yes, but this is highly unethical and may be considered fraud. You paid $0.01, so that's the value you'd receive as credit. Attempting to return items for full price credit when you paid pennies is dishonest and can result in being banned from the store or legal consequences."
  },
  {
    question: "Do Home Depot employees hide penny items for themselves?",
    answer: "While this sometimes happens, it's against company policy and can result in termination. Most employees are honest, but some may hold items aside. If you suspect this, politely ask a manager, but avoid accusations. Remember that employees are prohibited from buying penny items, so hiding them is a violation."
  },
  {
    question: "How often does Home Depot markdown clearance items to pennies?",
    answer: "There's no fixed schedule. Clearance cycles vary by department, season, and product type. Items typically go through several markdown stages over weeks or months before hitting $0.01. Seasonal items (holiday, garden, outdoor) follow more predictable patterns than regular merchandise."
  },
  {
    question: "What should I NOT do when penny hunting?",
    answer: "Never be rude to employees, never demand items be sold to you, never leave a mess in aisles, never hide items for later, never scan entire carts of items at self-checkout during busy times, and never brag about finds on social media in ways that identify specific stores. Respect and discretion protect the hobby for everyone."
  },
  {
    question: "Are there Facebook groups or communities for penny shoppers?",
    answer: "Yes, there are several active communities with 10,000-50,000+ members who share finds, tips, and strategies. These groups often have regional subgroups for local coordination. However, be cautious about what you share publicly - oversharing specific store locations and large hauls can lead to increased competition or policy changes."
  }
]

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <Card className="w-full hover:border-primary/50 transition-colors">
      <CardHeader
        className="cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-lg md:text-xl font-semibold text-left">
            {item.question}
          </CardTitle>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-primary transition-transform duration-200 flex-shrink-0",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0">
          <p className="text-muted-foreground leading-relaxed">
            {item.answer}
          </p>
        </CardContent>
      )}
    </Card>
  )
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about finding penny items at Home Depot
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {faqData.map((item, index) => (
                <FAQAccordion
                  key={index}
                  item={item}
                  isOpen={openIndex === index}
                  onToggle={() => toggleFAQ(index)}
                />
              ))}
            </div>

            {/* Footer CTA */}
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">
                Still have questions?
              </p>
              <p className="text-sm text-muted-foreground">
                Join our community of 32,000+ penny hunters to learn more and share your finds.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
