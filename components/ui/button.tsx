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
 * Button Component with Smooth, WCAG-friendly interactions
 *
 * Interaction Design Principles:
 * - Color + shadow only (no motion) to avoid clunky hover shifts
 * - 150-180ms transitions for responsiveness
 * - Consistent focus ring using CTA color
 */
const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    { className, variant = "secondary", size = "default", href, type, asChild, children, ...props },
    ref
  ) => {
    const classes = cn(
      // Base styles with improved transitions
      "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cta-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      // Variant-specific styles
      {
        primary:
          "bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] text-[var(--cta-text)] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)]",
        secondary:
          "bg-transparent border-2 border-[var(--border-default)] dark:border-[var(--border-dark)] hover:bg-[var(--bg-secondary)] dark:hover:bg-[var(--bg-elevated)] hover:border-[var(--border-strong)] text-[var(--text-primary)] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)]",
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

    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement<Record<string, unknown>>
      return React.cloneElement(child, {
        ...props,
        className: cn(classes, (child.props as { className?: string }).className),
        ref: ref as unknown,
      })
    }

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
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
