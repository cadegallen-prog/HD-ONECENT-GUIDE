# HD Penny Guide - Asset Placeholders

This document lists all placeholders that need to be filled with actual content/assets.

## Images Required

### Hero Section
- **hero-clearance-tag-mockup.png**
  - Description: Annotated clearance tags showing .03/.02 price endings
  - Recommended size: 800x800px
  - Format: PNG or JPG
  - Location: `/public/images/`

### What Are Pennies Section
- **receipt-penny-item-example.jpg**
  - Description: Receipt showing items purchased at $0.01
  - Recommended size: 600x400px
  - Format: JPG
  - Location: `/public/images/`

### Digital Tools Section
- **app-screenshot-store-selector.png**
  - Description: Home Depot app showing store selection screen
  - Recommended size: 400x800px (mobile screenshot)
  - Format: PNG
  - Location: `/public/images/`

- **app-screenshot-sku-search.png**
  - Description: Home Depot app showing SKU search results
  - Recommended size: 400x800px (mobile screenshot)
  - Format: PNG
  - Location: `/public/images/`

- **app-comparison-side-by-side.png**
  - Description: Side-by-side comparison of app vs in-store pricing
  - Recommended size: 1200x600px
  - Format: PNG
  - Location: `/public/images/`

### In-Store Strategies Section
- **photo-clearance-endcap.jpg**
  - Description: Orange clearance endcap in Home Depot
  - Recommended size: 800x600px
  - Format: JPG
  - Location: `/public/images/`

- **photo-dusty-shelf-example.jpg**
  - Description: Forgotten clearance items on back shelf
  - Recommended size: 800x600px
  - Format: JPG
  - Location: `/public/images/`

- **photo-sco-screen-blur.jpg**
  - Description: Self-checkout screen (blurred for privacy)
  - Recommended size: 800x600px
  - Format: JPG
  - Location: `/public/images/`

- **photo-first-phone.jpg**
  - Description: FIRST phone (associate handheld device)
  - Recommended size: 600x800px
  - Format: JPG
  - Location: `/public/images/`

- **photo-yellow-ladder.jpg** & **photo-orange-ladder.jpg**
  - Description: Overhead storage ladders
  - Recommended size: 600x800px
  - Format: JPG
  - Location: `/public/images/`

### Internal Systems Section
- **screenshot-clearance-app-ui.png**
  - Description: Screenshot of associate clearance app interface
  - Recommended size: 800x600px
  - Format: PNG
  - Location: `/public/images/`

## SVG Diagrams Required

### Cadence Comparison
- **cadence-comparison-chart.svg**
  - Description: Timeline diagram showing Cadence A vs B progression
  - Type: Custom SVG illustration
  - Location: `/public/diagrams/`

### Price Decoder
- **price-ending-reference-card.svg**
  - Description: Visual reference card for price ending meanings
  - Type: Custom SVG illustration
  - Location: `/public/diagrams/`

### Checkout Section
- **diagram-barcode-vs-tag.svg**
  - Description: Diagram explaining barcode scan vs physical tag priority
  - Type: Custom SVG illustration
  - Location: `/public/diagrams/`

### Internal Systems
- **diagram-zma-process-flow.svg**
  - Description: Flowchart of ZMA (Zero Margin Alert) process
  - Type: Custom SVG illustration
  - Location: `/public/diagrams/`

## Text Content Placeholders

### Hero Section
- **PLACEHOLDER_HERO_SUBHEAD**
  - Current: "A comprehensive reference for finding clearance items..."
  - Can be customized to better match community voice

### FAQ Section
- **PLACEHOLDER_FAQ_LEGAL** - Legal status explanation (currently filled)
- **PLACEHOLDER_FAQ_FREQUENCY** - How often to check (currently filled)
- **PLACEHOLDER_FAQ_RETURNS** - Return policy explanation (currently filled)
- **PLACEHOLDER_FAQ_ADDITIONAL_5_QUESTIONS** - 5 more common questions to add

### Footer
- **PLACEHOLDER_FOOTER_DISCLAIMER** - Extended legal disclaimer (currently filled)

## Data Files Created

### JSON Files (in `/data/`)
- ✅ **clearance-cadences.json** - Cadence progression data
- Potential additions:
  - **recent-finds.json** - Community recent finds (optional)
  - **store-locations.json** - Store finder data (optional)
  - **faq-data.json** - Structured FAQ content (optional)

## PDF Download

### Guide PDF
- **hd-penny-guide.pdf**
  - Description: Downloadable PDF version of complete guide
  - Location: `/public/downloads/`
  - Note: Hero section has "Download PDF Guide" button that needs to link to this

## Implementation Priority

### High Priority (Core Functionality)
1. Hero image placeholder (hero-clearance-tag-mockup.png)
2. PDF download file
3. At least one example photo for in-store section

### Medium Priority (Enhanced Experience)
1. App screenshots for digital tools section
2. SVG diagrams for cadences and processes
3. Additional in-store photos

### Low Priority (Nice to Have)
1. Additional FAQ questions
2. Recent finds data/widget
3. All decorative photos

## Notes

- All image paths in the code currently show placeholder text with asset names
- Images should be optimized for web (compressed, appropriate formats)
- SVG diagrams can be created with tools like Figma, Illustrator, or even code-based tools
- Consider using Next.js Image component for optimal loading
- Maintain consistent visual style across all assets
- Ensure all photos comply with Home Depot's brand guidelines and don't violate any policies

## Placeholder Locations in Code

Search codebase for these terms to find all placeholder locations:
- `PLACEHOLDER_HERO_IMAGE`
- `PLACEHOLDER_RECEIPT_EXAMPLE`
- `PLACEHOLDER_DIAGRAM`
- `PLACEHOLDER_FAQ_`
- `PLACEHOLDER_FOOTER_DISCLAIMER`

All placeholders are clearly marked in the code with the pattern `PLACEHOLDER_*` for easy identification.
