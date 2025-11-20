/**
 * ANALYTICS.JS - Google Analytics 4 Event Tracking
 * HD-ONECENT-GUIDE - Home Depot Penny Items Guide
 *
 * SETUP INSTRUCTIONS:
 * 1. Get your GA4 Measurement ID from Google Analytics (format: G-XXXXXXXXXX)
 * 2. Replace 'G-XXXXXXXXXX' below with your actual Measurement ID
 * 3. Add Google Analytics script to <head> of all HTML pages
 * 4. Include this analytics.js file after scripts.js
 * 5. Ensure cookie consent is obtained before initializing (see cookie-consent.html)
 *
 * Privacy Note: Only track with user consent (GDPR compliance)
 */

// ========================================
// CONFIGURATION
// ========================================

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // REPLACE WITH YOUR GA4 MEASUREMENT ID
const DEBUG_MODE = false; // Set to true for console logging

// ========================================
// GOOGLE ANALYTICS 4 INITIALIZATION
// ========================================

/**
 * Initialize Google Analytics 4
 * Call this after user consents to cookies
 */
function initializeAnalytics() {
  // Check if user has consented to analytics
  if (!hasAnalyticsConsent()) {
    if (DEBUG_MODE) console.log('Analytics: User has not consented');
    return;
  }

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true, // Anonymize IP for GDPR compliance
    cookie_flags: 'SameSite=None;Secure',
    send_page_view: true
  });

  if (DEBUG_MODE) console.log('Analytics: Initialized with ID', GA_MEASUREMENT_ID);

  // Setup event tracking after initialization
  setupEventTracking();
}

/**
 * Check if user has consented to analytics cookies
 * Reads from cookie set by cookie consent banner
 */
function hasAnalyticsConsent() {
  const consent = getCookie('hd-penny-analytics-consent');
  return consent === 'true';
}

/**
 * Get cookie value by name
 */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// ========================================
// EVENT TRACKING SETUP
// ========================================

/**
 * Setup all event tracking listeners
 */
function setupEventTracking() {
  trackPageViews();
  trackPDFDownloads();
  trackExternalLinks();
  trackNavigationClicks();
  trackFAQInteractions();
  trackSocialShares();
  trackScrollDepth();
  trackTimeOnPage();
  trackSearchUsage();

  if (DEBUG_MODE) console.log('Analytics: Event tracking setup complete');
}

// ========================================
// PAGE VIEW TRACKING
// ========================================

/**
 * Track page views (automatic with GA4 config)
 * This function logs additional page metadata
 */
function trackPageViews() {
  const pageTitle = document.title;
  const pagePath = window.location.pathname;
  const pageCategory = getPageCategory(pagePath);

  trackEvent('page_view', {
    page_title: pageTitle,
    page_location: window.location.href,
    page_path: pagePath,
    page_category: pageCategory
  });

  if (DEBUG_MODE) console.log('Analytics: Page view tracked', pageTitle);
}

/**
 * Get page category based on path
 */
function getPageCategory(path) {
  if (path === '/' || path.includes('index.html')) return 'home';
  if (path.includes('what-are-pennies')) return 'basics';
  if (path.includes('clearance-lifecycle')) return 'advanced';
  if (path.includes('digital-prehunt')) return 'strategy';
  if (path.includes('in-store-strategy')) return 'strategy';
  if (path.includes('checkout-strategy')) return 'strategy';
  if (path.includes('internal-systems')) return 'advanced';
  if (path.includes('facts-vs-myths')) return 'information';
  if (path.includes('responsible-hunting')) return 'ethics';
  if (path.includes('faq')) return 'support';
  if (path.includes('about')) return 'about';
  return 'other';
}

// ========================================
// PDF DOWNLOAD TRACKING
// ========================================

/**
 * Track PDF guide downloads
 */
function trackPDFDownloads() {
  const pdfLinks = document.querySelectorAll('a[href$=".pdf"]');

  pdfLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const fileName = this.getAttribute('href');

      trackEvent('file_download', {
        file_name: fileName,
        file_type: 'pdf',
        link_text: this.textContent.trim(),
        link_url: this.href
      });

      if (DEBUG_MODE) console.log('Analytics: PDF download tracked', fileName);
    });
  });
}

// ========================================
// EXTERNAL LINK TRACKING
// ========================================

/**
 * Track clicks on external links
 */
function trackExternalLinks() {
  const externalLinks = document.querySelectorAll('a[href^="http"]');

  externalLinks.forEach(link => {
    // Skip if it's an internal link
    if (link.hostname === window.location.hostname) return;

    link.addEventListener('click', function(e) {
      const destination = this.href;
      const linkText = this.textContent.trim();

      trackEvent('click', {
        link_type: 'external',
        link_url: destination,
        link_text: linkText,
        outbound: true
      });

      if (DEBUG_MODE) console.log('Analytics: External link clicked', destination);
    });
  });
}

// ========================================
// NAVIGATION TRACKING
// ========================================

/**
 * Track navigation menu clicks
 */
function trackNavigationClicks() {
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const destination = this.getAttribute('href');
      const linkText = this.textContent.trim();

      trackEvent('navigation_click', {
        link_text: linkText,
        destination_page: destination,
        from_page: window.location.pathname
      });

      if (DEBUG_MODE) console.log('Analytics: Navigation click', linkText);
    });
  });
}

