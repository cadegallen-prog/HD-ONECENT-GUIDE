# ============================================================================
# PENNY CENTRAL — PAGE IMPROVEMENT WIZARD
# ============================================================================
# Purpose: Generate structured prompts for AI coding assistants that align
#          with PennyCentral's design system, accessibility standards, and docs.
#
# Usage: Run this script, answer the questions, then paste the output into
#        your AI coding assistant (Copilot, Claude, ChatGPT).
#
# WCAG Target: AAA compliance (7:1 contrast for normal text, 4.5:1 for large)
# ============================================================================

$ErrorActionPreference = "Stop"

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
        $input = Read-Host "  Rating [1-5]"
        if ($input -match '^[1-5]$') {
            return [int]$input
        }
        Write-Host "  Please enter a number between 1 and 5." -ForegroundColor Red
    }
}

# ============================================================================
# HEADER
# ============================================================================

Clear-Host
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║           PENNY CENTRAL — PAGE IMPROVEMENT WIZARD                ║" -ForegroundColor Magenta
Write-Host "║                                                                  ║" -ForegroundColor Magenta
Write-Host "║  This wizard captures structured input about a page you want    ║" -ForegroundColor Magenta
Write-Host "║  to improve, then generates a prompt for your AI assistant.     ║" -ForegroundColor Magenta
Write-Host "║                                                                  ║" -ForegroundColor Magenta
Write-Host "║  Target: WCAG AAA Compliance | Design System: PennyCentral v2   ║" -ForegroundColor Magenta
Write-Host "╚══════════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# ============================================================================
# AVAILABLE PAGES
# ============================================================================

$availablePages = @(
    "landing (app/page.tsx)",
    "store-finder",
    "trip-tracker",
    "guide",
    "resources",
    "cashback",
    "about",
    "faq",
    "what-are-pennies",
    "clearance-lifecycle",
    "checkout-strategy",
    "in-store-strategy",
    "digital-pre-hunt",
    "facts-vs-myths",
    "responsible-hunting",
    "internal-systems"
)

Write-Section "STEP 1: SELECT PAGE"

Write-Host "Available pages:" -ForegroundColor Gray
$i = 1
foreach ($page in $availablePages) {
    Write-Host "  $i. $page" -ForegroundColor Gray
    $i++
}
Write-Host ""

$pageName = Read-Host "Which page are you improving? (Enter name or number)"

# Convert number to name if applicable
if ($pageName -match '^\d+$') {
    $index = [int]$pageName - 1
    if ($index -ge 0 -and $index -lt $availablePages.Count) {
        $pageName = $availablePages[$index] -replace ' \(.*\)', ''
    }
}

# Normalize page name
$pageName = $pageName.Trim().ToLower()
if ($pageName -eq "landing" -or $pageName -eq "home" -or $pageName -eq "homepage") {
    $pageName = "landing"
    $pageFile = "app/page.tsx"
} else {
    $pageFile = "app/$pageName/page.tsx"
}

Write-Host ""
Write-Host "Selected: $pageName ($pageFile)" -ForegroundColor Green

# ============================================================================
# PAGE CONTEXT
# ============================================================================

Write-Section "STEP 2: PAGE CONTEXT"

$pageGoal = Read-Host "What is the MAIN GOAL of this page for the user?"
Write-Host "  Example: Help users find their nearest Home Depot stores" -ForegroundColor DarkGray
Write-Host ""

$primaryUsers = Read-Host "Who are the PRIMARY USERS of this page?"
Write-Host "  Example: Casual penny hunters, serious resellers, first-time visitors" -ForegroundColor DarkGray
Write-Host ""

$primaryCTA = Read-Host "What is the PRIMARY CALL TO ACTION?"
Write-Host "  Example: Use store finder, Read penny guide, Join Facebook group" -ForegroundColor DarkGray
Write-Host ""

$currentProblems = Read-Host "What feels WRONG or WEAK about the current page?"
Write-Host "  Example: Too much text, unclear purpose, CTA buried, poor mobile layout" -ForegroundColor DarkGray
Write-Host ""

$successLook = Read-Host "If this page were PERFECT, what would users do or say?"
Write-Host "  Example: 'I immediately found what I needed and took action'" -ForegroundColor DarkGray
Write-Host ""

$extraNotes = Read-Host "Any EXTRA NOTES, constraints, or ideas? (Press Enter to skip)"

# ============================================================================
# SELF-ASSESSMENT RATINGS
# ============================================================================

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

Write-Subsection "Accessibility & Mobile"
$mobile = Get-Rating "How good is the MOBILE experience?" "Works well on phone screens?"
$access = Get-Rating "How ACCESSIBLE is the page?" "Contrast, font sizes, screen reader friendly?"
$interactive = Get-Rating "How obviously CLICKABLE are interactive elements?" "Links underlined, buttons look like buttons?"

