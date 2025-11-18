// ====================
// HD-ONECENT-GUIDE - Enhanced Interactive Features
// ====================

// Page configuration
const PAGE_ORDER = [
  'index.html',
  'quick-start.html',
  'what-are-pennies.html',
  'clearance-lifecycle.html',
  'digital-prehunt.html',
  'in-store-strategy.html',
  'checkout-strategy.html',
  'internal-systems.html',
  'facts-vs-myths.html',
  'responsible-hunting.html',
  'calculators.html',
  'faq.html',
  'resources.html',
  'quick-reference-card.html',
  'contribute.html',
  'changelog.html',
  'about.html'
];

const PAGE_TITLES = {
  'index.html': 'Home',
  'quick-start.html': 'Quick Start',
  'what-are-pennies.html': 'What Are Pennies?',
  'clearance-lifecycle.html': 'Clearance Lifecycle',
  'digital-prehunt.html': 'Digital Pre-Hunt',
  'in-store-strategy.html': 'In-Store Strategy',
  'checkout-strategy.html': 'Checkout Strategy',
  'internal-systems.html': 'Internal Systems',
  'facts-vs-myths.html': 'Facts vs. Myths',
  'responsible-hunting.html': 'Responsible Hunting',
  'calculators.html': 'Calculators',
  'faq.html': 'FAQ',
  'resources.html': 'Resources',
  'quick-reference-card.html': 'Quick Reference',
  'contribute.html': 'Contribute',
  'changelog.html': 'Changelog',
  'about.html': 'About'
};

// ====================
// UTILITY FUNCTIONS
// ====================

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function getCurrentPageIndex() {
  return PAGE_ORDER.indexOf(getCurrentPage());
}

function getNextPage() {
  const currentIndex = getCurrentPageIndex();
  return currentIndex < PAGE_ORDER.length - 1 ? PAGE_ORDER[currentIndex + 1] : null;
}

function getPreviousPage() {
  const currentIndex = getCurrentPageIndex();
  return currentIndex > 0 ? PAGE_ORDER[currentIndex - 1] : null;
}

// ====================
// PROGRESS TRACKING
// ====================

const ProgressTracker = {
  init() {
    this.markCurrentPageAsRead();
    this.updateProgressIndicator();
    this.addProgressCheckmarks();
  },

  getReadPages() {
    const stored = localStorage.getItem('hd-guide-progress');
    return stored ? JSON.parse(stored) : [];
  },

  saveReadPages(pages) {
    localStorage.setItem('hd-guide-progress', JSON.stringify(pages));
  },

  markCurrentPageAsRead() {
    const currentPage = getCurrentPage();
    const readPages = this.getReadPages();
    if (!readPages.includes(currentPage)) {
      readPages.push(currentPage);
      this.saveReadPages(readPages);
    }
  },

  updateProgressIndicator() {
    const readPages = this.getReadPages();
    const totalPages = PAGE_ORDER.length;
    const readCount = readPages.length;

    const progressEl = document.querySelector('.progress-indicator');
    if (progressEl) {
      progressEl.textContent = `${readCount}/${totalPages} pages read`;
    }
  },

  addProgressCheckmarks() {
    const readPages = this.getReadPages();
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (readPages.includes(href)) {
        link.classList.add('page-read');
      }
    });
  },

  resetProgress() {
    if (confirm('Reset all progress? This will mark all pages as unread.')) {
      localStorage.removeItem('hd-guide-progress');
      location.reload();
    }
  }
};

// ====================
// USER PREFERENCES
// ====================

const Preferences = {
  init() {
    this.loadTheme();
    this.loadFontSize();
    this.setupThemeToggle();
    this.setupFontSizeControls();
  },

  loadTheme() {
    const theme = localStorage.getItem('hd-guide-theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    this.updateThemeButton(theme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('hd-guide-theme', newTheme);
    this.updateThemeButton(newTheme);
  },

  updateThemeButton(theme) {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.textContent = theme === 'light' ? '🌙' : '☀️';
      btn.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }
  },

  setupThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => this.toggleTheme());
    }
  },

  loadFontSize() {
    const size = localStorage.getItem('hd-guide-font-size') || 'medium';
    document.documentElement.setAttribute('data-font-size', size);
    this.updateFontSizeButtons(size);
  },

  setFontSize(size) {
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem('hd-guide-font-size', size);
    this.updateFontSizeButtons(size);
  },

  updateFontSizeButtons(activeSize) {
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === activeSize);
    });
  },

  setupFontSizeControls() {
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setFontSize(btn.dataset.size));
    });
  }
};

// ====================
// SITE-WIDE SEARCH
// ====================

const Search = {
  searchIndex: [],

  init() {
    this.setupSearchBar();
    this.buildSearchIndex();
  },

  setupSearchBar() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeSearch();
        }
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.toggleSearch());
    }

    // Keyboard shortcut: Ctrl+K or /
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !this.isTyping(e))) {
        e.preventDefault();
        this.openSearch();
      }
    });
  },

  isTyping(e) {
    return ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
  },

  toggleSearch() {
    const searchContainer = document.querySelector('.search-container');
    const isOpen = searchContainer.classList.contains('active');
    if (isOpen) {
      this.closeSearch();
    } else {
      this.openSearch();
    }
  },

  openSearch() {
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.querySelector('.search-input');
    searchContainer.classList.add('active');
    searchInput.focus();
  },

  closeSearch() {
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    searchContainer.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
  },

  async buildSearchIndex() {
    // Build index from current page
    const main = document.querySelector('main');
    if (main) {
      const currentPage = getCurrentPage();
      const pageTitle = PAGE_TITLES[currentPage] || 'Home Depot Penny Guide';

      // Extract headings and paragraphs
      const headings = Array.from(main.querySelectorAll('h1, h2, h3'));
      const paragraphs = Array.from(main.querySelectorAll('p'));

      headings.forEach(heading => {
        this.searchIndex.push({
          page: currentPage,
          pageTitle: pageTitle,
          type: 'heading',
          content: heading.textContent,
          element: heading
        });
      });

      paragraphs.forEach(p => {
        if (p.textContent.trim().length > 20) {
          this.searchIndex.push({
            page: currentPage,
            pageTitle: pageTitle,
            type: 'paragraph',
            content: p.textContent,
            element: p
          });
        }
      });
    }
  },

  handleSearch(query) {
    const resultsContainer = document.querySelector('.search-results');

    if (!query || query.length < 2) {
      resultsContainer.innerHTML = '';
      return;
    }

    const results = this.searchContent(query);
    this.displayResults(results, query);
  },

  searchContent(query) {
    const lowerQuery = query.toLowerCase();
    const results = [];

    this.searchIndex.forEach(item => {
      const lowerContent = item.content.toLowerCase();
      if (lowerContent.includes(lowerQuery)) {
        const index = lowerContent.indexOf(lowerQuery);
        const start = Math.max(0, index - 50);
        const end = Math.min(item.content.length, index + query.length + 100);
        let excerpt = item.content.substring(start, end);

        if (start > 0) excerpt = '...' + excerpt;
        if (end < item.content.length) excerpt += '...';

        results.push({
          ...item,
          excerpt: excerpt,
          relevance: this.calculateRelevance(item, lowerQuery)
        });
      }
    });

    return results.sort((a, b) => b.relevance - a.relevance).slice(0, 10);
  },

  calculateRelevance(item, query) {
    let score = 0;
    const lowerContent = item.content.toLowerCase();

    if (item.type === 'heading') score += 10;
    if (lowerContent.startsWith(query)) score += 5;

    const occurrences = (lowerContent.match(new RegExp(query, 'g')) || []).length;
    score += occurrences;

    return score;
  },

  displayResults(results, query) {
    const resultsContainer = document.querySelector('.search-results');

    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="search-result-empty">No results found</div>';
      return;
    }

    const html = results.map(result => {
      const highlightedExcerpt = this.highlightQuery(result.excerpt, query);
      const isCurrentPage = result.page === getCurrentPage();

      if (isCurrentPage) {
        // Link to section on current page
        const sectionId = result.element.id || this.createSectionId(result.element);
        return `
          <div class="search-result" data-href="#${sectionId}">
            <div class="search-result-title">${result.pageTitle}</div>
            <div class="search-result-excerpt">${highlightedExcerpt}</div>
          </div>
        `;
      } else {
        return `
          <div class="search-result" data-href="${result.page}">
            <div class="search-result-title">${result.pageTitle}</div>
            <div class="search-result-excerpt">${highlightedExcerpt}</div>
          </div>
        `;
      }
    }).join('');

    resultsContainer.innerHTML = html;

    // Add click handlers
    document.querySelectorAll('.search-result').forEach(result => {
      result.addEventListener('click', () => {
        const href = result.dataset.href;
        if (href.startsWith('#')) {
          this.scrollToSection(href);
          this.closeSearch();
        } else {
          window.location.href = href;
        }
      });
    });
  },

  createSectionId(element) {
    if (!element.id) {
      const id = 'search-target-' + Math.random().toString(36).substr(2, 9);
      element.id = id;
    }
    return element.id;
  },

  scrollToSection(hash) {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, null, hash);
    }
  },

  highlightQuery(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
};

// ====================
// NAVIGATION ENHANCEMENTS
// ====================

const Navigation = {
  init() {
    this.addBackToTop();
    this.addPrevNextButtons();
    this.setupKeyboardNavigation();
    this.generateTableOfContents();
    this.setupBreadcrumbs();
  },

  addBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (btn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      });

      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  },

  addPrevNextButtons() {
    const prevPage = getPreviousPage();
    const nextPage = getNextPage();

    const prevBtn = document.querySelector('.nav-prev-btn');
    const nextBtn = document.querySelector('.nav-next-btn');

    if (prevBtn && prevPage) {
      prevBtn.href = prevPage;
      prevBtn.style.display = 'inline-flex';
      prevBtn.innerHTML = `<span class="nav-arrow">←</span> ${PAGE_TITLES[prevPage]}`;
    }

    if (nextBtn && nextPage) {
      nextBtn.href = nextPage;
      nextBtn.style.display = 'inline-flex';
      nextBtn.innerHTML = `${PAGE_TITLES[nextPage]} <span class="nav-arrow">→</span>`;
    }
  },

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Ignore if typing in input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowLeft' || e.key === 'p') {
        const prevPage = getPreviousPage();
        if (prevPage) window.location.href = prevPage;
      } else if (e.key === 'ArrowRight' || e.key === 'n') {
        const nextPage = getNextPage();
        if (nextPage) window.location.href = nextPage;
      }
    });
  },

  generateTableOfContents() {
    const tocContainer = document.querySelector('.table-of-contents');
    if (!tocContainer) return;

    const main = document.querySelector('main');
    const headings = main.querySelectorAll('h2, h3');

    if (headings.length < 3) {
      tocContainer.style.display = 'none';
      return;
    }

    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    headings.forEach((heading, index) => {
      // Create ID if it doesn't exist
      if (!heading.id) {
        heading.id = 'section-' + index;
      }

      const li = document.createElement('li');
      li.className = heading.tagName === 'H3' ? 'toc-item-h3' : 'toc-item-h2';

      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.textContent = heading.textContent;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, '#' + heading.id);
      });

      li.appendChild(link);
      tocList.appendChild(li);
    });

    tocContainer.appendChild(tocList);
  },

  setupBreadcrumbs() {
    const breadcrumbs = document.querySelector('.breadcrumbs');
    if (!breadcrumbs) return;

    const currentPage = getCurrentPage();
    const currentTitle = PAGE_TITLES[currentPage] || 'Home';

    breadcrumbs.innerHTML = `
      <a href="index.html">Home</a>
      ${currentPage !== 'index.html' ? `<span class="breadcrumb-separator">›</span><span class="breadcrumb-current">${currentTitle}</span>` : ''}
    `;
  }
};

// ====================
// CONTENT FEATURES
// ====================

const ContentFeatures = {
  init() {
    this.addCopyButtons();
    this.setupExpandableSections();
    this.setupDeepLinks();
  },

  addCopyButtons() {
    // Add copy buttons to code blocks and important lists
    const codeBlocks = document.querySelectorAll('code');
    const importantLists = document.querySelectorAll('ol, ul');

    codeBlocks.forEach(code => {
      if (code.textContent.length > 20) {
        this.wrapWithCopyButton(code);
      }
    });

    // Only add to lists that look like procedures/steps
    importantLists.forEach(list => {
      if (list.querySelectorAll('li').length >= 3) {
        const firstLiText = list.querySelector('li')?.textContent || '';
        if (firstLiText.length > 30) {
          this.wrapWithCopyButton(list, 'list');
        }
      }
    });
  },

  wrapWithCopyButton(element, type = 'code') {
    const wrapper = document.createElement('div');
    wrapper.className = 'copyable-content';

    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);

    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = '📋 Copy';
    btn.setAttribute('aria-label', 'Copy to clipboard');

    btn.addEventListener('click', async () => {
      const text = type === 'list'
        ? Array.from(element.querySelectorAll('li')).map(li => li.textContent).join('\n')
        : element.textContent;

      try {
        await navigator.clipboard.writeText(text);
        btn.innerHTML = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = '📋 Copy';
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        btn.innerHTML = '✗ Failed';
        setTimeout(() => {
          btn.innerHTML = '📋 Copy';
        }, 2000);
      }
    });

    wrapper.insertBefore(btn, element);
  },

  setupExpandableSections() {
    // Make blockquotes and certain sections expandable/collapsible
    const blockquotes = document.querySelectorAll('blockquote');

    blockquotes.forEach(bq => {
      if (bq.textContent.length > 200) {
        bq.classList.add('expandable-section');
        bq.classList.add('collapsed');

        const toggle = document.createElement('button');
        toggle.className = 'expand-toggle';
        toggle.textContent = 'Show more ▼';

        toggle.addEventListener('click', () => {
          bq.classList.toggle('collapsed');
          toggle.textContent = bq.classList.contains('collapsed')
            ? 'Show more ▼'
            : 'Show less ▲';
        });

        bq.appendChild(toggle);
      }
    });
  },

  setupDeepLinks() {
    // Make all headings linkable
    const headings = document.querySelectorAll('main h2, main h3');

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      heading.classList.add('linkable-heading');
      heading.addEventListener('click', () => {
        const url = window.location.origin + window.location.pathname + '#' + heading.id;
        history.pushState(null, null, '#' + heading.id);

        // Copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
          const tooltip = document.createElement('span');
          tooltip.className = 'link-copied-tooltip';
          tooltip.textContent = 'Link copied!';
          heading.appendChild(tooltip);
          setTimeout(() => tooltip.remove(), 2000);
        });
      });
    });
  }
};

// ====================
// ORIGINAL FEATURES (Preserved)
// ====================

function initializeOriginalFeatures() {
  // FAQ Accordion functionality
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      this.classList.toggle('active');
      const answer = this.nextElementSibling;
      answer.classList.toggle('active');
    });
  });

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });

  // Highlight current page in navigation
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath ||
        (currentPath === '' && linkPath === 'index.html') ||
        (currentPath === 'index.html' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ====================
// SOCIAL SHARING
// ====================

const SocialSharing = {
  init() {
    this.createFloatingShareBar();
    this.setupShareButtons();
    this.handleShareBarVisibility();
  },

  getPageInfo() {
    const title = document.title || 'Home Depot Penny Items Guide';
    const url = window.location.href;
    const description = document.querySelector('meta[name="description"]')?.content ||
                       'Complete guide to finding penny items at Home Depot';
    return { title, url, description };
  },

  createFloatingShareBar() {
    const shareBar = document.createElement('div');
    shareBar.className = 'floating-share-bar';
    shareBar.innerHTML = `
      <div class="share-label">Share:</div>
      <button class="share-btn share-facebook" aria-label="Share on Facebook" title="Share on Facebook">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      </button>
      <button class="share-btn share-twitter" aria-label="Share on Twitter" title="Share on Twitter">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
        </svg>
      </button>
      <button class="share-btn share-linkedin" aria-label="Share on LinkedIn" title="Share on LinkedIn">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
          <circle cx="4" cy="4" r="2"/>
        </svg>
      </button>
      <button class="share-btn share-email" aria-label="Share via Email" title="Share via Email">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </button>
      <button class="share-btn share-copy" aria-label="Copy link" title="Copy link">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      </button>
    `;
    document.body.appendChild(shareBar);
  },

  setupShareButtons() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.share-facebook')) {
        this.shareOnFacebook();
      } else if (e.target.closest('.share-twitter')) {
        this.shareOnTwitter();
      } else if (e.target.closest('.share-linkedin')) {
        this.shareOnLinkedIn();
      } else if (e.target.closest('.share-email')) {
        this.shareViaEmail();
      } else if (e.target.closest('.share-copy')) {
        this.copyLink(e.target.closest('.share-copy'));
      }
    });
  },

  shareOnFacebook() {
    const { url } = this.getPageInfo();
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  },

  shareOnTwitter() {
    const { title, url } = this.getPageInfo();
    const text = `${title} - Your complete guide to Home Depot penny items`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  },

  shareOnLinkedIn() {
    const { url } = this.getPageInfo();
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  },

  shareViaEmail() {
    const { title, url, description } = this.getPageInfo();
    const subject = encodeURIComponent(`Check out: ${title}`);
    const body = encodeURIComponent(`I found this helpful guide:\n\n${title}\n${description}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  },

  async copyLink(button) {
    const { url } = this.getPageInfo();
    try {
      await navigator.clipboard.writeText(url);
      const originalHTML = button.innerHTML;
      button.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      `;
      button.classList.add('copied');
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  },

  handleShareBarVisibility() {
    const shareBar = document.querySelector('.floating-share-bar');
    if (!shareBar) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 300 && currentScroll > lastScroll) {
        shareBar.classList.add('visible');
      } else if (currentScroll < lastScroll - 5) {
        shareBar.classList.remove('visible');
      }

      lastScroll = currentScroll;
    });
  }
};

