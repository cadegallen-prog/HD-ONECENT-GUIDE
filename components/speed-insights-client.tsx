"use client"

import dynamic from "next/dynamic"

const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((mod) => ({ default: mod.SpeedInsights })),
  {
    ssr: false,
  }
)

export function SpeedInsightsClient() {
  return <SpeedInsights />
}
