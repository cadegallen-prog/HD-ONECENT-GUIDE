# Content Quality Checklist

**Purpose:** Ensure every page meets quality standards before publishing
**Last Updated:** 2025-11-18

---

## How to Use This Checklist

Before marking a page as "complete," go through each section and check off every item. If you can't check an item, fix the issue before proceeding.

**Tip**: Print this checklist or keep it open while creating pages.

---

## 📝 Content Quality

### Writing Quality

- [ ] **Clear purpose** - Page has a single, well-defined purpose
- [ ] **Appropriate length** - Not too short (< 300 words) or too long (> 2500 words)
- [ ] **Scannable** - Uses headings, lists, and callouts to break up text
- [ ] **Conversational tone** - Friendly but professional
- [ ] **No jargon** - Or jargon is explained on first use
- [ ] **Active voice** - Prefers "Use the app" over "The app should be used"
- [ ] **Specific examples** - Includes real examples where appropriate
- [ ] **Accurate information** - Content is factually correct
- [ ] **Up-to-date** - No outdated information or broken processes

### Content Structure

- [ ] **H1 present** - Exactly one H1 per page
- [ ] **Logical hierarchy** - Headings follow H1 → H2 → H3 order (no skipping)
- [ ] **Introduction** - First paragraph explains what the page is about
- [ ] **Summary box** - Page has a summary box explaining key points
- [ ] **Section headings** - Content is divided into clear sections with H2 headings
- [ ] **Conclusion** - Page ends with key takeaways or next steps
- [ ] **Related links** - Links to related pages in the guide
- [ ] **Next page link** - Suggests next page in learning path

### Content Elements

- [ ] **Lists used appropriately** - Bullet points for groups, numbers for steps
- [ ] **Tables for data** - Structured information uses tables, not paragraphs
- [ ] **Callouts for emphasis** - Important points highlighted in callout boxes
- [ ] **Code formatting** - Technical terms use `<code>` tags
- [ ] **Bold for emphasis** - Key terms are bold on first use
- [ ] **No redundancy** - Content doesn't repeat unnecessarily

---

## 🎨 Visual Design

### Layout

- [ ] **Proper spacing** - Content has breathing room (not cramped)
- [ ] **Consistent margins** - All sections use template spacing
- [ ] **Centered content** - Main content is centered and max-width 900px
- [ ] **Footer visible** - Footer appears at bottom of page
- [ ] **No horizontal scroll** - Page doesn't scroll horizontally (desktop)

### Typography

- [ ] **Readable font size** - Base font is 18px (adjustable by user)
- [ ] **Appropriate line height** - Text has 1.6 line height for readability
- [ ] **Heading contrast** - Headings are visually distinct from body text
- [ ] **Code blocks styled** - Code has gray background and monospace font
- [ ] **No ALL CAPS** - Except for acronyms (ZMA, FAQ, etc.)

### Color & Contrast