// ====================
// PWA FUNCTIONALITY
// ====================

const PWA = {
  deferredPrompt: null,
  isInstalled: false,

  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.detectInstallation();
    this.setupOfflineDetection();
    this.checkForUpdates();
  },

  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[PWA] Service Worker registered:', registration);

      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

      // Listen for waiting service worker
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            this.showUpdateNotification();
          }
        });
      });
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  },

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[PWA] Install prompt triggered');
      e.preventDefault();
      this.deferredPrompt = e;

      // Check if user dismissed install banner before
      const dismissed = localStorage.getItem('install-banner-dismissed');
      const installDate = localStorage.getItem('app-installed-date');

      if (!dismissed && !installDate) {
        this.showInstallBanner();
      }
    });

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      this.deferredPrompt = null;
      this.hideInstallBanner();
      localStorage.setItem('app-installed-date', new Date().toISOString());
      this.showInstallSuccessMessage();
    });
  },

  detectInstallation() {
    // Check if running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true) {
      this.isInstalled = true;
      console.log('[PWA] Running as installed app');
      document.body.classList.add('pwa-installed');
    }
  },

  showInstallBanner() {
    // Remove existing banner if any
    const existingBanner = document.querySelector('.pwa-install-banner');
    if (existingBanner) {
      existingBanner.remove();
    }

    const banner = document.createElement('div');
    banner.className = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="pwa-install-content">
        <div class="pwa-install-icon">📱</div>
        <div class="pwa-install-text">
          <strong>Install HD Penny Guide</strong>
          <p>Get quick access and work offline!</p>
        </div>
        <div class="pwa-install-actions">
          <button class="pwa-install-btn">Install</button>
          <button class="pwa-dismiss-btn">Not Now</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Animate in
    setTimeout(() => banner.classList.add('visible'), 100);

    // Setup button handlers
    banner.querySelector('.pwa-install-btn').addEventListener('click', () => {
      this.promptInstall();
    });

    banner.querySelector('.pwa-dismiss-btn').addEventListener('click', () => {
      this.hideInstallBanner();
      localStorage.setItem('install-banner-dismissed', 'true');
    });
  },

  hideInstallBanner() {
    const banner = document.querySelector('.pwa-install-banner');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 300);
    }
  },

  async promptInstall() {
    if (!this.deferredPrompt) {
      console.log('[PWA] No install prompt available');
      return;
    }

    this.deferredPrompt.prompt();

    const { outcome } = await this.deferredPrompt.userChoice;
    console.log('[PWA] User choice:', outcome);

    if (outcome === 'accepted') {
      console.log('[PWA] User accepted install');
    } else {
      console.log('[PWA] User dismissed install');
      localStorage.setItem('install-banner-dismissed', 'true');
    }

    this.deferredPrompt = null;
    this.hideInstallBanner();
  },

  showInstallSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'pwa-success-message';
    message.innerHTML = `
      <div class="pwa-success-content">
        <div class="pwa-success-icon">✅</div>
        <div class="pwa-success-text">
          <strong>App Installed Successfully!</strong>
          <p>You can now access the guide anytime, even offline.</p>
        </div>
      </div>
    `;

    document.body.appendChild(message);

    setTimeout(() => message.classList.add('visible'), 100);
    setTimeout(() => {
      message.classList.remove('visible');
      setTimeout(() => message.remove(), 300);
    }, 5000);
  },

  setupOfflineDetection() {
    const updateOnlineStatus = () => {
      const isOnline = navigator.onLine;
      document.body.classList.toggle('offline', !isOnline);

      if (!isOnline) {
        this.showOfflineBanner();
      } else {
        this.hideOfflineBanner();
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Check initial status
    updateOnlineStatus();
  },

  showOfflineBanner() {
    // Remove existing banner if any
    const existingBanner = document.querySelector('.pwa-offline-banner');
    if (existingBanner) return;

    const banner = document.createElement('div');
    banner.className = 'pwa-offline-banner';
    banner.innerHTML = `
      <div class="pwa-offline-content">
        <span class="pwa-offline-icon">📡</span>
        <span class="pwa-offline-text">You're offline - cached pages are available</span>
      </div>
    `;

    document.body.appendChild(banner);

    setTimeout(() => banner.classList.add('visible'), 100);
  },

  hideOfflineBanner() {
    const banner = document.querySelector('.pwa-offline-banner');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(() => banner.remove(), 300);
    }
  },

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'pwa-update-notification';
    notification.innerHTML = `
      <div class="pwa-update-content">
        <div class="pwa-update-icon">🔄</div>
        <div class="pwa-update-text">
          <strong>Update Available</strong>
          <p>A new version of the guide is ready!</p>
        </div>
        <button class="pwa-update-btn">Update Now</button>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('visible'), 100);

    notification.querySelector('.pwa-update-btn').addEventListener('click', () => {
      this.applyUpdate();
    });
  },

  applyUpdate() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });

          // Reload page when service worker is activated
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });
        }
      });
    }
  },

  checkForUpdates() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Check for updates on page load
        registration.update();
      });
    }
  }
};

// ====================
// GAMIFICATION SYSTEM
// ====================

const Gamification = {
  // Achievement definitions (30+ achievements)
  achievements: [
    // Learning Achievements
    { id: 'getting-started', name: 'Getting Started', description: 'Complete the "What Are Pennies?" page', category: 'learning', rarity: 'common', points: 10, icon: '🎓', requirement: { type: 'page', value: 'what-are-pennies.html' } },
    { id: 'digital-detective', name: 'Digital Detective', description: 'Complete the Digital Pre-Hunt page', category: 'learning', rarity: 'common', points: 10, icon: '🔍', requirement: { type: 'page', value: 'digital-prehunt.html' } },
    { id: 'store-strategist', name: 'Store Strategist', description: 'Complete the In-Store Strategy page', category: 'learning', rarity: 'common', points: 10, icon: '🏪', requirement: { type: 'page', value: 'in-store-strategy.html' } },
    { id: 'master-shopper', name: 'Master Shopper', description: 'Complete all main learning pages', category: 'learning', rarity: 'legendary', points: 100, icon: '👑', requirement: { type: 'pages-count', value: PAGE_ORDER.length } },
    { id: 'speed-reader', name: 'Speed Reader', description: 'Complete 5 pages in one session', category: 'learning', rarity: 'uncommon', points: 25, icon: '⚡', requirement: { type: 'session-pages', value: 5 } },
    { id: 'dedicated-learner', name: 'Dedicated Learner', description: 'Visit site 7 days in a row', category: 'learning', rarity: 'rare', points: 50, icon: '🔥', requirement: { type: 'streak', value: 7 } },
    { id: 'knowledge-seeker', name: 'Knowledge Seeker', description: 'Use search 10 times', category: 'learning', rarity: 'uncommon', points: 20, icon: '🔎', requirement: { type: 'search-count', value: 10 } },
    { id: 'faq-master', name: 'FAQ Master', description: 'Read the entire FAQ page', category: 'learning', rarity: 'common', points: 15, icon: '❓', requirement: { type: 'page', value: 'faq.html' } },
    { id: 'lifecycle-expert', name: 'Lifecycle Expert', description: 'Complete Clearance Lifecycle page', category: 'learning', rarity: 'common', points: 10, icon: '📊', requirement: { type: 'page', value: 'clearance-lifecycle.html' } },
    { id: 'checkout-pro', name: 'Checkout Pro', description: 'Complete Checkout Strategy page', category: 'learning', rarity: 'common', points: 10, icon: '🛒', requirement: { type: 'page', value: 'checkout-strategy.html' } },

    // Engagement Achievements
    { id: 'night-owl', name: 'Night Owl', description: 'Use dark mode for 1 hour total', category: 'engagement', rarity: 'uncommon', points: 15, icon: '🌙', requirement: { type: 'dark-mode-time', value: 3600 } },
    { id: 'customizer', name: 'Customizer', description: 'Change font size', category: 'engagement', rarity: 'common', points: 5, icon: '🎨', requirement: { type: 'font-change', value: 1 } },
    { id: 'organized', name: 'Organized', description: 'Bookmark 5 pages (via browser)', category: 'engagement', rarity: 'uncommon', points: 15, icon: '📑', requirement: { type: 'bookmarks', value: 5 } },
    { id: 'tool-master', name: 'Tool Master', description: 'Use 5 different interactive features', category: 'engagement', rarity: 'rare', points: 30, icon: '🛠️', requirement: { type: 'tools-used', value: 5 } },
    { id: 'quiz-taker', name: 'Quiz Taker', description: 'Complete your first quiz', category: 'engagement', rarity: 'common', points: 15, icon: '📝', requirement: { type: 'quiz-completed', value: 1 } },
    { id: 'quiz-ace', name: 'Quiz Ace', description: 'Score 100% on any quiz', category: 'engagement', rarity: 'rare', points: 50, icon: '💯', requirement: { type: 'quiz-perfect', value: 1 } },
    { id: 'quiz-master', name: 'Quiz Master', description: 'Complete all quizzes', category: 'engagement', rarity: 'legendary', points: 100, icon: '🏆', requirement: { type: 'all-quizzes', value: true } },
    { id: 'early-bird', name: 'Early Bird', description: 'Visit site before 7 AM', category: 'engagement', rarity: 'uncommon', points: 10, icon: '🌅', requirement: { type: 'early-visit', value: true } },
    { id: 'persistent', name: 'Persistent', description: 'Return to site 3 times in one day', category: 'engagement', rarity: 'uncommon', points: 20, icon: '🔄', requirement: { type: 'daily-visits', value: 3 } },
    { id: 'explorer', name: 'Explorer', description: 'Visit every page at least once', category: 'engagement', rarity: 'rare', points: 40, icon: '🗺️', requirement: { type: 'all-pages-visited', value: true } },

    // Special Achievements
    { id: 'early-adopter', name: 'Early Adopter', description: 'Visited in the first month of launch', category: 'special', rarity: 'legendary', points: 50, icon: '🌟', requirement: { type: 'early-user', value: true } },
    { id: 'completionist', name: 'Completionist', description: '100% of all content viewed', category: 'special', rarity: 'legendary', points: 150, icon: '💎', requirement: { type: 'completion', value: 100 } },
    { id: 'community-member', name: 'Community Member', description: 'Share site 3 times', category: 'special', rarity: 'rare', points: 30, icon: '🤝', requirement: { type: 'shares', value: 3 } },
    { id: 'responsible-hunter', name: 'Responsible Hunter', description: 'Read Responsible Hunting page', category: 'special', rarity: 'common', points: 25, icon: '🎯', requirement: { type: 'page', value: 'responsible-hunting.html' } },
    { id: 'myth-buster', name: 'Myth Buster', description: 'Complete Facts vs. Myths page', category: 'special', rarity: 'common', points: 15, icon: '🔬', requirement: { type: 'page', value: 'facts-vs-myths.html' } },
    { id: 'systems-analyst', name: 'Systems Analyst', description: 'Complete Internal Systems page', category: 'special', rarity: 'uncommon', points: 20, icon: '⚙️', requirement: { type: 'page', value: 'internal-systems.html' } },
    { id: 'quick-starter', name: 'Quick Starter', description: 'Complete Quick Start guide', category: 'special', rarity: 'common', points: 10, icon: '🚀', requirement: { type: 'page', value: 'quick-start.html' } },
    { id: 'resource-finder', name: 'Resource Finder', description: 'Visit Resources page', category: 'special', rarity: 'common', points: 10, icon: '📚', requirement: { type: 'page', value: 'resources.html' } },
    { id: 'path-completer', name: 'Path Completer', description: 'Complete a learning path', category: 'special', rarity: 'rare', points: 75, icon: '🛤️', requirement: { type: 'path-completed', value: 1 } },
    { id: 'all-paths', name: 'Master of All Paths', description: 'Complete all learning paths', category: 'special', rarity: 'legendary', points: 200, icon: '🎖️', requirement: { type: 'all-paths', value: true } }
  ],

  // Level system (10 levels)
  levels: [
    { level: 1, name: 'Newbie', xpRequired: 0, icon: '🌱' },
    { level: 2, name: 'Beginner', xpRequired: 50, icon: '📖' },
    { level: 3, name: 'Learner', xpRequired: 150, icon: '🎓' },
    { level: 4, name: 'Hunter', xpRequired: 300, icon: '🔍' },
    { level: 5, name: 'Scout', xpRequired: 500, icon: '🗺️' },
    { level: 6, name: 'Pro', xpRequired: 800, icon: '⭐' },
    { level: 7, name: 'Expert', xpRequired: 1200, icon: '💪' },
    { level: 8, name: 'Master', xpRequired: 1700, icon: '🏆' },
    { level: 9, name: 'Legend', xpRequired: 2500, icon: '👑' },
    { level: 10, name: 'Penny Wizard', xpRequired: 4000, icon: '🧙' }
  ],

  init() {
    this.loadUserData();
    this.checkAchievements();
    this.updateLevelDisplay();
    this.trackSession();
    this.trackDarkModeTime();
    this.checkDailyVisit();
  },

  loadUserData() {
    const stored = localStorage.getItem('hd-guide-gamification');
    if (stored) {
      this.userData = JSON.parse(stored);
    } else {
      this.userData = {
        points: 0,
        level: 1,
        unlockedAchievements: [],
        streakCount: 0,
        lastVisit: null,
        searchCount: 0,
        fontChanges: 0,
        toolsUsed: [],
        quizzesCompleted: [],
        quizPerfectScores: 0,
        darkModeSeconds: 0,
        darkModeStartTime: null,
        sessionPagesRead: 0,
        dailyVisits: 0,
        lastVisitDate: null,
        shares: 0,
        firstVisit: new Date().toISOString(),
        pathsCompleted: []
      };
      this.saveUserData();
    }
  },

  saveUserData() {
    localStorage.setItem('hd-guide-gamification', JSON.stringify(this.userData));
  },

  addPoints(points) {
    this.userData.points += points;
    this.checkLevelUp();
    this.saveUserData();
  },

  checkLevelUp() {
    const currentLevel = this.getCurrentLevel();
    const nextLevel = this.levels.find(l => l.level === currentLevel.level + 1);

    if (nextLevel && this.userData.points >= nextLevel.xpRequired) {
      this.userData.level = nextLevel.level;
      this.showLevelUpNotification(nextLevel);
    }
  },

  getCurrentLevel() {
    let currentLevel = this.levels[0];
    for (let level of this.levels) {
      if (this.userData.points >= level.xpRequired) {
        currentLevel = level;
      } else {
        break;
      }
    }
    return currentLevel;
  },

  updateLevelDisplay() {
    const levelIndicator = document.querySelector('.level-indicator');
    if (levelIndicator) {
      const currentLevel = this.getCurrentLevel();
      levelIndicator.innerHTML = `${currentLevel.icon} ${currentLevel.name} (Level ${currentLevel.level})`;
    }
  },

  showLevelUpNotification(level) {
    // Create level-up notification
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
      <div class="level-up-content">
        <h3>🎉 Level Up!</h3>
        <p>You are now a <strong>${level.name}</strong> ${level.icon}</p>
        <p>Level ${level.level} achieved!</p>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  checkAchievements() {
    this.achievements.forEach(achievement => {
      if (!this.userData.unlockedAchievements.includes(achievement.id)) {
        if (this.isAchievementUnlocked(achievement)) {
          this.unlockAchievement(achievement);
        }
      }
    });
  },

  isAchievementUnlocked(achievement) {
    const req = achievement.requirement;
    const readPages = ProgressTracker.getReadPages();

    switch (req.type) {
      case 'page':
        return readPages.includes(req.value);
      case 'pages-count':
        return readPages.length >= req.value;
      case 'session-pages':
        return this.userData.sessionPagesRead >= req.value;
      case 'streak':
        return this.userData.streakCount >= req.value;
      case 'search-count':
        return this.userData.searchCount >= req.value;
      case 'dark-mode-time':
        return this.userData.darkModeSeconds >= req.value;
      case 'font-change':
        return this.userData.fontChanges >= req.value;
      case 'tools-used':
        return this.userData.toolsUsed.length >= req.value;
      case 'quiz-completed':
        return this.userData.quizzesCompleted.length >= req.value;
      case 'quiz-perfect':
        return this.userData.quizPerfectScores >= req.value;
      case 'all-quizzes':
        return this.userData.quizzesCompleted.length >= 5; // Total number of quizzes
      case 'early-visit':
        return new Date().getHours() < 7;
      case 'daily-visits':
        return this.userData.dailyVisits >= req.value;
      case 'all-pages-visited':
        return readPages.length >= PAGE_ORDER.length;
      case 'early-user':
        const firstVisit = new Date(this.userData.firstVisit);
        const launchDate = new Date('2025-11-18'); // Launch date
        const oneMonth = 30 * 24 * 60 * 60 * 1000;
        return (firstVisit - launchDate) < oneMonth;
      case 'completion':
        return (readPages.length / PAGE_ORDER.length * 100) >= req.value;
      case 'shares':
        return this.userData.shares >= req.value;
      case 'path-completed':
        return this.userData.pathsCompleted.length >= req.value;
      case 'all-paths':
        return this.userData.pathsCompleted.length >= 3; // Total number of paths
      default:
        return false;
    }
  },

  unlockAchievement(achievement) {
    this.userData.unlockedAchievements.push(achievement.id);
    this.addPoints(achievement.points);
    this.showAchievementNotification(achievement);
    this.saveUserData();
  },

  showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = `achievement-notification rarity-${achievement.rarity}`;
    notification.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-details">
        <div class="achievement-title">Achievement Unlocked!</div>
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-points">+${achievement.points} XP</div>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  },

  trackSession() {
    // Track pages read in this session
    const currentPage = getCurrentPage();
    const sessionPages = sessionStorage.getItem('hd-guide-session-pages');

    if (!sessionPages) {
      sessionStorage.setItem('hd-guide-session-pages', JSON.stringify([currentPage]));
      this.userData.sessionPagesRead = 1;
    } else {
      const pages = JSON.parse(sessionPages);
      if (!pages.includes(currentPage)) {
        pages.push(currentPage);
        sessionStorage.setItem('hd-guide-session-pages', JSON.stringify(pages));
        this.userData.sessionPagesRead = pages.length;
      }
    }

    this.saveUserData();
  },

  trackDarkModeTime() {
    const theme = document.documentElement.getAttribute('data-theme');

    if (theme === 'dark' && !this.userData.darkModeStartTime) {
      this.userData.darkModeStartTime = Date.now();
    } else if (theme === 'light' && this.userData.darkModeStartTime) {
      const timeSpent = Math.floor((Date.now() - this.userData.darkModeStartTime) / 1000);
      this.userData.darkModeSeconds += timeSpent;
      this.userData.darkModeStartTime = null;
    }

    // Check every minute
    setInterval(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'dark' && this.userData.darkModeStartTime) {
        const timeSpent = Math.floor((Date.now() - this.userData.darkModeStartTime) / 1000);
        this.userData.darkModeSeconds += timeSpent;
        this.userData.darkModeStartTime = Date.now();
        this.saveUserData();
        this.checkAchievements();
      }
    }, 60000);
  },

  checkDailyVisit() {
    const today = new Date().toDateString();
    const lastVisit = this.userData.lastVisit;

    if (!lastVisit || lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastVisit === yesterday.toDateString()) {
        this.userData.streakCount++;
      } else if (!lastVisit) {
        this.userData.streakCount = 1;
      } else {
        this.userData.streakCount = 1;
      }

      this.userData.lastVisit = today;
      this.saveUserData();
    }

    // Track daily visits
    if (this.userData.lastVisitDate !== today) {
      this.userData.dailyVisits = 1;
      this.userData.lastVisitDate = today;
    } else {
      this.userData.dailyVisits++;
    }
    this.saveUserData();
  },

  trackToolUse(toolName) {
    if (!this.userData.toolsUsed.includes(toolName)) {
      this.userData.toolsUsed.push(toolName);
      this.saveUserData();
      this.checkAchievements();
    }
  },

  trackSearchUse() {
    this.userData.searchCount++;
    this.saveUserData();
    this.checkAchievements();
  },

  trackFontChange() {
    this.userData.fontChanges++;
    this.trackToolUse('font-size');
    this.saveUserData();
    this.checkAchievements();
  },

  trackQuizCompletion(quizId, score, maxScore) {
    if (!this.userData.quizzesCompleted.includes(quizId)) {
      this.userData.quizzesCompleted.push(quizId);
      this.addPoints(20); // Bonus points for completing quiz
    }

    if (score === maxScore) {
      this.userData.quizPerfectScores++;
      this.addPoints(10); // Bonus for perfect score
    }

    this.saveUserData();
    this.checkAchievements();
  },

  trackPathCompletion(pathId) {
    if (!this.userData.pathsCompleted.includes(pathId)) {
      this.userData.pathsCompleted.push(pathId);
      this.saveUserData();
      this.checkAchievements();
    }
  },

  trackShare() {
    this.userData.shares++;
    this.saveUserData();
    this.checkAchievements();
  },

  getUnlockedAchievements() {
    return this.achievements.filter(a => this.userData.unlockedAchievements.includes(a.id));
  },

  getLockedAchievements() {
    return this.achievements.filter(a => !this.userData.unlockedAchievements.includes(a.id));
  },

  getAchievementsByCategory(category) {
    return this.achievements.filter(a => a.category === category);
  },

  getCompletionPercentage() {
    return Math.round((this.userData.unlockedAchievements.length / this.achievements.length) * 100);
  }
};

// Quiz Engine
const QuizEngine = {
  quizzes: {
    'price-endings': {
      title: 'Test Your Knowledge: Price Endings',
      description: 'How well do you understand Home Depot\'s price ending system?',
      questions: [
        {
          question: 'What does a price ending in $0.06 typically indicate?',
          options: ['Clearance item', 'Regular price', 'Special order', 'Manager markdown'],
          correct: 0,
          explanation: 'Prices ending in $0.06 indicate clearance items that are being marked down.'
        },
        {
          question: 'Which price ending suggests an item is most likely to go penny?',
          options: ['$X.98', '$X.06', '$X.03', '$X.97'],
          correct: 2,
          explanation: '$X.03 endings are the final markdown before items potentially reach penny status.'
        },
        {
          question: 'What does a $X.97 price ending mean?',
          options: ['Penny item', 'Regular retail price', 'Manager special', 'Clearance'],
          correct: 1,
          explanation: '$X.97 is a standard retail price ending at Home Depot.'
        },
        {
          question: 'If an item is priced at $15.03, what\'s the next likely price?',
          options: ['$10.03', '$0.03', '$0.01', 'Removed from floor'],
          correct: 3,
          explanation: 'Items at $X.03 are typically removed from the floor rather than marked to penny.'
        },
        {
          question: 'Can you tell if an item is penny just by looking at it?',
          options: ['Yes, penny items have special tags', 'No, you must scan it', 'Yes, they\'re marked with orange stickers', 'Yes, the price tag shows $0.01'],
          correct: 1,
          explanation: 'Penny items don\'t have visible indicators—you must scan them to verify the price.'
        }
      ]
    },
    'clearance-cadence': {
      title: 'Clearance Cadence Quiz',
      description: 'Test your understanding of markdown schedules and timing.',
      questions: [
        {
          question: 'How often does Home Depot typically run clearance markdowns?',
          options: ['Daily', 'Weekly', 'Monthly', 'Quarterly'],
          correct: 1,
          explanation: 'Most stores follow a weekly markdown cadence, though timing varies by department.'
        },
        {
          question: 'Which day is most commonly reported for markdowns?',
          options: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
          correct: 2,
          explanation: 'Thursday is the most commonly reported markdown day, though this varies by store.'
        },
        {
          question: 'What\'s the best time to check for new markdowns?',
          options: ['Opening time', 'Mid-morning after processing', 'Afternoon', 'Evening'],
          correct: 1,
          explanation: 'Mid-morning (9-11 AM) is often best after overnight processing has completed.'
        },
        {
          question: 'Do all stores follow the same markdown schedule?',
          options: ['Yes, corporate mandates it', 'No, it varies by store', 'Only in the same region', 'Only seasonal items vary'],
          correct: 1,
          explanation: 'Each store can have different cadences based on their management and inventory.'
        },
        {
          question: 'What happens during a "skip week"?',
          options: ['No markdowns occur', 'Double markdowns happen', 'Only seasonal items mark down', 'Penny items are pulled'],
          correct: 0,
          explanation: 'During skip weeks, the normal markdown cadence is paused and no new markdowns occur.'
        }
      ]
    },
    'in-store-strategy': {
      title: 'In-Store Strategy Assessment',
      description: 'How well do you know the art of finding penny items?',
      questions: [
        {
          question: 'Where are you most likely to find unpulled penny items?',
          options: ['Front endcaps', 'Clearance section', 'Top shelves and corners', 'Customer service desk'],
          correct: 2,
          explanation: 'Top shelves, back corners, and overlooked spots often contain missed penny items.'
        },
        {
          question: 'What\'s the best scanning strategy?',
          options: ['Scan everything randomly', 'Focus on clearance tags only', 'Scan misplaced and dusty items', 'Only scan seasonal items'],
          correct: 2,
          explanation: 'Misplaced, dusty, or forgotten items in odd locations are prime candidates.'
        },
        {
          question: 'Should you ask employees if they have penny items?',
          options: ['Yes, always ask', 'No, never mention pennies', 'Only ask managers', 'Only on Thursdays'],
          correct: 1,
          explanation: 'Never ask about "penny items"—it draws unwanted attention and may trigger pulls.'
        },
        {
          question: 'What does it mean if the app shows "Limited Stock"?',
          options: ['It\'s definitely penny', 'There are 1-3 items left', 'It\'s out of stock', 'It\'s on clearance'],
          correct: 1,
          explanation: '"Limited Stock" typically means 1-3 units remain, making it a good target to check.'
        },
        {
          question: 'What\'s the most respectful way to penny hunt?',
          options: ['Bring a scanner gun', 'Scan discreetly and quickly', 'Scan during peak hours', 'Bring a cart and pile items'],
          correct: 1,
          explanation: 'Be discreet, quick, and respectful. Don\'t disrupt operations or draw attention.'
        }
      ]
    },
    'checkout-scenario': {
      title: 'Checkout Scenario Quiz',
      description: 'Test your knowledge of successful checkout strategies.',
      questions: [
        {
          question: 'What\'s the best checkout lane for penny items?',
          options: ['Self-checkout', 'Express lane', 'Regular lane with new cashier', 'Pro desk'],
          correct: 0,
          explanation: 'Self-checkout avoids scrutiny from cashiers and allows you to proceed quickly.'
        },
        {
          question: 'If a cashier questions your item, what should you do?',
          options: ['Argue it should ring up penny', 'Say you found it in clearance', 'Accept their decision politely', 'Demand a manager'],
          correct: 2,
          explanation: 'Always be polite and accept their decision. Arguing damages the community reputation.'
        },
        {
          question: 'Should you buy penny items in bulk quantities?',
          options: ['Yes, maximize your savings', 'No, it\'s excessive and risky', 'Only if you resell', 'Only seasonal items'],
          correct: 1,
          explanation: 'Buying excessive quantities is greedy, draws attention, and hurts the community.'
        },
        {
          question: 'What should you do if an item doesn\'t ring up penny?',
          options: ['Insist it should be penny', 'Leave it and move on', 'Try a different register', 'Call corporate'],
          correct: 1,
          explanation: 'If it doesn\'t ring penny, accept it and move on. Don\'t argue or cause issues.'
        },
        {
          question: 'Is it okay to return penny items for store credit?',
          options: ['Yes, it\'s your right', 'No, it\'s unethical', 'Only if unopened', 'Only for defective items'],
          correct: 1,
          explanation: 'Buying penny items to return them for credit is abuse and damages the community.'
        }
      ]
    },
    'myths-vs-facts': {
      title: 'Myths vs. Facts Challenge',
      description: 'Can you separate penny hunting myths from reality?',
      questions: [
        {
          question: 'TRUE or FALSE: Penny items are an official Home Depot sale.',
          options: ['True', 'False'],
          correct: 1,
          explanation: 'FALSE. Penny items are NOT intended for sale—they\'re marked for removal.'
        },
        {
          question: 'TRUE or FALSE: All clearance items eventually go penny.',
          options: ['True', 'False'],
          correct: 1,
          explanation: 'FALSE. Most clearance items are removed or returned to vendors before reaching penny.'
        },
        {
          question: 'TRUE or FALSE: You can predict exactly when items will go penny.',
          options: ['True', 'False'],
          correct: 1,
          explanation: 'FALSE. While patterns exist, exact timing is unpredictable and varies by store.'
        },
        {
          question: 'TRUE or FALSE: Employees are trained to stop penny sales.',
          options: ['True', 'False'],
          correct: 0,
          explanation: 'TRUE. Stores actively train staff to recognize and prevent penny transactions.'
        },
        {
          question: 'TRUE or FALSE: Penny hunting is guaranteed to save you money.',
          options: ['True', 'False'],
          correct: 1,
          explanation: 'FALSE. Time, gas, and inconsistent finds mean it\'s not always cost-effective.'
        }
      ]
    }
  },

  currentQuiz: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  score: 0,

  init(quizId) {
    this.currentQuiz = this.quizzes[quizId];
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.score = 0;
    this.renderQuiz();
  },

  renderQuiz() {
    const container = document.getElementById('quiz-container');
    if (!container || !this.currentQuiz) return;

    const question = this.currentQuiz.questions[this.currentQuestionIndex];
    const progress = ((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100;

    container.innerHTML = `
      <div class="quiz-header">
        <h2>${this.currentQuiz.title}</h2>
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="quiz-question-counter">Question ${this.currentQuestionIndex + 1} of ${this.currentQuiz.questions.length}</div>
      </div>

      <div class="quiz-question">
        <h3>${question.question}</h3>
        <div class="quiz-options">
          ${question.options.map((option, index) => `
            <button class="quiz-option" data-index="${index}">
              ${option}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="quiz-explanation" style="display: none;"></div>

      <div class="quiz-navigation">
        ${this.currentQuestionIndex > 0 ? '<button class="quiz-btn quiz-prev-btn">← Previous</button>' : ''}
        <button class="quiz-btn quiz-next-btn" style="display: none;">Next →</button>
        <button class="quiz-btn quiz-finish-btn" style="display: none;">Finish Quiz</button>
      </div>
    `;

    this.attachQuizHandlers();
  },

  attachQuizHandlers() {
    const options = document.querySelectorAll('.quiz-option');
    const nextBtn = document.querySelector('.quiz-next-btn');
    const prevBtn = document.querySelector('.quiz-prev-btn');
    const finishBtn = document.querySelector('.quiz-finish-btn');
    const explanationDiv = document.querySelector('.quiz-explanation');

    options.forEach(option => {
      option.addEventListener('click', () => {
        const selectedIndex = parseInt(option.dataset.index);
        const question = this.currentQuiz.questions[this.currentQuestionIndex];

        // Remove previous selection
        options.forEach(opt => opt.classList.remove('selected', 'correct', 'incorrect'));

        // Mark selection
        option.classList.add('selected');

        if (selectedIndex === question.correct) {
          option.classList.add('correct');
          if (this.userAnswers[this.currentQuestionIndex] === undefined) {
            this.score++;
          }
        } else {
          option.classList.add('incorrect');
          options[question.correct].classList.add('correct');
        }

        this.userAnswers[this.currentQuestionIndex] = selectedIndex;

        // Show explanation
        explanationDiv.innerHTML = `
          <div class="explanation-content ${selectedIndex === question.correct ? 'correct' : 'incorrect'}">
            <strong>${selectedIndex === question.correct ? '✓ Correct!' : '✗ Incorrect'}</strong>
            <p>${question.explanation}</p>
          </div>
        `;
        explanationDiv.style.display = 'block';

        // Show next/finish button
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
          nextBtn.style.display = 'inline-block';
        } else {
          finishBtn.style.display = 'inline-block';
        }
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentQuestionIndex++;
        this.renderQuiz();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.currentQuestionIndex--;
        this.renderQuiz();
      });
    }

    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        this.showResults();
      });
    }
  },

  showResults() {
    const container = document.getElementById('quiz-container');
    const percentage = Math.round((this.score / this.currentQuiz.questions.length) * 100);
    const passed = percentage >= 80;

    let performanceMessage = '';
    if (percentage === 100) {
      performanceMessage = 'Perfect! You\'re a true penny hunting expert! 🏆';
    } else if (percentage >= 80) {
      performanceMessage = 'Great job! You have a solid understanding! ⭐';
    } else if (percentage >= 60) {
      performanceMessage = 'Good effort! Review the guide to improve. 📚';
    } else {
      performanceMessage = 'Keep learning! Revisit the guide sections. 📖';
    }

    container.innerHTML = `
      <div class="quiz-results">
        <h2>Quiz Complete!</h2>
        <div class="quiz-score-circle ${passed ? 'passed' : 'failed'}">
          <div class="score-percentage">${percentage}%</div>
          <div class="score-fraction">${this.score} / ${this.currentQuiz.questions.length}</div>
        </div>
        <p class="performance-message">${performanceMessage}</p>

        ${passed ? '<div class="quiz-badge">🏅 Quiz Passed!</div>' : '<div class="quiz-retry-message">Need 80% to pass. Try again!</div>'}

        <div class="quiz-actions">
          <button class="quiz-btn quiz-retry-btn">Retry Quiz</button>
          <a href="quizzes.html" class="quiz-btn">Back to Quizzes</a>
        </div>
      </div>
    `;

    // Track completion
    const quizId = Object.keys(this.quizzes).find(key => this.quizzes[key] === this.currentQuiz);
    Gamification.trackQuizCompletion(quizId, this.score, this.currentQuiz.questions.length);

    const retryBtn = document.querySelector('.quiz-retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.init(quizId);
      });
    }
  }
};

