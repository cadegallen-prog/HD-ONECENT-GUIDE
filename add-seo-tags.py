#!/usr/bin/env python3
"""
Batch update HTML files with comprehensive SEO meta tags.
"""

import re
import os

# Page-specific metadata configuration
PAGE_METADATA = {
    'in-store-strategy.html': {
        'description': 'Master in-store penny hunting tactics. Learn where to look, how to scan items, use overhead storage, and find hidden clearance sections at Home Depot.',
        'keywords': 'in-store penny hunting, Home Depot tactics, where to find penny items, clearance sections, overhead penny items',
        'og_title': 'In-Store Strategy: Master Penny Hunting Tactics at Home Depot',
        'og_description': 'Discover expert in-store strategies for finding penny items including scanning techniques, clearance section locations, and overhead storage tactics.',
        'schema_type': 'Article',
        'schema_headline': 'In-Store Penny Hunting Strategies and Tactics'
    },
    'checkout-strategy.html': {
        'description': 'Learn checkout strategies for purchasing penny items successfully. Master self-checkout techniques, avoid common mistakes, and handle employee interactions professionally.',
        'keywords': 'penny checkout strategy, self-checkout tactics, buying penny items, checkout tips, penny purchase strategy',
        'og_title': 'Checkout Strategy: Successfully Purchase Penny Items',
        'og_description': 'Master checkout techniques for penny items including self-checkout best practices, avoiding flags, and handling employee interactions.',
        'schema_type': 'Article',
        'schema_headline': 'Checkout Strategies for Penny Item Purchases'
    },
    'internal-systems.html': {
        'description': 'Understand Home Depot internal systems including FIRST phones, clearance app, inventory management, and how employees track and remove penny items.',
        'keywords': 'Home Depot FIRST phone, internal systems, clearance app, inventory management, employee systems',
        'og_title': 'Internal Systems: How Home Depot Tracks Penny Items',
        'og_description': 'Learn about Home Depot\'s internal systems, FIRST phones, clearance tracking app, and how employees identify and remove penny items.',
        'schema_type': 'Article',
        'schema_headline': 'Understanding Home Depot\'s Internal Systems and Tools'
    },
    'facts-vs-myths.html': {
        'description': 'Separate penny hunting facts from myths. Debunk common misconceptions, learn what really works, and avoid wasting time on false strategies.',
        'keywords': 'penny hunting myths, penny facts, penny misconceptions, what works, penny shopping truth',
        'og_title': 'Facts vs Myths: The Truth About Penny Hunting',
        'og_description': 'Cut through the hype and learn what really works in penny hunting. Debunk common myths and focus on proven strategies.',
        'schema_type': 'Article',
        'schema_headline': 'Penny Hunting Facts vs Myths: What Really Works'
    },
    'responsible-hunting.html': {
        'description': 'Practice responsible penny hunting with ethical guidelines, community best practices, store respect, and sustainable hunting strategies.',
        'keywords': 'responsible penny hunting, penny ethics, community guidelines, respectful shopping, ethical penny hunting',
        'og_title': 'Responsible Hunting: Ethical Penny Shopping Practices',
        'og_description': 'Learn responsible penny hunting practices to protect the community, respect stores, and ensure sustainable success for all hunters.',
        'schema_type': 'Article',
        'schema_headline': 'Responsible and Ethical Penny Hunting Practices'
    },
    'faq.html': {
        'description': 'Frequently asked questions about Home Depot penny items. Get answers to common questions about finding, buying, legality, ethics, and strategies.',
        'keywords': 'penny items FAQ, penny hunting questions, penny shopping answers, common questions, penny help',
        'og_title': 'FAQ: Your Penny Hunting Questions Answered',
        'og_description': 'Find answers to the most common penny hunting questions including legality, strategies, ethics, and troubleshooting.',
        'schema_type': 'FAQPage',
        'schema_headline': 'Frequently Asked Questions About Penny Hunting'
    },
    'resources.html': {
        'description': 'Download free penny hunting resources including tracking templates, checklists, workflow guides, and community tools for successful hunting.',
        'keywords': 'penny hunting resources, penny templates, penny tools, hunting checklists, penny worksheets',
        'og_title': 'Resources: Free Penny Hunting Templates and Tools',
        'og_description': 'Access free downloadable resources including penny tracking templates, store visit checklists, and workflow guides.',
        'schema_type': 'WebPage',
        'schema_headline': 'Free Penny Hunting Resources and Downloads'
    },
    'about.html': {
        'description': 'Learn about the HD Penny Items Guide, our mission to provide accurate penny hunting education, and how this comprehensive resource was created.',
        'keywords': 'about penny guide, penny guide info, who created this, penny guide mission',
        'og_title': 'About the Home Depot Penny Items Guide',
        'og_description': 'Learn about our comprehensive penny hunting guide, our commitment to accuracy, and our community-driven approach.',
        'schema_type': 'AboutPage',
        'schema_headline': 'About the Home Depot Penny Items Guide'
    },
    'contribute.html': {
        'description': 'Contribute to the HD Penny Items Guide by sharing strategies, reporting errors, suggesting improvements, and helping the penny hunting community.',
        'keywords': 'contribute penny guide, improve guide, share strategies, report errors, help community',
        'og_title': 'Contribute: Help Improve the Penny Hunting Guide',
        'og_description': 'Help make this guide better by contributing your knowledge, reporting issues, and sharing successful strategies.',
        'schema_type': 'WebPage',
        'schema_headline': 'Contribute to the Penny Hunting Community'
    },
    'changelog.html': {
        'description': 'View the complete update history and changelog for the HD Penny Items Guide. See what is new, what is improved, and recent additions.',
        'keywords': 'penny guide updates, changelog, version history, what is new, guide improvements',
        'og_title': 'Changelog: Guide Updates and Version History',
        'og_description': 'Track all updates, improvements, and additions to the comprehensive penny hunting guide.',
        'schema_type': 'WebPage',
        'schema_headline': 'Update History and Changelog'
    },
    'quick-reference-card.html': {
        'description': 'Quick reference card with essential penny hunting information including price endings, markdown cadences, and key strategies at a glance.',
        'keywords': 'penny quick reference, cheat sheet, quick guide, price endings reference, penny summary',
        'og_title': 'Quick Reference: Essential Penny Hunting Cheat Sheet',
        'og_description': 'Print-friendly quick reference with all essential penny hunting information including price endings and markdown schedules.',
        'schema_type': 'WebPage',
        'schema_headline': 'Penny Hunting Quick Reference Card'
    },
    'store-visit-checklist.html': {
        'description': 'Printable store visit checklist for systematic penny hunting. Ensure you check all key areas and follow best practices on every trip.',
        'keywords': 'store visit checklist, penny hunting checklist, shopping checklist, hunt checklist, store checklist template',
        'og_title': 'Store Visit Checklist: Systematic Penny Hunting Template',
        'og_description': 'Download and print this comprehensive checklist to ensure thorough and organized penny hunting on every store visit.',
        'schema_type': 'WebPage',
        'schema_headline': 'Store Visit Checklist Template'
    },
    'store-notes-template.html': {
        'description': 'Downloadable store notes template for tracking penny hunting observations, clearance patterns, employee schedules, and store-specific insights.',
        'keywords': 'store notes template, penny notes, hunting journal, store tracking, observation template',
        'og_title': 'Store Notes Template: Track Your Penny Hunting Observations',
        'og_description': 'Organize your penny hunting observations with this customizable store notes template for tracking patterns and insights.',
        'schema_type': 'WebPage',
        'schema_headline': 'Store Notes and Observations Template'
    },
    'finds-log-template.html': {
        'description': 'Track your penny item finds with this detailed log template. Record UPCs, prices, dates, locations, and resale values for organized inventory management.',
        'keywords': 'finds log template, penny tracker, inventory template, item log, penny finds spreadsheet',
        'og_title': 'Finds Log Template: Track and Organize Your Penny Items',
        'og_description': 'Comprehensive template for logging penny finds including purchase details, resale values, and inventory tracking.',
        'schema_type': 'WebPage',
        'schema_headline': 'Penny Finds Log and Tracking Template'
    },
    'digital-prehunt-workflow.html': {
        'description': 'Step-by-step digital pre-hunt workflow for efficient online scouting. Systematically check inventory, identify targets, and plan store visits.',
        'keywords': 'digital workflow, pre-hunt process, scouting workflow, online hunting process, systematic scouting',
        'og_title': 'Digital Pre-Hunt Workflow: Systematic Online Scouting Process',
        'og_description': 'Follow this proven workflow for efficient digital pre-hunting including inventory checking, target identification, and visit planning.',
        'schema_type': 'HowTo',
        'schema_headline': 'Step-by-Step Digital Pre-Hunt Workflow'
    },
}

