"use client"

import * as React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

// Data for markdown progression over time
const cadenceData = [
  { week: "Week 1", cadenceA: 100, cadenceB: 100, label: "Initial Price" },
  { week: "Week 2", cadenceA: 100, cadenceB: 100, label: "$X.00" },
  { week: "Week 3", cadenceA: 60, cadenceB: 70, label: "First Markdown" },
  { week: "Week 4", cadenceA: 60, cadenceB: 70, label: ".06 / .04" },
  { week: "Week 5", cadenceA: 30, cadenceB: 30, label: "Second Markdown" },
  { week: "Week 6", cadenceA: 30, cadenceB: 30, label: ".03 / .02" },
  { week: "Week 7", cadenceA: 0.1, cadenceB: 0.1, label: "Penny Status" },
  { week: "Week 8", cadenceA: 0.1, cadenceB: 0.1, label: "$0.01" },
]

// Data for department success rates
const departmentData = [
  { department: "Tools", successRate: 82, avgItems: 15 },
  { department: "Garden", successRate: 75, avgItems: 22 },
  { department: "Electrical", successRate: 68, avgItems: 12 },
  { department: "Plumbing", successRate: 65, avgItems: 10 },
  { department: "Hardware", successRate: 78, avgItems: 18 },
  { department: "Paint", successRate: 55, avgItems: 8 },
]

export function ClearanceLifecycleChart() {
  return (
    <div className="space-y-8">
      {/* Markdown Progression Chart */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-xl font-heading font-semibold mb-6">Markdown Progression Over Time</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Visualization of how items progress through clearance cadences (percentage of original
          price)
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cadenceData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="week" className="text-xs" tick={{ fill: "currentColor" }} />
            <YAxis
              label={{ value: "% of Original Price", angle: -90, position: "insideLeft" }}
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="cadenceA"
              name="Cadence A (.06 → .03 → .01)"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
            />
            <Line
              type="monotone"
              dataKey="cadenceB"
              name="Cadence B (.04 → .02 → .01)"
              stroke="hsl(142 76% 36%)"
              strokeWidth={2}
              dot={{ fill: "hsl(142 76% 36%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Department Success Rates Chart */}
      <div className="bg-background border border-border rounded-lg p-6">
        <h3 className="text-xl font-heading font-semibold mb-6">
          Penny Find Success Rate by Department
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Typical penny find patterns by department (illustrative estimates)
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departmentData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="department" className="text-xs" tick={{ fill: "currentColor" }} />
            <YAxis
              label={{ value: "Success Rate (%)", angle: -90, position: "insideLeft" }}
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number | string | undefined, name: string | undefined) => {
                const numericValue = typeof value === "number" ? value : Number(value)
                if (name === "successRate") {
                  return [`${Number.isFinite(numericValue) ? numericValue : ""}%`, "Success Rate"]
                }
                if (name === "avgItems") {
                  return [Number.isFinite(numericValue) ? numericValue : "", "Avg Items Found"]
                }
                return [value ?? "", name ?? ""]
              }}
            />
            <Legend />
            <Bar
              dataKey="successRate"
              name="Success Rate (%)"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Info note */}
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Charts show typical markdown patterns based on community
          observations. Individual store timing may vary significantly.
        </p>
      </div>
    </div>
  )
}