// Learning Paths
const LearningPaths = {
  paths: {
    'complete-beginner': {
      id: 'complete-beginner',
      name: 'Complete Beginner',
      description: 'Perfect for someone who has never penny hunted before',
      duration: '1-2 weeks',
      difficulty: 'beginner',
      icon: '🌱',
      steps: [
        { page: 'what-are-pennies.html', title: 'What Are Pennies?', required: true },
        { page: 'facts-vs-myths.html', title: 'Facts vs. Myths', required: true },
        { page: 'responsible-hunting.html', title: 'Responsible Hunting', required: true },
  'calculators.html',
        { page: 'quick-start.html', title: 'Quick Start Guide', required: true },
        { quiz: 'myths-vs-facts', title: 'Myths vs. Facts Quiz', required: true },
        { page: 'digital-prehunt.html', title: 'Digital Pre-Hunt', required: false }
      ]
    },
    'digital-scout': {
      id: 'digital-scout',
      name: 'Digital Scout',
      description: 'Master online research and app-based scouting techniques',
      duration: '1 week',
      difficulty: 'intermediate',
      icon: '🔍',
      steps: [
        { page: 'digital-prehunt.html', title: 'Digital Pre-Hunt', required: true },
        { page: 'internal-systems.html', title: 'Internal Systems', required: true },
        { page: 'clearance-lifecycle.html', title: 'Clearance Lifecycle', required: true },
        { quiz: 'price-endings', title: 'Price Endings Quiz', required: true },
        { quiz: 'clearance-cadence', title: 'Clearance Cadence Quiz', required: true }
      ]
    },
    'in-store-expert': {
      id: 'in-store-expert',
      name: 'In-Store Expert',
      description: 'Deep dive into finding and purchasing penny items in stores',
      duration: '2 weeks',
      difficulty: 'advanced',
      icon: '🏪',
      steps: [
        { page: 'in-store-strategy.html', title: 'In-Store Strategy', required: true },
        { page: 'checkout-strategy.html', title: 'Checkout Strategy', required: true },
        { quiz: 'in-store-strategy', title: 'In-Store Strategy Quiz', required: true },
        { quiz: 'checkout-scenario', title: 'Checkout Scenario Quiz', required: true },
        { page: 'responsible-hunting.html', title: 'Responsible Hunting', required: true }
  'calculators.html',
      ]
    }
  },

  getPathProgress(pathId) {
    const path = this.paths[pathId];
    if (!path) return 0;

    const readPages = ProgressTracker.getReadPages();
    const completedQuizzes = Gamification.userData.quizzesCompleted;

    let completedSteps = 0;
    path.steps.forEach(step => {
      if (step.page && readPages.includes(step.page)) {
        completedSteps++;
      } else if (step.quiz && completedQuizzes.includes(step.quiz)) {
        completedSteps++;
      }
    });

    return Math.round((completedSteps / path.steps.length) * 100);
  },

  isPathComplete(pathId) {
    return this.getPathProgress(pathId) === 100;
  },

  checkPathCompletion(pathId) {
    if (this.isPathComplete(pathId) && !Gamification.userData.pathsCompleted.includes(pathId)) {
      Gamification.trackPathCompletion(pathId);
    }
  }
};

