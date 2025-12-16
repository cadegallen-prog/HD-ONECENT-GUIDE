import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-default)]",
        success:
          "bg-[var(--chip-success-surface)] text-[var(--status-success)] border-[var(--chip-success-border)]",
        error: "bg-[var(--bg-elevated)] text-[var(--status-error)] border-[var(--status-error)]",
        warning:
          "bg-[var(--bg-elevated)] text-[var(--status-warning)] border-[var(--status-warning)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
