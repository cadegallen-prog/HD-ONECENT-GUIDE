# Integration Guide for HD Penny Guide Interactive Features

**Version:** 1.0
**Last Updated:** 2025-11-18
**Features:** Advanced Search, Quiz System, UI Components

---

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Quick Start](#quick-start)
4. [Search System Integration](#search-system-integration)
5. [Quiz System Integration](#quiz-system-integration)
6. [UI Components Integration](#ui-components-integration)
7. [Learning Platform Integration](#learning-platform-integration)
8. [Event System](#event-system)
9. [Browser Support](#browser-support)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This guide explains how to integrate all the interactive features into your HD Penny Guide website. The system consists of three main modules:

1. **Search System** - Advanced search with keyboard shortcuts
2. **Quiz System** - Interactive quizzes with XP rewards
3. **UI Components** - Breadcrumbs, tooltips, modals, toasts, loading states

All modules are designed to work independently but integrate seamlessly with the existing `learning-platform.js`.

---

## File Structure

```
/home/user/HD-ONECENT-GUIDE/
├── search.js                    # Search functionality
├── search-index.json            # Search data (16 pages indexed)
├── quiz-system.js               # Quiz engine
├── quizzes.json                 # Quiz questions (30+ questions)
├── ui-components.js             # Reusable UI components
├── component-styles.css         # All component styles
├── integration-guide.md         # This file
└── html-snippets.html           # HTML markup examples
```

---

## Quick Start

### Step 1: Add CSS

Add the component styles to your HTML pages (in `<head>`):

```html
<link rel="stylesheet" href="component-styles.css">
```

**Option:** You can also merge `component-styles.css` into your main `styles.css` file.

### Step 2: Add JavaScript Files

Add scripts before closing `</body>` tag:

```html
<!-- Existing scripts -->
<script src="base.js"></script>
<script src="learning-platform.js"></script>

<!-- New interactive features -->
<script src="ui-components.js"></script>
<script src="search.js"></script>
<script src="quiz-system.js"></script>

<!-- Initialize all features -->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI components
    if (window.initUIComponents) {
      window.initUIComponents();
    }

    // Initialize search
    if (window.initSearch) {
      window.initSearch();
    }

    // Initialize quizzes (only on quiz page)
    if (window.initQuizzes && document.getElementById('quiz-container')) {
      window.initQuizzes();
    }
  });
</script>
```

### Step 3: Add Required HTML Elements

Add these containers to your pages:

```html
<!-- Breadcrumb navigation (add at top of main content) -->
<div id="breadcrumb-nav"></div>

<!-- Suggested next pages (add at bottom of main content) -->
<div id="suggested-next"></div>

<!-- Quiz container (only on quizzes.html) -->
<div id="quiz-container"></div>
```

That's it! The features will now work automatically.

---

## Search System Integration

### Features

- **Keyboard shortcuts:** Ctrl+K, Cmd+K, or `/` to open
- **Fuzzy search** across all pages
- **Recent searches** (stored in localStorage)
- **Keyboard navigation** (arrow keys, Enter, Escape)
- **Mobile-friendly** with touch support

### How It Works

1. User presses keyboard shortcut
2. Search modal appears with focus on input
3. User types query (debounced 200ms)
4. Results appear in real-time with relevance scoring
5. User navigates with keyboard or clicks result
6. Query is saved to recent searches

### Data Structure

**search-index.json:**

```json
[
  {
    "id": "unique-id",
    "title": "Page Title",
    "url": "page.html",
    "description": "Short description",
    "keywords": ["keyword1", "keyword2"],
    "category": "Category Name",
    "icon": "🔍"
  }
]
```

### Customization

**Change keyboard shortcuts:**

Edit `search.js` lines 134-154 to modify shortcuts.

**Adjust search scoring:**

Edit `fuzzySearch()` function in `search.js` (lines 294-360) to adjust relevance weights.

**Modify max results:**

```javascript
const MAX_RESULTS = 10; // Change to desired number
```

### API

```javascript
// Open search programmatically
window.initSearch(); // Initialize
```

The search system is entirely keyboard-driven and manages its own state.

---

## Quiz System Integration

### Features

- **Multiple question types** (multiple-choice, multiple-select, true/false)
- **Complete quiz flow** (start → questions → feedback → results)
- **Score tracking** with localStorage persistence
- **XP rewards** integrated with learning platform
- **Review mode** to see all answers
- **Retake functionality**

### How It Works

1. User visits `quizzes.html`
2. Quiz selection screen shows available quizzes
3. User clicks "Start Quiz"
4. Questions are presented one at a time
5. Immediate feedback after each answer
6. Final results with score and XP reward
7. Completion saved to localStorage

### Data Structure

**quizzes.json:**

```json
{
  "quizzes": [
    {
      "id": "quiz-id",
      "title": "Quiz Title",
      "description": "Description",
      "category": "Category",
      "difficulty": "easy|medium|hard",
      "estimatedTime": 5,
      "xpReward": 50,
      "questions": [
        {
          "id": "question-id",
          "type": "multiple-choice",
          "difficulty": "easy",
          "question": "Question text?",
          "answers": ["Option 1", "Option 2", "Option 3"],
          "correct": "Option 1",
          "explanation": "Why this is correct",
          "points": 10
        }
      ]
    }
  ]
}
```

### Learning Platform Integration

The quiz system integrates with `learning-platform.js`:

```javascript
// Award XP (called automatically on quiz completion)
window.LearningPlatform.awardXP(xpAmount, reason);

// Unlock achievements (called for perfect scores)
window.LearningPlatform.unlockAchievement('achievement-id');
```

**Storage Key:** `hdPennyGuide` (unified with learning platform)

**Quiz Data Structure in localStorage:**

```json
{
  "quizzes": {
    "quiz-id": {
      "attempts": 3,
      "bestScore": 90,
      "totalTime": 450,
      "lastAttempt": "2025-11-18T10:30:00.000Z"
    }
  }
}
```

### API

```javascript
// Initialize quiz system
window.initQuizzes();

// Start specific quiz
window.quizSystem.startQuiz('quiz-id');

// Show quiz selection
window.quizSystem.showQuizSelection();

// Navigate quiz flow
window.quizSystem.showQuestion();
window.quizSystem.submitAnswer();
window.quizSystem.nextQuestion();
window.quizSystem.showResults();
window.quizSystem.showReview();
```

### Customization

**XP Rewards:**

```javascript
const BASE_XP = 50;          // Base XP per quiz
const PERFECT_BONUS_XP = 25; // Bonus for 100% score
```

**Results Messages:**

Edit `showResults()` function in `quiz-system.js` around line 485 to customize messages.

---

## UI Components Integration

### Breadcrumb Navigation

**Setup:**

Add this div at the top of your main content:

```html
<div id="breadcrumb-nav"></div>
```

**Configuration:**

Edit `breadcrumbConfig` in `ui-components.js` (lines 18-34) to define breadcrumb paths:

```javascript
const breadcrumbConfig = {
  'page.html': ['Home', 'Category'],
  // Add more pages...
};
```

### Suggested Next Pages

**Setup:**

Add this div at the bottom of your main content:

```html
<div id="suggested-next"></div>
```

**Configuration:**

Edit `pageSequence` in `ui-components.js` (lines 67-78) to define the learning path order.

### Tooltips

**Usage:**

Add `data-tooltip` attribute to any element:

```html
<span data-tooltip="This is helpful info" data-tooltip-position="top">
  Hover me
</span>
```

**Positions:** `top`, `bottom`, `left`, `right`

### Modals

**Usage:**

```javascript
// Confirmation modal
window.UIComponents.Modal.open({
  title: 'Confirm Action',
  content: 'Are you sure?',
  type: 'confirm',
  confirmText: 'Yes',
  cancelText: 'No',
  onConfirm: () => {
    console.log('Confirmed');
  },
  onCancel: () => {
    console.log('Cancelled');
  }
});

// Info modal
window.UIComponents.Modal.open({
  title: 'Information',
  content: '<p>Some helpful information</p>',
  type: 'info',
  confirmText: 'Got it'
});

// Close modal
window.UIComponents.Modal.close();
```

### Toast Notifications

**Usage:**

```javascript
// Success toast
window.UIComponents.Toast.success('Changes saved!');

// Error toast
window.UIComponents.Toast.error('Something went wrong');

// Warning toast
window.UIComponents.Toast.warning('Please review your input');

// Info toast
window.UIComponents.Toast.info('Did you know...');

// Custom duration (default 3000ms)
window.UIComponents.Toast.success('Message', 5000);
```

### Loading States

**Usage:**

```javascript
// Show loading on element
window.UIComponents.Loading.show('#my-element', 'Loading data...');

// Hide loading
window.UIComponents.Loading.hide('#my-element');

// Full-page loading overlay
window.UIComponents.Loading.overlay(true, 'Processing...');
window.UIComponents.Loading.overlay(false);
```

### Error States

**Usage:**

```javascript
// Generic error
window.UIComponents.ErrorState.show('#container', {
  icon: '⚠️',
  title: 'Error',
  message: 'Something went wrong',
  actionText: 'Retry',
  onAction: () => {
    // Retry logic
  }
});

// 404 Not Found
window.UIComponents.ErrorState.notFound('#container');

// No search results
window.UIComponents.ErrorState.noResults('#container');
```

---

## Learning Platform Integration

### Required Functions

The quiz system expects these functions from `learning-platform.js`:

```javascript
window.LearningPlatform = {
  // Award XP to user
  awardXP: function(amount, reason) {
    // Implementation
  },

  // Unlock achievement
  unlockAchievement: function(achievementId) {
    // Implementation
  }
};
```

### Storage Key

All features use the unified localStorage key: **`hdPennyGuide`**

**Data Structure:**

```json
{
  "user": {
    "xp": 0,
    "level": 1
  },
  "progress": {
    "pagesRead": [],
    "quizzesCompleted": []
  },
  "quizzes": {
    "quiz-id": {
      "attempts": 1,
      "bestScore": 80,
      "totalTime": 300,
      "lastAttempt": "2025-11-18T10:00:00.000Z"
    }
  },
  "achievements": []
}
```

### Event Hooks

**Quiz Completion Event:**

```javascript
// Listen for quiz completion
document.addEventListener('quizCompleted', (e) => {
  const { quizId, score, xpEarned } = e.detail;
  console.log('Quiz completed:', quizId, score, xpEarned);
});

// Dispatch from quiz system (add to quiz-system.js if needed)
document.dispatchEvent(new CustomEvent('quizCompleted', {
  detail: { quizId, score, xpEarned }
}));
```

---

## Event System

### Custom Events

You can listen for these events:

```javascript
// Search opened
document.addEventListener('searchOpened', () => {
  console.log('Search opened');
});

// Search closed
document.addEventListener('searchClosed', () => {
  console.log('Search closed');
});

// Quiz started
document.addEventListener('quizStarted', (e) => {
  console.log('Quiz started:', e.detail.quizId);
});

// Quiz completed
document.addEventListener('quizCompleted', (e) => {
  console.log('Quiz completed:', e.detail);
});
```

### Dispatching Events

Add these to the respective JS files:

```javascript
// In search.js - when opening search
document.dispatchEvent(new Event('searchOpened'));

// In quiz-system.js - when starting quiz
document.dispatchEvent(new CustomEvent('quizStarted', {
  detail: { quizId: currentQuiz.id }
}));
```

---

## Browser Support

### Minimum Requirements

- **Modern browsers** (last 2 versions)
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome Android 90+

### Features Used

- **ES6+ JavaScript** (arrow functions, const/let, template literals)
- **CSS Grid & Flexbox**
- **CSS Variables** (for theming)
- **LocalStorage API**
- **Fetch API**
- **Backdrop-filter** (graceful degradation)

### Polyfills Not Needed

All features work natively in supported browsers. No polyfills required.

---

## Troubleshooting

### Search Not Opening

**Problem:** Pressing Ctrl+K doesn't open search

**Solutions:**
1. Check that `search.js` is loaded
2. Verify `initSearch()` was called
3. Check browser console for errors
4. Ensure `search-index.json` loads successfully

### Quizzes Not Loading

**Problem:** Quiz page is blank or shows error

**Solutions:**
1. Check that `quiz-system.js` is loaded
2. Verify `<div id="quiz-container"></div>` exists
3. Check that `quizzes.json` loads (network tab)
4. Verify JSON is valid (use JSON validator)

### XP Not Awarded

**Problem:** Completing quiz doesn't award XP

**Solutions:**
1. Check that `learning-platform.js` is loaded **before** `quiz-system.js`
2. Verify `window.LearningPlatform.awardXP` exists
3. Check browser console for errors
4. Test LearningPlatform functions independently

### Styles Not Applied

**Problem:** Components look unstyled

**Solutions:**
1. Verify `component-styles.css` is loaded
2. Check CSS link path is correct
3. Clear browser cache
4. Check for CSS conflicts with existing styles
5. Verify CSS variables are defined in main stylesheet

### LocalStorage Issues

**Problem:** Quiz progress not saving

**Solutions:**
1. Check localStorage is enabled in browser
2. Verify localStorage quota not exceeded
3. Check for private/incognito mode restrictions
4. Test with: `localStorage.setItem('test', 'value')`

### Mobile Issues

**Problem:** Features don't work on mobile

**Solutions:**
1. Test on actual devices, not just browser emulation
2. Check touch events are working
3. Verify viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
4. Test keyboard shortcuts alternatives (search icon button)

---

## Performance Optimization

### Loading Strategy

**Lazy Load Non-Critical Features:**

```html
<script>
  // Load quiz system only when needed
  if (window.location.pathname.includes('quiz')) {
    const script = document.createElement('script');
    script.src = 'quiz-system.js';
    document.body.appendChild(script);
  }
</script>
```

### Search Index Optimization

Keep `search-index.json` under 50KB by:
- Using concise descriptions
- Limiting keywords to 5-10 per page
- Avoiding duplicate data

### LocalStorage Management

Clear old data periodically:

```javascript
// Clear quiz data older than 90 days
function cleanOldQuizData() {
  const data = JSON.parse(localStorage.getItem('hdPennyGuide') || '{}');
  const now = new Date();
  const ninetyDaysAgo = new Date(now - 90 * 24 * 60 * 60 * 1000);

  if (data.quizzes) {
    Object.keys(data.quizzes).forEach(quizId => {
      const lastAttempt = new Date(data.quizzes[quizId].lastAttempt);
      if (lastAttempt < ninetyDaysAgo) {
        delete data.quizzes[quizId];
      }
    });
    localStorage.setItem('hdPennyGuide', JSON.stringify(data));
  }
}
```

---

## Customization Guide

### Theming

All colors use CSS variables. Update these in your main stylesheet:

```css
:root {
  --accent-color: #f96302;      /* Home Depot orange */
  --accent-hover: #d55502;
  --bg-color: #f8f9fa;
  --text-color: #212529;
  --border-color: #dee2e6;
  --table-header-bg: #f96302;
  --table-row-alt: #f8f9fa;
  --table-hover: #e9ecef;
}
```

### Adding New Quiz

1. Open `quizzes.json`
2. Add new quiz object to `quizzes` array
3. Include at least 6 questions
4. Set appropriate difficulty and XP reward
5. Test thoroughly

### Adding Search Page

1. Open `search-index.json`
2. Add new page object with all required fields
3. Ensure URL is correct
4. Add relevant keywords
5. Test search finds the page

### Custom Achievements

Define achievements in learning platform:

```javascript
const achievements = {
  'perfect-quiz': {
    id: 'perfect-quiz',
    title: 'Perfect Score',
    description: 'Complete a quiz with 100% score',
    icon: '🏆',
    xp: 25
  },
  'quiz-master': {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Complete all quizzes',
    icon: '🎓',
    xp: 100
  }
};
```

Trigger from quiz system:

```javascript
// Check if user completed all quizzes
if (completedQuizzes.length === totalQuizzes) {
  window.LearningPlatform.unlockAchievement('quiz-master');
}
```

---

## Testing Checklist

### Search System

- [ ] Ctrl+K opens search modal
- [ ] Cmd+K works on Mac
- [ ] `/` key opens search (when not in input)
- [ ] Search results appear as you type
- [ ] Arrow keys navigate results
- [ ] Enter selects highlighted result
- [ ] Escape closes modal
- [ ] Click outside closes modal
- [ ] Recent searches are saved
- [ ] Recent searches can be clicked
- [ ] Matched text is highlighted
- [ ] Mobile tap to search works

### Quiz System

- [ ] Quiz selection page loads
- [ ] All quizzes are displayed
- [ ] Quiz start screen shows correct info
- [ ] Questions display correctly
- [ ] Answers can be selected
- [ ] Multiple-select allows multiple answers
- [ ] Submit button works
- [ ] Feedback shows correct/incorrect
- [ ] Explanation is displayed
- [ ] Next question button works
- [ ] Results screen shows score
- [ ] XP is awarded
- [ ] Perfect score gives bonus XP
- [ ] Review mode shows all Q&A
- [ ] Retake quiz works
- [ ] Progress is saved to localStorage
- [ ] Best score is tracked

### UI Components

- [ ] Breadcrumbs appear on pages
- [ ] Breadcrumb links work
- [ ] Suggested pages appear
- [ ] Suggested page links work
- [ ] Tooltips show on hover
- [ ] Tooltips hide on mouse out
- [ ] Tooltips work on mobile (tap)
- [ ] Modal opens correctly
- [ ] Modal closes on X button
- [ ] Modal closes on Escape
- [ ] Modal closes on overlay click
- [ ] Toast notifications appear
- [ ] Toast auto-dismisses
- [ ] Toast can be manually closed
- [ ] Loading spinner shows
- [ ] Loading spinner hides
- [ ] Error states display correctly

---

## API Reference

### Search System

```javascript
// Initialize
window.initSearch()
```

### Quiz System

```javascript
// Initialize
window.initQuizzes()

// API methods
window.quizSystem.startQuiz(quizId)
window.quizSystem.showQuizSelection()
window.quizSystem.showQuestion()
window.quizSystem.submitAnswer()
window.quizSystem.nextQuestion()
window.quizSystem.showResults()
window.quizSystem.showReview()
```

### UI Components

```javascript
// Initialize
window.initUIComponents()

// Breadcrumbs
window.UIComponents.initBreadcrumbs()

// Suggested pages
window.UIComponents.initSuggestedPages()

// Tooltips
window.UIComponents.initTooltips()

// Modal
window.UIComponents.Modal.open(options)
window.UIComponents.Modal.close()

// Toast
window.UIComponents.Toast.show(message, type, duration)
window.UIComponents.Toast.success(message, duration)
window.UIComponents.Toast.error(message, duration)
window.UIComponents.Toast.warning(message, duration)
window.UIComponents.Toast.info(message, duration)

// Loading
window.UIComponents.Loading.show(target, text)
window.UIComponents.Loading.hide(target)
window.UIComponents.Loading.overlay(show, text)

// Error States
window.UIComponents.ErrorState.show(target, options)
window.UIComponents.ErrorState.notFound(target)
window.UIComponents.ErrorState.noResults(target)
```

---

## Support

For issues or questions:

1. Check this integration guide
2. Review browser console for errors
3. Test in different browsers
4. Check `localStorage` data structure
5. Verify all files are loaded correctly

---

## Changelog

### Version 1.0 (2025-11-18)

- Initial release
- Search system with fuzzy search
- Quiz system with 30+ questions
- UI components (breadcrumbs, tooltips, modals, toasts, loading, errors)
- Full learning platform integration
- Comprehensive documentation

---

**End of Integration Guide**