// ====================
// INITIALIZATION
// ====================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize original features
  initializeOriginalFeatures();

  // Initialize new features
  ProgressTracker.init();
  Preferences.init();
  Search.init();
  Navigation.init();
  ContentFeatures.init();
  SocialSharing.init();

  // Initialize PWA features
  PWA.init();

  // Initialize gamification
  Gamification.init();

  // Initialize calculator features if on calculators page
  if (window.location.pathname.includes('calculators.html')) {
    initializeCalculators();
  }

  // Initialize table enhancements on all pages
  TableEnhancements.init();

  // Setup reset progress button
  const resetBtn = document.querySelector('.reset-progress-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => ProgressTracker.resetProgress());
  }

  // Track search usage
  const originalHandleSearch = Search.handleSearch;
  Search.handleSearch = function(query) {
    if (query && query.length >= 2) {
      Gamification.trackSearchUse();
    }
    originalHandleSearch.call(this, query);
  };

  // Track font size changes
  const originalSetFontSize = Preferences.setFontSize;
  Preferences.setFontSize = function(size) {
    Gamification.trackFontChange();
    originalSetFontSize.call(this, size);
  };

  // Track theme toggle
  const originalToggleTheme = Preferences.toggleTheme;
  Preferences.toggleTheme = function() {
    Gamification.trackToolUse('theme-toggle');
    originalToggleTheme.call(this);
  };

  // Track shares
  const originalShareMethods = ['shareOnFacebook', 'shareOnTwitter', 'shareOnLinkedIn', 'shareViaEmail', 'copyLink'];
  originalShareMethods.forEach(method => {
    const original = SocialSharing[method];
    SocialSharing[method] = function(...args) {
      Gamification.trackShare();
      return original.apply(this, args);
    };
  });
});

// ====================
// CALCULATOR FUNCTIONS
// ====================

function initializeCalculators() {
  // Set today's date for hunt tracker
  const huntDate = document.getElementById('hunt-date');
  if (huntDate) {
    huntDate.valueAsDate = new Date();
  }

  // Load saved calculations
  loadROISavedCalculations();
  loadHuntHistory();
  updateHuntStats();
}

