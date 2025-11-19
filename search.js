/**
 * Advanced Search System for HD Penny Guide
 * Features:
 * - Keyboard shortcuts (Ctrl+K, Cmd+K, /)
 * - Fuzzy search with relevance scoring
 * - Recent searches (localStorage)
 * - Keyboard navigation
 * - Mobile-friendly
 */

(function() {
  'use strict';

  // State
  let searchIndex = [];
  let recentSearches = [];
  let currentResults = [];
  let selectedIndex = 0;
  let searchModal = null;
  let searchInput = null;
  let resultsContainer = null;
  let debounceTimer = null;
  const MAX_RECENT = 5;
  const MAX_RESULTS = 10;
  const DEBOUNCE_MS = 200;
  const RECENT_SEARCHES_KEY = 'hdPennyGuide_recentSearches';

  // Initialize search system
  async function initSearch() {
    try {
      // Load search index
      await loadSearchIndex();

      // Load recent searches from localStorage
      loadRecentSearches();

      // Create search modal
      createSearchModal();

      // Setup event listeners
      setupKeyboardShortcuts();
      setupModalListeners();

      console.log('✅ Search system initialized');
    } catch (error) {
      console.error('❌ Failed to initialize search:', error);
    }
  }

  // Load search index from JSON
  async function loadSearchIndex() {
    try {
      const response = await fetch('search-index.json');
      if (!response.ok) {
        throw new Error('Failed to load search index');
      }
      searchIndex = await response.json();
    } catch (error) {
      console.error('Error loading search index:', error);
      // Fallback to empty index
      searchIndex = [];
    }
  }

  // Load recent searches from localStorage
  function loadRecentSearches() {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      recentSearches = stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading recent searches:', error);
      recentSearches = [];
    }
  }

  // Save recent searches to localStorage
  function saveRecentSearches() {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  }

  // Add search to recent searches
  function addRecentSearch(query) {
    if (!query || query.trim().length === 0) return;

    // Remove if already exists
    recentSearches = recentSearches.filter(s => s !== query);

    // Add to beginning
    recentSearches.unshift(query);

    // Keep only MAX_RECENT
    if (recentSearches.length > MAX_RECENT) {
      recentSearches = recentSearches.slice(0, MAX_RECENT);
    }

    saveRecentSearches();
  }

  // Create search modal HTML
  function createSearchModal() {
    const modalHTML = `
      <div id="search-modal" class="search-modal" role="dialog" aria-modal="true" aria-labelledby="search-title">
        <div class="search-backdrop"></div>
        <div class="search-container">
          <div class="search-header">
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input
                type="text"
                id="search-input"
                class="search-input"
                placeholder="Search the guide... (Ctrl+K)"
                autocomplete="off"
                aria-label="Search"
              />
              <button class="search-close" aria-label="Close search">
                <span>✕</span>
              </button>
            </div>
          </div>
          <div class="search-body">
            <div id="search-results" class="search-results"></div>
            <div id="search-empty" class="search-empty" style="display: none;">
              <span class="empty-icon">🔎</span>
              <p>No results found</p>
            </div>
          </div>
          <div class="search-footer">
            <div class="search-hints">
              <kbd>↑</kbd><kbd>↓</kbd> Navigate
              <kbd>↵</kbd> Select
              <kbd>Esc</kbd> Close
            </div>
          </div>
        </div>
      </div>
    `;

    // Insert into body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Cache DOM elements
    searchModal = document.getElementById('search-modal');
    searchInput = document.getElementById('search-input');
    resultsContainer = document.getElementById('search-results');
  }

  // Setup keyboard shortcuts
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
        return;
      }

      // Forward slash (/) - only if not in an input
      if (e.key === '/' && !isInputFocused()) {
        e.preventDefault();
        openSearch();
        return;
      }

      // Escape - close modal
      if (e.key === 'Escape' && isSearchOpen()) {
        e.preventDefault();
        closeSearch();
        return;
      }

      // Arrow navigation - only when search is open
      if (isSearchOpen()) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          navigateResults(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          navigateResults(-1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          selectResult();
        }
      }
    });
  }

  // Setup modal event listeners
  function setupModalListeners() {
    // Search input - perform search on input
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      performSearch(query);
    });

    // Close button
    const closeBtn = searchModal.querySelector('.search-close');
    closeBtn.addEventListener('click', closeSearch);

    // Backdrop click
    const backdrop = searchModal.querySelector('.search-backdrop');
    backdrop.addEventListener('click', closeSearch);

    // Prevent clicks inside container from closing
    const container = searchModal.querySelector('.search-container');
    container.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Check if an input is focused
  function isInputFocused() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
  }

  // Check if search modal is open
  function isSearchOpen() {
    return searchModal && searchModal.classList.contains('active');
  }

  // Open search modal
  function openSearch() {
    if (!searchModal) return;

    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus input after animation
    setTimeout(() => {
      searchInput.focus();

      // Show recent searches if input is empty
      if (!searchInput.value) {
        showRecentSearches();
      }
    }, 100);
  }

  // Close search modal
  function closeSearch() {
    if (!searchModal) return;

    searchModal.classList.remove('active');
    document.body.style.overflow = '';

    // Clear input and results
    searchInput.value = '';
    resultsContainer.innerHTML = '';
    currentResults = [];
    selectedIndex = 0;
  }

  // Perform search with debouncing
  function performSearch(query) {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Debounce search
    debounceTimer = setTimeout(() => {
      executeSearch(query);
    }, DEBOUNCE_MS);
  }

  // Execute search and display results
  function executeSearch(query) {
    const trimmedQuery = query.trim();

    // Show recent searches if empty
    if (!trimmedQuery) {
      showRecentSearches();
      return;
    }

    // Search the index
    const results = fuzzySearch(trimmedQuery);
    currentResults = results.slice(0, MAX_RESULTS);
    selectedIndex = 0;

    // Display results
    displayResults(currentResults);

    // Show/hide empty state
    const emptyState = document.getElementById('search-empty');
    if (currentResults.length === 0) {
      resultsContainer.style.display = 'none';
      emptyState.style.display = 'flex';
    } else {
      resultsContainer.style.display = 'block';
      emptyState.style.display = 'none';
    }
  }

  // Fuzzy search algorithm
  function fuzzySearch(query) {
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 0);

    // Score each page
    const scored = searchIndex.map(page => {
      let score = 0;
      let matches = [];

      // Title matching (highest weight)
      if (page.title.toLowerCase().includes(lowerQuery)) {
        score += 100;
        matches.push('title');
      }

      // Exact word matches in title
      queryWords.forEach(word => {
        if (page.title.toLowerCase().includes(word)) {
          score += 50;
        }
      });

      // Description matching
      if (page.description.toLowerCase().includes(lowerQuery)) {
        score += 30;
        matches.push('description');
      }

      // Keyword matching
      page.keywords.forEach(keyword => {
        if (keyword.includes(lowerQuery)) {
          score += 20;
          matches.push(keyword);
        }
        queryWords.forEach(word => {
          if (keyword.includes(word)) {
            score += 10;
          }
        });
      });

      // Category matching
      if (page.category.toLowerCase().includes(lowerQuery)) {
        score += 15;
      }

      // Fuzzy character matching (bonus for partial matches)
      const titleChars = page.title.toLowerCase();
      let consecutiveMatches = 0;
      for (let i = 0; i < lowerQuery.length; i++) {
        const charIndex = titleChars.indexOf(lowerQuery[i], i);
        if (charIndex !== -1) {
          score += 5;
          if (charIndex === i) consecutiveMatches++;
        }
      }
      score += consecutiveMatches * 3;

      return {
        ...page,
        score,
        matches: [...new Set(matches)]
      };
    });

    // Filter out zero scores and sort by score
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  // Display search results
  function displayResults(results) {
    if (results.length === 0) {
      resultsContainer.innerHTML = '';
      return;
    }

    const html = results.map((result, index) => {
      const isSelected = index === selectedIndex;
      return `
        <div class="search-result ${isSelected ? 'selected' : ''}" data-index="${index}">
          <div class="result-icon">${result.icon}</div>
          <div class="result-content">
            <div class="result-title">${highlightMatch(result.title, searchInput.value)}</div>
            <div class="result-description">${highlightMatch(result.description, searchInput.value)}</div>
            ${result.matches.length > 0 ? `
              <div class="result-matches">
                ${result.matches.slice(0, 3).map(m => `<span class="match-tag">${m}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          <div class="result-category">${result.category}</div>
        </div>
      `;
    }).join('');

    resultsContainer.innerHTML = html;

    // Add click listeners
    resultsContainer.querySelectorAll('.search-result').forEach((el, index) => {
      el.addEventListener('click', () => {
        selectedIndex = index;
        selectResult();
      });
    });
  }

  // Show recent searches
  function showRecentSearches() {
    if (recentSearches.length === 0) {
      resultsContainer.innerHTML = `
        <div class="recent-searches-empty">
          <p>Start typing to search...</p>
        </div>
      `;
      return;
    }

    const html = `
      <div class="recent-searches">
        <div class="recent-header">Recent Searches</div>
        ${recentSearches.map((query, index) => `
          <div class="recent-item ${index === selectedIndex ? 'selected' : ''}" data-index="${index}">
            <span class="recent-icon">🕐</span>
            <span class="recent-query">${query}</span>
          </div>
        `).join('')}
      </div>
    `;

    resultsContainer.innerHTML = html;
    currentResults = recentSearches.map(query => ({ query }));

    // Add click listeners
    resultsContainer.querySelectorAll('.recent-item').forEach((el, index) => {
      el.addEventListener('click', () => {
        searchInput.value = recentSearches[index];
        performSearch(recentSearches[index]);
      });
    });
  }

  // Highlight matching text
  function highlightMatch(text, query) {
    if (!query || !text) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) return text;

    // Find all occurrences
    let result = '';
    let lastIndex = 0;
    let index = lowerText.indexOf(lowerQuery);

    while (index !== -1) {
      // Add text before match
      result += text.substring(lastIndex, index);
      // Add highlighted match
      result += `<mark>${text.substring(index, index + lowerQuery.length)}</mark>`;
      lastIndex = index + lowerQuery.length;
      index = lowerText.indexOf(lowerQuery, lastIndex);
    }

    // Add remaining text
    result += text.substring(lastIndex);

    return result;
  }

  // Navigate results with arrow keys
  function navigateResults(direction) {
    if (currentResults.length === 0) return;

    // Update selected index
    selectedIndex += direction;

    // Wrap around
    if (selectedIndex < 0) {
      selectedIndex = currentResults.length - 1;
    } else if (selectedIndex >= currentResults.length) {
      selectedIndex = 0;
    }

    // Update UI
    resultsContainer.querySelectorAll('.search-result, .recent-item').forEach((el, index) => {
      if (index === selectedIndex) {
        el.classList.add('selected');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        el.classList.remove('selected');
      }
    });
  }

  // Select current result
  function selectResult() {
    if (currentResults.length === 0) return;

    const selected = currentResults[selectedIndex];

    if (!selected) return;

    // If it's a recent search query
    if (selected.query) {
      searchInput.value = selected.query;
      performSearch(selected.query);
      return;
    }

    // It's a search result - navigate to page
    if (selected.url) {
      // Add to recent searches
      addRecentSearch(searchInput.value);

      // Navigate
      window.location.href = selected.url;

      // Close modal
      closeSearch();
    }
  }

  // Expose init function globally
  window.initSearch = initSearch;

})();
