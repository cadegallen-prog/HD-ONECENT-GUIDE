#!/usr/bin/env tsx
/**
 * SEO & Mobile-First Audit for /guide page
 * 
 * Checks:
 * - Structured data presence (HowTo, FAQPage, Breadcrumb)
 * - Meta tags completeness
 * - Mobile viewport configuration
 * - Image optimization (lazy load, alt text, responsive)
 * - Core Web Vitals considerations
 * - Semantic HTML structure
 */

import fs from "fs"
import path from "path"

interface AuditResult {
  category: string
  status: "✅" | "⚠️" | "❌"
  message: string
}

const results: AuditResult[] = []

function audit(category: string, status: "✅" | "⚠️" | "❌", message: string) {
  results.push({ category, status, message })
}

// Read guide page
const guidePath = path.join(process.cwd(), "app/guide/page.tsx")
const guideContent = fs.readFileSync(guidePath, "utf-8")

const guideComponentPath = path.join(process.cwd(), "components/GuideContent.tsx")
const guideComponentContent = fs.readFileSync(guideComponentPath, "utf-8")

console.log("═══════════════════════════════════════")
console.log("   SEO & Mobile-First Audit")
console.log("   Target: /guide")
console.log("═══════════════════════════════════════\n")

// ============================================
// STRUCTURED DATA
// ============================================
console.log("📊 Structured Data\n")

if (guideContent.includes('"@type": "HowTo"')) {
  audit("Structured Data", "✅", "HowTo schema present")
} else {
  audit("Structured Data", "❌", "Missing HowTo schema")
}

if (guideContent.includes('"@type": "FAQPage"')) {
  audit("Structured Data", "✅", "FAQPage schema present")
} else {
  audit("Structured Data", "❌", "Missing FAQPage schema")
}

if (guideContent.includes('"@type": "BreadcrumbList"')) {
  audit("Structured Data", "✅", "Breadcrumb schema present")
} else {
  audit("Structured Data", "❌", "Missing Breadcrumb schema")
}

// Count FAQ questions
const faqMatches = guideContent.match(/"@type": "Question"/g)
if (faqMatches && faqMatches.length >= 4) {
  audit("Structured Data", "✅", `${faqMatches.length} FAQ questions in schema`)
} else {
  audit("Structured Data", "⚠️", "Should have 4+ FAQ questions")
}

// ============================================
// META TAGS
// ============================================
console.log("\n🏷️  Meta Tags\n")

if (guideContent.includes('title:')) {
  const titleMatch = guideContent.match(/title:\s*"([^"]+)"/)
  if (titleMatch) {
    const title = titleMatch[1]
    if (title.length >= 50 && title.length <= 60) {
      audit("Meta Tags", "✅", `Title length optimal: ${title.length} chars`)
    } else if (title.length > 60) {
      audit("Meta Tags", "⚠️", `Title too long: ${title.length} chars (max 60)`)
    } else {
      audit("Meta Tags", "⚠️", `Title too short: ${title.length} chars (min 50)`)
    }
  }
}

if (guideContent.includes('description:')) {
  const descMatch = guideContent.match(/description:\s*"([^"]+)"/)
  if (descMatch) {
    const desc = descMatch[1]
    if (desc.length >= 150 && desc.length <= 160) {
      audit("Meta Tags", "✅", `Description length optimal: ${desc.length} chars`)
    } else if (desc.length > 160) {
      audit("Meta Tags", "⚠️", `Description too long: ${desc.length} chars (max 160)`)
    } else {
      audit("Meta Tags", "⚠️", `Description too short: ${desc.length} chars (min 150)`)
    }
  }
}

if (guideContent.includes('openGraph:')) {
  audit("Meta Tags", "✅", "Open Graph tags present")
} else {
  audit("Meta Tags", "❌", "Missing Open Graph tags")
}

if (guideContent.includes('twitter:')) {
  audit("Meta Tags", "✅", "Twitter Card tags present")
} else {
  audit("Meta Tags", "❌", "Missing Twitter Card tags")
}

// ============================================
// MOBILE OPTIMIZATION
// ============================================
console.log("\n📱 Mobile Optimization\n")

// Check for mobile-first CSS classes
if (guideComponentContent.includes('sm:') || guideComponentContent.includes('md:') || guideComponentContent.includes('lg:')) {
  audit("Mobile", "✅", "Responsive breakpoints used (sm:, md:, lg:)")
} else {
  audit("Mobile", "⚠️", "Limited responsive design detected")
}

// Check for touch-friendly elements
if (guideComponentContent.includes('gap-')) {
  audit("Mobile", "✅", "Gap utilities for spacing (touch-friendly)")
} else {
  audit("Mobile", "⚠️", "Consider adding gap utilities for better spacing")
}

