"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { ArrowRight } from "lucide-react"

// ============================================================================
// PAGE TEMPLATE COMPONENTS
// ============================================================================
// Reusable layout patterns for consistent page structure across PennyCentral.
// Uses the WCAG AAA color system from docs/COLOR-SYSTEM.md
// ============================================================================

// ----------------------------------------------------------------------------
// HERO SECTION
// ----------------------------------------------------------------------------
// Use at the top of every page. Provides consistent spacing and structure.

interface HeroProps {
  /** Badge text shown above headline (optional) */
  badge?: string
  /** Main headline - keep under 10 words */
  headline: string
  /** Optional highlighted word in headline (will use brand color) */
  highlightWord?: string
  /** Subtitle - 1-2 sentences max */
  subtitle: string
  /** Primary CTA button */
  primaryCTA?: {
    text: string
    href: string
  }
  /** Secondary CTA button (optional) */
  secondaryCTA?: {
    text: string
    href: string
  }
  /** Center content (default) or left-align */
  align?: "center" | "left"
  /** Compact hero for subpages */
  compact?: boolean
}

export function Hero({
  badge,
  headline,
  highlightWord,
  subtitle,
  primaryCTA,
  secondaryCTA,
  align = "center",
  compact = false,
}: HeroProps) {
  // Split headline to highlight specific word
  const renderHeadline = () => {
    if (!highlightWord) {
      return headline
    }
    const parts = headline.split(highlightWord)
    return (
      <>
        {parts[0]}
        <span className="text-[--cta-primary]">{highlightWord}</span>
        {parts[1]}
      </>
    )
  }

  return (
    <section
      className={`
        ${compact ? "py-12 md:py-16" : "min-h-[60vh] py-16 md:py-24"}
        flex flex-col ${align === "center" ? "items-center text-center" : "items-start text-left"}
        justify-center px-6
        bg-[--bg-primary]
      `}
    >
      <div className={`max-w-4xl ${align === "center" ? "mx-auto" : ""}`}>
        {/* Badge */}
        {badge && (
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                       bg-[--bg-elevated] text-[--text-secondary] 
                       text-sm font-medium mb-6 border border-[--border-default]"
          >
            {badge}
          </div>
        )}

        {/* Headline */}
        <h1
          className={`
            ${compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"}
            font-semibold tracking-tight text-[--text-primary] leading-tight
          `}
        >
          {renderHeadline()}
        </h1>

        {/* Subtitle */}
        <p
          className={`
            mt-4 md:mt-6 text-lg md:text-xl text-[--text-secondary] 
            ${align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"}
          `}
        >
          {subtitle}
        </p>

        {/* CTAs */}
        {(primaryCTA || secondaryCTA) && (
          <div
            className={`
              mt-8 flex flex-col sm:flex-row gap-4
              ${align === "center" ? "justify-center" : "justify-start"}
            `}
          >
            {primaryCTA && (
              <Link
                href={primaryCTA.href}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg 
                         bg-[--cta-primary] hover:bg-[--cta-hover] text-white 
                         font-medium text-base transition-colors
                         focus:outline-none focus:ring-2 focus:ring-[--cta-primary] focus:ring-offset-2"
              >
                {primaryCTA.text}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            )}
            {secondaryCTA && (
              <Link
                href={secondaryCTA.href}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg 
                         bg-transparent border-2 border-[--border-strong]
                         hover:bg-[--bg-elevated] text-[--text-primary]
                         font-medium text-base transition-colors"
              >
                {secondaryCTA.text}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

// ----------------------------------------------------------------------------
// SECTION
// ----------------------------------------------------------------------------
// Use to wrap content sections. Provides consistent spacing and backgrounds.

interface SectionProps {
  /** Section heading */
  title?: string
  /** Optional subtitle under heading */
  subtitle?: string
  /** Section content */
  children: ReactNode
  /** Background variant */
  variant?: "default" | "muted" | "card"
  /** Padding size */
  padding?: "sm" | "md" | "lg"
  /** Maximum width constraint */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full"
  /** Optional ID for anchor links */
  id?: string
}

export function Section({
  title,
  subtitle,
  children,
  variant = "default",
  padding = "md",
  maxWidth = "lg",
  id,
}: SectionProps) {
  const bgClasses = {
    default: "bg-[--bg-primary]",
    muted: "bg-[--bg-elevated]",
    card: "bg-[--bg-secondary]",
  }

  const paddingClasses = {
    sm: "py-8 md:py-12",
    md: "py-12 md:py-16",
    lg: "py-16 md:py-24",
  }

  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  }

  return (
    <section id={id} className={`${bgClasses[variant]} ${paddingClasses[padding]} px-6`}>
      <div className={`${maxWidthClasses[maxWidth]} mx-auto`}>
        {(title || subtitle) && (
          <div className="mb-8 md:mb-12">
            {title && (
              <h2 className="text-2xl md:text-3xl font-semibold text-[--text-primary] tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-3 text-lg text-[--text-secondary] max-w-3xl">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

// ----------------------------------------------------------------------------
// FEATURE CARD
// ----------------------------------------------------------------------------
// Use in grids to showcase features, benefits, or navigation options.

interface FeatureCardProps {
  /** Card title */
  title: string
  /** Card description - keep to 2-3 sentences */
  description: string
  /** Icon component (from lucide-react) */
  icon?: ReactNode
  /** Optional link - makes entire card clickable */
  href?: string
  /** Optional action button text */
  actionText?: string
}

export function FeatureCard({ title, description, icon, href, actionText }: FeatureCardProps) {
  const content = (
    <>
      {icon && (
        <div
          className="w-10 h-10 rounded-lg bg-[--bg-elevated] flex items-center justify-center mb-4
                      text-[--text-secondary]"
        >
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[--text-primary] mb-2">{title}</h3>
      <p className="text-[--text-secondary] text-sm leading-relaxed">{description}</p>
      {actionText && (
        <span
          className="inline-flex items-center mt-4 text-sm font-medium 
                      text-[--cta-primary] underline underline-offset-2"
        >
          {actionText}
          <ArrowRight className="ml-1 w-4 h-4" />
        </span>
      )}
    </>
  )

  const cardClasses = `
    block p-6 rounded-lg border border-[--border-default]
    bg-[--bg-card] hover:border-[--border-strong]
    transition-colors
    ${href ? "cursor-pointer" : ""}
  `

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {content}
      </Link>
    )
  }

  return <div className={cardClasses}>{content}</div>
}

// ----------------------------------------------------------------------------
// CTA BANNER
// ----------------------------------------------------------------------------
// Use at the end of pages to drive a single action.

interface CTABannerProps {
  /** Banner headline */
  headline: string
  /** Brief description */
  description?: string
  /** Button text */
  buttonText: string
  /** Button link */
  buttonHref: string
  /** Visual variant */
  variant?: "default" | "muted"
}

export function CTABanner({
  headline,
  description,
  buttonText,
  buttonHref,
  variant = "default",
}: CTABannerProps) {
  return (
    <section
      className={`
        py-12 md:py-16 px-6
        ${variant === "muted" ? "bg-[--bg-elevated]" : "bg-[--bg-primary]"}
      `}
    >
      <div
        className="max-w-4xl mx-auto text-center p-8 md:p-12 rounded-xl
                    border border-[--border-default] bg-[--bg-card]"
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-[--text-primary] mb-4">
          {headline}
        </h2>
        {description && (
          <p className="text-[--text-secondary] mb-6 max-w-xl mx-auto">{description}</p>
        )}
        <Link
          href={buttonHref}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg 
                   bg-[--cta-primary] hover:bg-[--cta-hover] text-white 
                   font-medium text-base transition-colors
                   focus:outline-none focus:ring-2 focus:ring-[--cta-primary] focus:ring-offset-2"
        >
          {buttonText}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}

// ----------------------------------------------------------------------------
// PROSE CONTAINER
// ----------------------------------------------------------------------------
// Use for long-form content. Enforces readable line lengths.

interface ProseProps {
  children: ReactNode
  /** Optional className overrides */
  className?: string
}

export function Prose({ children, className = "" }: ProseProps) {
  return (
    <div
      className={`
        prose prose-stone dark:prose-invert
        max-w-prose mx-auto
        prose-headings:font-semibold prose-headings:tracking-tight
        prose-h2:text-2xl prose-h3:text-xl
        prose-p:text-[--text-primary] prose-p:leading-relaxed
        prose-a:text-[--cta-primary] prose-a:underline prose-a:underline-offset-2
        prose-strong:text-[--text-primary] prose-strong:font-semibold
        prose-li:text-[--text-primary]
        ${className}
      `}
    >
      {children}
    </div>
  )
}

// ----------------------------------------------------------------------------
// CARD GRID
// ----------------------------------------------------------------------------
// Responsive grid for FeatureCards or similar items.

interface CardGridProps {
  children: ReactNode
  /** Number of columns at desktop */
  columns?: 2 | 3 | 4
}

export function CardGrid({ children, columns = 3 }: CardGridProps) {
  const colClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }

  return <div className={`grid gap-6 ${colClasses[columns]}`}>{children}</div>
}