// ROI CALCULATOR
function calculateROI() {
  const purchase = parseFloat(document.getElementById('roi-purchase-price').value) || 0;
  const selling = parseFloat(document.getElementById('roi-selling-price').value) || 0;
  const fees = parseFloat(document.getElementById('roi-fees').value) || 0;
  const time = parseFloat(document.getElementById('roi-time').value) || 1;

  const profit = selling - purchase - fees;
  const roi = purchase > 0 ? ((profit / purchase) * 100) : 0;
  const hourlyRate = time > 0 ? (profit / time) : 0;

  // Display results
  document.getElementById('roi-results').style.display = 'block';
  document.getElementById('roi-profit').textContent = `$${profit.toFixed(2)}`;
  document.getElementById('roi-percentage').textContent = `${roi.toFixed(1)}%`;
  document.getElementById('roi-hourly').textContent = `$${hourlyRate.toFixed(2)}/hr`;

  // Color code results
  const profitEl = document.querySelector('#roi-results .result-item.profit .result-value');
  profitEl.style.color = profit > 0 ? '#28a745' : '#dc3545';

  // Create breakdown chart
  createROIChart(purchase, selling, fees, profit);

  // Create breakdown list
  const breakdownList = document.getElementById('roi-breakdown-list');
  breakdownList.innerHTML = `
    <li>Purchase Price: $${purchase.toFixed(2)}</li>
    <li>Selling Price: $${selling.toFixed(2)}</li>
    <li>Fees & Expenses: $${fees.toFixed(2)}</li>
    <li><strong>Net Profit: $${profit.toFixed(2)}</strong></li>
    <li>Time Invested: ${time} hour${time !== 1 ? 's' : ''}</li>
    <li><strong>Effective Hourly Rate: $${hourlyRate.toFixed(2)}/hr</strong></li>
  `;

  // Scroll to results
  document.getElementById('roi-results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function createROIChart(purchase, selling, fees, profit) {
  const chartEl = document.getElementById('roi-chart');
  const total = selling;

  const purchasePercent = (purchase / total) * 100;
  const feesPercent = (fees / total) * 100;
  const profitPercent = (profit / total) * 100;

  chartEl.innerHTML = `
    <div class="breakdown-bar">
      <div class="bar-segment purchase" style="width: ${purchasePercent}%" title="Purchase: ${purchasePercent.toFixed(1)}%"></div>
      <div class="bar-segment fees" style="width: ${feesPercent}%" title="Fees: ${feesPercent.toFixed(1)}%"></div>
      <div class="bar-segment profit" style="width: ${profitPercent}%" title="Profit: ${profitPercent.toFixed(1)}%"></div>
    </div>
    <div class="breakdown-legend">
      <span><span class="legend-color purchase"></span> Purchase (${purchasePercent.toFixed(1)}%)</span>
      <span><span class="legend-color fees"></span> Fees (${feesPercent.toFixed(1)}%)</span>
      <span><span class="legend-color profit"></span> Profit (${profitPercent.toFixed(1)}%)</span>
    </div>
  `;
}

function saveROICalculation() {
  const calculation = {
    date: new Date().toISOString(),
    purchase: parseFloat(document.getElementById('roi-purchase-price').value),
    selling: parseFloat(document.getElementById('roi-selling-price').value),
    fees: parseFloat(document.getElementById('roi-fees').value),
    time: parseFloat(document.getElementById('roi-time').value),
    profit: parseFloat(document.getElementById('roi-profit').textContent.replace('$', '')),
    roi: document.getElementById('roi-percentage').textContent
  };

  let saved = JSON.parse(localStorage.getItem('hd-roi-calculations') || '[]');
  saved.unshift(calculation);
  saved = saved.slice(0, 10);
  localStorage.setItem('hd-roi-calculations', JSON.stringify(saved));

  loadROISavedCalculations();
  alert('Calculation saved!');
}

function loadROISavedCalculations() {
  const saved = JSON.parse(localStorage.getItem('hd-roi-calculations') || '[]');
  const listEl = document.getElementById('roi-saved-list');

  if (!listEl) return;

  if (saved.length === 0) {
    listEl.innerHTML = '<p>No saved calculations yet.</p>';
    return;
  }

  listEl.innerHTML = saved.map((calc, index) => `
    <div class="saved-calc-item">
      <div class="saved-calc-header">
        <strong>${new Date(calc.date).toLocaleDateString()}</strong>
        <button class="delete-calc-btn" onclick="deleteSavedROI(${index})">×</button>
      </div>
      <div class="saved-calc-details">
        Purchase: $${calc.purchase.toFixed(2)} → Selling: $${calc.selling.toFixed(2)} =
        <strong style="color: ${calc.profit >= 0 ? '#28a745' : '#dc3545'}">$${calc.profit} (${calc.roi})</strong>
      </div>
    </div>
  `).join('');
}

function deleteSavedROI(index) {
  let saved = JSON.parse(localStorage.getItem('hd-roi-calculations') || '[]');
  saved.splice(index, 1);
  localStorage.setItem('hd-roi-calculations', JSON.stringify(saved));
  loadROISavedCalculations();
}

// GAS COST CALCULATOR
function calculateGasCost() {
  const distance = parseFloat(document.getElementById('gas-distance').value) || 0;
  const gasPrice = parseFloat(document.getElementById('gas-price').value) || 0;
  const mpg = parseFloat(document.getElementById('gas-mpg').value) || 1;
  const expectedValue = parseFloat(document.getElementById('gas-expected-value').value) || 0;

  const gasCost = (distance / mpg) * gasPrice;
  const netBenefit = expectedValue - gasCost;

  document.getElementById('gas-results').style.display = 'block';
  document.getElementById('gas-cost').textContent = `$${gasCost.toFixed(2)}`;
  document.getElementById('gas-value').textContent = `$${expectedValue.toFixed(2)}`;
  document.getElementById('gas-net').textContent = `$${netBenefit.toFixed(2)}`;

  const verdictEl = document.getElementById('gas-verdict');
  if (netBenefit > gasCost) {
    verdictEl.innerHTML = '<div class="verdict-positive">✓ Worth the Trip</div>';
    verdictEl.className = 'result-verdict positive';
  } else if (netBenefit > 0) {
    verdictEl.innerHTML = '<div class="verdict-neutral">⚠ Marginal - Your Call</div>';
    verdictEl.className = 'result-verdict neutral';
  } else {
    verdictEl.innerHTML = '<div class="verdict-negative">✗ Not Worth It</div>';
    verdictEl.className = 'result-verdict negative';
  }

  const breakeven = gasCost;
  document.getElementById('gas-analysis').innerHTML = `
    Based on your inputs, this trip will cost <strong>$${gasCost.toFixed(2)}</strong> in gas.
    ${netBenefit > 0
      ? `You expect to gain <strong>$${netBenefit.toFixed(2)}</strong> after gas costs.`
      : `You would lose <strong>$${Math.abs(netBenefit).toFixed(2)}</strong> after gas costs.`
    }
  `;

  document.getElementById('gas-breakeven').innerHTML = `
    <strong>Break-even point:</strong> You need to find at least $${breakeven.toFixed(2)} worth of resellable items to cover gas costs.
  `;

  document.getElementById('gas-results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// TIME INVESTMENT CALCULATOR
function calculateTimeInvestment() {
  const stores = parseInt(document.getElementById('time-stores').value) || 1;
  const timePerStore = parseInt(document.getElementById('time-per-store').value) || 30;
  const drivingTime = parseInt(document.getElementById('time-driving').value) || 0;
  const digitalTime = parseInt(document.getElementById('time-digital').value) || 0;
  const hourlyValue = parseFloat(document.getElementById('time-hourly-value').value) || 0;

  const totalMinutes = (stores * timePerStore) + drivingTime + digitalTime;
  const totalHours = totalMinutes / 60;
  const opportunityCost = totalHours * hourlyValue;
  const breakeven = opportunityCost;

  document.getElementById('time-results').style.display = 'block';
  document.getElementById('time-total').textContent = `${totalHours.toFixed(1)} hrs (${totalMinutes} min)`;
  document.getElementById('time-cost').textContent = `$${opportunityCost.toFixed(2)}`;
  document.getElementById('time-breakeven').textContent = `$${breakeven.toFixed(2)}`;

  const storeTime = stores * timePerStore;
  const chartEl = document.getElementById('time-chart');

  const storePercent = (storeTime / totalMinutes) * 100;
  const drivePercent = (drivingTime / totalMinutes) * 100;
  const digitalPercent = (digitalTime / totalMinutes) * 100;

  chartEl.innerHTML = `
    <div class="time-breakdown-bar">
      <div class="time-segment stores" style="width: ${storePercent}%" title="In-Store: ${storeTime} min"></div>
      <div class="time-segment driving" style="width: ${drivePercent}%" title="Driving: ${drivingTime} min"></div>
      <div class="time-segment digital" style="width: ${digitalPercent}%" title="Digital: ${digitalTime} min"></div>
    </div>
    <div class="time-legend">
      <span><span class="legend-color stores"></span> In-Store (${storeTime} min)</span>
      <span><span class="legend-color driving"></span> Driving (${drivingTime} min)</span>
      <span><span class="legend-color digital"></span> Digital (${digitalTime} min)</span>
    </div>
  `;

  document.getElementById('time-analysis').innerHTML = `
    You'll invest <strong>${totalHours.toFixed(1)} hours</strong> total.
    ${hourlyValue > 0
      ? `At your time value of $${hourlyValue}/hr, you need to find items worth at least <strong>$${breakeven.toFixed(2)}</strong>
         in resale value to break even on your time investment.`
      : 'Set your hourly time value above to see break-even analysis.'
    }
  `;

  document.getElementById('time-results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// RESALE PRICE ESTIMATOR
function calculateResalePrice() {
  const category = document.getElementById('resale-category').value;
  const condition = document.getElementById('resale-condition').value;
  const original = parseFloat(document.getElementById('resale-original').value) || 0;

  const categoryMultipliers = {
    'power-tools': [0.30, 0.45, 0.65],
    'hand-tools': [0.20, 0.35, 0.50],
    'lighting': [0.25, 0.40, 0.60],
    'plumbing': [0.15, 0.30, 0.45],
    'electrical': [0.20, 0.35, 0.50],
    'garden': [0.15, 0.25, 0.40],
    'hardware': [0.10, 0.20, 0.35],
    'paint': [0.10, 0.15, 0.25],
    'seasonal': [0.05, 0.15, 0.30],
    'appliances': [0.35, 0.50, 0.70]
  };

  const conditionAdjustments = {
    'new-box': 1.0,
    'new-damaged-box': 0.85,
    'like-new': 0.75,
    'good': 0.60,
    'fair': 0.40
  };

  const [lowMult, typMult, highMult] = categoryMultipliers[category] || [0.15, 0.30, 0.50];
  const condAdj = conditionAdjustments[condition] || 0.75;

  const conservative = original * lowMult * condAdj;
  const typical = original * typMult * condAdj;
  const optimistic = original * highMult * condAdj;

  document.getElementById('resale-results').style.display = 'block';
  document.getElementById('resale-low').textContent = `$${conservative.toFixed(2)}`;
  document.getElementById('resale-high').textContent = `$${optimistic.toFixed(2)}`;
  document.getElementById('resale-conservative').textContent = `$${conservative.toFixed(2)}`;
  document.getElementById('resale-typical').textContent = `$${typical.toFixed(2)}`;
  document.getElementById('resale-optimistic').textContent = `$${optimistic.toFixed(2)}`;

  const rangeFill = document.getElementById('resale-range-fill');
  rangeFill.style.width = `${(typical / optimistic) * 100}%`;

  const platforms = document.getElementById('resale-platforms');
  let platformHTML = '';

  if (typical >= 30) {
    platformHTML += '<li><strong>eBay</strong> - Good for items $30+, wider reach</li>';
  }
  if (typical >= 15) {
    platformHTML += '<li><strong>Facebook Marketplace</strong> - Good for local sales, no shipping</li>';
    platformHTML += '<li><strong>Mercari</strong> - Easy listings, good for $15-$100 items</li>';
  }
  if (typical < 15) {
    platformHTML += '<li><strong>Facebook Local Groups</strong> - Best for low-value items, avoid fees</li>';
  }
  if (category === 'power-tools' || category === 'appliances') {
    platformHTML += '<li><strong>OfferUp</strong> - Popular for tools and appliances</li>';
  }

  platforms.innerHTML = platformHTML;

  const notes = {
    'power-tools': 'Power tools hold value well. Brands like DeWalt, Milwaukee, and Makita resell best. Include all accessories.',
    'hand-tools': 'Hand tools are slower movers. Stick to quality brands. Sets sell better than individual pieces.',
    'lighting': 'Lighting fixtures can be hit-or-miss. Modern styles sell better. Vintage/unique pieces may surprise you.',
    'plumbing': 'Plumbing items typically have low resale value unless new-in-box or specialty items.',
    'electrical': 'Electrical items sell moderately. Smart devices and LED products do better than basic switches.',
    'garden': 'Garden items are seasonal. List in spring for best results. Large items may be hard to ship.',
    'hardware': 'Hardware has low individual value but can be bundled. Specialty fasteners sell better.',
    'paint': 'Paint has very limited resale market. Focus on unopened cans of premium brands only.',
    'seasonal': 'Seasonal items must be listed at the right time. Store until the season arrives for best pricing.',
    'appliances': 'Appliances can bring good returns but shipping is expensive. Focus on local sales or smaller items.'
  };

  document.getElementById('resale-notes').textContent = notes[category] || 'Research sold listings to gauge actual demand.';

  document.getElementById('resale-results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// DECISION TREE
let decisionAnswers = {};

function answerDecision(step, answer) {
  decisionAnswers[step] = answer;

  const currentQ = document.querySelector(`.decision-question[data-step="${step}"]`);
  currentQ.classList.remove('active');

  if (step < 5) {
    const nextQ = document.querySelector(`.decision-question[data-step="${step + 1}"]`);
    nextQ.classList.add('active');
    nextQ.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    showDecisionResult();
  }
}

function showDecisionResult() {
  let score = 0;
  if (decisionAnswers[1] === 'yes') score += 3;
  if (decisionAnswers[1] === 'maybe') score += 1;

  if (decisionAnswers[2] === 'yes') score += 2;
  if (decisionAnswers[2] === 'maybe') score += 1;

  if (decisionAnswers[3] === 'yes') score += 2;
  if (decisionAnswers[3] === 'maybe') score += 1;

  if (decisionAnswers[4] === 'no') score += 2;
  if (decisionAnswers[4] === 'maybe') score += 1;

  if (decisionAnswers[5] === 'yes') score += 2;
  if (decisionAnswers[5] === 'maybe') score += 1;

  const resultEl = document.getElementById('decision-result');
  const verdictEl = document.getElementById('decision-verdict');
  const reasoningEl = document.getElementById('decision-reasoning');

  resultEl.style.display = 'block';

  if (score >= 9) {
    verdictEl.innerHTML = '<div class="verdict-buy">✓ BUY IT</div>';
    verdictEl.className = 'decision-verdict buy';
    reasoningEl.innerHTML = `
      <p><strong>This looks like a good opportunity.</strong></p>
      <p>You've identified demand, the condition is acceptable, you have space, competition is manageable,
      and it should sell reasonably quickly. These are all positive indicators.</p>
      <p><strong>Next steps:</strong> Verify pricing on your chosen platform, take good photos, and list it promptly.</p>
    `;
  } else if (score >= 5) {
    verdictEl.innerHTML = '<div class="verdict-research">⚠ RESEARCH MORE</div>';
    verdictEl.className = 'decision-verdict research';
    reasoningEl.innerHTML = `
      <p><strong>This is borderline - proceed with caution.</strong></p>
      <p>Some factors are positive, but there are concerns. Consider:</p>
      <ul>
        ${decisionAnswers[1] !== 'yes' ? '<li>Research demand more thoroughly - check sold listings</li>' : ''}
        ${decisionAnswers[2] !== 'yes' ? '<li>Evaluate if condition issues will significantly impact value</li>' : ''}
        ${decisionAnswers[3] !== 'yes' ? '<li>Consider storage costs if it takes time to sell</li>' : ''}
        ${decisionAnswers[4] !== 'no' ? '<li>Check if market saturation means lower prices</li>' : ''}
        ${decisionAnswers[5] !== 'yes' ? '<li>Calculate if slow sales are acceptable for your strategy</li>' : ''}
      </ul>
      <p>If you can address these concerns, it might be worth buying.</p>
    `;
  } else {
    verdictEl.innerHTML = '<div class="verdict-pass">✗ PASS</div>';
    verdictEl.className = 'decision-verdict pass';
    reasoningEl.innerHTML = `
      <p><strong>This is likely not a good buy.</strong></p>
      <p>Too many red flags suggest this item won't be profitable or will tie up your capital for too long.</p>
      <p><strong>Why pass?</strong></p>
      <ul>
        ${decisionAnswers[1] !== 'yes' ? '<li>Limited or uncertain demand makes it risky</li>' : ''}
        ${decisionAnswers[2] !== 'yes' ? '<li>Poor condition will hurt resale value significantly</li>' : ''}
        ${decisionAnswers[3] !== 'yes' ? '<li>Storage constraints add hidden costs</li>' : ''}
        ${decisionAnswers[4] === 'yes' ? '<li>Market saturation means price competition and slow sales</li>' : ''}
        ${decisionAnswers[5] === 'no' ? '<li>Slow-moving items tie up capital you could use elsewhere</li>' : ''}
      </ul>
      <p>Focus your efforts on better opportunities.</p>
    `;
  }

  resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetDecisionTree() {
  decisionAnswers = {};
  document.querySelectorAll('.decision-question').forEach(q => q.classList.remove('active'));
  document.querySelector('.decision-question[data-step="1"]').classList.add('active');
  document.getElementById('decision-result').style.display = 'none';
  document.querySelector('.decision-question[data-step="1"]').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// STORE PRIORITIZER
let storeCounter = 1;

function addStore() {
  storeCounter++;
  const storeList = document.getElementById('store-list');

  const storeEntry = document.createElement('div');
  storeEntry.className = 'store-entry';
  storeEntry.dataset.id = storeCounter;
  storeEntry.innerHTML = `
    <h4>Store #${storeCounter} <button class="remove-store-btn" onclick="removeStore(${storeCounter})">Remove</button></h4>
    <div class="calc-row">
      <label>Store Name:</label>
      <input type="text" class="store-name" placeholder="e.g., HD East Side">
    </div>
    <div class="calc-row">
      <label>Distance (miles):</label>
      <input type="number" class="store-distance" min="0" step="0.1" value="5">
    </div>
    <div class="calc-row">
      <label>Days Since Last Visit:</label>
      <input type="number" class="store-last-visit" min="0" step="1" value="7">
    </div>
    <div class="calc-row">
      <label>Expected Quality:</label>
      <select class="store-quality">
        <option value="high">High - Often has good finds</option>
        <option value="medium" selected>Medium - Hit or miss</option>
        <option value="low">Low - Usually picked over</option>
      </select>
    </div>
  `;

  storeList.appendChild(storeEntry);
}

function removeStore(id) {
  const storeEntry = document.querySelector(`.store-entry[data-id="${id}"]`);
  if (storeEntry) {
    storeEntry.remove();
  }
}

function prioritizeStores() {
  const stores = [];
  document.querySelectorAll('.store-entry').forEach(entry => {
    const name = entry.querySelector('.store-name').value || 'Unnamed Store';
    const distance = parseFloat(entry.querySelector('.store-distance').value) || 0;
    const daysSince = parseInt(entry.querySelector('.store-last-visit').value) || 0;
    const quality = entry.querySelector('.store-quality').value;

    let score = 0;
    score += Math.min(daysSince * 2, 40);

    if (quality === 'high') score += 30;
    else if (quality === 'medium') score += 15;
    else score += 5;

    score -= Math.min(distance, 20);

    stores.push({ name, distance, daysSince, quality, score });
  });

  stores.sort((a, b) => b.score - a.score);

  const resultEl = document.getElementById('prioritizer-results');
  const listEl = document.getElementById('priority-list');

  listEl.innerHTML = stores.map((store, index) => {
    const qualityLabels = { high: 'High Quality', medium: 'Medium Quality', low: 'Lower Quality' };
    return `
      <div class="priority-item rank-${index + 1}">
        <div class="priority-rank">#${index + 1}</div>
        <div class="priority-details">
          <h4>${store.name}</h4>
          <div class="priority-stats">
            <span>📍 ${store.distance} mi</span>
            <span>🗓️ ${store.daysSince} days ago</span>
            <span>⭐ ${qualityLabels[store.quality]}</span>
          </div>
          <div class="priority-reason">
            ${getPriorityReason(store, index, stores.length)}
          </div>
        </div>
      </div>
    `;
  }).join('');

  resultEl.style.display = 'block';
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function getPriorityReason(store, rank, total) {
  if (rank === 0) {
    const reasons = [];
    if (store.daysSince >= 10) reasons.push('hasn\'t been visited in a while');
    if (store.quality === 'high') reasons.push('typically has good inventory');
    if (store.distance <= 5) reasons.push('is nearby');

    if (reasons.length > 0) {
      return `<strong>Top priority:</strong> This store ${reasons.join(', ')}.`;
    }
    return '<strong>Top priority</strong> based on overall factors.';
  } else if (rank === total - 1) {
    const reasons = [];
    if (store.daysSince < 3) reasons.push('visited recently');
    if (store.quality === 'low') reasons.push('typically has limited finds');
    if (store.distance > 15) reasons.push('is farther away');

    if (reasons.length > 0) {
      return `Lower priority: ${reasons.join(', ')}.`;
    }
    return 'Lower priority based on overall factors.';
  } else {
    return 'Moderate priority - visit if you have time.';
  }
}

// HUNT TRACKER
function switchTrackerTab(tab) {
  document.querySelectorAll('.tracker-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tracker-panel').forEach(p => p.classList.remove('active'));

  event.target.classList.add('active');
  document.getElementById(`tracker-${tab}`).classList.add('active');

  if (tab === 'history') {
    loadHuntHistory();
  } else if (tab === 'stats') {
    updateHuntStats();
  }
}

function logHunt() {
  const hunt = {
    date: document.getElementById('hunt-date').value,
    stores: parseInt(document.getElementById('hunt-stores').value) || 0,
    items: parseInt(document.getElementById('hunt-items').value) || 0,
    spent: parseFloat(document.getElementById('hunt-spent').value) || 0,
    value: parseFloat(document.getElementById('hunt-value').value) || 0,
    notes: document.getElementById('hunt-notes').value,
    timestamp: new Date().toISOString()
  };

  let history = JSON.parse(localStorage.getItem('hd-hunt-history') || '[]');
  history.unshift(hunt);
  localStorage.setItem('hd-hunt-history', JSON.stringify(history));

  document.getElementById('hunt-stores').value = '1';
  document.getElementById('hunt-items').value = '0';
  document.getElementById('hunt-spent').value = '0';
  document.getElementById('hunt-value').value = '0';
  document.getElementById('hunt-notes').value = '';

  alert('Hunt logged successfully!');
  updateHuntStats();
}

function loadHuntHistory() {
  const history = JSON.parse(localStorage.getItem('hd-hunt-history') || '[]');
  const listEl = document.getElementById('hunt-history-list');

  if (!listEl) return;

  if (history.length === 0) {
    listEl.innerHTML = '<p>No hunts logged yet. Start tracking your sessions!</p>';
    return;
  }

  listEl.innerHTML = history.map((hunt, index) => `
    <div class="hunt-history-item">
      <div class="hunt-header">
        <strong>${new Date(hunt.date).toLocaleDateString()}</strong>
        <button class="delete-hunt-btn" onclick="deleteHunt(${index})">Delete</button>
      </div>
      <div class="hunt-details">
        <span>🏪 ${hunt.stores} store${hunt.stores !== 1 ? 's' : ''}</span>
        <span>📦 ${hunt.items} item${hunt.items !== 1 ? 's' : ''}</span>
        <span>💰 Spent: $${hunt.spent.toFixed(2)}</span>
        <span>💵 Est. Value: $${hunt.value.toFixed(2)}</span>
        ${hunt.value > hunt.spent ? `<span class="profit-positive">Profit: $${(hunt.value - hunt.spent).toFixed(2)}</span>` : ''}
      </div>
      ${hunt.notes ? `<div class="hunt-notes">${hunt.notes}</div>` : ''}
    </div>
  `).join('');
}

function deleteHunt(index) {
  if (confirm('Delete this hunt log?')) {
    let history = JSON.parse(localStorage.getItem('hd-hunt-history') || '[]');
    history.splice(index, 1);
    localStorage.setItem('hd-hunt-history', JSON.stringify(history));
    loadHuntHistory();
    updateHuntStats();
  }
}

function updateHuntStats() {
  const history = JSON.parse(localStorage.getItem('hd-hunt-history') || '[]');
  const statsEl = document.getElementById('hunt-stats');

  if (!statsEl) return;

  if (history.length === 0) {
    statsEl.innerHTML = '<p>No data yet. Log some hunts to see your statistics!</p>';
    return;
  }

  const totalHunts = history.length;
  const totalStores = history.reduce((sum, h) => sum + h.stores, 0);
  const totalItems = history.reduce((sum, h) => sum + h.items, 0);
  const totalSpent = history.reduce((sum, h) => sum + h.spent, 0);
  const totalValue = history.reduce((sum, h) => sum + h.value, 0);
  const totalProfit = totalValue - totalSpent;

  const avgItemsPerHunt = totalItems / totalHunts;
  const avgValuePerHunt = totalValue / totalHunts;
  const avgProfitPerHunt = totalProfit / totalHunts;
  const successRate = history.filter(h => h.items > 0).length / totalHunts * 100;

  const bestHunt = history.reduce((best, h) => {
    const profit = h.value - h.spent;
    const bestProfit = best.value - best.spent;
    return profit > bestProfit ? h : best;
  }, history[0]);

  statsEl.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${totalHunts}</div>
        <div class="stat-label">Total Hunts</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${totalItems}</div>
        <div class="stat-label">Items Found</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">$${totalProfit.toFixed(2)}</div>
        <div class="stat-label">Total Profit</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${successRate.toFixed(0)}%</div>
        <div class="stat-label">Success Rate</div>
      </div>
    </div>

    <h4>Averages</h4>
    <ul class="stats-list">
      <li><strong>${avgItemsPerHunt.toFixed(1)}</strong> items per hunt</li>
      <li><strong>$${avgValuePerHunt.toFixed(2)}</strong> value per hunt</li>
      <li><strong>$${avgProfitPerHunt.toFixed(2)}</strong> profit per hunt</li>
      <li><strong>${(totalStores / totalHunts).toFixed(1)}</strong> stores per trip</li>
    </ul>

    <h4>Best Hunt</h4>
    <div class="best-hunt-card">
      <p><strong>${new Date(bestHunt.date).toLocaleDateString()}</strong></p>
      <p>${bestHunt.items} items found, $${(bestHunt.value - bestHunt.spent).toFixed(2)} profit</p>
      ${bestHunt.notes ? `<p class="hunt-notes">${bestHunt.notes}</p>` : ''}
    </div>

    <button class="calc-button secondary" onclick="clearAllHuntData()">Clear All Data</button>
  `;
}

function clearAllHuntData() {
  if (confirm('Clear ALL hunt tracking data? This cannot be undone.')) {
    localStorage.removeItem('hd-hunt-history');
    loadHuntHistory();
    updateHuntStats();
  }
}

// ====================
// TABLE ENHANCEMENTS
// ====================

const TableEnhancements = {
  init() {
    this.enhanceAllTables();
  },

  enhanceAllTables() {
    const tables = document.querySelectorAll('table');
    tables.forEach((table, index) => {
      if (!table.classList.contains('enhanced')) {
        this.enhanceTable(table, index);
      }
    });
  },

  enhanceTable(table, index) {
    table.classList.add('enhanced');
    table.dataset.tableId = index;

    if (!table.parentElement.classList.contains('table-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }

    this.addTableControls(table);
    this.makeSortable(table);
  },

  addTableControls(table) {
    const wrapper = table.parentElement;

    const controls = document.createElement('div');
    controls.className = 'table-controls';
    controls.innerHTML = `
      <div class="table-search-wrapper">
        <input type="text" class="table-search" placeholder="Filter table..." />
      </div>
      <button class="table-export-btn" title="Export to CSV">📊 Export CSV</button>
    `;

    wrapper.insertBefore(controls, table);

    const searchInput = controls.querySelector('.table-search');
    searchInput.addEventListener('input', (e) => {
      this.filterTable(table, e.target.value);
    });

    const exportBtn = controls.querySelector('.table-export-btn');
    exportBtn.addEventListener('click', () => {
      this.exportTableToCSV(table);
    });
  },

  makeSortable(table) {
    const headers = table.querySelectorAll('thead th');
    headers.forEach((header, columnIndex) => {
      header.style.cursor = 'pointer';
      header.classList.add('sortable');
      header.innerHTML = `<span class="header-text">${header.innerHTML}</span><span class="sort-indicator"></span>`;

      header.addEventListener('click', () => {
        this.sortTable(table, columnIndex, header);
      });
    });
  },

  sortTable(table, columnIndex, header) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const currentDirection = header.dataset.sortDirection || 'none';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

    table.querySelectorAll('thead th').forEach(h => {
      h.dataset.sortDirection = 'none';
      h.querySelector('.sort-indicator').textContent = '';
    });

    header.dataset.sortDirection = newDirection;
    header.querySelector('.sort-indicator').textContent = newDirection === 'asc' ? ' ↑' : ' ↓';

    rows.sort((a, b) => {
      const aValue = a.cells[columnIndex].textContent.trim();
      const bValue = b.cells[columnIndex].textContent.trim();

      const aNum = parseFloat(aValue.replace(/[$,%]/g, ''));
      const bNum = parseFloat(bValue.replace(/[$,%]/g, ''));

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return newDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }

      return newDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    rows.forEach(row => tbody.appendChild(row));
  },

  filterTable(table, query) {
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    const lowerQuery = query.toLowerCase();

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(lowerQuery)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  },

  exportTableToCSV(table) {
    const rows = [];

    const headers = Array.from(table.querySelectorAll('thead th'))
      .map(th => th.querySelector('.header-text').textContent.trim());
    rows.push(headers);

    table.querySelectorAll('tbody tr').forEach(tr => {
      if (tr.style.display !== 'none') {
        const row = Array.from(tr.querySelectorAll('td'))
          .map(td => td.textContent.trim());
        rows.push(row);
      }
    });

    const csv = rows.map(row =>
      row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hd-guide-table.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
};

// ====================
// USER CONTENT MANAGEMENT SYSTEM
// ====================

const UserContentManager = {
  // Data structure for all user content
  data: {
    notes: [],
    bookmarks: [],
    highlights: [],
    tags: [],
    readingPositions: {},
    collections: ['uncategorized']
  },

  init() {
    this.loadData();
    this.setupToolbar();
    this.setupNotePanel();
    this.setupHighlighting();
    this.setupReadingPosition();
    this.setupFocusMode();
    this.setupKeyboardShortcuts();
    this.addSectionControls();
    
    // Initialize page-specific functionality
    if (window.location.pathname.includes('notes.html')) {
      this.initNotesPage();
    } else if (window.location.pathname.includes('bookmarks.html')) {
      this.initBookmarksPage();
    }
  },

  // ====================
  // DATA MANAGEMENT
  // ====================

  loadData() {
    const stored = localStorage.getItem('hd-guide-user-content');
    if (stored) {
      try {
        this.data = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to load user content:', e);
      }
    }
    this.restoreHighlights();
    this.updateBookmarkIndicators();
  },

  saveData() {
    try {
      localStorage.setItem('hd-guide-user-content', JSON.stringify(this.data));
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        alert('Storage limit reached. Consider exporting and clearing old data.');
      }
      return false;
    }
  },

  // ====================
  // TOOLBAR
  // ====================

  setupToolbar() {
    // Skip toolbar on notes/bookmarks pages
    if (window.location.pathname.includes('notes.html') || 
        window.location.pathname.includes('bookmarks.html')) {
      return;
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'content-mgmt-toolbar';
    toolbar.innerHTML = `
      <button class="toolbar-btn" id="add-page-note" title="Add Note (N)" aria-label="Add note">📝</button>
      <button class="toolbar-btn" id="bookmark-page" title="Bookmark Page (B)" aria-label="Bookmark page">⭐</button>
      <button class="toolbar-btn" id="highlight-mode" title="Highlight Text (H)" aria-label="Highlight text">🖍️</button>
      <span class="toolbar-separator"></span>
      <button class="toolbar-btn" id="focus-mode-toggle" title="Focus Mode (F)" aria-label="Toggle focus mode">🎯</button>
      <button class="toolbar-btn" id="export-data" title="Export Data" aria-label="Export data">📥</button>
    `;
    document.body.appendChild(toolbar);

    // Add event listeners
    document.getElementById('add-page-note').addEventListener('click', () => this.openNotePanel());
    document.getElementById('bookmark-page').addEventListener('click', () => this.togglePageBookmark());
    document.getElementById('highlight-mode').addEventListener('click', () => this.toggleHighlightMode());
    document.getElementById('focus-mode-toggle').addEventListener('click', () => this.toggleFocusMode());
    document.getElementById('export-data').addEventListener('click', () => this.showExportMenu());

    // Update bookmark button state
    this.updateBookmarkButton();
  },

  // ====================
  // NOTE PANEL
  // ====================

  setupNotePanel() {
    const panel = document.createElement('div');
    panel.className = 'note-panel';
    panel.id = 'note-panel';
    panel.innerHTML = `
      <div class="note-panel-header">
        <h3 class="note-panel-title">Add Note</h3>
        <button class="note-panel-close" aria-label="Close">&times;</button>
      </div>
      <div class="note-panel-body">
        <textarea class="note-editor" id="note-editor" placeholder="Write your note here..."></textarea>
        <input type="text" class="note-tags-input" id="note-tags" placeholder="Tags (comma-separated, e.g., important, review)">
        <div class="note-actions">
          <button class="note-save-btn" id="save-note">Save Note</button>
          <button class="note-delete-btn" id="delete-note" style="display:none;">Delete Note</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Event listeners
    panel.querySelector('.note-panel-close').addEventListener('click', () => this.closeNotePanel());
    document.getElementById('save-note').addEventListener('click', () => this.saveNote());
    document.getElementById('delete-note').addEventListener('click', () => this.deleteCurrentNote());
  },

  openNotePanel(section = null, existingNote = null) {
    const panel = document.getElementById('note-panel');
    const editor = document.getElementById('note-editor');
    const tagsInput = document.getElementById('note-tags');
    const deleteBtn = document.getElementById('delete-note');

    panel.classList.add('visible');
    
    // Store current context
    panel.dataset.section = section || 'page';
    panel.dataset.noteId = existingNote ? existingNote.id : '';

    if (existingNote) {
      editor.value = existingNote.content;
      tagsInput.value = existingNote.tags.join(', ');
      deleteBtn.style.display = 'block';
    } else {
      editor.value = '';
      tagsInput.value = '';
      deleteBtn.style.display = 'none';
    }

    editor.focus();
  },

  closeNotePanel() {
    const panel = document.getElementById('note-panel');
    panel.classList.remove('visible');
  },

  saveNote() {
    const editor = document.getElementById('note-editor');
    const tagsInput = document.getElementById('note-tags');
    const panel = document.getElementById('note-panel');
    
    const content = editor.value.trim();
    if (!content) {
      alert('Please enter some content for your note.');
      return;
    }

    const tags = tagsInput.value.split(',').map(t => t.trim()).filter(t => t);
    const section = panel.dataset.section;
    const noteId = panel.dataset.noteId;

    const note = {
      id: noteId || 'note_' + Date.now(),
      page: getCurrentPage(),
      pageTitle: PAGE_TITLES[getCurrentPage()] || 'Home',
      section: section,
      sectionTitle: section !== 'page' ? document.getElementById(section)?.textContent : '',
      content: content,
      tags: tags,
      timestamp: Date.now(),
      dateCreated: new Date().toISOString()
    };

    if (noteId) {
      // Update existing note
      const index = this.data.notes.findIndex(n => n.id === noteId);
      if (index !== -1) {
        this.data.notes[index] = note;
      }
    } else {
      // Add new note
      this.data.notes.push(note);
    }

    this.saveData();
    this.closeNotePanel();
    this.addSectionControls(); // Refresh controls

    // Show confirmation
    this.showToast('Note saved!');
  },

  deleteCurrentNote() {
    if (!confirm('Delete this note?')) return;

    const panel = document.getElementById('note-panel');
    const noteId = panel.dataset.noteId;

    this.data.notes = this.data.notes.filter(n => n.id !== noteId);
    this.saveData();
    this.closeNotePanel();
    this.addSectionControls();

    this.showToast('Note deleted');
  },

  // ====================
  // SECTION CONTROLS
  // ====================

  addSectionControls() {
    // Add note/bookmark buttons to all H2 headings
    const headings = document.querySelectorAll('main h2');
    
    headings.forEach(heading => {
      // Skip if already has controls
      if (heading.querySelector('.add-note-btn')) return;

      // Create ID if doesn't exist
      if (!heading.id) {
        heading.id = 'section-' + Math.random().toString(36).substr(2, 9);
      }

      // Check if section has note or bookmark
      const hasNote = this.data.notes.some(n => n.section === heading.id);
      const hasBookmark = this.data.bookmarks.some(b => b.sectionId === heading.id);

      // Add note button
      const noteBtn = document.createElement('button');
      noteBtn.className = 'add-note-btn';
      noteBtn.textContent = hasNote ? '📝 Note' : '+ Note';
      noteBtn.title = 'Add note to this section';
      noteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const existingNote = this.data.notes.find(n => n.section === heading.id);
        this.openNotePanel(heading.id, existingNote);
      });

      // Add bookmark button
      const bookmarkBtn = document.createElement('button');
      bookmarkBtn.className = 'add-bookmark-btn';
      bookmarkBtn.textContent = hasBookmark ? '⭐ Bookmarked' : '+ Bookmark';
      bookmarkBtn.title = 'Bookmark this section';
      bookmarkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleSectionBookmark(heading.id, heading.textContent);
      });

      heading.appendChild(noteBtn);
      heading.appendChild(bookmarkBtn);
    });
  },

  // ====================
  // BOOKMARKS
  // ====================

  togglePageBookmark() {
    const page = getCurrentPage();
    const pageTitle = PAGE_TITLES[page] || 'Home';
    
    const existingIndex = this.data.bookmarks.findIndex(b => b.page === page && !b.sectionId);
    
    if (existingIndex !== -1) {
      // Remove bookmark
      this.data.bookmarks.splice(existingIndex, 1);
      this.showToast('Bookmark removed');
    } else {
      // Add bookmark
      this.data.bookmarks.push({
        id: 'bookmark_' + Date.now(),
        page: page,
        pageTitle: pageTitle,
        type: 'page',
        sectionId: null,
        sectionTitle: null,
        collection: 'uncategorized',
        timestamp: Date.now(),
        dateCreated: new Date().toISOString()
      });
      this.showToast('Page bookmarked!');
    }

    this.saveData();
    this.updateBookmarkButton();
  },

  toggleSectionBookmark(sectionId, sectionTitle) {
    const page = getCurrentPage();
    const pageTitle = PAGE_TITLES[page] || 'Home';
    
    const existingIndex = this.data.bookmarks.findIndex(b => b.sectionId === sectionId);
    
    if (existingIndex !== -1) {
      this.data.bookmarks.splice(existingIndex, 1);
      this.showToast('Section bookmark removed');
    } else {
      this.data.bookmarks.push({
        id: 'bookmark_' + Date.now(),
        page: page,
        pageTitle: pageTitle,
        type: 'section',
        sectionId: sectionId,
        sectionTitle: sectionTitle,
        collection: 'uncategorized',
        timestamp: Date.now(),
        dateCreated: new Date().toISOString()
      });
      this.showToast('Section bookmarked!');
    }

    this.saveData();
    this.addSectionControls();
  },

  updateBookmarkButton() {
    const btn = document.getElementById('bookmark-page');
    if (!btn) return;

    const page = getCurrentPage();
    const isBookmarked = this.data.bookmarks.some(b => b.page === page && !b.sectionId);
    
    btn.style.opacity = isBookmarked ? '1' : '0.6';
    btn.title = isBookmarked ? 'Remove bookmark' : 'Bookmark page';
  },

  updateBookmarkIndicators() {
    // Add stars to bookmarked pages in navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isBookmarked = this.data.bookmarks.some(b => b.page === href && !b.sectionId);
      if (isBookmarked) {
        link.classList.add('page-bookmarked');
      }
    });
  },

  // ====================
  // TEXT HIGHLIGHTING
  // ====================

  highlightMode: false,

  setupHighlighting() {
    // Setup text selection listener
    document.addEventListener('mouseup', (e) => {
      if (!this.highlightMode) return;
      
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text.length > 0 && text.length < 500) {
        this.showHighlightMenu(e.clientX, e.clientY, selection);
      }
    });
  },

  toggleHighlightMode() {
    this.highlightMode = !this.highlightMode;
    const btn = document.getElementById('highlight-mode');
    
    if (this.highlightMode) {
      btn.style.backgroundColor = 'var(--accent-color)';
      btn.style.color = 'white';
      this.showToast('Highlight mode ON - Select text to highlight');
    } else {
      btn.style.backgroundColor = '';
      btn.style.color = '';
      this.removeHighlightMenu();
      this.showToast('Highlight mode OFF');
    }
  },

  showHighlightMenu(x, y, selection) {
    this.removeHighlightMenu();

    const menu = document.createElement('div');
    menu.className = 'highlight-menu';
    menu.style.left = x + 'px';
    menu.style.top = (y - 60) + 'px';
    
    ['yellow', 'green', 'blue', 'pink'].forEach(color => {
      const btn = document.createElement('button');
      btn.className = `highlight-color-btn ${color}`;
      btn.title = `Highlight ${color}`;
      btn.addEventListener('click', () => {
        this.applyHighlight(selection, color);
        this.removeHighlightMenu();
      });
      menu.appendChild(btn);
    });

    document.body.appendChild(menu);

    // Remove menu on click outside
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target)) {
          this.removeHighlightMenu();
        }
      }, { once: true });
    }, 100);
  },

  removeHighlightMenu() {
    const existing = document.querySelector('.highlight-menu');
    if (existing) existing.remove();
  },

  applyHighlight(selection, color) {
    const range = selection.getRangeAt(0);
    const text = selection.toString();
    
    // Create highlight span
    const highlight = document.createElement('span');
    highlight.className = `highlight ${color}`;
    highlight.textContent = text;
    highlight.dataset.highlightId = 'highlight_' + Date.now();
    
    // Add click to remove
    highlight.addEventListener('click', () => {
      this.removeHighlight(highlight.dataset.highlightId);
    });

    // Replace selected text
    range.deleteContents();
    range.insertNode(highlight);
    
    // Save highlight data
    this.data.highlights.push({
      id: highlight.dataset.highlightId,
      page: getCurrentPage(),
      text: text,
      color: color,
      context: this.getHighlightContext(highlight),
      timestamp: Date.now()
    });

    this.saveData();
    selection.removeAllRanges();
  },

  removeHighlight(highlightId) {
    const element = document.querySelector(`[data-highlight-id="${highlightId}"]`);
    if (element) {
      const text = document.createTextNode(element.textContent);
      element.parentNode.replaceChild(text, element);
    }

    this.data.highlights = this.data.highlights.filter(h => h.id !== highlightId);
    this.saveData();
  },

  restoreHighlights() {
    const page = getCurrentPage();
    const pageHighlights = this.data.highlights.filter(h => h.page === page);
    
    // Simple restoration - find and highlight text
    pageHighlights.forEach(h => {
      const main = document.querySelector('main');
      if (!main) return;

      const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
      let node;

      while (node = walker.nextNode()) {
        const text = node.textContent;
        if (text.includes(h.text)) {
          const span = document.createElement('span');
          span.className = `highlight ${h.color}`;
          span.textContent = h.text;
          span.dataset.highlightId = h.id;
          span.addEventListener('click', () => this.removeHighlight(h.id));

          const parent = node.parentNode;
          const before = text.substring(0, text.indexOf(h.text));
          const after = text.substring(text.indexOf(h.text) + h.text.length);

          if (before) parent.insertBefore(document.createTextNode(before), node);
          parent.insertBefore(span, node);
          if (after) parent.insertBefore(document.createTextNode(after), node);
          parent.removeChild(node);
          break;
        }
      }
    });
  },

  getHighlightContext(element) {
    // Get surrounding context for better restoration
    const parent = element.parentElement;
    return parent ? parent.textContent.substring(0, 100) : '';
  },

  // ====================
  // READING POSITION
  // ====================

  setupReadingPosition() {
    // Create progress bar
    const bar = document.createElement('div');
    bar.className = 'reading-position-bar';
    document.body.appendChild(bar);

    // Update on scroll
    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (window.scrollY / docHeight) * 100;
      bar.style.width = Math.min(scrollPercent, 100) + '%';

      // Save position
      this.saveReadingPosition();
    });

    // Restore position
    this.restoreReadingPosition();
  },

  saveReadingPosition() {
    const page = getCurrentPage();
    this.data.readingPositions[page] = {
      scrollY: window.scrollY,
      timestamp: Date.now()
    };
    this.saveData();
  },

  restoreReadingPosition() {
    const page = getCurrentPage();
    const saved = this.data.readingPositions[page];

    if (saved && Date.now() - saved.timestamp < 7 * 24 * 60 * 60 * 1000) { // 7 days
      // Show prompt to continue
      const prompt = document.createElement('div');
      prompt.className = 'continue-reading-prompt';
      prompt.innerHTML = `
        <p>Continue where you left off?</p>
        <button class="continue-reading-btn">Yes, continue</button>
        <button class="dismiss-prompt-btn">Start from top</button>
      `;
      document.body.appendChild(prompt);

      prompt.querySelector('.continue-reading-btn').addEventListener('click', () => {
        window.scrollTo({ top: saved.scrollY, behavior: 'smooth' });
        prompt.remove();
      });

      prompt.querySelector('.dismiss-prompt-btn').addEventListener('click', () => {
        prompt.remove();
      });

      // Auto-dismiss after 10 seconds
      setTimeout(() => prompt.remove(), 10000);
    }
  },

  // ====================
  // FOCUS MODE
  // ====================

  setupFocusMode() {
    // Listen for F key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'f' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        this.toggleFocusMode();
      }
    });
  },

  toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
    
    if (document.body.classList.contains('focus-mode')) {
      // Add focus mode indicator
      const indicator = document.createElement('div');
      indicator.className = 'focus-mode-indicator';
      indicator.innerHTML = 'Focus Mode <button class="exit-focus-btn">Exit (F)</button>';
      document.body.appendChild(indicator);

      indicator.querySelector('.exit-focus-btn').addEventListener('click', () => {
        this.toggleFocusMode();
      });
    } else {
      // Remove indicator
      const indicator = document.querySelector('.focus-mode-indicator');
      if (indicator) indicator.remove();
    }
  },

  // ====================
  // KEYBOARD SHORTCUTS
  // ====================

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ignore if typing
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      // Ctrl+B - View bookmarks
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        window.location.href = 'bookmarks.html';
      }

      // N - Add note
      if (e.key === 'n') {
        e.preventDefault();
        this.openNotePanel();
      }

      // H - Toggle highlight mode
      if (e.key === 'h') {
        e.preventDefault();
        this.toggleHighlightMode();
      }

      // B - Bookmark page
      if (e.key === 'b') {
        e.preventDefault();
        this.togglePageBookmark();
      }
    });
  },

  // ====================
  // EXPORT / IMPORT
  // ====================

  showExportMenu() {
    const menu = document.createElement('div');
    menu.className = 'export-menu';
    menu.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--nav-bg);
      border: 2px solid var(--border-color);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 1001;
      min-width: 300px;
    `;
    
    menu.innerHTML = `
      <h3 style="margin-top: 0;">Export Your Data</h3>
      <button class="action-btn" style="width: 100%; margin-bottom: 0.75rem;" id="export-all-json">Export All (JSON)</button>
      <button class="action-btn" style="width: 100%; margin-bottom: 0.75rem;" id="export-notes-md">Export Notes (Markdown)</button>
      <button class="action-btn" style="width: 100%; margin-bottom: 0.75rem;" id="export-bookmarks-html">Export Bookmarks (HTML)</button>
      <button class="action-btn" style="width: 100%; margin-bottom: 1rem;" id="import-data">Import Data</button>
      <button class="action-btn danger-btn" style="width: 100%;" id="close-export-menu">Close</button>
    `;
    
    document.body.appendChild(menu);

    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
    `;
    document.body.appendChild(backdrop);

    // Event listeners
    document.getElementById('export-all-json').addEventListener('click', () => {
      this.exportAllJSON();
    });

    document.getElementById('export-notes-md').addEventListener('click', () => {
      this.exportNotesMarkdown();
    });

    document.getElementById('export-bookmarks-html').addEventListener('click', () => {
      this.exportBookmarksHTML();
    });

    document.getElementById('import-data').addEventListener('click', () => {
      this.importData();
    });

    document.getElementById('close-export-menu').addEventListener('click', () => {
      menu.remove();
      backdrop.remove();
    });

    backdrop.addEventListener('click', () => {
      menu.remove();
      backdrop.remove();
    });
  },

  exportAllJSON() {
    const data = JSON.stringify(this.data, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hd-penny-guide-backup-${Date.now()}.json`;
    a.click();
    this.showToast('Data exported!');
  },

  exportNotesMarkdown() {
    let md = '# My Notes - Home Depot Penny Guide\n\n';
    md += `Exported: ${new Date().toLocaleString()}\n\n`;
    
    this.data.notes.forEach(note => {
      md += `## ${note.pageTitle}\n`;
      if (note.sectionTitle) md += `### ${note.sectionTitle}\n`;
      md += `**Date:** ${new Date(note.timestamp).toLocaleString()}\n\n`;
      md += `${note.content}\n\n`;
      if (note.tags.length) md += `**Tags:** ${note.tags.join(', ')}\n\n`;
      md += '---\n\n';
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hd-penny-guide-notes-${Date.now()}.md`;
    a.click();
    this.showToast('Notes exported!');
  },

  exportBookmarksHTML() {
    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>HD Penny Guide Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n<DL><p>\n`;
    
    this.data.bookmarks.forEach(b => {
      const url = `${window.location.origin}/${b.page}${b.sectionId ? '#' + b.sectionId : ''}`;
      html += `<DT><A HREF="${url}">${b.pageTitle}${b.sectionTitle ? ' - ' + b.sectionTitle : ''}</A>\n`;
    });

    html += `</DL><p>\n`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hd-penny-guide-bookmarks-${Date.now()}.html`;
    a.click();
    this.showToast('Bookmarks exported!');
  },

  importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (confirm('Import data? This will merge with existing data.')) {
            // Merge data
            this.data.notes = [...this.data.notes, ...imported.notes];
            this.data.bookmarks = [...this.data.bookmarks, ...imported.bookmarks];
            this.data.highlights = [...this.data.highlights, ...imported.highlights];
            this.saveData();
            this.showToast('Data imported successfully!');
            location.reload();
          }
        } catch (err) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    });
    input.click();
  },

  // ====================
  // NOTES PAGE
  // ====================

  initNotesPage() {
    this.renderNotes();
    this.setupNotesFilters();
    this.setupNotesActions();
  },

  renderNotes(filtered = null) {
    const container = document.getElementById('notes-container');
    const notes = filtered || this.data.notes;

    document.getElementById('note-count').textContent = notes.length;

    if (notes.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p class="icon-book">No notes yet!</p>
          <p>Start adding notes to any page or section.</p>
          <p><a href="index.html">Go to Home Page</a></p>
        </div>
      `;
      return;
    }

    container.innerHTML = notes.map(note => `
      <div class="note-card">
        <div class="note-card-header">
          <a href="${note.page}${note.section !== 'page' ? '#' + note.section : ''}" class="note-page-link">${note.pageTitle}</a>
          <span class="note-date">${new Date(note.timestamp).toLocaleDateString()}</span>
        </div>
        ${note.sectionTitle ? `<div class="note-section-title">${note.sectionTitle}</div>` : ''}
        <div class="note-content">${this.escapeHtml(note.content)}</div>
        ${note.tags.length ? `<div class="note-tags">${note.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
        <div class="note-actions-footer">
          <button class="note-edit-btn" data-note-id="${note.id}">Edit</button>
          <button class="note-delete-small-btn" data-note-id="${note.id}">Delete</button>
        </div>
      </div>
    `).join('');

    // Add event listeners
    container.querySelectorAll('.note-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const note = notes.find(n => n.id === btn.dataset.noteId);
        window.location.href = `${note.page}`;
      });
    });

    container.querySelectorAll('.note-delete-small-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Delete this note?')) {
          this.data.notes = this.data.notes.filter(n => n.id !== btn.dataset.noteId);
          this.saveData();
          this.renderNotes();
        }
      });
    });
  },

  setupNotesFilters() {
    const searchInput = document.getElementById('note-search');
    const pageFilter = document.getElementById('filter-by-page');
    const tagFilter = document.getElementById('filter-by-tag');
    const sortSelect = document.getElementById('sort-notes');

    // Populate page filter
    const pages = [...new Set(this.data.notes.map(n => n.pageTitle))];
    pages.forEach(page => {
      const option = document.createElement('option');
      option.value = page;
      option.textContent = page;
      pageFilter.appendChild(option);
    });

    // Populate tag filter
    const tags = [...new Set(this.data.notes.flatMap(n => n.tags))];
    tags.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      tagFilter.appendChild(option);
    });

    // Apply filters
    const applyFilters = () => {
      let filtered = [...this.data.notes];

      // Search
      const searchTerm = searchInput.value.toLowerCase();
      if (searchTerm) {
        filtered = filtered.filter(n => 
          n.content.toLowerCase().includes(searchTerm) ||
          n.pageTitle.toLowerCase().includes(searchTerm) ||
          n.sectionTitle?.toLowerCase().includes(searchTerm)
        );
      }

      // Page filter
      if (pageFilter.value) {
        filtered = filtered.filter(n => n.pageTitle === pageFilter.value);
      }

      // Tag filter
      if (tagFilter.value) {
        filtered = filtered.filter(n => n.tags.includes(tagFilter.value));
      }

      // Sort
      const sortBy = sortSelect.value;
      if (sortBy === 'date-desc') {
        filtered.sort((a, b) => b.timestamp - a.timestamp);
      } else if (sortBy === 'date-asc') {
        filtered.sort((a, b) => a.timestamp - b.timestamp);
      } else if (sortBy === 'page') {
        filtered.sort((a, b) => a.pageTitle.localeCompare(b.pageTitle));
      }

      this.renderNotes(filtered);
    };

    searchInput.addEventListener('input', applyFilters);
    pageFilter.addEventListener('change', applyFilters);
    tagFilter.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
  },

  setupNotesActions() {
    document.getElementById('export-notes-md').addEventListener('click', () => {
      this.exportNotesMarkdown();
    });

    document.getElementById('export-notes-txt').addEventListener('click', () => {
      let txt = 'My Notes - Home Depot Penny Guide\n\n';
      this.data.notes.forEach(note => {
        txt += `${note.pageTitle}\n`;
        if (note.sectionTitle) txt += `${note.sectionTitle}\n`;
        txt += `${new Date(note.timestamp).toLocaleString()}\n\n`;
        txt += `${note.content}\n\n`;
        txt += '---\n\n';
      });

      const blob = new Blob([txt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notes-${Date.now()}.txt`;
      a.click();
    });

    document.getElementById('print-notes').addEventListener('click', () => {
      window.print();
    });

    document.getElementById('clear-all-notes').addEventListener('click', () => {
      if (confirm('Delete ALL notes? This cannot be undone!')) {
        this.data.notes = [];
        this.saveData();
        this.renderNotes();
      }
    });
  },

  // ====================
  // BOOKMARKS PAGE
  // ====================

  initBookmarksPage() {
    this.renderBookmarks();
    this.renderCollections();
    this.setupBookmarksFilters();
    this.setupBookmarksActions();
  },

  renderBookmarks(filtered = null) {
    const container = document.getElementById('bookmarks-container');
    const bookmarks = filtered || this.data.bookmarks;

    document.getElementById('bookmark-count').textContent = bookmarks.length;

    if (bookmarks.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p class="icon-star">No bookmarks yet!</p>
          <p>Start bookmarking important pages and sections.</p>
          <p><a href="index.html">Go to Home Page</a></p>
        </div>
      `;
      return;
    }

    container.innerHTML = bookmarks.map(b => `
      <div class="bookmark-card" data-href="${b.page}${b.sectionId ? '#' + b.sectionId : ''}">
        <div class="bookmark-icon">${b.type === 'page' ? '📄' : '📌'}</div>
        <div class="bookmark-title">${b.pageTitle}</div>
        ${b.sectionTitle ? `<div class="bookmark-page">${b.sectionTitle}</div>` : ''}
        <div class="bookmark-collection">${b.collection}</div>
        <div class="bookmark-actions">
          <button class="bookmark-delete-btn" data-bookmark-id="${b.id}">Remove</button>
        </div>
      </div>
    `).join('');

    // Navigate on click
    container.querySelectorAll('.bookmark-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('bookmark-delete-btn')) {
          window.location.href = card.dataset.href;
        }
      });
    });

    // Delete buttons
    container.querySelectorAll('.bookmark-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.data.bookmarks = this.data.bookmarks.filter(b => b.id !== btn.dataset.bookmarkId);
        this.saveData();
        this.renderBookmarks();
        this.renderCollections();
      });
    });
  },

  renderCollections() {
    const container = document.getElementById('collections-list');
    const collections = this.data.collections;

    container.innerHTML = collections.map(col => {
      const count = this.data.bookmarks.filter(b => b.collection === col).length;
      return `
        <div class="collection-card" data-collection="${col}">
          <h3>${col}</h3>
          <p><span class="collection-count">${count}</span> bookmarks</p>
        </div>
      `;
    }).join('');

    // Filter by collection
    container.querySelectorAll('.collection-card').forEach(card => {
      card.addEventListener('click', () => {
        const col = card.dataset.collection;
        const filtered = this.data.bookmarks.filter(b => b.collection === col);
        this.renderBookmarks(filtered);
        
        // Update active state
        container.querySelectorAll('.collection-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });
  },

  setupBookmarksFilters() {
    const searchInput = document.getElementById('bookmark-search');
    const collectionFilter = document.getElementById('filter-by-collection');
    const sortSelect = document.getElementById('sort-bookmarks');

    // Populate collection filter
    this.data.collections.forEach(col => {
      if (col !== 'uncategorized') {
        const option = document.createElement('option');
        option.value = col;
        option.textContent = col;
        collectionFilter.appendChild(option);
      }
    });

    const applyFilters = () => {
      let filtered = [...this.data.bookmarks];

      // Search
      const searchTerm = searchInput.value.toLowerCase();
      if (searchTerm) {
        filtered = filtered.filter(b => 
          b.pageTitle.toLowerCase().includes(searchTerm) ||
          b.sectionTitle?.toLowerCase().includes(searchTerm)
        );
      }

      // Collection filter
      if (collectionFilter.value) {
        filtered = filtered.filter(b => b.collection === collectionFilter.value);
      }

      // Sort
      const sortBy = sortSelect.value;
      if (sortBy === 'date-desc') {
        filtered.sort((a, b) => b.timestamp - a.timestamp);
      } else if (sortBy === 'date-asc') {
        filtered.sort((a, b) => a.timestamp - b.timestamp);
      } else if (sortBy === 'page') {
        filtered.sort((a, b) => a.pageTitle.localeCompare(b.pageTitle));
      } else if (sortBy === 'alpha') {
        filtered.sort((a, b) => (a.sectionTitle || a.pageTitle).localeCompare(b.sectionTitle || b.pageTitle));
      }

      this.renderBookmarks(filtered);
    };

    searchInput.addEventListener('input', applyFilters);
    collectionFilter.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
  },

  setupBookmarksActions() {
    document.getElementById('create-collection').addEventListener('click', () => {
      const name = prompt('Collection name:');
      if (name && !this.data.collections.includes(name)) {
        this.data.collections.push(name);
        this.saveData();
        this.renderCollections();
        this.setupBookmarksFilters(); // Refresh filter options
      }
    });

    document.getElementById('export-bookmarks').addEventListener('click', () => {
      this.exportBookmarksHTML();
    });

    document.getElementById('clear-all-bookmarks').addEventListener('click', () => {
      if (confirm('Delete ALL bookmarks? This cannot be undone!')) {
        this.data.bookmarks = [];
        this.saveData();
        this.renderBookmarks();
        this.renderCollections();
      }
    });
  },

  // ====================
  // UTILITY FUNCTIONS
  // ====================

  showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--accent-color);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 20px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 1003;
      animation: slideInUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Initialize User Content Manager
document.addEventListener('DOMContentLoaded', function() {
  // Add a small delay to ensure other scripts are loaded
  setTimeout(() => {
    UserContentManager.init();
  }, 100);
});
// ====================
// ACCESSIBILITY FEATURES
// ====================

const Accessibility = {
  modes: [],
  ttsUtterance: null,
  ttsActive: false,

  init() {
    this.loadAccessibilityModes();
    this.setupKeyboardShortcuts();
    this.setupAccessibilityWidget();
    this.setupA11yControls();
    this.setupTextToSpeech();
    this.detectSystemPreferences();
  },

  loadAccessibilityModes() {
    const modes = localStorage.getItem('hd-guide-a11y-modes');
    if (modes) {
      this.modes = JSON.parse(modes);
      this.applyModes();
    }
  },

  saveAccessibilityModes() {
    localStorage.setItem('hd-guide-a11y-modes', JSON.stringify(this.modes));
  },

  toggleMode(mode) {
    const index = this.modes.indexOf(mode);
    if (index > -1) {
      this.modes.splice(index, 1);
    } else {
      this.modes.push(mode);
    }
    this.saveAccessibilityModes();
    this.applyModes();
    this.updateModeButtons();
    this.announceChange(mode + ' mode ' + (index > -1 ? 'disabled' : 'enabled'));
  },

  applyModes() {
    const html = document.documentElement;
    html.setAttribute('data-a11y-mode', this.modes.join(' '));
  },

  updateModeButtons() {
    const self = this;
    document.querySelectorAll('.a11y-toggle-btn').forEach(function(btn) {
      const mode = btn.dataset.mode;
      const isActive = self.modes.includes(mode);
      btn.setAttribute('aria-pressed', isActive);
      btn.textContent = isActive ? 'Disable ' + self.getModeName(mode) : 'Enable ' + self.getModeName(mode);
    });
  },

  getModeName(mode) {
    const names = {
      'high-contrast': 'High Contrast',
      'dyslexia': 'Dyslexia Mode',
      'reduce-motion': 'Reduce Motion',
      'focus-mode': 'Focus Mode',
      'deuteranopia': 'Deuteranopia',
      'protanopia': 'Protanopia',
      'tritanopia': 'Tritanopia'
    };
    return names[mode] || mode;
  },

  detectSystemPreferences() {
    // Auto-detect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (!this.modes.includes('reduce-motion')) {
        this.modes.push('reduce-motion');
        this.saveAccessibilityModes();
        this.applyModes();
      }
    }

    // Auto-detect prefers-contrast
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      if (!this.modes.includes('high-contrast')) {
        this.modes.push('high-contrast');
        this.saveAccessibilityModes();
        this.applyModes();
      }
    }
  },

  setupKeyboardShortcuts() {
    const self = this;
    document.addEventListener('keydown', function(e) {
      // Ignore if typing in input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      // ? or Shift+/ - Show shortcuts help
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        self.showShortcutsHelp();
      }

      // H - Go to homepage
      if (e.key === 'h' || e.key === 'H') {
        window.location.href = 'index.html';
      }

      // T - Scroll to top
      if (e.key === 't' || e.key === 'T') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // F - Toggle focus mode
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        self.toggleMode('focus-mode');
      }

      // Alt+T - Toggle theme
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        Preferences.toggleTheme();
      }

      // Alt+A - Open accessibility widget
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        self.toggleAccessibilityWidget();
      }

      // Alt++ - Increase font size
      if (e.altKey && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        self.increaseFontSize();
      }

      // Alt+- - Decrease font size
      if (e.altKey && e.key === '-') {
        e.preventDefault();
        self.decreaseFontSize();
      }
    });

    // Arrow key navigation for FAQ items
    this.setupFAQKeyboardNav();
  },

  setupFAQKeyboardNav() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length === 0) return;

    faqQuestions.forEach(function(question, index) {
      question.setAttribute('tabindex', '0');
      question.setAttribute('role', 'button');
      question.setAttribute('aria-expanded', 'false');

      question.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
          const isExpanded = question.classList.contains('active');
          question.setAttribute('aria-expanded', isExpanded);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextQuestion = faqQuestions[index + 1];
          if (nextQuestion) nextQuestion.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevQuestion = faqQuestions[index - 1];
          if (prevQuestion) prevQuestion.focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          faqQuestions[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          faqQuestions[faqQuestions.length - 1].focus();
        }
      });
    });
  },

  showShortcutsHelp() {
    // Navigate to shortcuts page or show modal
    if (window.location.pathname.includes('shortcuts.html')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = 'shortcuts.html';
    }
  },

  increaseFontSize() {
    const current = document.documentElement.getAttribute('data-font-size') || 'medium';
    const sizes = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(current);
    if (currentIndex < sizes.length - 1) {
      Preferences.setFontSize(sizes[currentIndex + 1]);
      this.announceChange('Font size increased to ' + sizes[currentIndex + 1]);
    }
  },

  decreaseFontSize() {
    const current = document.documentElement.getAttribute('data-font-size') || 'medium';
    const sizes = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(current);
    if (currentIndex > 0) {
      Preferences.setFontSize(sizes[currentIndex - 1]);
      this.announceChange('Font size decreased to ' + sizes[currentIndex - 1]);
    }
  },

  setupAccessibilityWidget() {
    const widget = document.getElementById('a11y-widget');
    if (!widget) {
      this.createAccessibilityWidget();
    }

    const toggle = document.querySelector('.a11y-widget-toggle');
    const panel = document.querySelector('.a11y-widget-panel');

    const self = this;
    if (toggle && panel) {
      toggle.addEventListener('click', function() {
        self.toggleAccessibilityWidget();
      });

      // Close when clicking outside
      document.addEventListener('click', function(e) {
        if (widget && !widget.contains(e.target)) {
          panel.setAttribute('aria-hidden', 'true');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  },

  createAccessibilityWidget() {
    const widget = document.createElement('div');
    widget.id = 'a11y-widget';
    widget.className = 'a11y-widget';
    widget.setAttribute('aria-label', 'Accessibility options');

    widget.innerHTML = '<button class="a11y-widget-toggle" aria-label="Toggle accessibility menu" aria-expanded="false">♿</button>' +
      '<div class="a11y-widget-panel" aria-hidden="true">' +
      '<h3>Quick Accessibility</h3>' +
      '<button data-mode="high-contrast">High Contrast</button>' +
      '<button data-mode="dyslexia">Dyslexia Mode</button>' +
      '<button data-mode="reduce-motion">Reduce Motion</button>' +
      '<button data-mode="focus-mode">Focus Mode</button>' +
      '<a href="a11y.html">All Options →</a>' +
      '</div>';

    document.body.appendChild(widget);

    // Setup click handlers for widget buttons
    const self = this;
    widget.querySelectorAll('button[data-mode]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        self.toggleMode(btn.dataset.mode);
      });
    });
  },

  toggleAccessibilityWidget() {
    const toggle = document.querySelector('.a11y-widget-toggle');
    const panel = document.querySelector('.a11y-widget-panel');

    if (panel && toggle) {
      const isHidden = panel.getAttribute('aria-hidden') === 'true';
      panel.setAttribute('aria-hidden', !isHidden);
      toggle.setAttribute('aria-expanded', isHidden);
    }
  },

  setupA11yControls() {
    // Setup all toggle buttons on a11y.html page
    const self = this;
    document.querySelectorAll('.a11y-toggle-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const mode = btn.dataset.mode;
        self.toggleMode(mode);
      });
    });

    // Animation speed controls
    document.querySelectorAll('.animation-speed-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const speed = btn.dataset.speed;
        self.setAnimationSpeed(speed);
        document.querySelectorAll('.animation-speed-btn').forEach(function(b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
      });
    });

    this.updateModeButtons();
  },

  setAnimationSpeed(speed) {
    const durations = {
      'off': '0.01ms',
      'slow': '0.6s',
      'normal': '0.3s',
      'fast': '0.15s'
    };

    const duration = durations[speed] || '0.3s';
    document.documentElement.style.setProperty('--animation-duration', duration);
    localStorage.setItem('hd-guide-animation-speed', speed);
  },

  setupTextToSpeech() {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported in this browser');
      return;
    }

    const playBtn = document.querySelector('.tts-control-btn[data-action="play"]');
    const pauseBtn = document.querySelector('.tts-control-btn[data-action="pause"]');
    const stopBtn = document.querySelector('.tts-control-btn[data-action="stop"]');
    const rateSlider = document.getElementById('tts-rate');
    const rateDisplay = document.getElementById('tts-rate-display');

    const self = this;
    if (playBtn) {
      playBtn.addEventListener('click', function() { self.startTextToSpeech(); });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', function() { self.pauseTextToSpeech(); });
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', function() { self.stopTextToSpeech(); });
    }

    if (rateSlider && rateDisplay) {
      rateSlider.addEventListener('input', function(e) {
        const rate = parseFloat(e.target.value);
        rateDisplay.textContent = rate.toFixed(1) + 'x';
        if (self.ttsUtterance) {
          self.ttsUtterance.rate = rate;
        }
      });
    }
  },

  startTextToSpeech() {
    const main = document.querySelector('main');
    if (!main) return;

    const text = this.getReadableText(main);

    if (speechSynthesis.speaking) {
      speechSynthesis.resume();
      return;
    }

    const self = this;
    this.ttsUtterance = new SpeechSynthesisUtterance(text);
    const rate = document.getElementById('tts-rate') ? document.getElementById('tts-rate').value : 1;
    this.ttsUtterance.rate = parseFloat(rate);

    this.ttsUtterance.onend = function() {
      self.ttsActive = false;
    };

    this.ttsActive = true;
    speechSynthesis.speak(this.ttsUtterance);
    this.announceChange('Started reading page aloud');
  },

  pauseTextToSpeech() {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      this.announceChange('Paused reading');
    }
  },

  stopTextToSpeech() {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      this.ttsActive = false;
      this.announceChange('Stopped reading');
    }
  },

  getReadableText(element) {
    // Extract readable text from main content, excluding navigation, etc.
    const clone = element.cloneNode(true);

    // Remove non-content elements
    clone.querySelectorAll('nav, .controls-bar, .search-container, .breadcrumbs, .page-nav-buttons, button').forEach(function(el) {
      el.remove();
    });

    return clone.textContent.trim().replace(/\s+/g, ' ');
  },

  announceChange(message) {
    // Create or update live region for screen reader announcements
    let announcer = document.getElementById('a11y-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'a11y-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.position = 'absolute';
      announcer.style.left = '-10000px';
      announcer.style.width = '1px';
      announcer.style.height = '1px';
      announcer.style.overflow = 'hidden';
      document.body.appendChild(announcer);
    }

    announcer.textContent = message;
  }
};

// ====================
// PERFORMANCE OPTIMIZATIONS
// ====================

const PerformanceUtils = {
  // Debounce function
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      const later = function() {
        clearTimeout(timeout);
        func.apply(context, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle: function(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function() { inThrottle = false; }, limit);
      }
    };
  },

  // Lazy load images
  lazyLoadImages: function() {
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(function(img) {
        img.src = img.dataset.src;
      });
    }
  },

  // Add resource hints
  addResourceHints: function() {
    // Preconnect to external domains if needed (currently none)
    // This is a placeholder for future optimization
  }
};

// Apply performance optimizations to search
if (typeof Search !== 'undefined' && Search.handleSearch) {
  const originalHandleSearch = Search.handleSearch;
  Search.handleSearch = PerformanceUtils.debounce(function(query) {
    originalHandleSearch.call(Search, query);
  }, 300);
}

// ====================
// ENHANCED INITIALIZATION
// ====================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize accessibility features
  Accessibility.init();

  // Performance optimizations
  PerformanceUtils.lazyLoadImages();
  PerformanceUtils.addResourceHints();

  // Announce page load to screen readers
  setTimeout(function() {
    Accessibility.announceChange('Page loaded and ready');
  }, 1000);
});
