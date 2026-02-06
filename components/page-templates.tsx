import Link from "next/link"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type HeaderAction = {
  label: string
  href: string
  target?: string
  rel?: string
  external?: boolean
}

type PageShellProps = {
  children: ReactNode
  /** Max-width of the content column */
  width?: "narrow" | "default" | "wide"
  /** Vertical padding for the page band */
  padding?: "sm" | "lg"
  /** Background surface for the section */
  background?: "page" | "muted" | "card"
  /** Vertical rhythm between children */
  gap?: "md" | "lg"
  /** Semantic element wrapper */
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export function PageShell({
  children,
  width = "default",
  padding = "lg",
  background = "page",
  gap = "lg",
  as: Component = "section",
  className,
}: PageShellProps) {
  const widthClass = {
    narrow: "max-w-4xl",
    default: "max-w-5xl",
    wide: "max-w-6xl",
  }[width]

  const paddingClass = {
    sm: "py-8 sm:py-12",
    lg: "py-12 sm:py-16 lg:py-20",
  }[padding]

  const backgroundClass = {
    page: "bg-[var(--bg-page)]",
    muted: "bg-[var(--bg-elevated)]",
    card: "bg-[var(--bg-card)]",
  }[background]

  const gapClass = {
    md: "gap-6 sm:gap-8",
    lg: "gap-8 sm:gap-10",
  }[gap]

  return (
    <Component className={cn(backgroundClass, paddingClass)}>
      <div className={cn("mx-auto flex flex-col px-4 sm:px-6", widthClass, gapClass, className)}>
        {children}
      </div>
    </Component>
  )
}

type PageHeaderProps = {
  title: string
  subtitle?: ReactNode
  eyebrow?: string
  primaryAction?: HeaderAction
  secondaryActions?: HeaderAction[]
  align?: "left" | "center"
  children?: ReactNode
}

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  primaryAction,
  secondaryActions = [],
  align = "left",
  children,
}: PageHeaderProps) {
  const alignment = align === "center" ? "items-center text-center" : "items-start text-left"
  const descriptionWidth = align === "center" ? "max-w-3xl" : "max-w-2xl"

  return (
    <header className={cn("flex flex-col gap-4 sm:gap-5", alignment)}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {eyebrow}
        </p>
      )}

      <div className="space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-[var(--text-primary)]">
          {title}
        </h1>
        {subtitle && (
          <div
            className={cn(
              "text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed",
              descriptionWidth
            )}
          >
            {subtitle}
          </div>
        )}
      </div>

      {children}

      {(primaryAction || secondaryActions.length > 0) && (
        <div
          className={cn(
            "flex flex-col sm:flex-row gap-3 sm:gap-4",
            align === "center" ? "justify-center" : "justify-start"
          )}
        >
          {primaryAction && <HeaderButton action={primaryAction} variant="primary" />}
          {secondaryActions.map((action) => (
            <HeaderButton
              key={`${action.href}-${action.label}`}
              action={action}
              variant="secondary"
            />
          ))}
        </div>
      )}
    </header>
  )
}

type SectionProps = {
  title?: string
  subtitle?: ReactNode
  kicker?: string
  children: ReactNode
  id?: string
  align?: "left" | "center"
  spacing?: "md" | "lg"
  className?: string
}

export function Section({
  title,
  subtitle,
  kicker,
  children,
  id,
  align = "left",
  spacing = "lg",
  className,
}: SectionProps) {
  const contentSpacing = {
    md: "space-y-5",
    lg: "space-y-6",
  }[spacing]

  return (
    <section id={id} className={cn("w-full", className)}>
      {(kicker || title || subtitle) && (
        <div
          className={cn(
            "mb-4 sm:mb-6 flex flex-col gap-2",
            align === "center" ? "items-center text-center" : "text-left"
          )}
        >
          {kicker && (
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              {kicker}
            </p>
          )}
          {title && (
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)] leading-snug">
              {title}
            </h2>
          )}
          {subtitle && (
            <div className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl">
              {subtitle}
            </div>
          )}
        </div>
      )}
      <div className={contentSpacing}>{children}</div>
    </section>
  )
}

type ProseProps = {
  children: ReactNode
  className?: string
  /** Use "guide" for long-form guide chapters with enhanced readability */
  variant?: "default" | "guide"
}

export function Prose({ children, className, variant = "default" }: ProseProps) {
  return (
    <div
      className={cn(
        "space-y-4 text-[var(--text-secondary)] leading-relaxed",
        "[&_p]:text-[var(--text-secondary)]",
        "[&_p]:leading-relaxed",
        "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[var(--text-primary)] [&_h2]:leading-snug",
        "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--text-primary)]",
        "[&_strong]:text-[var(--text-primary)] [&_strong]:font-semibold",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2",
        "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2",
        "[&_li]:text-[var(--text-secondary)] [&_li]:leading-relaxed",
        "[&_a]:font-semibold",
        "[&_code]:font-mono [&_code]:text-sm [&_code]:bg-[var(--bg-elevated)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded",
        variant === "guide" && "guide-article w-full mx-auto",
        className
      )}
    >
      {children}
    </div>
  )
}

function HeaderButton({
  action,
  variant,
}: {
  action: HeaderAction
  variant: "primary" | "secondary"
}) {
  const isExternal = action.external ?? /^https?:\/\//.test(action.href)
  const rel = action.rel ?? (action.target === "_blank" ? "noopener noreferrer" : undefined)
  const ariaLabel = action.target === "_blank" ? `${action.label} (opens in a new tab)` : undefined

  if (isExternal) {
    return (
      <Button asChild variant={variant} size="lg">
        <a href={action.href} target={action.target} rel={rel} aria-label={ariaLabel}>
          {action.label}
        </a>
      </Button>
    )
  }

  return (
    <Button asChild variant={variant} size="lg">
      <Link href={action.href}>{action.label}</Link>
    </Button>
  )
}