// ========================================
// FAQ ACCORDION TRACKING
// ========================================

/**
 * Track FAQ accordion interactions
 */
function trackFAQInteractions() {
  // Only run on FAQ page
  if (!window.location.pathname.includes('faq')) return;

  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((question, index) => {
    question.addEventListener('click', function() {
      const questionText = this.textContent.trim();
      const isExpanding = !this.parentElement.classList.contains('active');

      trackEvent('faq_interaction', {
        question: questionText,
        question_number: index + 1,
        action: isExpanding ? 'expand' : 'collapse'
      });

      if (DEBUG_MODE) console.log('Analytics: FAQ interaction', questionText);
    });
  });
}

// ========================================
// SOCIAL SHARE TRACKING
// ========================================

/**
 * Track social media share button clicks
 */
function trackSocialShares() {
  const shareButtons = document.querySelectorAll('[data-share-platform]');

  shareButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const platform = this.getAttribute('data-share-platform');
      const pageTitle = document.title;
      const pageUrl = window.location.href;

      trackEvent('share', {
        method: platform,
        content_type: 'page',
        item_id: pageUrl,
        page_title: pageTitle
      });

      if (DEBUG_MODE) console.log('Analytics: Social share', platform);
    });
  });
}

// ========================================
// SCROLL DEPTH TRACKING
// ========================================

/**
 * Track how far users scroll down the page
 */
function trackScrollDepth() {
  const thresholds = [25, 50, 75, 90, 100];
  const tracked = new Set();
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollPercentage = Math.round(
          ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100
        );

        thresholds.forEach(threshold => {
          if (scrollPercentage >= threshold && !tracked.has(threshold)) {
            tracked.add(threshold);

            trackEvent('scroll', {
              percent_scrolled: threshold,
              page_title: document.title
            });

            if (DEBUG_MODE) console.log('Analytics: Scroll depth', threshold + '%');
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll);
}

// ========================================
// TIME ON PAGE TRACKING
// ========================================

/**
 * Track time spent on page
 */
function trackTimeOnPage() {
  const startTime = Date.now();

  // Track time on page when user leaves
  window.addEventListener('beforeunload', function() {
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds

    trackEvent('timing_complete', {
      name: 'page_view_duration',
      value: timeSpent,
      page_title: document.title
    });

    if (DEBUG_MODE) console.log('Analytics: Time on page', timeSpent + 's');
  });

  // Also track engagement at intervals
  const intervals = [30, 60, 120, 300]; // 30s, 1m, 2m, 5m
  intervals.forEach(interval => {
    setTimeout(() => {
      trackEvent('user_engagement', {
        engagement_time_msec: interval * 1000,
        page_title: document.title
      });

      if (DEBUG_MODE) console.log('Analytics: User engaged for', interval + 's');
    }, interval * 1000);
  });
}

// ========================================
// SEARCH TRACKING
// ========================================

/**
 * Track site search usage (if search functionality added)
 */
function trackSearchUsage() {
  // Get search input element (update selector if search is added)
  const searchInput = document.querySelector('input[type="search"]');

  if (!searchInput) return;

  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const searchTerm = this.value.trim();

      if (searchTerm) {
        trackEvent('search', {
          search_term: searchTerm,
          page_location: window.location.pathname
        });

        if (DEBUG_MODE) console.log('Analytics: Search performed', searchTerm);
      }
    }
  });
}

// ========================================
// CUSTOM EVENT TRACKING
// ========================================

/**
 * Generic function to track custom events
 * @param {string} eventName - Name of the event
 * @param {object} eventParams - Event parameters
 */
function trackEvent(eventName, eventParams = {}) {
  if (!window.gtag) {
    if (DEBUG_MODE) console.warn('Analytics: gtag not initialized');
    return;
  }

  window.gtag('event', eventName, eventParams);

  if (DEBUG_MODE) {
    console.log('Analytics: Event tracked', eventName, eventParams);
  }
}

// ========================================
// USER PROPERTIES
// ========================================

/**
 * Set user properties for segmentation
 */
function setUserProperties() {
  if (!window.gtag) return;

  const properties = {
    user_type: isReturningVisitor() ? 'returning' : 'new',
    device_type: getDeviceType(),
    preferred_theme: 'light' // Can be dynamic if dark mode added
  };

  window.gtag('set', 'user_properties', properties);

  if (DEBUG_MODE) console.log('Analytics: User properties set', properties);
}

/**
 * Check if user is a returning visitor
 */
function isReturningVisitor() {
  const visited = getCookie('hd-penny-visited');
  if (!visited) {
    // Set cookie for 1 year
    document.cookie = 'hd-penny-visited=true; max-age=31536000; path=/; SameSite=Lax';
    return false;
  }
  return true;
}

/**
 * Get device type
 */
function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize analytics when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initializeAnalytics();
    setUserProperties();
  });
} else {
  initializeAnalytics();
  setUserProperties();
}

// ========================================
// EXPORT FOR MANUAL TRACKING
// ========================================

// Make trackEvent available globally for manual tracking
window.hdPennyAnalytics = {
  trackEvent: trackEvent,
  hasConsent: hasAnalyticsConsent
};