- [ ] **Sufficient contrast** - Text passes WCAG AA (4.5:1 for body text)
- [ ] **Consistent colors** - Uses CSS variables, not hardcoded colors
- [ ] **Orange accent used correctly** - Home Depot orange (#f96302) for accents
- [ ] **Callouts have appropriate colors** - Warning = yellow, danger = red, etc.
- [ ] **Dark mode works** - Page is readable in dark theme

---

## 🔗 Links & Navigation

### Internal Links

- [ ] **Relative paths** - Internal links use `href="page.html"` not full URLs
- [ ] **All links work** - No 404 errors on internal links
- [ ] **Descriptive link text** - No "click here" or "read more"
- [ ] **Related pages linked** - Cross-references to related content
- [ ] **Breadcrumbs present** - `<div class="breadcrumbs">` in main
- [ ] **Previous/Next buttons** - `<div class="page-nav-buttons">` present

### External Links

- [ ] **Open in new tab** - External links have `target="_blank"` (if desired)
- [ ] **No broken links** - All external URLs are valid
- [ ] **Appropriate external links** - Only link to reputable sources

### Navigation

- [ ] **Page in nav bar** - Link appears in `<nav>` on ALL pages
- [ ] **Correct nav position** - Link is in logical place in navigation
- [ ] **Active state works** - Current page is highlighted in nav
- [ ] **PAGE_ORDER updated** - Page added to scripts.js PAGE_ORDER array
- [ ] **PAGE_TITLES updated** - Page title added to PAGE_TITLES object

---

## 📱 Responsive Design

### Mobile (< 768px)

- [ ] **Readable text** - Font size appropriate for mobile
- [ ] **Touch targets** - Buttons are at least 44x44px
- [ ] **Navigation stacks** - Nav links stack vertically
- [ ] **No horizontal overflow** - Content fits in viewport
- [ ] **Tables scroll** - Wide tables wrapped in `.table-enhanced`
- [ ] **Images resize** - Images don't overflow viewport

### Tablet (768px - 1199px)

- [ ] **Layout adapts** - Content adjusts to tablet width
- [ ] **Navigation readable** - Nav items have enough space
- [ ] **Tables fit** - Tables are readable or scroll horizontally

### Desktop (1200px+)

- [ ] **Full layout** - All features visible and functional
- [ ] **Max width enforced** - Content doesn't stretch too wide
- [ ] **Balanced design** - Page looks polished on large screens

---

## ♿ Accessibility

### Keyboard Navigation

- [ ] **Tab order logical** - Tabbing through elements makes sense
- [ ] **All interactive elements reachable** - Buttons, links accessible via keyboard
- [ ] **Focus indicators visible** - Focused elements have visible outline
- [ ] **Skip to main content** - Skip link available (if applicable)
- [ ] **No keyboard traps** - Can tab out of all elements

### Screen Readers

- [ ] **Alt text on images** - All `<img>` tags have alt attributes
- [ ] **ARIA labels present** - Buttons have aria-label attributes
- [ ] **Semantic HTML** - Uses `<nav>`, `<main>`, `<footer>`, etc.
- [ ] **Heading structure** - Headings are nested correctly (H1 → H2 → H3)
- [ ] **Table headers** - Tables use `<th>` elements with `scope` attribute
- [ ] **Link text descriptive** - Links make sense out of context

### Color & Contrast

- [ ] **Color not sole indicator** - Don't rely on color alone for meaning
- [ ] **Contrast ratio sufficient** - Text meets WCAG AA standards (4.5:1)
- [ ] **Focus visible** - Focus states don't rely on color alone

---

## 🔍 SEO & Metadata

### Required Meta Tags

- [ ] **Title tag unique** - Page has unique, descriptive title
- [ ] **Title length** - Title is 50-60 characters (ideal for Google)
- [ ] **Meta description** - Unique description under 155 characters
- [ ] **Description compelling** - Entices users to click in search results
- [ ] **Keywords meta** - Includes relevant keywords
- [ ] **Canonical URL** - `<link rel="canonical">` points to this page
- [ ] **Theme color** - `<meta name="theme-color" content="#f96302">`

### Open Graph Tags

- [ ] **og:type** - Set to "article" for content pages
- [ ] **og:title** - Descriptive title for social sharing
- [ ] **og:description** - Compelling description for social media
- [ ] **og:url** - Canonical URL of page
- [ ] **og:site_name** - Set to "Home Depot Penny Items Guide"
- [ ] **og:image** - Preview image for social shares (SVG or PNG)

### Twitter Card

- [ ] **twitter:card** - Set to "summary_large_image"
- [ ] **twitter:title** - Title for Twitter shares
- [ ] **twitter:description** - Description for Twitter
- [ ] **twitter:image** - Image for Twitter preview

### Structured Data

- [ ] **JSON-LD present** - Schema.org structured data included
- [ ] **@type correct** - Usually "Article" for content pages
- [ ] **headline** - Matches or similar to H1
- [ ] **description** - Brief page description
- [ ] **Valid JSON** - No syntax errors in structured data

---

## 🔧 Technical

### HTML Validation

- [ ] **Valid HTML5** - No errors in W3C validator
- [ ] **Proper DOCTYPE** - `<!DOCTYPE html>` at top
- [ ] **Character encoding** - `<meta charset="UTF-8">`
- [ ] **Viewport meta** - `<meta name="viewport" ...>` present
- [ ] **No deprecated tags** - Uses modern HTML5 elements
- [ ] **Semantic elements** - `<nav>`, `<main>`, `<footer>`, etc.

### CSS

- [ ] **External stylesheet** - No inline styles (except rare exceptions)
- [ ] **CSS variables used** - Colors use `var(--accent-color)` not `#f96302`
- [ ] **No !important** - Avoids !important unless absolutely necessary
- [ ] **Responsive classes** - Uses existing responsive utilities

### JavaScript

- [ ] **Scripts load** - No JavaScript errors in console
- [ ] **Breadcrumbs generate** - Auto-generated breadcrumbs appear
- [ ] **TOC generates** - Table of contents auto-populates from headings
- [ ] **Page navigation works** - Previous/Next buttons functional
- [ ] **Progress tracking works** - Page marks as read when visited
- [ ] **Search includes page** - Page appears in search results
- [ ] **Theme toggle works** - Can switch between light/dark mode
- [ ] **Font controls work** - Can adjust font size

### Performance

- [ ] **Fast loading** - Page loads in < 2 seconds
- [ ] **No external dependencies** - All resources are local
- [ ] **Images optimized** - Images compressed (if any)
- [ ] **Minimal file size** - HTML file < 50KB (ideally)

---

## 🎯 Page-Specific Quality

### Beginner Pages

- [ ] **Explains basics clearly** - No assumptions of prior knowledge
- [ ] **Defines terms** - All technical terms explained
- [ ] **Simple language** - Avoids complex sentences
- [ ] **Visual aids** - Uses callouts, lists, tables to explain
- [ ] **Encouraging tone** - Doesn't intimidate or overwhelm

### Intermediate Pages

- [ ] **Builds on basics** - Links back to beginner content
- [ ] **Step-by-step guidance** - Processes broken into clear steps
- [ ] **Examples provided** - Real-world examples included
- [ ] **Tips included** - Pro tips in callout boxes

### Advanced Pages

- [ ] **Assumes knowledge** - Doesn't re-explain basics
- [ ] **Links to fundamentals** - References beginner pages for review
- [ ] **Detailed information** - Provides in-depth coverage
- [ ] **Technical accuracy** - Information is precise and correct

### Reference Pages

- [ ] **Quick to scan** - Information organized for fast lookup
- [ ] **Tables used** - Data presented in table format
- [ ] **Alphabetical/logical order** - Information organized logically
- [ ] **Comprehensive** - Covers all relevant items

### Guide Pages

- [ ] **Clear objectives** - States what user will accomplish
- [ ] **Prerequisites listed** - Says what user needs to know first
- [ ] **Step-by-step** - Process broken into numbered steps
- [ ] **Troubleshooting** - Includes common issues and solutions
- [ ] **Success criteria** - Explains how to know when done

---

## 📊 Content Components Checklist

### Required on All Pages

- [ ] Breadcrumbs (`<div class="breadcrumbs">`)
- [ ] H1 heading (exactly one)
- [ ] Table of contents (`<div class="table-of-contents">`)
- [ ] Page metadata (read time, difficulty)
- [ ] Summary box
- [ ] Previous/Next navigation
- [ ] Footer disclaimer
- [ ] Back to top button

### Recommended Components

- [ ] Callout boxes (for tips, warnings, key takeaways)
- [ ] Tables (for structured data)
- [ ] Lists (bullets or numbered)
- [ ] Related topics section
- [ ] Code examples (where applicable)

### Optional Components

- [ ] Comparison tables (do's vs don'ts)
- [ ] Procedure steps
- [ ] Enhanced lists (checkmarks, crosses, arrows)
- [ ] Quick reference cards
- [ ] Accordion sections (for FAQs)
- [ ] Progress indicators (for multi-step guides)

---

## ✅ Pre-Publish Checklist

### Final Review

- [ ] **Proofread** - No typos, spelling errors, or grammar mistakes
- [ ] **Fact-check** - All information is accurate
- [ ] **Links tested** - All internal and external links work
- [ ] **Cross-browser tested** - Works in Chrome, Firefox, Safari
- [ ] **Mobile tested** - Tested on actual mobile device
- [ ] **Accessibility tested** - Keyboard nav and screen reader friendly
- [ ] **SEO optimized** - Meta tags complete and accurate
- [ ] **Navigation updated** - Page linked in all other pages
- [ ] **Scripts updated** - PAGE_ORDER and PAGE_TITLES updated
- [ ] **Validated** - HTML passes W3C validator

### Post-Publish

- [ ] **Search indexed** - Page appears in site search
- [ ] **Progress tracking** - Page shows in progress counter
- [ ] **Social sharing** - Open Graph tags display correctly
- [ ] **Analytics** - Page tracking works (if applicable)

---

## 🚨 Common Issues to Check

### Critical Issues (Must Fix)

- [ ] **No H1** - Every page needs exactly one H1
- [ ] **Broken links** - All links must work
- [ ] **Missing navigation** - Page must be in nav on all pages
- [ ] **No meta description** - Required for SEO
- [ ] **Accessibility fails** - Color contrast, keyboard nav must work
- [ ] **Mobile breaks** - Page must be usable on mobile

### Important Issues (Should Fix)

- [ ] **No summary box** - Pages should have overview
- [ ] **Missing related links** - Should link to related content
- [ ] **No callouts** - Important info should be highlighted
- [ ] **Poor heading structure** - Headings should be hierarchical
- [ ] **No table of contents** - Long pages need TOC

### Nice to Have (Consider Fixing)

- [ ] **Could use more examples** - Real examples help understanding
- [ ] **Missing pro tips** - Expert advice in callouts
- [ ] **No visual aids** - Tables, lists improve scannability
- [ ] **Tone could be friendlier** - More conversational style
- [ ] **Could link more** - More cross-references to other pages

---

## 📋 Page Type Templates

### Content Page Checklist

- [ ] Summary box at top
- [ ] Clear sections with H2 headings
- [ ] At least one callout box
- [ ] Related topics at end
- [ ] Previous/Next navigation
- [ ] Read time: 3-8 minutes

### Guide Page Checklist

- [ ] Prerequisites listed
- [ ] Step-by-step instructions
- [ ] Procedure steps formatted correctly
- [ ] Screenshots or examples (if needed)
- [ ] Troubleshooting section
- [ ] Read time: 5-10 minutes

### Reference Page Checklist

- [ ] Quick reference at top
- [ ] Table for main data
- [ ] Searchable/sortable if long
- [ ] Example use cases
- [ ] Print-friendly
- [ ] Read time: 2-5 minutes

### FAQ Page Checklist

- [ ] Questions categorized
- [ ] Accordion format
- [ ] Most common questions first
- [ ] Related question links
- [ ] Search functionality
- [ ] Read time: 3-7 minutes

---

## 🎓 Quality Standards

### Excellent Page

✅ Clear purpose and well-structured
✅ Scannable with headings, lists, callouts
✅ No errors (typos, broken links, validation)
✅ Fully accessible (keyboard, screen reader)
✅ Mobile responsive
✅ Fast loading
✅ Comprehensive metadata
✅ Engaging and helpful content

### Good Page

✅ Meets all required checklist items
✅ Few minor issues (e.g., could use more examples)
✅ Accessible and responsive
✅ Accurate information
✅ Most recommended items present

### Needs Improvement

⚠️ Missing some required elements
⚠️ Accessibility issues present
⚠️ Poor structure or organization
⚠️ Broken links or errors
⚠️ Not mobile responsive

### Unacceptable

❌ No H1 or multiple H1s
❌ Broken navigation
❌ Accessibility failures
❌ Inaccurate information
❌ Not mobile responsive
❌ Missing meta tags

---

## 📝 Review Process

### Self-Review (Author)

1. Complete this checklist
2. Fix all issues found
3. Test in browser
4. Test on mobile device
5. Mark page as "Ready for Review"

### Peer Review (Optional)

1. Another person reviews the page
2. Uses this checklist
3. Provides feedback
4. Author addresses feedback

### Final Approval

1. All checklist items checked
2. No critical or important issues
3. Page published
4. Monitoring for user feedback

---

## 🔄 Maintenance Checklist

### Quarterly Review

- [ ] Information still accurate?
- [ ] Links still work?
- [ ] Examples still relevant?
- [ ] Screenshots up-to-date? (if any)
- [ ] New related pages to link?

### Annual Review

- [ ] Content still aligned with site goals?
- [ ] Writing style consistent with newer pages?
- [ ] Accessibility standards updated?
- [ ] SEO best practices followed?
- [ ] Mobile experience still good?

---

## 📞 Getting Help

If you're unsure about any checklist item:

1. **Compare to existing pages** - See how similar pages handle it
2. **Check style-guide.md** - Component documentation and examples
3. **Check template-usage.md** - Step-by-step page creation guide
4. **Test with users** - Get feedback from actual readers
5. **Use validation tools** - W3C validator, WAVE accessibility checker

---

## 🎯 Quick Quality Check (30 seconds)

Can't do the full checklist? Do this minimum check:

- [ ] H1 present and unique
- [ ] No console errors
- [ ] All links work
- [ ] Readable on mobile
- [ ] Navigation includes this page
- [ ] Meta description present

**If all 6 items pass, page is probably okay to publish** (but do full checklist when you have time).

---

**Last updated:** 2025-11-18
**See also:** [style-guide.md](style-guide.md), [template-usage.md](template-usage.md)
