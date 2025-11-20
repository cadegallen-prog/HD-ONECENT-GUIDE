/**
 * COOKIE CONSENT JAVASCRIPT
 * HD-ONECENT-GUIDE - GDPR Cookie Consent Logic
 * 
 * Handles:
 * - Cookie consent banner display
 * - User preference storage
 * - Settings modal
 * - Cookie policy display
 * - Integration with analytics.js
 */

(function() {
  'use strict';

  // ========================================
  // CONFIGURATION
  // ========================================

  const COOKIE_NAME = 'hd-penny-cookie-consent';
  const ANALYTICS_COOKIE_NAME = 'hd-penny-analytics-consent';
  const COOKIE_EXPIRY_DAYS = 365; // 1 year
  const DEBUG = false;

  // ========================================
  // DOM ELEMENTS
  // ========================================

  let banner = null;
  let settingsModal = null;
  let policyModal = null;
  let analyticsToggle = null;

  // ========================================
  // INITIALIZATION
  // ========================================

  /**
   * Initialize cookie consent on page load
   */
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupCookieConsent);
    } else {
      setupCookieConsent();
    }
  }

  /**
   * Setup cookie consent functionality
   */
  function setupCookieConsent() {
    // Get DOM elements
    banner = document.getElementById('cookie-consent-banner');
    settingsModal = document.getElementById('cookie-settings-modal');
    policyModal = document.getElementById('cookie-policy-details');
    analyticsToggle = document.getElementById('cookie-analytics-toggle');

    if (!banner) {
      console.error('Cookie consent banner not found in DOM');
      return;
    }

    // Check if user has already made a choice
    const consent = getCookie(COOKIE_NAME);

    if (consent) {
      // User has already made a choice, hide banner
      banner.classList.add('hidden');
      if (DEBUG) console.log('Cookie consent already set:', consent);
    } else {
      // Show banner after a short delay
      setTimeout(() => {
        banner.classList.remove('hidden');
      }, 1000);
    }

    // Setup event listeners
    setupEventListeners();

    // Setup settings button in footer (if added)
    addSettingsButtonToFooter();
  }

  // ========================================
  // EVENT LISTENERS
  // ========================================

  /**
   * Setup all event listeners
   */
  function setupEventListeners() {
    // Banner buttons
    document.getElementById('cookie-accept-all')?.addEventListener('click', acceptAllCookies);
    document.getElementById('cookie-accept-necessary')?.addEventListener('click', acceptNecessaryOnly);
    document.getElementById('cookie-settings')?.addEventListener('click', openSettingsModal);

    // Learn more link
    document.getElementById('cookie-learn-more')?.addEventListener('click', function(e) {
      e.preventDefault();
      openPolicyModal();
    });

    // Settings modal buttons
    document.getElementById('cookie-save-settings')?.addEventListener('click', saveSettings);
    document.getElementById('cookie-reject-all')?.addEventListener('click', acceptNecessaryOnly);
    document.getElementById('cookie-modal-close')?.addEventListener('click', closeSettingsModal);

    // Settings modal overlay click
    document.getElementById('cookie-modal-overlay')?.addEventListener('click', closeSettingsModal);

    // Policy modal close buttons
    const policyCloseButtons = document.querySelectorAll('.cookie-policy-close');
    policyCloseButtons.forEach(btn => {
      btn.addEventListener('click', closePolicyModal);
    });

    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (settingsModal && !settingsModal.hasAttribute('hidden')) {
          closeSettingsModal();
        }
        if (policyModal && !policyModal.hasAttribute('hidden')) {
          closePolicyModal();
        }
      }
    });
  }

  // ========================================
  // CONSENT ACTIONS
  // ========================================

  /**
   * Accept all cookies (necessary + analytics)
   */
  function acceptAllCookies() {
    setCookie(COOKIE_NAME, 'all', COOKIE_EXPIRY_DAYS);
    setCookie(ANALYTICS_COOKIE_NAME, 'true', COOKIE_EXPIRY_DAYS);

    if (DEBUG) console.log('User accepted all cookies');

    hideBanner();
    initializeAnalytics();

    // Track consent event (if analytics already loaded)
    if (window.hdPennyAnalytics) {
      window.hdPennyAnalytics.trackEvent('cookie_consent', {
        consent_type: 'all',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Accept necessary cookies only
   */
  function acceptNecessaryOnly() {
    setCookie(COOKIE_NAME, 'necessary', COOKIE_EXPIRY_DAYS);
    setCookie(ANALYTICS_COOKIE_NAME, 'false', COOKIE_EXPIRY_DAYS);

    if (DEBUG) console.log('User accepted necessary cookies only');

    hideBanner();
    closeSettingsModal();

    // Don't initialize analytics
  }

  /**
   * Save custom settings from modal
   */
  function saveSettings() {
    const analyticsEnabled = analyticsToggle?.checked || false;

    if (analyticsEnabled) {
      setCookie(COOKIE_NAME, 'all', COOKIE_EXPIRY_DAYS);
      setCookie(ANALYTICS_COOKIE_NAME, 'true', COOKIE_EXPIRY_DAYS);
      initializeAnalytics();
    } else {
      setCookie(COOKIE_NAME, 'necessary', COOKIE_EXPIRY_DAYS);
      setCookie(ANALYTICS_COOKIE_NAME, 'false', COOKIE_EXPIRY_DAYS);
    }

    if (DEBUG) console.log('User saved custom settings:', { analytics: analyticsEnabled });

    hideBanner();
    closeSettingsModal();

    // Track consent event
    if (window.hdPennyAnalytics && analyticsEnabled) {
      window.hdPennyAnalytics.trackEvent('cookie_consent', {
        consent_type: 'custom',
        analytics_enabled: analyticsEnabled,
        timestamp: new Date().toISOString()
      });
    }
  }

  // ========================================
  // MODAL FUNCTIONS
  // ========================================

  /**
   * Open settings modal
   */
  function openSettingsModal() {
    if (!settingsModal) return;

    // Set toggle state based on current consent
    const analyticsConsent = getCookie(ANALYTICS_COOKIE_NAME);
    if (analyticsToggle) {
      analyticsToggle.checked = (analyticsConsent === 'true');
    }

    settingsModal.removeAttribute('hidden');
    
    // Focus management for accessibility
    const closeButton = document.getElementById('cookie-modal-close');
    if (closeButton) closeButton.focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    if (DEBUG) console.log('Settings modal opened');
  }

  /**
   * Close settings modal
   */
  function closeSettingsModal() {
    if (!settingsModal) return;

    settingsModal.setAttribute('hidden', '');
    
    // Restore body scroll
    document.body.style.overflow = '';

    if (DEBUG) console.log('Settings modal closed');
  }

  /**
   * Open policy modal
   */
  function openPolicyModal() {
    if (!policyModal) return;

    policyModal.removeAttribute('hidden');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    if (DEBUG) console.log('Policy modal opened');
  }

  /**
   * Close policy modal
   */
  function closePolicyModal() {
    if (!policyModal) return;

    policyModal.setAttribute('hidden', '');
    
    // Restore body scroll
    document.body.style.overflow = '';

    if (DEBUG) console.log('Policy modal closed');
  }

  // ========================================
  // UI FUNCTIONS
  // ========================================

  /**
   * Hide consent banner
   */
  function hideBanner() {
    if (banner) {
      banner.classList.add('hidden');
    }
  }

  /**
   * Add settings button to footer for users to change preferences
   */
  function addSettingsButtonToFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    // Check if button already exists
    if (document.getElementById('footer-cookie-settings')) return;

    // Create settings link
    const settingsLink = document.createElement('button');
    settingsLink.id = 'footer-cookie-settings';
    settingsLink.textContent = '🍪 Cookie Settings';
    settingsLink.style.cssText = `
      background: none;
      border: none;
      color: #dee2e6;
      font-size: 0.875rem;
      cursor: pointer;
      padding: 0.5rem 0;
      margin-top: 0.5rem;
      text-decoration: underline;
      font-family: inherit;
    `;
    settingsLink.addEventListener('click', openSettingsModal);

    // Add to footer
    footer.appendChild(settingsLink);

    if (DEBUG) console.log('Cookie settings button added to footer');
  }

  // ========================================
  // COOKIE UTILITIES
  // ========================================

  /**
   * Set a cookie
   * @param {string} name - Cookie name
   * @param {string} value - Cookie value
   * @param {number} days - Expiry in days
   */
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax; Secure`;
    
    if (DEBUG) console.log('Cookie set:', name, '=', value);
  }

  /**
   * Get a cookie value
   * @param {string} name - Cookie name
   * @return {string|null} Cookie value or null
   */
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    
    return null;
  }

  /**
   * Delete a cookie
   * @param {string} name - Cookie name
   */
  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    
    if (DEBUG) console.log('Cookie deleted:', name);
  }

  // ========================================
  // ANALYTICS INTEGRATION
  // ========================================

  /**
   * Initialize analytics if user consented
   */
  function initializeAnalytics() {
    // Analytics initialization happens in analytics.js
    // This function just triggers a page reload or manual init if needed
    
    if (DEBUG) console.log('Triggering analytics initialization');

    // If analytics.js is loaded and has an init function, call it
    if (window.initializeAnalytics && typeof window.initializeAnalytics === 'function') {
      window.initializeAnalytics();
    }
  }

  // ========================================
  // PUBLIC API
  // ========================================

  /**
   * Expose public API for manual control
   */
  window.hdPennyCookieConsent = {
    acceptAll: acceptAllCookies,
    acceptNecessary: acceptNecessaryOnly,
    openSettings: openSettingsModal,
    closeSettings: closeSettingsModal,
    openPolicy: openPolicyModal,
    closePolicy: closePolicyModal,
    hasConsent: function() {
      return getCookie(COOKIE_NAME) !== null;
    },
    hasAnalyticsConsent: function() {
      return getCookie(ANALYTICS_COOKIE_NAME) === 'true';
    },
    revokeConsent: function() {
      deleteCookie(COOKIE_NAME);
      deleteCookie(ANALYTICS_COOKIE_NAME);
      location.reload();
    }
  };

  // ========================================
  // START
  // ========================================

  init();

})();
