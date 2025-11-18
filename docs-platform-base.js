/* ============================================================================
   DOCUMENTATION PLATFORM - BASE JAVASCRIPT
   Theme toggle, font controls, mobile menu, smooth scrolling, and more
   ============================================================================ */

(function() {
  'use strict';

  /* ========================================================================
     CONSTANTS & CONFIGURATION
     ======================================================================== */

  const CONFIG = {
    THEME_KEY: 'docs-theme',
    FONT_SIZE_KEY: 'docs-font-size',
    THEME_LIGHT: 'light',
    THEME_DARK: 'dark',
    FONT_SMALL: 'font-small',
    FONT_MEDIUM: 'font-medium',
    FONT_LARGE: 'font-large',
    MOBILE_BREAKPOINT: 768
  };

  /* ========================================================================
     STATE MANAGEMENT
     ======================================================================== */

  const state = {
    currentTheme: CONFIG.THEME_DARK,
    currentFontSize: CONFIG.FONT_MEDIUM,
    isMobileMenuOpen: false,
    scrollPosition: 0
  };

  /* ========================================================================
     DOM ELEMENTS CACHE
     ======================================================================== */

  const elements = {
    body: document.body,
    html: document.documentElement,
    themeToggle: null,
    fontSmallBtn: null,
    fontMediumBtn: null,
    fontLargeBtn: null,
    resetBtn: null,
    mobileMenuToggle: null,
    navMain: null,
    readingProgress: null
  };

  /* ========================================================================
     INITIALIZATION
     ======================================================================== */

  function init() {
    cacheElements();
    loadSavedPreferences();
    setupEventListeners();
    setupSmoothScrolling();
    setupReadingProgress();
    setupActiveNavHighlight();

    console.log('📚 Documentation Platform initialized');
  }

  function cacheElements() {
    elements.themeToggle = document.getElementById('theme-toggle');
    elements.fontSmallBtn = document.getElementById('font-small');
    elements.fontMediumBtn = document.getElementById('font-medium');
    elements.fontLargeBtn = document.getElementById('font-large');
    elements.resetBtn = document.getElementById('reset-prefs');
    elements.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    elements.navMain = document.querySelector('.nav-main');
    elements.readingProgress = document.querySelector('.reading-progress');
  }

  /* ========================================================================
     THEME MANAGEMENT
     ======================================================================== */

  function loadSavedPreferences() {
    // Load theme preference
    const savedTheme = localStorage.getItem(CONFIG.THEME_KEY);
    if (savedTheme) {
      state.currentTheme = savedTheme;
      applyTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      state.currentTheme = prefersDark ? CONFIG.THEME_DARK : CONFIG.THEME_LIGHT;
      applyTheme(state.currentTheme);
    }

    // Load font size preference
    const savedFontSize = localStorage.getItem(CONFIG.FONT_SIZE_KEY);
    if (savedFontSize) {
      state.currentFontSize = savedFontSize;
      applyFontSize(savedFontSize);
    }

    updateFontButtons();
  }

  function applyTheme(theme) {
    if (theme === CONFIG.THEME_LIGHT) {
      elements.html.setAttribute('data-theme', 'light');
      state.currentTheme = CONFIG.THEME_LIGHT;
    } else {
      elements.html.removeAttribute('data-theme');
      state.currentTheme = CONFIG.THEME_DARK;
    }

    // Update theme toggle button icon
    if (elements.themeToggle) {
      const icon = elements.themeToggle.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === CONFIG.THEME_LIGHT ? '🌙' : '☀️';
      }
    }
  }

  function toggleTheme() {
    const newTheme = state.currentTheme === CONFIG.THEME_DARK
      ? CONFIG.THEME_LIGHT
      : CONFIG.THEME_DARK;

    applyTheme(newTheme);
    localStorage.setItem(CONFIG.THEME_KEY, newTheme);

    // Add subtle animation feedback
    elements.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }

  /* ========================================================================
     FONT SIZE MANAGEMENT
     ======================================================================== */

  function applyFontSize(size) {
    // Remove all font size classes
    elements.body.classList.remove(CONFIG.FONT_SMALL, CONFIG.FONT_MEDIUM, CONFIG.FONT_LARGE);

    // Apply new font size class
    elements.body.classList.add(size);
    state.currentFontSize = size;

    updateFontButtons();
  }

  function updateFontButtons() {
    // Remove active state from all font buttons
    [elements.fontSmallBtn, elements.fontMediumBtn, elements.fontLargeBtn].forEach(btn => {
      if (btn) btn.classList.remove('active');
    });

    // Add active state to current size button
    if (state.currentFontSize === CONFIG.FONT_SMALL && elements.fontSmallBtn) {
      elements.fontSmallBtn.classList.add('active');
    } else if (state.currentFontSize === CONFIG.FONT_MEDIUM && elements.fontMediumBtn) {
      elements.fontMediumBtn.classList.add('active');
    } else if (state.currentFontSize === CONFIG.FONT_LARGE && elements.fontLargeBtn) {
      elements.fontLargeBtn.classList.add('active');
    }
  }

  function setFontSize(size) {
    applyFontSize(size);
    localStorage.setItem(CONFIG.FONT_SIZE_KEY, size);
  }

  /* ========================================================================
     RESET PREFERENCES
     ======================================================================== */

  function resetPreferences() {
    // Clear localStorage
    localStorage.removeItem(CONFIG.THEME_KEY);
    localStorage.removeItem(CONFIG.FONT_SIZE_KEY);

    // Reset to defaults
    applyTheme(CONFIG.THEME_DARK);
    applyFontSize(CONFIG.FONT_MEDIUM);

    // Visual feedback
    showNotification('Preferences reset to defaults');
  }

  /* ========================================================================
     MOBILE MENU
     ======================================================================== */

  function toggleMobileMenu() {
    state.isMobileMenuOpen = !state.isMobileMenuOpen;

    if (elements.navMain) {
      if (state.isMobileMenuOpen) {
        elements.navMain.classList.add('active');
        elements.mobileMenuToggle.innerHTML = '✕';
        // Prevent body scroll when menu is open
        elements.body.style.overflow = 'hidden';
      } else {
        elements.navMain.classList.remove('active');
        elements.mobileMenuToggle.innerHTML = '☰';
        elements.body.style.overflow = '';
      }
    }
  }

  function closeMobileMenu() {
    if (state.isMobileMenuOpen) {
      state.isMobileMenuOpen = false;
      if (elements.navMain) {
        elements.navMain.classList.remove('active');
      }
      if (elements.mobileMenuToggle) {
        elements.mobileMenuToggle.innerHTML = '☰';
      }
      elements.body.style.overflow = '';
    }
  }

  /* ========================================================================
     SMOOTH SCROLLING
     ======================================================================== */

  function setupSmoothScrolling() {
    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');

        // Skip if it's just "#"
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          e.preventDefault();

          // Close mobile menu if open
          closeMobileMenu();

          // Calculate offset for sticky header
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  /* ========================================================================
     READING PROGRESS BAR
     ======================================================================== */

  function setupReadingProgress() {
    if (!elements.readingProgress) return;

    window.addEventListener('scroll', updateReadingProgress);
    updateReadingProgress(); // Initial update
  }

  function updateReadingProgress() {
    if (!elements.readingProgress) return;

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    const totalScroll = documentHeight - windowHeight;
    const currentProgress = (scrollTop / totalScroll) * 100;

    elements.readingProgress.style.width = `${Math.min(currentProgress, 100)}%`;
  }

  /* ========================================================================
     ACTIVE NAVIGATION HIGHLIGHT
     ======================================================================== */

  function setupActiveNavHighlight() {
    // Highlight current page in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-item a, .sidebar-nav a');

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;

      if (linkPath === currentPath) {
        link.classList.add('active');
      }
    });

    // Intersection Observer for section-based highlighting (if on docs page)
    setupScrollSpy();
  }

  function setupScrollSpy() {
    const sections = document.querySelectorAll('main section[id], main article[id]');
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -75% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');

          // Remove active from all sidebar links
          navLinks.forEach(link => link.classList.remove('active'));

          // Add active to corresponding link
          const activeLink = document.querySelector(`.sidebar-nav a[href="#${id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }

  /* ========================================================================
     EVENT LISTENERS
     ======================================================================== */

  function setupEventListeners() {
    // Theme toggle
    if (elements.themeToggle) {
      elements.themeToggle.addEventListener('click', toggleTheme);
    }

    // Font size controls
    if (elements.fontSmallBtn) {
      elements.fontSmallBtn.addEventListener('click', () => setFontSize(CONFIG.FONT_SMALL));
    }
    if (elements.fontMediumBtn) {
      elements.fontMediumBtn.addEventListener('click', () => setFontSize(CONFIG.FONT_MEDIUM));
    }
    if (elements.fontLargeBtn) {
      elements.fontLargeBtn.addEventListener('click', () => setFontSize(CONFIG.FONT_LARGE));
    }

    // Reset preferences
    if (elements.resetBtn) {
      elements.resetBtn.addEventListener('click', resetPreferences);
    }

    // Mobile menu toggle
    if (elements.mobileMenuToggle) {
      elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking nav links
    if (elements.navMain) {
      const navLinks = elements.navMain.querySelectorAll('.nav-item a');
      navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });
    }

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isMobileMenuOpen) {
        closeMobileMenu();
      }
    });

    // Close mobile menu when resizing above mobile breakpoint
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > CONFIG.MOBILE_BREAKPOINT) {
        closeMobileMenu();
      }
    }, 250));

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem(CONFIG.THEME_KEY)) {
        applyTheme(e.matches ? CONFIG.THEME_DARK : CONFIG.THEME_LIGHT);
      }
    });
  }

  /* ========================================================================
     UTILITY FUNCTIONS
     ======================================================================== */

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function showNotification(message, duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--bg-elevated);
      color: var(--text-primary);
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--border-moderate);
      z-index: 9999;
      animation: slideInUp 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Remove after duration
    setTimeout(() => {
      notification.style.animation = 'slideOutDown 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  /* ========================================================================
     MODAL MANAGEMENT (if modals exist on page)
     ======================================================================== */

  function setupModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-trigger');
        const modal = document.getElementById(modalId);

        if (modal) {
          openModal(modal);
        }
      });
    });

    modalOverlays.forEach(overlay => {
      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal(overlay);
        }
      });

      // Close on close button click
      const closeBtn = overlay.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(overlay));
      }
    });

    // Close modals on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
          closeModal(activeModal);
        }
      }
    });
  }

  function openModal(modal) {
    modal.classList.add('active');
    elements.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    elements.body.style.overflow = '';
  }

  /* ========================================================================
     SEARCH FUNCTIONALITY (if search exists)
     ======================================================================== */

  function setupSearch() {
    const searchBtn = document.getElementById('search-btn');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchModal && searchInput) {
      searchBtn.addEventListener('click', () => {
        openModal(searchModal);
        // Focus search input after modal opens
        setTimeout(() => searchInput.focus(), 100);
      });

      // Quick keyboard shortcut: Cmd/Ctrl + K
      document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          openModal(searchModal);
          setTimeout(() => searchInput.focus(), 100);
        }
      });
    }
  }

  /* ========================================================================
     COPY CODE BUTTON (for code blocks)
     ======================================================================== */

  function setupCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach(codeBlock => {
      const pre = codeBlock.parentElement;

      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'code-copy-btn';
      copyButton.innerHTML = '📋';
      copyButton.setAttribute('aria-label', 'Copy code');
      copyButton.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: var(--bg-tertiary);
        border: 1px solid var(--border-moderate);
        border-radius: 6px;
        padding: 6px 10px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
        font-size: 14px;
      `;

      pre.style.position = 'relative';

      // Show button on hover
      pre.addEventListener('mouseenter', () => {
        copyButton.style.opacity = '1';
      });

      pre.addEventListener('mouseleave', () => {
        copyButton.style.opacity = '0';
      });

      // Copy functionality
      copyButton.addEventListener('click', async () => {
        const code = codeBlock.textContent;

        try {
          await navigator.clipboard.writeText(code);
          copyButton.innerHTML = '✓';
          setTimeout(() => {
            copyButton.innerHTML = '📋';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy code:', err);
        }
      });

      pre.appendChild(copyButton);
    });
  }

  /* ========================================================================
     TABLE OF CONTENTS GENERATOR (if needed)
     ======================================================================== */

  function generateTableOfContents() {
    const tocContainer = document.getElementById('table-of-contents');
    if (!tocContainer) return;

    const headings = document.querySelectorAll('.content h2, .content h3');
    if (headings.length === 0) return;

    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    headings.forEach((heading, index) => {
      // Add ID if doesn't exist
      if (!heading.id) {
        heading.id = `section-${index}`;
      }

      const li = document.createElement('li');
      li.className = heading.tagName === 'H2' ? 'toc-item-h2' : 'toc-item-h3';

      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;

      li.appendChild(link);
      tocList.appendChild(li);
    });

    tocContainer.appendChild(tocList);
  }

  /* ========================================================================
     BOOTSTRAP APPLICATION
     ======================================================================== */

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      setupModals();
      setupSearch();
      setupCodeCopyButtons();
      generateTableOfContents();
    });
  } else {
    init();
    setupModals();
    setupSearch();
    setupCodeCopyButtons();
    generateTableOfContents();
  }

  // Add additional CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes slideOutDown {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(100%);
        opacity: 0;
      }
    }

    .code-copy-btn:hover {
      background: var(--bg-elevated) !important;
    }
  `;
  document.head.appendChild(style);

})();
