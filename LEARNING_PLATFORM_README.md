# 🎮 HD Penny Guide - Learning Platform & Gamification System

A complete, production-ready learning management system with gamification features for static websites.

**Built for:** HD Penny Guide (Home Depot penny items educational site)
**Version:** 1.0.0
**License:** MIT

---

## ✨ Features

### Core Functionality
- ✅ **Progress Tracking** - Automatically track 16 pages as users visit them
- ✅ **XP System** - Award experience points for reading pages, completing quizzes, and achievements
- ✅ **5-Level System** - Newbie → Beginner → Intermediate → Advanced → Expert
- ✅ **3 Learning Paths** - Guided Learning, Structured Approach, Quick Start
- ✅ **25 Achievements** - Progress, paths, quizzes, engagement, and special achievements
- ✅ **Quiz Integration** - Track quiz completion with perfect score bonuses
- ✅ **Data Persistence** - All progress saved to localStorage (no backend required)
- ✅ **Export/Import** - Download progress as JSON, import on another device
- ✅ **Event System** - Custom events for extensibility

### User Experience
- 🎨 Beautiful UI with smooth animations
- 🎉 Level-up modals with confetti animations
- 🏆 Achievement unlock toast notifications
- 📱 Fully responsive (mobile, tablet, desktop)
- 🌙 Dark mode support (if your site has it)
- 🔊 Sound effect support (optional, with mute toggle)
- ♿ Accessible (semantic HTML, keyboard navigation)

### Developer Experience
- 🚀 Easy integration (just add scripts and HTML)
- 📚 Comprehensive documentation
- 🔧 Fully customizable (colors, XP values, achievements)
- 🧪 Test/demo page included
- 💾 Single localStorage key (clean data structure)
- 🎯 Event-driven architecture
- 📝 Well-commented code

---

## 📦 What's Included

### Core Files (Required)
```
learning-platform.js          (40 KB)  - Complete gamification engine
learning-data.json            (5 KB)   - Paths and achievements definitions
learning-platform.css         (15 KB)  - Complete stylesheet
```

### Documentation & Examples
```
LEARNING_PLATFORM_GUIDE.md    (20 KB)  - Complete integration guide
LEARNING_PLATFORM_README.md   (this)   - Overview and quick start
learning-platform-ui.html     (15 KB)  - HTML snippets and examples
learning-platform-demo.html   (10 KB)  - Interactive demo page
```

### Total Size
- **Uncompressed:** ~105 KB total
- **Minified (estimated):** ~50 KB total
- **Impact on page load:** Minimal (defer loading)

---

## 🚀 Quick Start

### 1. Add Files to Your Project
```bash
# Copy these 3 files to your project root:
- learning-platform.js
- learning-platform.css
- learning-data.json
```

### 2. Add to Your HTML Pages

**In `<head>`:**
```html
<link rel="stylesheet" href="learning-platform.css">
```

**In your header/nav:**
```html
<div class="learning-header-widget">
  <div class="widget-level">
    <span class="learning-level-icon">🌱</span>
    <span class="learning-level-text">Level 1</span>
  </div>
  <div class="widget-progress">
    <div class="widget-label">
      <span class="learning-progress-text">0/16</span>
      <span class="learning-xp-text">0 XP</span>
    </div>
    <div class="widget-bars">
      <div class="bar-container">
        <div class="learning-progress-bar" style="width: 0%"></div>
      </div>
      <div class="bar-container">
        <div class="learning-xp-bar" style="width: 0%"></div>
      </div>
    </div>
  </div>
</div>
```

**Before `</body>`:**
```html
<!-- Modals (copy from learning-platform-ui.html) -->
<div id="level-up-modal" class="modal">...</div>
<div id="path-complete-modal" class="modal">...</div>
<canvas id="confetti-canvas"></canvas>

<!-- Initialize -->
<script src="learning-platform.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    window.initLearningPlatform();
  });
</script>
```

### 3. Test It Out

Open `learning-platform-demo.html` in your browser to see it in action!

---

## 📖 Complete Documentation

See **[LEARNING_PLATFORM_GUIDE.md](LEARNING_PLATFORM_GUIDE.md)** for:
- Detailed integration instructions
- Complete API reference
- Customization guide
- Quiz integration
- Event system usage
- Troubleshooting
- Advanced features

---

## 🎯 How It Works

### Automatic Page Tracking
```javascript
// When user visits a page:
1. Detect current page URL
2. Check if page is in learning-data.json
3. Mark as read (if first visit)
4. Award XP
5. Update learning path progress
6. Check for achievement unlocks
7. Update UI
8. Save to localStorage
```

### XP & Leveling
```javascript
// XP Sources:
- Read page: +10 XP
- Complete quiz: +50 XP
- Perfect quiz score: +25 bonus XP
- Complete learning path: +100 XP
- Unlock achievement: varies (5-200 XP)

// Levels:
Level 1: 0-50 XP      (Newbie)
Level 2: 51-150 XP    (Beginner)
Level 3: 151-300 XP   (Intermediate)
Level 4: 301-500 XP   (Advanced)
Level 5: 501+ XP      (Expert)
```