# ============================================================================
# COMPUTE DIAGNOSIS
# ============================================================================

$allScores = @($clarity, $scan, $cta, $layout, $hierarchy, $colorUse, $mobile, $access, $interactive)
$avgScore = ($allScores | Measure-Object -Average).Average
$avgScore = [math]::Round($avgScore, 1)
$minScore = ($allScores | Measure-Object -Minimum).Minimum

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

# Identify weak areas (below 3)
$weakAreas = @()
$scoreNames = @{
    0 = "Clarity of purpose"
    1 = "Scannability"
    2 = "Call-to-action strength"
    3 = "Layout and spacing"
    4 = "Visual hierarchy"
    5 = "Color usage"
    6 = "Mobile experience"
    7 = "Accessibility"
    8 = "Interactive element clarity"
}

for ($i = 0; $i -lt $allScores.Count; $i++) {
    if ($allScores[$i] -lt 3) {
        $weakAreas += $scoreNames[$i]
    }
}

# Critical areas (below 2)
$criticalAreas = @()
for ($i = 0; $i -lt $allScores.Count; $i++) {
    if ($allScores[$i] -lt 2) {
        $criticalAreas += $scoreNames[$i]
    }
}

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

if ($weakAreas.Count -eq 0 -and $criticalAreas.Count -eq 0) {
    Write-Host ""
    Write-Host "No areas scored below 3. Focus on polish and optimization." -ForegroundColor Green
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
2. **lib/constants.ts** — Centralized constants (member count, URLs)
3. **app/globals.css** — CSS variables and color system
4. **tailwind.config.ts** — Tailwind theme configuration

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

PennyCentral uses a **warm neutral + blue CTA** system:

**Light Mode:**
- Background: #FFFFFF (primary), #F8F8F7 (secondary)
- Text: #1C1917 (primary, 15.4:1 contrast ✓), #44403C (secondary, 9.7:1 ✓), #6B6560 (muted, 5.7:1 ✓)
- CTA: #1D4ED8 (blue, white text at 8.6:1 ✓)
- Borders: #E7E5E4

**Dark Mode:**
- Background: #171412 (primary), #231F1C (card), #2E2926 (elevated)
- Text: #FAFAF9 (primary, 16.2:1 ✓), #D6D3D1 (secondary, 11.8:1 ✓), #A8A29E (muted, 7.1:1 ✓)
- CTA: #3B82F6 (blue, white text)
- Borders: #3D3835

### Typography
- Font: Inter (sans-serif)
- Body: 16px base, 1.6 line height
- Headings: Bold weight, clear size hierarchy

### Interactive Elements (CRITICAL for Accessibility)
- **Inline links:** Must be underlined AND use a distinct color
- **Buttons:** Solid background, sufficient padding, visible hover/focus states
- **Focus rings:** Visible outline on keyboard focus

### Forbidden Elements
- Gradients, heavy shadows, animations >150ms
- Emoji in UI, decorative graphics
- Orange/amber/teal/cyan/pink/purple accents
- Text larger than 22px
- Gamification elements

---

## YOUR TASK

1. **Read the page code** at $pageFile and related components
2. **Address weak areas first** (anything scored < 3)
3. **Improve toward exceptional** using the criteria above
4. **Maintain consistency** with the design system in globals.css

### Output Format

1. **UX Plan** — Brief explanation of layout/hierarchy/CTA changes
2. **Files Changed** — List of files you will modify
3. **Code Changes** — Complete updated code for each file

### Constraints

- Do NOT turn pages into walls of text
- Do NOT break existing navigation or routing
- Do NOT add new dependencies without explaining why
- DO use existing shadcn/ui components where appropriate
- DO use constants from lib/constants.ts
- DO follow the 60-30-10 color rule (60% neutral, 30% supporting, 10% CTA)
"@

# ============================================================================
# OUTPUT
# ============================================================================

Write-Section "GENERATED PROMPT"

Write-Host "Copy everything below the line and paste into your AI assistant:" -ForegroundColor White
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

# Save to file for reference
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$outputFile = "scripts/prompts/$pageName-$timestamp.md"
$outputDir = Split-Path $outputFile -Parent

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$prompt | Out-File -FilePath $outputFile -Encoding UTF8
Write-Host "✓ Prompt saved to: $outputFile" -ForegroundColor Gray
Write-Host ""
Write-Host "Paste this prompt into Copilot Chat, Claude, or ChatGPT to begin." -ForegroundColor Cyan
Write-Host ""
