"use client"

import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CommunityBanner() {
  return (
    <div className="bg-primary/10 dark:bg-slate-800 border-y border-primary/20 dark:border-slate-700 py-4">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-center md:text-left">
          <p className="text-base md:text-lg font-semibold text-foreground">
            Join 36,000+ members hunting penny deals together
          </p>
          <Button
            href="https://www.facebook.com/groups/homedepotpenny"
            className="gap-2 shrink-0 font-semibold px-6 py-2 rounded-lg"
          >
            <Users className="w-4 h-4" />
            Join the Community
          </Button>
        </div>
      </div>
    </div>
  )
}