### Learning Paths
```javascript
// 3 Pre-defined Paths:
1. Guided Learning (5 pages, ~45 min)   - For complete beginners
2. Structured Approach (5 pages, ~60 min) - For methodical learners
3. Quick Start (4 pages, ~20 min)        - For fast learners

// Path Completion:
- Auto-tracked as user reads pages
- +100 XP bonus on completion
- Modal celebration
- Achievement unlocks
```

### Achievements (25 Total)
```javascript
// Categories:
- Progress (6)      - Pages read milestones
- Paths (3)         - Learning path completion
- Quizzes (3)       - Quiz completion and perfect scores
- Engagement (6)    - Visits, sessions, customization
- Special (4)       - Specific pages
- Progression (2)   - Level-based
- Meta (1)          - Achievement hunter
```

---

## 🔌 API Reference (Quick)

### Global Object
```javascript
window.HDPennyGuide
```

### Common Methods
```javascript
// Get stats
const stats = window.HDPennyGuide.getStats();

// Award XP
window.HDPennyGuide.awardXP(25, 'Custom action');

// Record quiz
window.HDPennyGuide.recordQuizCompletion('quiz-id', score, maxScore);

// Unlock achievement
window.HDPennyGuide.unlockAchievement('achievement-id');

// Get user data
const userData = window.HDPennyGuide.getUserData();

// Export/import/reset
window.HDPennyGuide.export();
window.HDPennyGuide.import(file);
window.HDPennyGuide.reset();

// Update UI
window.HDPennyGuide.updateUI();
```

### Events
```javascript
// Listen to events
window.addEventListener('hdpg:levelUp', (e) => {
  console.log('Level up!', e.detail);
});

window.addEventListener('hdpg:achievementUnlocked', (e) => {
  console.log('Achievement!', e.detail);
});

// Available events:
- hdpg:pageRead
- hdpg:xpEarned
- hdpg:levelUp
- hdpg:achievementUnlocked
- hdpg:pathStarted
- hdpg:pathCompleted
- hdpg:quizCompleted
- hdpg:dataReset
- hdpg:dataImported
```

---

## 🎨 Customization

### Change Colors
Edit `learning-platform.css`:
```css
:root {
  --learning-primary: #f96302;     /* Orange */
  --learning-success: #4CAF50;     /* Green */
  --level-expert: #FFD700;         /* Gold */
}
```

### Adjust XP Values
Edit `learning-data.json`:
```json
{
  "pages": [
    { "id": "home", "xp": 15 }  // Change from 10 to 15
  ]
}
```

### Add Achievements
Edit `learning-data.json`:
```json
{
  "achievements": [
    {
      "id": "new-achievement",
      "name": "New Achievement",
      "description": "Do something cool",
      "icon": "🎯",
      "xpBonus": 25,
      "category": "special",
      "condition": { "type": "custom" }
    }
  ]
}
```

---

## 🧪 Testing

### Demo Page
Open `learning-platform-demo.html` in your browser:
- Test all features interactively
- Award XP and see level-ups
- Unlock achievements
- View stats in real-time
- Test export/import/reset

### Manual Testing
```javascript
// Open browser console
console.log(window.HDPennyGuide.getStats());

// Award test XP
window.HDPennyGuide.awardXP(1000, 'Test');

// Check unlocked achievements
console.log(window.HDPennyGuide.getUnlockedAchievements());
```

---

## 📊 Data Structure

### localStorage Key
```
"hdPennyGuide"
```

### Data Format
```javascript
{
  user: {
    totalXP: 0,
    level: 1,
    visitCount: 0,
    uniqueDays: [],
    currentSession: { startTime, pagesRead }
  },
  progress: {
    pagesRead: [],
    totalPagesRead: 0,
    pageTimestamps: {}
  },
  paths: {
    guided: { started: false, completed: false, pagesCompleted: [] },
    structured: { ... },
    quickStart: { ... }
  },
  achievements: {
    unlocked: [],
    timestamps: {},
    notifiedThisSession: []
  },
  quizzes: {
    completed: [],
    scores: {},
    perfectQuizzes: []
  },
  preferences: {
    soundEnabled: true,
    animationsEnabled: true
  }
}
```

---

## 🔒 Privacy

- ✅ **No external requests** - Everything runs locally
- ✅ **No analytics** - No tracking or data collection
- ✅ **No cookies** - Uses localStorage only
- ✅ **User controlled** - Export/delete anytime
- ✅ **GDPR compliant** - No data leaves the device

---

## 🌟 Browser Support

