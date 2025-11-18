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

  // Setup reset progress button
  const resetBtn = document.querySelector('.reset-progress-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => ProgressTracker.resetProgress());
  }
});
