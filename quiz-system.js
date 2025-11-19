/**
 * Interactive Quiz System for HD Penny Guide
 * Features:
 * - Multiple question types (multiple-choice, multiple-select, true-false)
 * - Complete quiz flow with feedback
 * - Score tracking and time tracking
 * - Integration with learning platform (XP and achievements)
 * - Review mode
 * - Progress persistence
 */

(function() {
  'use strict';

  // State
  let quizData = null;
  let currentQuiz = null;
  let currentQuestionIndex = 0;
  let userAnswers = [];
  let quizStartTime = null;
  let quizContainer = null;
  let score = 0;
  let totalPoints = 0;

  // Constants
  const STORAGE_KEY = 'hdPennyGuide';
  const BASE_XP = 50;
  const PERFECT_BONUS_XP = 25;

  // Initialize quiz system
  async function initQuizzes() {
    try {
      // Load quiz data
      await loadQuizData();

      // Cache container
      quizContainer = document.getElementById('quiz-container');

      if (!quizContainer) {
        console.warn('⚠️ Quiz container not found on this page');
        return;
      }

      // Setup quiz list or individual quiz
      const urlParams = new URLSearchParams(window.location.search);
      const quizId = urlParams.get('quiz');

      if (quizId) {
        // Load specific quiz
        startQuiz(quizId);
      } else {
        // Show quiz selection
        showQuizSelection();
      }

      console.log('✅ Quiz system initialized');
    } catch (error) {
      console.error('❌ Failed to initialize quiz system:', error);
    }
  }

  // Load quiz data from JSON
  async function loadQuizData() {
    try {
      const response = await fetch('quizzes.json');
      if (!response.ok) {
        throw new Error('Failed to load quiz data');
      }
      const data = await response.json();
      quizData = data.quizzes;
    } catch (error) {
      console.error('Error loading quiz data:', error);
      quizData = [];
    }
  }

  // Show quiz selection screen
  function showQuizSelection() {
    if (!quizData || quizData.length === 0) {
      quizContainer.innerHTML = '<p>No quizzes available.</p>';
      return;
    }

    const completedQuizzes = getCompletedQuizzes();

    const html = `
      <div class="quiz-selection">
        <h2>Choose a Quiz</h2>
        <p class="quiz-intro">Test your knowledge and earn XP!</p>
        <div class="quiz-list">
          ${quizData.map(quiz => {
            const isCompleted = completedQuizzes[quiz.id];
            const bestScore = isCompleted ? completedQuizzes[quiz.id].bestScore : 0;
            const attempts = isCompleted ? completedQuizzes[quiz.id].attempts : 0;

            return `
              <div class="quiz-card ${isCompleted ? 'completed' : ''}" data-quiz-id="${quiz.id}">
                <div class="quiz-card-header">
                  <h3>${quiz.title}</h3>
                  ${isCompleted ? '<span class="quiz-badge">✓ Completed</span>' : ''}
                </div>
                <p class="quiz-description">${quiz.description}</p>
                <div class="quiz-meta">
                  <span class="quiz-difficulty difficulty-${quiz.difficulty}">${quiz.difficulty}</span>
                  <span class="quiz-questions">${quiz.questions.length} questions</span>
                  <span class="quiz-time">~${quiz.estimatedTime} min</span>
                  <span class="quiz-xp">+${quiz.xpReward} XP</span>
                </div>
                ${isCompleted ? `
                  <div class="quiz-stats">
                    <span>Best: ${bestScore}%</span>
                    <span>Attempts: ${attempts}</span>
                  </div>
                ` : ''}
                <button class="quiz-start-btn" onclick="window.quizSystem.startQuiz('${quiz.id}')">
                  ${isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    quizContainer.innerHTML = html;
  }

  // Start a specific quiz
  function startQuiz(quizId) {
    currentQuiz = quizData.find(q => q.id === quizId);

    if (!currentQuiz) {
      console.error('Quiz not found:', quizId);
      return;
    }

    // Reset state
    currentQuestionIndex = 0;
    userAnswers = [];
    score = 0;
    totalPoints = currentQuiz.questions.reduce((sum, q) => sum + q.points, 0);
    quizStartTime = Date.now();

    // Randomize question order (optional)
    // currentQuiz.questions = shuffleArray([...currentQuiz.questions]);

    // Show start screen
    showStartScreen();
  }

  // Show quiz start screen
  function showStartScreen() {
    const html = `
      <div class="quiz-start">
        <div class="quiz-start-content">
          <h2>${currentQuiz.title}</h2>
          <p class="quiz-description">${currentQuiz.description}</p>

          <div class="quiz-details">
            <div class="detail-item">
              <span class="detail-icon">📝</span>
              <div>
                <strong>${currentQuiz.questions.length}</strong>
                <span>Questions</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-icon">⏱️</span>
              <div>
                <strong>~${currentQuiz.estimatedTime}</strong>
                <span>Minutes</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-icon">⭐</span>
              <div>
                <strong>+${currentQuiz.xpReward}</strong>
                <span>Base XP</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🎯</span>
              <div>
                <strong>${currentQuiz.difficulty}</strong>
                <span>Difficulty</span>
              </div>
            </div>
          </div>

          <div class="quiz-tips">
            <h3>Tips:</h3>
            <ul>
              <li>Read each question carefully</li>
              <li>You'll get immediate feedback after each answer</li>
              <li>Perfect score earns bonus XP (+${PERFECT_BONUS_XP})</li>
              <li>You can retake quizzes to improve your score</li>
            </ul>
          </div>

          <button class="btn-primary btn-large" onclick="window.quizSystem.showQuestion()">
            Begin Quiz
          </button>
          <button class="btn-secondary" onclick="window.quizSystem.showQuizSelection()">
            Back to Quiz List
          </button>
        </div>
      </div>
    `;

    quizContainer.innerHTML = html;
  }

  // Show current question
  function showQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

    // Randomize answer order for multiple choice/select
    let answersToShow = [...question.answers];
    if (question.type !== 'true-false') {
      answersToShow = shuffleArray(answersToShow);
    }

    const html = `
      <div class="quiz-question">
        <div class="quiz-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="progress-text">
            Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}
          </div>
        </div>

        <div class="question-content">
          <div class="question-difficulty difficulty-${question.difficulty}">
            ${question.difficulty}
          </div>
          <h3 class="question-text">${question.question}</h3>

          <div class="question-answers" data-question-type="${question.type}">
            ${answersToShow.map((answer, index) => {
              const inputType = question.type === 'multiple-select' ? 'checkbox' : 'radio';
              const inputId = `answer-${index}`;

              return `
                <label class="answer-option" for="${inputId}">
                  <input
                    type="${inputType}"
                    id="${inputId}"
                    name="answer"
                    value="${answer}"
                  />
                  <span class="answer-text">${answer}</span>
                </label>
              `;
            }).join('')}
          </div>

          <button
            class="btn-primary"
            id="submit-answer-btn"
            onclick="window.quizSystem.submitAnswer()"
          >
            Submit Answer
          </button>
        </div>
      </div>
    `;

    quizContainer.innerHTML = html;
  }

  // Submit current answer
  function submitAnswer() {
    const question = currentQuiz.questions[currentQuestionIndex];
    const answerInputs = document.querySelectorAll('input[name="answer"]');

    let selectedAnswers = [];
    answerInputs.forEach(input => {
      if (input.checked) {
        selectedAnswers.push(input.value);
      }
    });

    if (selectedAnswers.length === 0) {
      alert('Please select an answer');
      return;
    }

    // Check if answer is correct
    const isCorrect = checkAnswer(question, selectedAnswers);

    // Store answer
    userAnswers.push({
      questionId: question.id,
      selected: selectedAnswers,
      correct: question.correct,
      isCorrect: isCorrect,
      points: isCorrect ? question.points : 0
    });

    // Update score
    if (isCorrect) {
      score += question.points;
    }

    // Show feedback
    showFeedback(question, selectedAnswers, isCorrect);
  }

  // Check if answer is correct
  function checkAnswer(question, selectedAnswers) {
    if (question.type === 'multiple-select') {
      // For multiple select, must match all correct answers
      const correct = Array.isArray(question.correct) ? question.correct : [question.correct];
      if (selectedAnswers.length !== correct.length) return false;

      return selectedAnswers.every(answer => correct.includes(answer)) &&
             correct.every(answer => selectedAnswers.includes(answer));
    } else {
      // For single answer, just check if it matches
      const correct = Array.isArray(question.correct) ? question.correct[0] : question.correct;
      return selectedAnswers[0] === correct;
    }
  }

  // Show answer feedback
  function showFeedback(question, selectedAnswers, isCorrect) {
    const html = `
      <div class="quiz-feedback">
        <div class="feedback-result ${isCorrect ? 'correct' : 'incorrect'}">
          <div class="feedback-icon">
            ${isCorrect ? '✓' : '✗'}
          </div>
          <h3>${isCorrect ? 'Correct!' : 'Incorrect'}</h3>
          <div class="feedback-points">
            ${isCorrect ? `+${question.points} points` : '0 points'}
          </div>
        </div>

        <div class="feedback-explanation">
          <h4>Explanation:</h4>
          <p>${question.explanation}</p>
        </div>

        ${!isCorrect ? `
          <div class="feedback-correct-answer">
            <h4>Correct answer${Array.isArray(question.correct) && question.correct.length > 1 ? 's' : ''}:</h4>
            <ul>
              ${(Array.isArray(question.correct) ? question.correct : [question.correct]).map(ans =>
                `<li>${ans}</li>`
              ).join('')}
            </ul>
          </div>
        ` : ''}

        <div class="feedback-actions">
          <button class="btn-primary btn-large" onclick="window.quizSystem.nextQuestion()">
            ${currentQuestionIndex < currentQuiz.questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        </div>
      </div>
    `;

    quizContainer.innerHTML = html;
  }

  // Move to next question
  function nextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuiz.questions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }

  // Show quiz results
  function showResults() {
    const quizEndTime = Date.now();
    const timeElapsed = Math.round((quizEndTime - quizStartTime) / 1000); // seconds
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;

    const percentage = Math.round((score / totalPoints) * 100);
    const isPerfect = percentage === 100;

    // Calculate XP
    let xpEarned = currentQuiz.xpReward;
    if (isPerfect) {
      xpEarned += PERFECT_BONUS_XP;
    }

    // Save completion
    saveQuizCompletion(currentQuiz.id, percentage, timeElapsed);

    // Award XP through learning platform
    if (window.LearningPlatform && window.LearningPlatform.awardXP) {
      window.LearningPlatform.awardXP(xpEarned, `Completed ${currentQuiz.title}`);
    }

    // Unlock achievements
    if (isPerfect && window.LearningPlatform && window.LearningPlatform.unlockAchievement) {
      window.LearningPlatform.unlockAchievement('perfect-quiz');
    }

    const html = `
      <div class="quiz-results">
        <div class="results-header">
          <h2>Quiz Complete!</h2>
          <div class="results-score ${isPerfect ? 'perfect' : ''}">
            ${percentage}%
          </div>
          <div class="results-message">
            ${isPerfect ? '🎉 Perfect Score!' : percentage >= 80 ? '👍 Great Job!' : percentage >= 60 ? '👌 Good Effort!' : '📚 Keep Learning!'}
          </div>
        </div>

        <div class="results-stats">
          <div class="stat-item">
            <span class="stat-label">Score</span>
            <span class="stat-value">${score} / ${totalPoints}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Correct</span>
            <span class="stat-value">${userAnswers.filter(a => a.isCorrect).length} / ${currentQuiz.questions.length}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Time</span>
            <span class="stat-value">${minutes}:${seconds.toString().padStart(2, '0')}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">XP Earned</span>
            <span class="stat-value">+${xpEarned} XP</span>
          </div>
        </div>

        ${isPerfect ? `
          <div class="perfect-bonus">
            ⭐ Perfect Score Bonus: +${PERFECT_BONUS_XP} XP!
          </div>
        ` : ''}

        <div class="results-actions">
          <button class="btn-primary" onclick="window.quizSystem.showReview()">
            📝 Review Answers
          </button>
          <button class="btn-secondary" onclick="window.quizSystem.startQuiz('${currentQuiz.id}')">
            🔄 Retake Quiz
          </button>
          <button class="btn-secondary" onclick="window.quizSystem.showQuizSelection()">
            📚 Back to Quizzes
          </button>
        </div>
      </div>
    `;

    quizContainer.innerHTML = html;
  }

  // Show review mode
  function showReview() {
    const html = `
      <div class="quiz-review">
        <div class="review-header">
          <h2>Review Your Answers</h2>
          <button class="btn-secondary" onclick="window.quizSystem.showResults()">
            ← Back to Results
          </button>
        </div>

        <div class="review-questions">
          ${currentQuiz.questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer.isCorrect;

            return `
              <div class="review-question ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="review-question-header">
                  <span class="review-number">Question ${index + 1}</span>
                  <span class="review-result">${isCorrect ? '✓ Correct' : '✗ Incorrect'}</span>
                </div>

                <h4 class="review-question-text">${question.question}</h4>

                <div class="review-answer-section">
                  <div class="review-your-answer">
                    <strong>Your answer:</strong>
                    <ul>
                      ${userAnswer.selected.map(ans => `<li>${ans}</li>`).join('')}
                    </ul>
                  </div>

                  ${!isCorrect ? `
                    <div class="review-correct-answer">
                      <strong>Correct answer:</strong>
                      <ul>
                        ${(Array.isArray(question.correct) ? question.correct : [question.correct]).map(ans =>
                          `<li>${ans}</li>`
                        ).join('')}
                      </ul>
                    </div>
                  ` : ''}

                  <div class="review-explanation">
                    <strong>Explanation:</strong>
                    <p>${question.explanation}</p>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    quizContainer.innerHTML = html;
  }

  // Save quiz completion to localStorage
  function saveQuizCompletion(quizId, percentage, timeElapsed) {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

      if (!data.quizzes) {
        data.quizzes = {};
      }

      if (!data.quizzes[quizId]) {
        data.quizzes[quizId] = {
          attempts: 0,
          bestScore: 0,
          totalTime: 0,
          lastAttempt: null
        };
      }

      data.quizzes[quizId].attempts++;
      data.quizzes[quizId].bestScore = Math.max(data.quizzes[quizId].bestScore, percentage);
      data.quizzes[quizId].totalTime += timeElapsed;
      data.quizzes[quizId].lastAttempt = new Date().toISOString();

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving quiz completion:', error);
    }
  }

  // Get completed quizzes from localStorage
  function getCompletedQuizzes() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return data.quizzes || {};
    } catch (error) {
      console.error('Error loading completed quizzes:', error);
      return {};
    }
  }

  // Utility: Shuffle array
  function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Expose public API
  window.quizSystem = {
    initQuizzes,
    startQuiz,
    showQuizSelection,
    showQuestion,
    submitAnswer,
    nextQuestion,
    showResults,
    showReview
  };

  // Also expose init function directly
  window.initQuizzes = initQuizzes;

})();