**Supported:**
- ✅ Chrome/Edge (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

**Required APIs:**
- localStorage
- JSON
- CustomEvent
- Canvas API (for confetti)
- ES6 features (const, let, arrow functions, async/await)

**Not supported:**
- ❌ IE11 or older

---

## 🤝 Integration Examples

### Example 1: Basic Page
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="learning-platform.css">
</head>
<body>
  <header>
    <nav><!-- Your nav --></nav>
    <div class="learning-header-widget">...</div>
  </header>

  <main>
    <!-- Your content -->
  </main>

  <!-- Modals -->
  <div id="level-up-modal" class="modal">...</div>
  <div id="path-complete-modal" class="modal">...</div>
  <canvas id="confetti-canvas"></canvas>

  <script src="learning-platform.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      window.initLearningPlatform();
    });
  </script>
</body>
</html>
```

### Example 2: Quiz Integration
```javascript
function submitQuiz() {
  const score = calculateScore();
  const maxScore = 10;

  window.HDPennyGuide.recordQuizCompletion('basics-quiz', score, maxScore);

  alert(`You scored ${score}/${maxScore}!`);
}
```

### Example 3: Custom XP Trigger
```javascript
document.querySelector('.share-btn').addEventListener('click', () => {
  window.HDPennyGuide.awardXP(15, 'Shared content');
});
```

---

## 📝 Files Overview

| File | Size | Purpose |
|------|------|---------|
| `learning-platform.js` | 40 KB | Core engine (XP, levels, achievements, tracking) |
| `learning-data.json` | 5 KB | Configuration (pages, paths, achievements, levels) |
| `learning-platform.css` | 15 KB | All styles (widgets, modals, animations) |
| `learning-platform-ui.html` | 15 KB | HTML snippets and examples |
| `learning-platform-demo.html` | 10 KB | Interactive demo/test page |
| `LEARNING_PLATFORM_GUIDE.md` | 20 KB | Complete integration guide |
| `LEARNING_PLATFORM_README.md` | 5 KB | This file (overview) |

---

## 🎓 Learning Paths

### Path 1: Guided Learning (Beginner)
1. What Are Pennies?
2. Clearance Lifecycle
3. In-Store Strategy
4. Checkout Strategy
5. Responsible Hunting

### Path 2: Structured Approach (Intermediate)
1. Digital Pre-Hunt
2. In-Store Strategy
3. Checkout Strategy
4. Internal Systems
5. Facts vs Myths

### Path 3: Quick Start (Fast Track)
1. Quick Start
2. What Are Pennies?
3. In-Store Strategy
4. Checkout Strategy

---

## 🏆 Achievement Categories

### Progress (6 achievements)
- First Steps - Visit first page
- Knowledge Seeker - Read 5 pages
- Halfway There - Read 8 pages
- Bookworm - Read 10 pages
- Completionist - Read all 16 pages

### Paths (3 achievements)
- Path Explorer - Start a path
- Path Master - Complete any path
- Master of All Paths - Complete all 3 paths

### Quizzes (3 achievements)
- Quiz Taker - Complete first quiz
- Quiz Champion - Score 100% on any quiz
- Perfect Student - Score 100% on all quizzes

### Engagement (6 achievements)
- Speed Reader - Read 5 pages in one session
- Dedicated Learner - Visit 5 times
- Returning User - Visit on 3 different days
- Early Bird - Visit before 8 AM
- Weekend Warrior - Visit on weekend
- Night Owl - Use dark mode
- Customizer - Change font size

### Special (4 achievements)
- FAQ Master - Read FAQ page
- Responsible Hunter - Read Responsible Hunting
- Myth Buster - Read Facts vs Myths
- Systems Expert - Read Internal Systems

### Progression & Meta (3 achievements)
- Level Up! - Reach Level 2
- Penny Expert - Reach Level 5 (Expert)
- Achievement Hunter - Unlock 10 achievements

---

## 🚦 Status

**Current Version:** 1.0.0
**Status:** ✅ Production Ready
**Last Updated:** 2025-11-18

### Completed Features
- ✅ Core engine (progress, XP, levels)
- ✅ Learning paths (3 paths)
- ✅ Achievement system (25 achievements)
- ✅ Quiz integration
- ✅ Data persistence
- ✅ Export/import/reset
- ✅ UI components
- ✅ Animations & modals
- ✅ Event system
- ✅ Documentation
- ✅ Demo page
- ✅ Mobile responsive
- ✅ Dark mode support

### Future Enhancements (Optional)
- ⏳ Leaderboard (requires backend)
- ⏳ Social sharing integration
- ⏳ Sound effects (audio files)
- ⏳ Additional achievements
- ⏳ Streak tracking
- ⏳ Daily challenges

---

## 💡 Tips for Success

1. **Test thoroughly** - Use the demo page to verify everything works
2. **Customize carefully** - Test after changing XP values or achievements
3. **Mobile first** - Ensure header widget looks good on small screens
4. **Listen to events** - Use the event system for custom integrations
5. **Export regularly** - Encourage users to backup their progress
6. **Document changes** - If you modify achievements, update your docs

---

## 🎉 You're Ready!

Everything you need is included. Follow the integration guide and you'll have a complete learning platform running in minutes!

**Questions?** Check `LEARNING_PLATFORM_GUIDE.md` for detailed docs.

**Want to see it in action?** Open `learning-platform-demo.html` in your browser.

---

**Happy coding!** 🚀