# Default metadata for pages not specifically configured
DEFAULT_METADATA = {
    'description': 'Home Depot Penny Items Guide - Comprehensive resource for penny hunting strategies, clearance lifecycle, and responsible shopping.',
    'keywords': 'Home Depot penny items, penny hunting, clearance shopping, penny guide',
    'og_title': 'Home Depot Penny Items Guide',
    'og_description': 'Complete guide to finding and purchasing penny items at Home Depot through responsible and informed shopping practices.',
    'schema_type': 'WebPage',
    'schema_headline': 'Home Depot Penny Items Guide'
}

def get_metadata(filename):
    """Get metadata for a specific page or return defaults."""
    return PAGE_METADATA.get(filename, DEFAULT_METADATA)

def generate_seo_tags(filename, canonical_url):
    """Generate complete SEO meta tags for a page."""
    meta = get_metadata(filename)

    tags = f'''
  <!-- SEO Meta Tags -->
  <meta name="description" content="{meta['description']}">
  <meta name="keywords" content="{meta['keywords']}">
  <meta name="author" content="HD Penny Items Guide">
  <meta name="copyright" content="2025 HD Penny Items Guide">
  <meta name="theme-color" content="#f96302">
  <link rel="canonical" href="{canonical_url}">

  <!-- Favicon -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>💰</text></svg>">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="{canonical_url}">
  <meta property="og:title" content="{meta['og_title']}">
  <meta property="og:description" content="{meta['og_description']}">
  <meta property="og:site_name" content="Home Depot Penny Items Guide">
  <meta property="og:image" content="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'><rect fill='%23f96302' width='1200' height='630'/><text x='50%' y='45%' fill='white' font-size='64' font-weight='bold' text-anchor='middle'>HD Penny Guide</text><text x='50%' y='60%' fill='white' font-size='36' text-anchor='middle'>{filename.replace('.html', '').replace('-', ' ').title()}</text></svg>">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="{canonical_url}">
  <meta name="twitter:title" content="{meta['og_title']}">
  <meta name="twitter:description" content="{meta['og_description']}">
  <meta name="twitter:image" content="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'><rect fill='%23f96302' width='1200' height='630'/><text x='50%' y='45%' fill='white' font-size='64' font-weight='bold' text-anchor='middle'>HD Penny Guide</text><text x='50%' y='60%' fill='white' font-size='36' text-anchor='middle'>{filename.replace('.html', '').replace('-', ' ').title()}</text></svg>">

  <!-- Structured Data -->
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "{meta['schema_type']}",
    "headline": "{meta['schema_headline']}",
    "description": "{meta['description']}",
    "author": {{
      "@type": "Organization",
      "name": "HD Penny Items Guide"
    }},
    "publisher": {{
      "@type": "Organization",
      "name": "HD Penny Items Guide"
    }},
    "mainEntityOfPage": {{
      "@type": "WebPage",
      "@id": "{canonical_url}"
    }}
  }}
  </script>
'''
    return tags