// Check for mobile-friendly font sizes
if (guideComponentContent.includes('text-sm') || guideComponentContent.includes('text-base') || guideComponentContent.includes('text-lg')) {
  audit("Mobile", "✅", "Responsive text sizing")
} else {
  audit("Mobile", "⚠️", "Consider adding responsive text sizes")
}

// ============================================
// IMAGES
// ============================================
console.log("\n🖼️  Images\n")

// Count images
const imgMatches = guideComponentContent.match(/<img/g)
if (imgMatches) {
  audit("Images", "✅", `${imgMatches.length} images found`)
  
  // Check for alt text
  const imgWithoutAlt = guideComponentContent.match(/<img(?![^>]*alt=)/g)
  if (!imgWithoutAlt) {
    audit("Images", "✅", "All images have alt text")
  } else {
    audit("Images", "❌", `${imgWithoutAlt.length} images missing alt text`)
  }
  
  // Check for loading attribute
  if (guideComponentContent.includes('loading="lazy"')) {
    audit("Images", "✅", "Lazy loading enabled")
  } else {
    audit("Images", "⚠️", "Consider adding loading='lazy' for better performance")
  }
  
  // Check for responsive images
  if (guideComponentContent.includes('w-full')) {
    audit("Images", "✅", "Responsive image widths (w-full)")
  } else {
    audit("Images", "⚠️", "Consider making images responsive")
  }
} else {
  audit("Images", "⚠️", "No images found")
}

// ============================================
// SEMANTIC HTML
// ============================================
console.log("\n🏗️  Semantic HTML\n")

if (guideComponentContent.includes('<article')) {
  audit("Semantic HTML", "✅", "Using <article> for main content")
} else {
  audit("Semantic HTML", "⚠️", "Consider wrapping content in <article>")
}

if (guideComponentContent.includes('<section')) {
  audit("Semantic HTML", "✅", "Using <section> for content divisions")
} else {
  audit("Semantic HTML", "⚠️", "Consider using <section> elements")
}

if (guideComponentContent.includes('<h2') && guideComponentContent.includes('<h3')) {
  audit("Semantic HTML", "✅", "Proper heading hierarchy (h2, h3)")
} else {
  audit("Semantic HTML", "⚠️", "Check heading hierarchy")
}

// ============================================
// CORE WEB VITALS
// ============================================
console.log("\n⚡ Core Web Vitals Considerations\n")

// Check for potential CLS issues
if (guideComponentContent.includes('rounded-lg') || guideComponentContent.includes('border')) {
  audit("Core Web Vitals", "✅", "Styled containers reduce layout shift")
} else {
  audit("Core Web Vitals", "⚠️", "Consider adding borders/backgrounds to prevent CLS")
}

// Check for potential LCP issues (large images)
if (imgMatches && imgMatches.length > 5) {
  audit("Core Web Vitals", "⚠️", `${imgMatches.length} images may impact LCP - ensure first image loads quickly`)
} else {
  audit("Core Web Vitals", "✅", "Reasonable image count for LCP")
}

// ============================================
// INTERNAL LINKING
// ============================================
console.log("\n🔗 Internal Linking\n")

const internalLinkMatches = guideComponentContent.match(/href="\/[^"]+"/g)
if (internalLinkMatches && internalLinkMatches.length >= 3) {
  audit("Internal Linking", "✅", `${internalLinkMatches.length} internal links (good for crawling)`)
} else if (internalLinkMatches) {
  audit("Internal Linking", "⚠️", `Only ${internalLinkMatches.length} internal links - consider adding more`)
} else {
  audit("Internal Linking", "❌", "No internal links found")
}

// ============================================
// PRINT RESULTS
// ============================================
console.log("\n═══════════════════════════════════════")
console.log("   Audit Results")
console.log("═══════════════════════════════════════\n")

const passed = results.filter(r => r.status === "✅").length
const warnings = results.filter(r => r.status === "⚠️").length
const failed = results.filter(r => r.status === "❌").length

results.forEach(r => {
  console.log(`${r.status} [${r.category}] ${r.message}`)
})

console.log("\n═══════════════════════════════════════")
console.log(`✅ Passed: ${passed}`)
console.log(`⚠️  Warnings: ${warnings}`)
console.log(`❌ Failed: ${failed}`)
console.log("═══════════════════════════════════════\n")

// Recommendations
if (warnings > 0 || failed > 0) {
  console.log("📋 Recommendations:\n")
  
  if (failed > 0) {
    console.log("High Priority:")
    results.filter(r => r.status === "❌").forEach(r => {
      console.log(`  • ${r.message}`)
    })
    console.log("")
  }
  
  if (warnings > 0) {
    console.log("Medium Priority:")
    results.filter(r => r.status === "⚠️").forEach(r => {
      console.log(`  • ${r.message}`)
    })
    console.log("")
  }
}

// Exit code
process.exit(failed > 0 ? 1 : 0)
