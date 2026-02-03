# ============================================================================
# PENNY CENTRAL — PAGE IMPROVEMENT WIZARD v2
# ============================================================================
# Purpose: Generate structured prompts for AI coding assistants that align
#          with PennyCentral's design system, accessibility standards, and docs.
#
# Usage:
#   Full mode:   .\page-improvement-wizard.ps1
#   Quick mode:  .\page-improvement-wizard.ps1 -Quick -Page "landing"
#   List pages:  .\page-improvement-wizard.ps1 -ListPages
#
# WCAG Target: AAA compliance (7:1 contrast for normal text, 4.5:1 for large)
# ============================================================================

param(
    [switch]$Quick,           # Skip ratings, use default "needs improvement"
    [switch]$ListPages,       # Just list available pages and exit
    [string]$Page = "",       # Pre-select a page
    [string]$Problem = "",    # Pre-fill the problem description
    [switch]$Help             # Show help
)

$ErrorActionPreference = "Stop"

# ============================================================================
# AVAILABLE PAGES
# ============================================================================

$pageMap = @{
    "landing"             = "app/page.tsx"
    "home"                = "app/page.tsx"
    "store-finder"        = "app/store-finder/page.tsx"
    "trip-tracker"        = "app/trip-tracker/page.tsx"
    "guide"               = "app/guide/page.tsx"
    "resources"           = "app/resources/page.tsx"
    "cashback"            = "app/cashback/page.tsx"
    "about"               = "app/about/page.tsx"
    "faq"                 = "app/faq/page.tsx"
    "what-are-pennies"    = "app/what-are-pennies/page.tsx"
    "clearance-lifecycle" = "app/clearance-lifecycle/page.tsx"
    "checkout-strategy"   = "app/checkout-strategy/page.tsx"
    "in-store-strategy"   = "app/in-store-strategy/page.tsx"
    "digital-pre-hunt"    = "app/digital-pre-hunt/page.tsx"
    "facts-vs-myths"      = "app/facts-vs-myths/page.tsx"
    "responsible-hunting" = "app/responsible-hunting/page.tsx"
    "internal-systems"    = "app/internal-systems/page.tsx"
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Subsection {
    param([string]$Title)
    Write-Host ""
    Write-Host "--- $Title ---" -ForegroundColor Yellow
}

function Get-Rating {
    param(
        [string]$Prompt,
        [string]$Description
    )
    while ($true) {
        Write-Host "$Prompt" -ForegroundColor White
        if ($Description) {
            Write-Host "  ($Description)" -ForegroundColor DarkGray
        }
        $response = Read-Host "  Rating [1-5]"
        if ($response -match '^[1-5]$') {
            return [int]$response
        }
        Write-Host "  Please enter a number between 1 and 5." -ForegroundColor Red
    }
}

function Show-Help {
    Write-Host ""
    Write-Host "PENNY CENTRAL PAGE IMPROVEMENT WIZARD" -ForegroundColor Cyan
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\page-improvement-wizard.ps1                    # Full interactive mode"
    Write-Host "  .\page-improvement-wizard.ps1 -Quick -Page landing"
    Write-Host "  .\page-improvement-wizard.ps1 -Page guide -Problem 'too much text'"
    Write-Host "  .\page-improvement-wizard.ps1 -ListPages         # Show all pages"
    Write-Host ""
    Write-Host "Parameters:" -ForegroundColor Yellow
    Write-Host "  -Quick      Skip the rating questions, assume page needs work"
    Write-Host "  -Page       Pre-select the page to improve"
    Write-Host "  -Problem    Pre-fill the problem description"
    Write-Host "  -ListPages  List all available pages and exit"
    Write-Host "  -Help       Show this help message"
    Write-Host ""
    Write-Host "The wizard generates a prompt to paste into Copilot/Claude/ChatGPT." -ForegroundColor Gray
    Write-Host ""
}

function Show-PageList {
    Write-Host ""
    Write-Host "AVAILABLE PAGES" -ForegroundColor Cyan
    Write-Host "===============" -ForegroundColor Cyan
    Write-Host ""
    $i = 1
    foreach ($key in $pageMap.Keys | Sort-Object) {
        Write-Host "  $i. $key" -ForegroundColor White -NoNewline
        Write-Host " → $($pageMap[$key])" -ForegroundColor DarkGray
        $i++
    }
    Write-Host ""
}

# ============================================================================
# HANDLE FLAGS
# ============================================================================

if ($Help) {
    Show-Help
    exit 0
}

if ($ListPages) {
    Show-PageList
    exit 0
}

# ============================================================================
# HEADER
# ============================================================================

Clear-Host
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║           PENNY CENTRAL — PAGE IMPROVEMENT WIZARD v2             ║" -ForegroundColor Magenta
Write-Host "║                                                                  ║" -ForegroundColor Magenta
Write-Host "║  Target: WCAG AAA Compliance | Design System: PennyCentral v2   ║" -ForegroundColor Magenta
Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta

if ($Quick) {
    Write-Host ""
    Write-Host "  [QUICK MODE] Skipping detailed ratings" -ForegroundColor Yellow
}

Write-Host ""

# ============================================================================
# STEP 1: SELECT PAGE
# ============================================================================

Write-Section "STEP 1: SELECT PAGE"

if (-not $Page) {
    Show-PageList
    $Page = Read-Host "Which page? (Enter name or number)"
}

# Convert number to name
if ($Page -match '^\d+$') {
    $sortedKeys = $pageMap.Keys | Sort-Object
    $index = [int]$Page - 1
    if ($index -ge 0 -and $index -lt $sortedKeys.Count) {
        $Page = $sortedKeys[$index]
    }
}

# Normalize
$pageName = $Page.Trim().ToLower()
if ($pageName -eq "home" -or $pageName -eq "homepage") {
    $pageName = "landing"
}

# Validate
if (-not $pageMap.ContainsKey($pageName)) {
    Write-Host "Unknown page: $pageName" -ForegroundColor Red
    Write-Host "Use -ListPages to see available pages." -ForegroundColor Gray
    exit 1
}

$pageFile = $pageMap[$pageName]
Write-Host "Selected: " -NoNewline
Write-Host "$pageName" -ForegroundColor Green -NoNewline
Write-Host " ($pageFile)" -ForegroundColor DarkGray

# ============================================================================
# STEP 2: PAGE CONTEXT
# ============================================================================

Write-Section "STEP 2: PAGE CONTEXT"

if ($Quick) {
    # Quick mode defaults
    $pageGoal = Read-Host "Main GOAL of this page? (one sentence)"
    $primaryUsers = "Penny hunters visiting the site"
    $primaryCTA = Read-Host "Primary CTA? (e.g., 'Use store finder')"
    $currentProblems = if ($Problem) { $Problem } else { Read-Host "What's WRONG with the current page?" }
    $successLook = "Users quickly understand and take action"
    $extraNotes = ""
} else {
    $pageGoal = Read-Host "What is the MAIN GOAL of this page for the user?"
    Write-Host "  Example: Help users find their nearest Home Depot stores" -ForegroundColor DarkGray
    Write-Host ""

    $primaryUsers = Read-Host "Who are the PRIMARY USERS of this page?"
    Write-Host "  Example: Casual penny hunters, serious resellers, first-time visitors" -ForegroundColor DarkGray
    Write-Host ""

    $primaryCTA = Read-Host "What is the PRIMARY CALL TO ACTION?"
    Write-Host "  Example: Use store finder, Read penny guide, Join Facebook group" -ForegroundColor DarkGray
    Write-Host ""

    $currentProblems = if ($Problem) { $Problem } else { Read-Host "What feels WRONG or WEAK about the current page?" }
    Write-Host "  Example: Too much text, unclear purpose, CTA buried, poor mobile layout" -ForegroundColor DarkGray
    Write-Host ""

    $successLook = Read-Host "If this page were PERFECT, what would users do or say?"
    Write-Host "  Example: 'I immediately found what I needed and took action'" -ForegroundColor DarkGray
    Write-Host ""

    $extraNotes = Read-Host "Any EXTRA NOTES, constraints, or ideas? (Press Enter to skip)"
}

# ============================================================================
# STEP 3: SELF-ASSESSMENT (Skip in Quick mode)
# ============================================================================

if ($Quick) {
    # Default scores for Quick mode (assume needs work)
    $clarity = 3
    $scan = 3
    $cta = 3
    $layout = 3
    $hierarchy = 3
    $colorUse = 4  # Assume color system is OK
    $typography = 4  # Assume typography is OK
    $mobile = 3
    $access = 4  # Assume accessibility basics are OK
    $interactive = 4
} else {
    Write-Section "STEP 3: SELF-ASSESSMENT"

    Write-Host "Rate the CURRENT page from 1-5 for each factor." -ForegroundColor White
    Write-Host "1 = Terrible, 2 = Weak, 3 = Acceptable, 4 = Good, 5 = Excellent" -ForegroundColor Gray
    Write-Host "If unsure, estimate based on your gut feeling." -ForegroundColor Gray

    Write-Subsection "Content & Clarity"
    $clarity = Get-Rating "How CLEAR is it what this page is for at a glance?" "Can a new visitor understand the purpose in 3 seconds?"
    $scan = Get-Rating "How SCANNABLE is the content?" "Can users get the gist by reading headings only?"
    $cta = Get-Rating "How STRONG and OBVIOUS is the main call to action?" "Does the primary CTA stand out?"

    Write-Subsection "Layout & Visual Design"
    $layout = Get-Rating "How good is the LAYOUT and SPACING?" "Does it feel organized and breathable?"
    $hierarchy = Get-Rating "How clear is the VISUAL HIERARCHY?" "Do important things look important?"
    $colorUse = Get-Rating "How appropriate is the COLOR usage?" "Consistent palette, not noisy, proper contrast?"

    Write-Subsection "Typography & Readability"
    $typography = Get-Rating "How good is the TYPOGRAPHY?" "Font sizes, line lengths, heading hierarchy?"

    Write-Subsection "Accessibility & Mobile"
    $mobile = Get-Rating "How good is the MOBILE experience?" "Works well on phone screens?"
    $access = Get-Rating "How ACCESSIBLE is the page?" "Contrast, font sizes, screen reader friendly?"
    $interactive = Get-Rating "How obviously CLICKABLE are interactive elements?" "Links underlined, buttons look like buttons?"
}

# ============================================================================
# COMPUTE DIAGNOSIS
# ============================================================================

$allScores = @($clarity, $scan, $cta, $layout, $hierarchy, $colorUse, $typography, $mobile, $access, $interactive)
$avgScore = ($allScores | Measure-Object -Average).Average
$avgScore = [math]::Round($avgScore, 1)

# Quality tier
if ($avgScore -lt 2.5) {
    $qualityTier = "CRITICAL"
    $qualityDesc = "Page needs significant redesign. Multiple fundamental issues."
    $qualityColor = "Red"
}
elseif ($avgScore -lt 3.5) {
    $qualityTier = "NEEDS WORK"
    $qualityDesc = "Page has clear weaknesses. Focused improvements needed."
    $qualityColor = "Yellow"
}
elseif ($avgScore -lt 4.5) {
    $qualityTier = "DECENT"
    $qualityDesc = "Page is functional but not exceptional. Polish and optimization."
    $qualityColor = "Cyan"
}
else {
    $qualityTier = "STRONG"
    $qualityDesc = "Page is already good. Fine-tuning and edge cases only."
    $qualityColor = "Green"
}

# Identify weak areas
$scoreNames = @{
    0 = "Clarity of purpose"
    1 = "Scannability"
    2 = "Call-to-action strength"
    3 = "Layout and spacing"
    4 = "Visual hierarchy"
    5 = "Color usage"
    6 = "Typography and readability"
    7 = "Mobile experience"
    8 = "Accessibility"
    9 = "Interactive element clarity"
}

$weakAreas = @()
$criticalAreas = @()
for ($i = 0; $i -lt $allScores.Count; $i++) {
    if ($allScores[$i] -lt 2) {
        $criticalAreas += $scoreNames[$i]
    }
    elseif ($allScores[$i] -lt 3) {
        $weakAreas += $scoreNames[$i]
    }
}

# ============================================================================
# SHOW DIAGNOSIS
# ============================================================================

Write-Section "DIAGNOSIS"

Write-Host "Average Score: " -NoNewline
Write-Host "$avgScore / 5.0" -ForegroundColor $qualityColor
Write-Host "Quality Tier:  " -NoNewline
Write-Host "$qualityTier" -ForegroundColor $qualityColor
Write-Host ""
Write-Host $qualityDesc -ForegroundColor Gray

if ($criticalAreas.Count -gt 0) {
    Write-Host ""
    Write-Host "CRITICAL ISSUES (score < 2):" -ForegroundColor Red
    foreach ($area in $criticalAreas) {
        Write-Host "  • $area" -ForegroundColor Red
    }
}

if ($weakAreas.Count -gt 0) {
    Write-Host ""
    Write-Host "Weak Areas (score < 3):" -ForegroundColor Yellow
    foreach ($area in $weakAreas) {
        Write-Host "  • $area" -ForegroundColor Yellow
    }
}

# ============================================================================
# BUILD THE PROMPT
# ============================================================================

$weakAreasText = if ($weakAreas.Count -gt 0) { $weakAreas -join ", " } else { "None identified" }
$criticalAreasText = if ($criticalAreas.Count -gt 0) { $criticalAreas -join ", " } else { "None" }

$prompt = @"
# PENNY CENTRAL PAGE IMPROVEMENT REQUEST

You are improving a page on www.pennycentral.com, a utility guide for Home Depot penny shoppers.

---

## CRITICAL: READ PROJECT DOCS FIRST

Before making ANY changes, read these files in the repo:
1. **AGENTS.md** — Design system, forbidden elements, behavior rules
2. **docs/COLOR-SYSTEM.md** — WCAG AAA color specifications and typography
3. **lib/constants.ts** — Centralized constants (member count, URLs)
4. **app/globals.css** — CSS variables and base styles

These docs are the source of truth. Do not deviate from them.

---

## PAGE TO IMPROVE

**Page:** $pageName
**File:** $pageFile
**Goal:** $pageGoal
**Primary Users:** $primaryUsers
**Primary CTA:** $primaryCTA

---

## CURRENT PROBLEMS

$currentProblems

---

## SUCCESS CRITERIA

$successLook

---

## EXTRA NOTES

$(if ($extraNotes) { $extraNotes } else { "None provided" })

---

## SELF-ASSESSMENT SCORES (1-5)

| Category | Score | Status |
|----------|-------|--------|
| Clarity of purpose | $clarity | $(if ($clarity -lt 3) { "⚠️ WEAK" } elseif ($clarity -lt 4) { "→ Improve" } else { "✓ OK" }) |
| Scannability | $scan | $(if ($scan -lt 3) { "⚠️ WEAK" } elseif ($scan -lt 4) { "→ Improve" } else { "✓ OK" }) |
| CTA strength | $cta | $(if ($cta -lt 3) { "⚠️ WEAK" } elseif ($cta -lt 4) { "→ Improve" } else { "✓ OK" }) |
| Layout/spacing | $layout | $(if ($layout -lt 3) { "⚠️ WEAK" } elseif ($layout -lt 4) { "→ Improve" } else { "✓ OK" }) |
| Visual hierarchy | $hierarchy | $(if ($hierarchy -lt 3) { "⚠️ WEAK" } elseif ($hierarchy -lt 4) { "→ Improve" } else { "✓ OK" }) |
| Color usage | $colorUse | $(if ($colorUse -lt 3) { "⚠️ WEAK" } elseif ($colorUse -lt 4) { "→ Improve" } else { "✓ OK" }) |
| Typography | $typography | $(if ($typography -lt 3) { "⚠️ WEAK" } elseif ($typography -lt 4) { "→ Improve" } else { "✓ OK" }) |
| Mobile experience | $mobile | $(if ($mobile -lt 3) { "⚠️ WEAK" } elseif ($mobile -lt 4) { "→ Improve" } else { "✓ OK" }) |
| Accessibility | $access | $(if ($access -lt 3) { "⚠️ WEAK" } elseif ($access -lt 4) { "→ Improve" } else { "✓ OK" }) |
| Interactive clarity | $interactive | $(if ($interactive -lt 3) { "⚠️ WEAK" } elseif ($interactive -lt 4) { "→ Improve" } else { "✓ OK" }) |

**Average:** $avgScore / 5.0
**Quality Tier:** $qualityTier
**Critical Areas:** $criticalAreasText
**Weak Areas:** $weakAreasText

---

## DESIGN SYSTEM REQUIREMENTS

### Color System (WCAG AAA Target)

**Light Mode:**
- Background: #FFFFFF (primary), #F8F8F7 (secondary)
- Text: #1C1917 (15.4:1 ✓ AAA), #44403C (9.7:1 ✓ AAA), #57534E (7.1:1 ✓ AAA)
- CTA: #1D4ED8 blue, white text (8.6:1 ✓ AAA)

**Dark Mode:**
- Background: #171412 (primary), #231F1C (card)
- Text: #FAFAF9 (16.2:1 ✓ AAA), #D6D3D1 (11.8:1 ✓ AAA), #A8A29E (7.1:1 ✓ AAA)
- CTA: #3B82F6 blue, white text

### Typography (from docs/COLOR-SYSTEM.md)

- Font: Inter (400, 500, 600 weights)
- Body: 16px, line-height 1.6
- H1: 30px max, H2: 24px, H3: 20px
- Minimum: 12px (enforced)
- Line length: max 65-80 characters (use max-w-prose)
- No justified text, left-aligned only

### Interactive Elements

- **Links in body text:** MUST be underlined AND blue (#1D4ED8)
- **Buttons:** Solid CTA background, 44x44px minimum touch target
- **Focus rings:** 2px solid outline, visible on all focusable elements

### Forbidden Elements

- Gradients, heavy shadows, animations >150ms
- Emoji in UI, decorative graphics
- Orange/amber/teal/cyan/pink/purple accents
- Text larger than 30px, smaller than 12px

---

## YOUR TASK

1. **Read the page code** at $pageFile and related components
2. **Address weak areas first** (anything scored < 3)
3. **Improve toward exceptional** using the design system
4. **Verify accessibility** — contrast, font sizes, touch targets

### Output Format

1. **UX Plan** — Brief explanation of changes
2. **Files Changed** — List of modified files
3. **Code Changes** — Complete updated code for each file

### Constraints

- Do NOT turn pages into walls of text
- Do NOT break existing navigation or routing
- DO use existing shadcn/ui components
- DO use constants from lib/constants.ts
- DO follow 60-30-10 color rule
"@

# ============================================================================
# OUTPUT
# ============================================================================

Write-Section "GENERATED PROMPT"

Write-Host "Copy everything below and paste into your AI assistant:" -ForegroundColor White
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host $prompt
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# Copy to clipboard
$prompt | Set-Clipboard
Write-Host "✓ Prompt copied to clipboard!" -ForegroundColor Green
Write-Host ""

# Save to file
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$outputDir = Join-Path $PSScriptRoot "prompts"
$outputFile = Join-Path $outputDir "$pageName-$timestamp.md"

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$prompt | Out-File -FilePath $outputFile -Encoding UTF8
Write-Host "✓ Saved to: $outputFile" -ForegroundColor Gray
Write-Host ""
Write-Host "Paste this prompt into Copilot Chat to begin." -ForegroundColor Cyan
Write-Host ""
