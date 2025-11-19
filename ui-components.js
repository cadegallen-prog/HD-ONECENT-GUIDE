/**
 * UI Components for HD Penny Guide
 * Features:
 * - Breadcrumb navigation
 * - Suggested next pages
 * - Tooltip system
 * - Modal system
 * - Toast notifications
 * - Loading states
 * - Error states
 */

(function() {
  'use strict';

  // ========== BREADCRUMB NAVIGATION ==========

  const breadcrumbConfig = {
    'index.html': [],
    'what-are-pennies.html': ['Home'],
    'clearance-lifecycle.html': ['Home', 'What Are Pennies?'],
    'digital-prehunt.html': ['Home', 'Strategy'],
    'in-store-strategy.html': ['Home', 'Strategy'],
    'checkout-strategy.html': ['Home', 'Strategy'],
    'internal-systems.html': ['Home', 'Advanced'],
    'facts-vs-myths.html': ['Home', 'Knowledge'],
    'responsible-hunting.html': ['Home', 'Ethics'],
    'faq.html': ['Home'],
    'resources.html': ['Home'],
    'quick-start.html': ['Home'],
    'about.html': ['Home'],
    'learning-paths.html': ['Home'],
    'quizzes.html': ['Home', 'Learning'],
    'updates.html': ['Home']
  };

  function initBreadcrumbs() {
    const breadcrumbContainer = document.getElementById('breadcrumb-nav');
    if (!breadcrumbContainer) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const breadcrumbs = breadcrumbConfig[currentPage] || [];
    const currentTitle = document.querySelector('h1')?.textContent || 'Page';

    if (breadcrumbs.length === 0) {
      breadcrumbContainer.style.display = 'none';
      return;
    }

    const breadcrumbHTML = `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol class="breadcrumb-list">
          ${breadcrumbs.map(crumb => `
            <li class="breadcrumb-item">
              <a href="${getPageUrl(crumb)}">${crumb}</a>
            </li>
          `).join('')}
          <li class="breadcrumb-item active" aria-current="page">
            ${currentTitle}
          </li>
        </ol>
      </nav>
    `;

    breadcrumbContainer.innerHTML = breadcrumbHTML;
  }

  function getPageUrl(pageName) {
    const urlMap = {
      'Home': 'index.html',
      'What Are Pennies?': 'what-are-pennies.html',
      'Strategy': 'in-store-strategy.html',
      'Advanced': 'internal-systems.html',
      'Knowledge': 'facts-vs-myths.html',
      'Ethics': 'responsible-hunting.html',
      'Learning': 'learning-paths.html'
    };
    return urlMap[pageName] || 'index.html';
  }

  // ========== SUGGESTED NEXT PAGES ==========

  const pageSequence = [
    'index.html',
    'what-are-pennies.html',
    'clearance-lifecycle.html',
    'digital-prehunt.html',
    'in-store-strategy.html',
    'checkout-strategy.html',
    'internal-systems.html',
    'facts-vs-myths.html',
    'responsible-hunting.html',
    'faq.html'
  ];

  const pageTitles = {
    'index.html': 'Home',
    'what-are-pennies.html': 'What Are Pennies?',
    'clearance-lifecycle.html': 'Clearance Lifecycle',
    'digital-prehunt.html': 'Digital Pre-Hunt',
    'in-store-strategy.html': 'In-Store Strategy',
    'checkout-strategy.html': 'Checkout Strategy',
    'internal-systems.html': 'Internal Systems',
    'facts-vs-myths.html': 'Facts vs Myths',
    'responsible-hunting.html': 'Responsible Hunting',
    'faq.html': 'FAQ',
    'resources.html': 'Resources',
    'quick-start.html': 'Quick Start',
    'about.html': 'About',
    'learning-paths.html': 'Learning Paths',
    'quizzes.html': 'Quizzes'
  };

  const pageDescriptions = {
    'what-are-pennies.html': 'Learn what penny items are and why they exist',
    'clearance-lifecycle.html': 'Understand the markdown process and price patterns',
    'digital-prehunt.html': 'Use digital tools to scout before visiting stores',
    'in-store-strategy.html': 'Master in-store hunting tactics and timing',
    'checkout-strategy.html': 'Navigate the checkout process successfully',
    'internal-systems.html': 'Understand Home Depot\'s inventory systems',
    'facts-vs-myths.html': 'Debunk common penny hunting myths',
    'responsible-hunting.html': 'Practice ethical and respectful hunting',
    'faq.html': 'Find answers to common questions',
    'quizzes.html': 'Test your knowledge and earn XP'
  };

  function initSuggestedPages() {
    const suggestedContainer = document.getElementById('suggested-next');
    if (!suggestedContainer) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentIndex = pageSequence.indexOf(currentPage);

    let suggestedPages = [];

    if (currentIndex !== -1 && currentIndex < pageSequence.length - 1) {
      // Suggest next in sequence
      suggestedPages.push(pageSequence[currentIndex + 1]);
    } else {
      // Suggest learning paths and quizzes
      if (currentPage !== 'learning-paths.html') {
        suggestedPages.push('learning-paths.html');
      }
      if (currentPage !== 'quizzes.html') {
        suggestedPages.push('quizzes.html');
      }
    }

    if (suggestedPages.length === 0) {
      suggestedContainer.style.display = 'none';
      return;
    }

    const suggestedHTML = `
      <div class="suggested-pages">
        <h3>Continue Learning</h3>
        <div class="suggested-list">
          ${suggestedPages.map(page => `
            <a href="${page}" class="suggested-card">
              <div class="suggested-title">${pageTitles[page]}</div>
              <div class="suggested-description">${pageDescriptions[page] || 'Learn more'}</div>
              <div class="suggested-arrow">→</div>
            </a>
          `).join('')}
        </div>
      </div>
    `;

    suggestedContainer.innerHTML = suggestedHTML;
  }

  // ========== TOOLTIP SYSTEM ==========

  let activeTooltip = null;

  function initTooltips() {
    // Find all elements with data-tooltip attribute
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      // Desktop: hover
      element.addEventListener('mouseenter', showTooltip);
      element.addEventListener('mouseleave', hideTooltip);

      // Mobile: tap
      element.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          toggleTooltip(element);
        }
      });
    });

    // Close tooltip when clicking outside
    document.addEventListener('click', (e) => {
      if (activeTooltip && !e.target.hasAttribute('data-tooltip')) {
        hideTooltip();
      }
    });
  }

  function showTooltip(e) {
    const element = e.currentTarget;
    const text = element.getAttribute('data-tooltip');
    const position = element.getAttribute('data-tooltip-position') || 'top';

    hideTooltip(); // Hide any existing tooltip

    const tooltip = document.createElement('div');
    tooltip.className = `tooltip tooltip-${position}`;
    tooltip.textContent = text;
    document.body.appendChild(tooltip);

    // Position tooltip
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top, left;

    switch (position) {
      case 'top':
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + (rect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.left - tooltipRect.width - 8;
        break;
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2;
        left = rect.right + 8;
        break;
    }

    // Keep tooltip on screen
    top = Math.max(8, Math.min(top, window.innerHeight - tooltipRect.height - 8));
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8));

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;

    activeTooltip = tooltip;
    setTimeout(() => tooltip.classList.add('visible'), 10);
  }

  function hideTooltip() {
    if (activeTooltip) {
      activeTooltip.classList.remove('visible');
      setTimeout(() => {
        if (activeTooltip && activeTooltip.parentNode) {
          activeTooltip.parentNode.removeChild(activeTooltip);
        }
        activeTooltip = null;
      }, 200);
    }
  }

  function toggleTooltip(element) {
    if (activeTooltip) {
      hideTooltip();
    } else {
      showTooltip({ currentTarget: element });
    }
  }

  // ========== MODAL SYSTEM ==========

  let activeModal = null;
  let previousFocus = null;

  const Modal = {
    open: function(options) {
      const {
        title = '',
        content = '',
        type = 'info', // 'info', 'confirm', 'custom'
        confirmText = 'OK',
        cancelText = 'Cancel',
        onConfirm = null,
        onCancel = null,
        className = ''
      } = options;

      // Close existing modal
      this.close();

      // Save current focus
      previousFocus = document.activeElement;

      // Create modal
      const modal = document.createElement('div');
      modal.className = `modal-overlay ${className}`;
      modal.innerHTML = `
        <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="modal-content">
            ${title ? `<div class="modal-header">
              <h3 id="modal-title">${title}</h3>
              <button class="modal-close" aria-label="Close">&times;</button>
            </div>` : ''}
            <div class="modal-body">
              ${content}
            </div>
            <div class="modal-footer">
              ${type === 'confirm' ? `
                <button class="btn-secondary modal-cancel">${cancelText}</button>
                <button class="btn-primary modal-confirm">${confirmText}</button>
              ` : `
                <button class="btn-primary modal-confirm">${confirmText}</button>
              `}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';

      // Event listeners
      const closeBtn = modal.querySelector('.modal-close');
      const confirmBtn = modal.querySelector('.modal-confirm');
      const cancelBtn = modal.querySelector('.modal-cancel');

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          if (onCancel) onCancel();
          this.close();
        });
      }

      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          if (onConfirm) onConfirm();
          this.close();
        });
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          if (onCancel) onCancel();
          this.close();
        });
      }

      // Close on overlay click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          if (onCancel) onCancel();
          this.close();
        }
      });

      // Close on ESC
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          if (onCancel) onCancel();
          this.close();
        }
      };
      document.addEventListener('keydown', escHandler);
      modal.escHandler = escHandler;

      // Show modal
      activeModal = modal;
      setTimeout(() => modal.classList.add('active'), 10);

      // Focus first button
      confirmBtn.focus();

      return modal;
    },

    close: function() {
      if (activeModal) {
        activeModal.classList.remove('active');
        document.body.style.overflow = '';

        // Remove ESC handler
        if (activeModal.escHandler) {
          document.removeEventListener('keydown', activeModal.escHandler);
        }

        setTimeout(() => {
          if (activeModal && activeModal.parentNode) {
            activeModal.parentNode.removeChild(activeModal);
          }
          activeModal = null;

          // Restore focus
          if (previousFocus) {
            previousFocus.focus();
            previousFocus = null;
          }
        }, 200);
      }
    }
  };

  // ========== TOAST NOTIFICATIONS ==========

  const toastQueue = [];
  let toastContainer = null;

  const Toast = {
    show: function(message, type = 'info', duration = 3000) {
      // Create container if it doesn't exist
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
      }

      // Create toast
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <div class="toast-content">
          <span class="toast-icon">${this.getIcon(type)}</span>
          <span class="toast-message">${message}</span>
        </div>
        <button class="toast-close" aria-label="Close">&times;</button>
      `;

      toastContainer.appendChild(toast);

      // Close button
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => this.hide(toast));

      // Show toast
      setTimeout(() => toast.classList.add('visible'), 10);

      // Auto-hide
      if (duration > 0) {
        setTimeout(() => this.hide(toast), duration);
      }

      return toast;
    },

    hide: function(toast) {
      toast.classList.remove('visible');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    },

    getIcon: function(type) {
      const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
      };
      return icons[type] || icons.info;
    },

    success: function(message, duration) {
      return this.show(message, 'success', duration);
    },

    error: function(message, duration) {
      return this.show(message, 'error', duration);
    },

    warning: function(message, duration) {
      return this.show(message, 'warning', duration);
    },

    info: function(message, duration) {
      return this.show(message, 'info', duration);
    }
  };

  // ========== LOADING STATES ==========

  const Loading = {
    show: function(target, text = 'Loading...') {
      if (typeof target === 'string') {
        target = document.querySelector(target);
      }

      if (!target) return;

      target.classList.add('loading');
      target.setAttribute('aria-busy', 'true');

      const spinner = document.createElement('div');
      spinner.className = 'loading-spinner';
      spinner.innerHTML = `
        <div class="spinner"></div>
        ${text ? `<div class="loading-text">${text}</div>` : ''}
      `;

      target.appendChild(spinner);
    },

    hide: function(target) {
      if (typeof target === 'string') {
        target = document.querySelector(target);
      }

      if (!target) return;

      target.classList.remove('loading');
      target.removeAttribute('aria-busy');

      const spinner = target.querySelector('.loading-spinner');
      if (spinner) {
        spinner.remove();
      }
    },

    overlay: function(show = true, text = 'Loading...') {
      let overlay = document.getElementById('loading-overlay');

      if (show) {
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.id = 'loading-overlay';
          overlay.className = 'loading-overlay';
          overlay.innerHTML = `
            <div class="loading-content">
              <div class="spinner"></div>
              <div class="loading-text">${text}</div>
            </div>
          `;
          document.body.appendChild(overlay);
        }
        setTimeout(() => overlay.classList.add('active'), 10);
      } else {
        if (overlay) {
          overlay.classList.remove('active');
          setTimeout(() => {
            if (overlay.parentNode) {
              overlay.parentNode.removeChild(overlay);
            }
          }, 300);
        }
      }
    }
  };

  // ========== ERROR STATES ==========

  const ErrorState = {
    show: function(target, options = {}) {
      if (typeof target === 'string') {
        target = document.querySelector(target);
      }

      if (!target) return;

      const {
        icon = '⚠️',
        title = 'Oops!',
        message = 'Something went wrong',
        actionText = 'Retry',
        onAction = null
      } = options;

      const errorHTML = `
        <div class="error-state">
          <div class="error-icon">${icon}</div>
          <h3 class="error-title">${title}</h3>
          <p class="error-message">${message}</p>
          ${actionText && onAction ? `
            <button class="btn-primary error-action">${actionText}</button>
          ` : ''}
        </div>
      `;

      target.innerHTML = errorHTML;

      if (onAction) {
        const actionBtn = target.querySelector('.error-action');
        if (actionBtn) {
          actionBtn.addEventListener('click', onAction);
        }
      }
    },

    notFound: function(target) {
      this.show(target, {
        icon: '🔍',
        title: 'Not Found',
        message: 'The page or resource you\'re looking for doesn\'t exist.',
        actionText: 'Go Home',
        onAction: () => window.location.href = 'index.html'
      });
    },

    noResults: function(target) {
      this.show(target, {
        icon: '🔎',
        title: 'No Results',
        message: 'We couldn\'t find what you\'re looking for.',
        actionText: null
      });
    }
  };

  // ========== INITIALIZATION ==========

  function initUIComponents() {
    // Initialize all components
    initBreadcrumbs();
    initSuggestedPages();
    initTooltips();

    console.log('✅ UI Components initialized');
  }

  // ========== EXPOSE PUBLIC API ==========

  window.UIComponents = {
    initBreadcrumbs,
    initSuggestedPages,
    initTooltips,
    Modal,
    Toast,
    Loading,
    ErrorState
  };

  window.initUIComponents = initUIComponents;

})();
