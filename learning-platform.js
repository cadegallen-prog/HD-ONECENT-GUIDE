/**
 * HD Penny Guide - Learning Platform & Gamification Engine
 *
 * A complete learning management system with XP, levels, paths, and achievements
 * Designed to integrate seamlessly with the existing static site
 *
 * Features:
 * - Progress tracking across 16 pages
 * - XP and leveling system (5 levels)
 * - 3 structured learning paths
 * - 25 achievements with unlock animations
 * - Data persistence in localStorage
 * - Auto-tracking of page visits
 * - Export/import/reset functionality
 * - Event system for extensibility
 *
 * Usage:
 *   Call window.initLearningPlatform() after page load
 *
 * Storage:
 *   All data stored under localStorage key "hdPennyGuide"
 */

(function() {
  'use strict';

  // ============================================================================
  // CONSTANTS & CONFIGURATION
  // ============================================================================

  const STORAGE_KEY = 'hdPennyGuide';
  const DATA_FILE = '/learning-data.json';

  // Event names for custom events
  const EVENTS = {
    PAGE_READ: 'hdpg:pageRead',
    XP_EARNED: 'hdpg:xpEarned',
    LEVEL_UP: 'hdpg:levelUp',
    ACHIEVEMENT_UNLOCKED: 'hdpg:achievementUnlocked',
    PATH_STARTED: 'hdpg:pathStarted',
    PATH_COMPLETED: 'hdpg:pathCompleted',
    QUIZ_COMPLETED: 'hdpg:quizCompleted',
    DATA_RESET: 'hdpg:dataReset',
    DATA_IMPORTED: 'hdpg:dataImported'
  };

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  let learningData = null; // Loaded from JSON
  let userData = null; // User progress and stats

  /**
   * Default user data structure
   */
  function getDefaultUserData() {
    return {
      user: {
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        visitCount: 0,
        sessions: [],
        uniqueDays: [],
        currentSession: {
          startTime: Date.now(),
          pagesRead: []
        }
      },
      progress: {
        pagesRead: [],
        lastVisit: null,
        totalPagesRead: 0,
        pageTimestamps: {}
      },
      paths: {
        guided: { started: false, completed: false, pagesCompleted: [] },
        structured: { started: false, completed: false, pagesCompleted: [] },
        quickStart: { started: false, completed: false, pagesCompleted: [] }
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
      },
      meta: {
        version: '1.0.0',
        created: Date.now(),
        lastUpdated: Date.now()
      }
    };
  }

  /**
   * Load user data from localStorage
   */
  function loadUserData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        userData = JSON.parse(stored);
        // Migrate old data if needed
        migrateUserData();
        // Initialize new session
        initializeSession();
        return userData;
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }

    userData = getDefaultUserData();
    saveUserData();
    return userData;
  }

  /**
   * Save user data to localStorage
   */
  function saveUserData() {
    try {
      userData.meta.lastUpdated = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  /**
   * Migrate older data structures (future-proofing)
   */
  function migrateUserData() {
    // Ensure all required properties exist
    if (!userData.user.currentSession) {
      userData.user.currentSession = {
        startTime: Date.now(),
        pagesRead: []
      };
    }

    if (!userData.achievements.notifiedThisSession) {
      userData.achievements.notifiedThisSession = [];
    }

    if (!userData.user.uniqueDays) {
      userData.user.uniqueDays = [];
    }

    if (!userData.preferences) {
      userData.preferences = {
        soundEnabled: true,
        animationsEnabled: true
      };
    }
  }

  /**
   * Initialize session tracking
   */
  function initializeSession() {
    const today = new Date().toDateString();

    // Track visit count
    userData.user.visitCount++;

    // Track unique days
    if (!userData.user.uniqueDays.includes(today)) {
      userData.user.uniqueDays.push(today);
    }

    // Start new session
    userData.user.currentSession = {
      startTime: Date.now(),
      pagesRead: []
    };

    saveUserData();

    // Check time-based achievements
    checkTimeBasedAchievements();
  }

  /**
   * Check for time-based achievements (early bird, weekend warrior)
   */
  function checkTimeBasedAchievements() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    // Early bird (before 8 AM)
    if (hour < 8) {
      checkAndUnlockAchievement('early-bird', { earlyMorningVisit: true });
    }

    // Weekend warrior (Saturday=6, Sunday=0)
    if (day === 0 || day === 6) {
      checkAndUnlockAchievement('weekend-warrior', { weekendVisit: true });
    }
  }

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  /**
   * Load learning data from JSON file
   */
  async function loadLearningData() {
    try {
      const response = await fetch(DATA_FILE);
      if (!response.ok) {
        throw new Error(`Failed to load learning data: ${response.status}`);
      }
      learningData = await response.json();
      return learningData;
    } catch (error) {
      console.error('Error loading learning data:', error);
      // Return minimal fallback data
      return {
        pages: [],
        learningPaths: {},
        levels: [],
        achievements: []
      };
    }
  }

  // ============================================================================
  // PAGE TRACKING
  // ============================================================================

  /**
   * Get current page ID from pathname
   */
  function getCurrentPageId() {
    const pathname = window.location.pathname;

    // Find matching page in learning data
    const page = learningData.pages.find(p => {
      if (p.path === pathname) return true;
      if (p.altPaths && p.altPaths.includes(pathname)) return true;
      return false;
    });

    return page ? page.id : null;
  }

  /**
   * Mark current page as read and award XP
   */
  function trackCurrentPage() {
    const pageId = getCurrentPageId();
    if (!pageId) return;

    const page = learningData.pages.find(p => p.id === pageId);
    if (!page) return;

    // Check if already read
    const alreadyRead = userData.progress.pagesRead.includes(pageId);

    if (!alreadyRead) {
      // Mark as read
      userData.progress.pagesRead.push(pageId);
      userData.progress.totalPagesRead = userData.progress.pagesRead.length;
      userData.progress.pageTimestamps[pageId] = Date.now();

      // Track in current session
      userData.user.currentSession.pagesRead.push(pageId);

      // Award XP
      awardXP(page.xp, `Read "${page.title}"`);

      // Update learning paths
      updateLearningPaths(pageId);

      // Check achievements
      checkProgressAchievements();

      // Dispatch event
      dispatchCustomEvent(EVENTS.PAGE_READ, { pageId, page });

      // Save
      saveUserData();

      // Update UI
      updateAllUI();

      console.log(`✅ Page tracked: ${page.title} (+${page.xp} XP)`);
    }
  }

  /**
   * Update learning path progress when a page is read
   */
  function updateLearningPaths(pageId) {
    Object.entries(learningData.learningPaths).forEach(([pathKey, pathData]) => {
      const pathProgress = userData.paths[pathKey];

      if (!pathProgress) {
        // Initialize if missing
        userData.paths[pathKey] = {
          started: false,
          completed: false,
          pagesCompleted: []
        };
        return;
      }

      // Check if page is in this path
      if (pathData.pages.includes(pageId)) {
        // Mark path as started
        if (!pathProgress.started) {
          pathProgress.started = true;
          dispatchCustomEvent(EVENTS.PATH_STARTED, { pathId: pathKey, pathData });
          checkAndUnlockAchievement('path-explorer');
        }

        // Add page to completed if not already there
        if (!pathProgress.pagesCompleted.includes(pageId)) {
          pathProgress.pagesCompleted.push(pageId);
        }

        // Check if path is now complete
        if (!pathProgress.completed && pathProgress.pagesCompleted.length === pathData.pages.length) {
          pathProgress.completed = true;
          awardXP(pathData.completionXP, `Completed "${pathData.name}" path`);
          dispatchCustomEvent(EVENTS.PATH_COMPLETED, { pathId: pathKey, pathData });

          // Check path completion achievements
          const completedPaths = Object.values(userData.paths).filter(p => p.completed).length;
          if (completedPaths === 1) {
            checkAndUnlockAchievement('path-master');
          }
          if (completedPaths === 3) {
            checkAndUnlockAchievement('master-of-all-paths');
          }

          showPathCompletionModal(pathData);
        }
      }
    });
  }

  // ============================================================================
  // XP & LEVELING
  // ============================================================================

  /**
   * Award XP to the user and check for level ups
   */
  function awardXP(amount, reason = '') {
    const oldXP = userData.user.totalXP;
    const oldLevel = userData.user.level;

    userData.user.totalXP += amount;

    // Check for level up
    const newLevel = calculateLevel(userData.user.totalXP);

    if (newLevel > oldLevel) {
      userData.user.level = newLevel;
      handleLevelUp(oldLevel, newLevel);
    }

    // Dispatch event
    dispatchCustomEvent(EVENTS.XP_EARNED, {
      amount,
      reason,
      oldXP,
      newXP: userData.user.totalXP,
      oldLevel,
      newLevel
    });

    // Update UI
    updateXPDisplay();
    updateLevelDisplay();

    saveUserData();
  }

  /**
   * Calculate level based on total XP
   */
  function calculateLevel(xp) {
    for (let i = learningData.levels.length - 1; i >= 0; i--) {
      const levelData = learningData.levels[i];
      if (xp >= levelData.minXP) {
        return levelData.level;
      }
    }
    return 1;
  }

  /**
   * Get level data for a specific level
   */
  function getLevelData(level) {
    return learningData.levels.find(l => l.level === level) || learningData.levels[0];
  }

  /**
   * Get current level data
   */
  function getCurrentLevelData() {
    return getLevelData(userData.user.level);
  }

  /**
   * Get next level data
   */
  function getNextLevelData() {
    return getLevelData(userData.user.level + 1);
  }

  /**
   * Calculate progress to next level (0-1)
   */
  function getProgressToNextLevel() {
    const currentLevel = getCurrentLevelData();
    const nextLevel = getNextLevelData();

    if (!nextLevel || userData.user.level >= learningData.levels.length) {
      return 1; // Max level
    }

    const currentXP = userData.user.totalXP;
    const xpInCurrentLevel = currentXP - currentLevel.minXP;
    const xpNeededForNextLevel = nextLevel.minXP - currentLevel.minXP;

    return Math.min(xpInCurrentLevel / xpNeededForNextLevel, 1);
  }

  /**
   * Get XP needed for next level
   */
  function getXPForNextLevel() {
    const nextLevel = getNextLevelData();
    if (!nextLevel || userData.user.level >= learningData.levels.length) {
      return 0; // Max level
    }
    return nextLevel.minXP - userData.user.totalXP;
  }

  /**
   * Handle level up event
   */
  function handleLevelUp(oldLevel, newLevel) {
    const levelData = getLevelData(newLevel);

    // Dispatch event
    dispatchCustomEvent(EVENTS.LEVEL_UP, { oldLevel, newLevel, levelData });

    // Show level up modal
    showLevelUpModal(oldLevel, newLevel, levelData);

    // Check level-based achievements
    if (newLevel === 2) {
      checkAndUnlockAchievement('level-up');
    }
    if (newLevel === 5) {
      checkAndUnlockAchievement('penny-expert');
    }

    console.log(`🎉 LEVEL UP! ${oldLevel} → ${newLevel} (${levelData.name})`);
  }

  // ============================================================================
  // ACHIEVEMENTS
  // ============================================================================

  /**
   * Check progress-based achievements
   */
  function checkProgressAchievements() {
    const pagesRead = userData.progress.totalPagesRead;
    const sessionPages = userData.user.currentSession.pagesRead.length;

    // Pages read achievements
    if (pagesRead >= 1) checkAndUnlockAchievement('first-steps');
    if (pagesRead >= 5) checkAndUnlockAchievement('knowledge-seeker');
    if (pagesRead >= 8) checkAndUnlockAchievement('halfway-there');
    if (pagesRead >= 10) checkAndUnlockAchievement('bookworm');
    if (pagesRead >= 16) checkAndUnlockAchievement('completionist');

    // Session achievements
    if (sessionPages >= 5) checkAndUnlockAchievement('speed-reader');

    // Visit achievements
    if (userData.user.visitCount >= 5) checkAndUnlockAchievement('dedicated-learner');
    if (userData.user.uniqueDays.length >= 3) checkAndUnlockAchievement('returning-user');

    // Achievement count achievement
    if (userData.achievements.unlocked.length >= 10) {
      checkAndUnlockAchievement('achievement-hunter');
    }
  }

  /**
   * Check and unlock a specific achievement
   */
  function checkAndUnlockAchievement(achievementId, customCondition = null) {
    // Already unlocked?
    if (userData.achievements.unlocked.includes(achievementId)) {
      return false;
    }

    const achievement = learningData.achievements.find(a => a.id === achievementId);
    if (!achievement) return false;

    // Check condition
    const meetsCondition = customCondition ?
      checkCustomCondition(achievement, customCondition) :
      checkAchievementCondition(achievement);

    if (meetsCondition) {
      unlockAchievement(achievement);
      return true;
    }

    return false;
  }

  /**
   * Check if achievement condition is met
   */
  function checkAchievementCondition(achievement) {
    const condition = achievement.condition;

    switch (condition.type) {
      case 'pagesRead':
        return userData.progress.totalPagesRead >= condition.count;

      case 'pagesInSession':
        return userData.user.currentSession.pagesRead.length >= condition.count;

      case 'pathStarted':
        const startedPaths = Object.values(userData.paths).filter(p => p.started).length;
        return startedPaths >= condition.count;

      case 'pathsCompleted':
        const completedPaths = Object.values(userData.paths).filter(p => p.completed).length;
        return completedPaths >= condition.count;

      case 'quizzesCompleted':
        return userData.quizzes.completed.length >= condition.count;

      case 'perfectQuizzes':
        return userData.quizzes.perfectQuizzes.length >= condition.count;

      case 'visitCount':
        return userData.user.visitCount >= condition.count;

      case 'uniqueDays':
        return userData.user.uniqueDays.length >= condition.count;

      case 'reachedLevel':
        return userData.user.level >= condition.level;

      case 'specificPage':
        return userData.progress.pagesRead.includes(condition.pageId);

      case 'achievementsUnlocked':
        return userData.achievements.unlocked.length >= condition.count;

      default:
        return false;
    }
  }

  /**
   * Check custom condition (for special achievements)
   */
  function checkCustomCondition(achievement, customCondition) {
    return Object.keys(customCondition).every(key => customCondition[key] === true);
  }

  /**
   * Unlock an achievement
   */
  function unlockAchievement(achievement) {
    userData.achievements.unlocked.push(achievement.id);
    userData.achievements.timestamps[achievement.id] = Date.now();

    // Award bonus XP
    if (achievement.xpBonus > 0) {
      awardXP(achievement.xpBonus, `Achievement: ${achievement.name}`);
    }

    // Dispatch event
    dispatchCustomEvent(EVENTS.ACHIEVEMENT_UNLOCKED, { achievement });

    // Show notification (only once per session to avoid spam)
    if (!userData.achievements.notifiedThisSession.includes(achievement.id)) {
      showAchievementNotification(achievement);
      userData.achievements.notifiedThisSession.push(achievement.id);
    }

    saveUserData();

    console.log(`🏆 Achievement unlocked: ${achievement.name} (+${achievement.xpBonus} XP)`);
  }

  /**
   * Check special page achievements
   */
  function checkSpecialPageAchievements(pageId) {
    const specialAchievements = {
      'faq': 'faq-master',
      'responsible-hunting': 'responsible-hunter',
      'facts-vs-myths': 'myth-buster',
      'internal-systems': 'systems-expert'
    };

    if (specialAchievements[pageId]) {
      checkAndUnlockAchievement(specialAchievements[pageId]);
    }
  }

  // ============================================================================
  // QUIZ INTEGRATION
  // ============================================================================

  /**
   * Record quiz completion
   * Call this from quiz page: window.HDPennyGuide.recordQuizCompletion('quiz-name', score, maxScore)
   */
  function recordQuizCompletion(quizId, score, maxScore) {
    // Record completion
    if (!userData.quizzes.completed.includes(quizId)) {
      userData.quizzes.completed.push(quizId);
    }

    // Record score
    userData.quizzes.scores[quizId] = {
      score,
      maxScore,
      percentage: (score / maxScore) * 100,
      timestamp: Date.now()
    };

    // Award base XP
    const baseXP = 50;
    awardXP(baseXP, `Completed quiz: ${quizId}`);

    // Perfect score bonus
    if (score === maxScore) {
      const bonusXP = 25;
      awardXP(bonusXP, `Perfect score on ${quizId}`);

      if (!userData.quizzes.perfectQuizzes.includes(quizId)) {
        userData.quizzes.perfectQuizzes.push(quizId);
      }

      // Check achievements
      checkAndUnlockAchievement('quiz-champion');
      if (userData.quizzes.perfectQuizzes.length >= 5) {
        checkAndUnlockAchievement('perfect-student');
      }
    }

    // Check quiz achievements
    if (userData.quizzes.completed.length >= 1) {
      checkAndUnlockAchievement('quiz-taker');
    }

    // Dispatch event
    dispatchCustomEvent(EVENTS.QUIZ_COMPLETED, { quizId, score, maxScore });

    saveUserData();
    updateAllUI();
  }

  // ============================================================================
  // PREFERENCE TRACKING
  // ============================================================================

  /**
   * Track dark mode usage
   */
  function trackDarkModeUsage() {
    checkAndUnlockAchievement('night-owl', { usedDarkMode: true });
  }

  /**
   * Track font size change
   */
  function trackFontSizeChange() {
    checkAndUnlockAchievement('customizer', { changedFontSize: true });
  }

  // ============================================================================
  // UI UPDATES
  // ============================================================================

  /**
   * Update all UI elements
   */
  function updateAllUI() {
    updateProgressDisplay();
    updateXPDisplay();
    updateLevelDisplay();
    updateLearningPathsDisplay();
    updateAchievementsDisplay();
    updateStatsDisplay();
  }

  /**
   * Update progress display (X/16 pages read)
   */
  function updateProgressDisplay() {
    const progressText = document.querySelector('.learning-progress-text');
    const progressBar = document.querySelector('.learning-progress-bar');

    if (progressText) {
      const total = learningData.pages.length;
      const read = userData.progress.totalPagesRead;
      progressText.textContent = `${read}/${total} pages read`;
    }

    if (progressBar) {
      const percentage = (userData.progress.totalPagesRead / learningData.pages.length) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  }

  /**
   * Update XP display
   */
  function updateXPDisplay() {
    const xpText = document.querySelector('.learning-xp-text');
    const xpBar = document.querySelector('.learning-xp-bar');
    const xpTooltip = document.querySelector('.learning-xp-tooltip');

    if (xpText) {
      const current = userData.user.totalXP;
      const needed = getXPForNextLevel();
      const nextLevel = getNextLevelData();

      if (nextLevel) {
        xpText.textContent = `${current} XP (${needed} to Level ${nextLevel.level})`;
      } else {
        xpText.textContent = `${current} XP (Max Level)`;
      }
    }

    if (xpBar) {
      const progress = getProgressToNextLevel() * 100;
      xpBar.style.width = `${progress}%`;
    }

    if (xpTooltip) {
      const current = userData.user.totalXP;
      const needed = getXPForNextLevel();
      xpTooltip.textContent = `${current} XP • ${needed} needed`;
    }
  }

  /**
   * Update level display
   */
  function updateLevelDisplay() {
    const levelBadge = document.querySelector('.learning-level-badge');
    const levelIcon = document.querySelector('.learning-level-icon');
    const levelText = document.querySelector('.learning-level-text');

    const currentLevel = getCurrentLevelData();

    if (levelIcon) {
      levelIcon.textContent = currentLevel.icon;
    }

    if (levelText) {
      levelText.textContent = `Level ${currentLevel.level}: ${currentLevel.name}`;
    }

    if (levelBadge) {
      levelBadge.style.backgroundColor = currentLevel.color;
      levelBadge.setAttribute('data-level', currentLevel.level);
    }
  }

  /**
   * Update learning paths display
   */
  function updateLearningPathsDisplay() {
    Object.entries(learningData.learningPaths).forEach(([pathKey, pathData]) => {
      const pathElement = document.querySelector(`[data-path="${pathKey}"]`);
      if (!pathElement) return;

      const pathProgress = userData.paths[pathKey];
      const completed = pathProgress.pagesCompleted.length;
      const total = pathData.pages.length;
      const percentage = (completed / total) * 100;

      // Update progress bar
      const progressBar = pathElement.querySelector('.path-progress-bar');
      if (progressBar) {
        progressBar.style.width = `${percentage}%`;
      }

      // Update progress text
      const progressText = pathElement.querySelector('.path-progress-text');
      if (progressText) {
        progressText.textContent = `${completed}/${total} pages`;
      }

      // Update status
      const statusBadge = pathElement.querySelector('.path-status');
      if (statusBadge) {
        if (pathProgress.completed) {
          statusBadge.textContent = '✓ Completed';
          statusBadge.classList.add('completed');
        } else if (pathProgress.started) {
          statusBadge.textContent = 'In Progress';
          statusBadge.classList.add('in-progress');
        } else {
          statusBadge.textContent = 'Not Started';
        }
      }
    });
  }

  /**
   * Update achievements display
   */
  function updateAchievementsDisplay() {
    const achievementsContainer = document.querySelector('.achievements-grid');
    if (!achievementsContainer) return;

    achievementsContainer.innerHTML = '';

    learningData.achievements.forEach(achievement => {
      const isUnlocked = userData.achievements.unlocked.includes(achievement.id);
      const card = createAchievementCard(achievement, isUnlocked);
      achievementsContainer.appendChild(card);
    });
  }

  /**
   * Create achievement card element
   */
  function createAchievementCard(achievement, isUnlocked) {
    const card = document.createElement('div');
    card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    card.setAttribute('data-achievement', achievement.id);

    const timestamp = userData.achievements.timestamps[achievement.id];
    const dateStr = timestamp ? new Date(timestamp).toLocaleDateString() : '';

    card.innerHTML = `
      <div class="achievement-icon">${achievement.icon}</div>
      <div class="achievement-name">${achievement.name}</div>
      <div class="achievement-description">${achievement.description}</div>
      <div class="achievement-xp">+${achievement.xpBonus} XP</div>
      ${isUnlocked ? `<div class="achievement-unlocked-date">Unlocked: ${dateStr}</div>` : ''}
    `;

    return card;
  }

  /**
   * Update stats display
   */
  function updateStatsDisplay() {
    const stats = {
      'stat-total-xp': userData.user.totalXP,
      'stat-level': `${userData.user.level} (${getCurrentLevelData().name})`,
      'stat-pages-read': `${userData.progress.totalPagesRead}/${learningData.pages.length}`,
      'stat-paths-completed': Object.values(userData.paths).filter(p => p.completed).length,
      'stat-achievements': `${userData.achievements.unlocked.length}/${learningData.achievements.length}`,
      'stat-quizzes': userData.quizzes.completed.length,
      'stat-visit-count': userData.user.visitCount,
      'stat-unique-days': userData.user.uniqueDays.length
    };

    Object.entries(stats).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  // ============================================================================
  // MODALS & NOTIFICATIONS
  // ============================================================================

  /**
   * Show level up modal with confetti
   */
  function showLevelUpModal(oldLevel, newLevel, levelData) {
    if (!userData.preferences.animationsEnabled) return;

    const modal = document.getElementById('level-up-modal');
    if (!modal) return;

    const icon = modal.querySelector('.level-up-icon');
    const title = modal.querySelector('.level-up-title');
    const message = modal.querySelector('.level-up-message');

    if (icon) icon.textContent = levelData.icon;
    if (title) title.textContent = `Level ${newLevel}: ${levelData.name}`;
    if (message) message.textContent = `You've advanced from Level ${oldLevel} to Level ${newLevel}! Keep learning!`;

    modal.style.display = 'flex';

    // Trigger confetti
    if (typeof createConfetti === 'function') {
      createConfetti();
    }

    // Play sound
    playSound('levelup');
  }

  /**
   * Show achievement notification (toast)
   */
  function showAchievementNotification(achievement) {
    if (!userData.preferences.animationsEnabled) return;

    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-notification-icon">${achievement.icon}</div>
      <div class="achievement-notification-content">
        <div class="achievement-notification-title">Achievement Unlocked!</div>
        <div class="achievement-notification-name">${achievement.name}</div>
        <div class="achievement-notification-xp">+${achievement.xpBonus} XP</div>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Play sound
    playSound('achievement');
  }

  /**
   * Show path completion modal
   */
  function showPathCompletionModal(pathData) {
    const modal = document.getElementById('path-complete-modal');
    if (!modal) return;

    const icon = modal.querySelector('.path-complete-icon');
    const title = modal.querySelector('.path-complete-title');
    const message = modal.querySelector('.path-complete-message');
    const xp = modal.querySelector('.path-complete-xp');

    if (icon) icon.textContent = pathData.icon;
    if (title) title.textContent = `${pathData.name} Complete!`;
    if (message) message.textContent = `Congratulations! You've completed the ${pathData.name} learning path.`;
    if (xp) xp.textContent = `+${pathData.completionXP} XP`;

    modal.style.display = 'flex';

    playSound('pathcomplete');
  }

  /**
   * Play sound effect
   */
  function playSound(soundName) {
    if (!userData.preferences.soundEnabled) return;

    // Placeholder - implement if audio files are added
    // const audio = new Audio(`/sounds/${soundName}.mp3`);
    // audio.play().catch(() => {}); // Ignore errors
  }

  /**
   * Create confetti animation
   */
  function createConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti = [];
    const colors = ['#f96302', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'];

    for (let i = 0; i < 50; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: -20,
        r: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        wobble: Math.random() * 2 - 1
      });
    }

    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allFallen = true;
      confetti.forEach(piece => {
        piece.y += piece.speed;
        piece.x += piece.wobble;

        ctx.fillStyle = piece.color;
        ctx.beginPath();
        ctx.arc(piece.x, piece.y, piece.r, 0, Math.PI * 2);
        ctx.fill();

        if (piece.y < canvas.height) {
          allFallen = false;
        }
      });

      if (!allFallen) {
        requestAnimationFrame(animateConfetti);
      }
    }

    animateConfetti();
  }

  // ============================================================================
  // DATA MANAGEMENT
  // ============================================================================

  /**
   * Export user data as JSON file
   */
  function exportUserData() {
    const dataStr = JSON.stringify(userData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `hdpg-progress-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Progress exported');
  }

  /**
   * Import user data from JSON file
   */
  function importUserData(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);

        // Validate data structure
        if (!imported.user || !imported.progress) {
          alert('Invalid data file');
          return;
        }

        // Confirm import
        if (!confirm('This will replace all your current progress. Continue?')) {
          return;
        }

        userData = imported;
        saveUserData();
        updateAllUI();

        dispatchCustomEvent(EVENTS.DATA_IMPORTED, { imported });

        alert('Progress imported successfully!');
        console.log('✅ Progress imported');
      } catch (error) {
        console.error('Import error:', error);
        alert('Error importing data');
      }
    };

    reader.readAsText(file);
  }

  /**
   * Reset all user data
   */
  function resetUserData() {
    const confirmed = confirm(
      'Are you sure you want to reset ALL progress?\n\n' +
      'This will delete:\n' +
      '- All page progress\n' +
      '- XP and level\n' +
      '- Learning paths\n' +
      '- Achievements\n' +
      '- Quiz scores\n\n' +
      'This cannot be undone!'
    );

    if (!confirmed) return;

    // Double confirmation
    const reallyConfirmed = confirm('Really reset everything? Last chance!');
    if (!reallyConfirmed) return;

    localStorage.removeItem(STORAGE_KEY);
    userData = getDefaultUserData();
    saveUserData();

    dispatchCustomEvent(EVENTS.DATA_RESET, {});

    alert('Progress has been reset. Reloading page...');

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  /**
   * Dispatch custom event
   */
  function dispatchCustomEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  }

  /**
   * Public API for event listeners
   */
  function addEventListener(eventName, callback) {
    window.addEventListener(eventName, callback);
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize the learning platform
   */
  async function init() {
    console.log('🚀 Initializing HD Penny Guide Learning Platform...');

    // Load learning data
    await loadLearningData();

    // Load user data
    loadUserData();

    // Track current page
    trackCurrentPage();

    // Update UI
    updateAllUI();

    // Set up event listeners
    setupEventListeners();

    console.log('✅ Learning Platform initialized');
    console.log(`📊 Stats: Level ${userData.user.level}, ${userData.user.totalXP} XP, ${userData.progress.totalPagesRead}/16 pages`);
  }

  /**
   * Set up global event listeners
   */
  function setupEventListeners() {
    // Close modal buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) modal.style.display = 'none';
      });
    });

    // Click outside modal to close
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
      }
    });

    // Export button
    const exportBtn = document.getElementById('export-progress-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportUserData);
    }

    // Import button
    const importBtn = document.getElementById('import-progress-btn');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => importUserData(e.target.files[0]);
        input.click();
      });
    }

    // Reset button
    const resetBtn = document.getElementById('reset-progress-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetUserData);
    }

    // Listen for theme/font changes from base.js
    window.addEventListener('themeChanged', () => {
      trackDarkModeUsage();
    });

    window.addEventListener('fontSizeChanged', () => {
      trackFontSizeChange();
    });
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  window.HDPennyGuide = {
    // Core functions
    init,

    // Data access
    getUserData: () => userData,
    getLearningData: () => learningData,

    // Progress tracking
    trackPage: trackCurrentPage,
    recordQuizCompletion,

    // XP & Levels
    awardXP,
    getCurrentLevel: getCurrentLevelData,
    getNextLevel: getNextLevelData,
    getProgressToNextLevel,

    // Achievements
    unlockAchievement: (id) => checkAndUnlockAchievement(id),
    getAchievements: () => learningData.achievements,
    getUnlockedAchievements: () => userData.achievements.unlocked,

    // Paths
    getLearningPaths: () => learningData.learningPaths,
    getPathProgress: (pathId) => userData.paths[pathId],

    // Data management
    export: exportUserData,
    import: importUserData,
    reset: resetUserData,
    save: saveUserData,

    // Events
    on: addEventListener,
    EVENTS,

    // UI updates
    updateUI: updateAllUI,

    // Stats
    getStats: () => ({
      totalXP: userData.user.totalXP,
      level: userData.user.level,
      pagesRead: userData.progress.totalPagesRead,
      totalPages: learningData.pages.length,
      pathsCompleted: Object.values(userData.paths).filter(p => p.completed).length,
      achievementsUnlocked: userData.achievements.unlocked.length,
      totalAchievements: learningData.achievements.length,
      quizzesCompleted: userData.quizzes.completed.length,
      visitCount: userData.user.visitCount
    })
  };

  // Expose init as global function
  window.initLearningPlatform = init;

})();