def update_html_file(filepath):
    """Update an HTML file with SEO tags."""
    filename = os.path.basename(filepath)
    canonical_url = f"https://yourdomain.com/{filename}"

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if already has SEO tags
    if '<meta name="description"' in content:
        print(f"  ✓ {filename} - Already has SEO tags, skipping")
        return False

    # Find the title tag and insert SEO tags after it
    # Handle both patterns: with and without PWA tags
    pattern1 = r'(<title>.*?</title>\n)(  <!-- PWA Manifest -->)'
    pattern2 = r'(<title>.*?</title>\n)(  <link rel="stylesheet")'

    seo_tags = generate_seo_tags(filename, canonical_url)

    if re.search(pattern1, content):
        # Has PWA tags, insert before them
        updated_content = re.sub(
            pattern1,
            r'\1' + seo_tags + r'\n\2',
            content
        )
    elif re.search(pattern2, content):
        # No PWA tags, insert before stylesheet
        updated_content = re.sub(
            pattern2,
            r'\1' + seo_tags + r'\n\2',
            content
        )
    else:
        print(f"  ✗ {filename} - Could not find insertion point")
        return False

    # Write updated content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(updated_content)

    print(f"  ✓ {filename} - SEO tags added successfully")
    return True

def main():
    """Main function to update all HTML files."""
    import glob

    html_files = sorted(glob.glob("*.html"))
    updated_count = 0
    skipped_count = 0
    failed_count = 0

    print("=" * 60)
    print("HD PENNY GUIDE - SEO TAGS BATCH UPDATE")
    print("=" * 60)
    print(f"\nFound {len(html_files)} HTML files\n")
    print("Processing files:\n")

    for filepath in html_files:
        result = update_html_file(filepath)
        if result:
            updated_count += 1
        elif result is False:
            failed_count += 1
        else:
            skipped_count += 1

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total files: {len(html_files)}")
    print(f"Updated: {updated_count}")
    print(f"Skipped (already has SEO): {skipped_count}")
    print(f"Failed: {failed_count}")
    print("=" * 60)

if __name__ == "__main__":
    main()
