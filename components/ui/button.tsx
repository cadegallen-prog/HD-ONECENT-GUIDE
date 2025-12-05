import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "default" | "lg"
  href?: string
  download?: string
  target?: string
  rel?: string
  asChild?: boolean
}

/**
 * Button Component with Enhanced Interactions
 *
 * Interaction Design Principles:
 * - Micro-lift on hover (-translate-y) for tactile feedback
 * - Shadow increase on hover reinforces depth
 * - 150ms transitions feel responsive but smooth
 * - Dark mode needs stronger contrast on hover states
 * - Primary: darker on hover, secondary: visible bg change (not lighter)
 * - Reduced lift effect (0.5 → 1px) to keep layout stable on mobile
 */
const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = "secondary", size = "default", href, type, ...props }, ref) => {
    const classes = cn(
      // Base styles with improved transitions
      "inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cta-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      // Variant-specific styles - reduced translate-y for mobile stability
      {
        primary:
          "bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] text-white shadow-md hover:shadow-lg hover:-translate-y-px active:translate-y-0",
        secondary:
          "bg-transparent border-2 border-[var(--border-default)] dark:border-[var(--border-dark)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-elevated)] hover:border-[var(--text-muted)] text-[var(--text-primary)] hover:-translate-y-px active:translate-y-0",
        ghost:
          "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]",
      }[variant],
      // Size variants with mobile touch targets (44px minimum)
      {
        sm: "h-9 min-h-[44px] px-3 text-sm",
        default: "h-10 min-h-[44px] px-4 text-sm",
        lg: "h-11 min-h-[48px] px-5 text-sm",
      }[size],
      className
    )

    if (href) {
      const anchorProps = props
      return (
        <a
          href={href}
          className={classes}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          {...(anchorProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      )
    }

    return (
      <button
        type={(type as "button" | "submit" | "reset") || "button"}
        className={classes}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
