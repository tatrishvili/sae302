// QUIZ SYSTEM
// ==============================
const quizData = {
  title: "How are you feeling about social media?",
  description: "Before you continue, answer a few questions",
  questions: [
    {
      id: 1,
      text: "How often do you edit your photos before posting?",
      options: [
        { text: "Never, I post as is", value: "never" },
        { text: "Sometimes, minor edits", value: "sometimes" },
        { text: "Often, I retouch everything", value: "often" },
        { text: "Always, perfect is required", value: "always" }
      ]
    },
    {
      id: 2,
      text: "What matters most in your posts?",
      options: [
        { text: "Being authentic", value: "authentic" },
        { text: "Looking good", value: "looking_good" },
        { text: "Getting likes", value: "likes" },
        { text: "Comparing with others", value: "comparing" }
      ]
    },
    {
      id: 3,
      text: "How do you feel after posting?",
      options: [
        { text: "Happy and satisfied", value: "happy" },
        { text: "Anxious waiting for reactions", value: "anxious" },
        { text: "Checking likes constantly", value: "checking" },
        { text: "Worried about judgment", value: "worried" }
      ]
    }
  ]
};

let currentQuestionIndex = 0;
let quizAnswers = {};

function initializeQuiz() {
  currentQuestionIndex = 0;
  quizAnswers = {};
  showQuizPopup();
}
function showQuizPopup() {
  const existingPopup = document.getElementById('quizPopup');
  if (existingPopup) {
    existingPopup.remove();
  }

  const quizPopup = document.createElement('div');
  quizPopup.id = 'quizPopup';
  quizPopup.className = 'quiz-overlay';
  quizPopup.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-header">
        <h2>${quizData.title}</h2>
        <p>${quizData.description}</p>
      </div>
      
      <div class="quiz-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%"></div>
        </div>
        <span class="progress-text">${currentQuestionIndex + 1} / ${quizData.questions.length}</span>
      </div>

      <div class="quiz-content" id="quizContent">
        ${renderQuestion()}
      </div>

      <div class="quiz-actions">
        ${currentQuestionIndex > 0 ? '<button class="quiz-btn secondary" onclick="previousQuestion()">← Back</button>' : ''}
        ${currentQuestionIndex < quizData.questions.length - 1 
          ? '<button class="quiz-btn primary" onclick="nextQuestion()" id="nextQuestionBtn" disabled>Next →</button>' 
          : '<button class="quiz-btn primary" onclick="submitQuiz()" id="submitBtn">Submit Quiz</button>'}
      </div>

      <button class="quiz-close" onclick="closeQuiz()">✕</button>
    </div>
  `;

  document.body.appendChild(quizPopup);
  
  document.body.style.overflow = 'hidden';
}

function renderQuestion() {
  const question = quizData.questions[currentQuestionIndex];
  
  return `
    <div class="quiz-question">
      <h3>${question.text}</h3>
      <div class="quiz-options">
        ${question.options.map(option => `
          <label class="quiz-option">
            <input 
              type="radio" 
              name="question-${question.id}" 
              value="${option.value}"
              onchange="selectAnswer(${question.id}, '${option.value}')"
              ${quizAnswers[question.id] === option.value ? 'checked' : ''}
            >
            <span class="option-text">${option.text}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;
}

function selectAnswer(questionId, value) {
  quizAnswers[questionId] = value;
  
  // Enable next button
  const nextBtn = document.getElementById('nextQuestionBtn');
  if (nextBtn) {
    nextBtn.disabled = false;
  }
}

function nextQuestion() {
  if (currentQuestionIndex < quizData.questions.length - 1) {
    if (quizAnswers[quizData.questions[currentQuestionIndex].id]) {
      currentQuestionIndex++;
      showQuizPopup();
    } else {
      alert('Please select an answer before continuing');
    }
  }
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuizPopup();
  }
}

function submitQuiz() {
  // Check all questions are answered
  const allAnswered = quizData.questions.every(q => quizAnswers[q.id]);
  
  if (!allAnswered) {
    alert('Please answer all questions');
    return;
  }

  // Store quiz results in sessionStorage
  sessionStorage.setItem('quizResults', JSON.stringify(quizAnswers));
  sessionStorage.setItem('quizCompleted', 'true');

  console.log('Quiz Answers:', quizAnswers);
  
  closeQuiz();
  

  showQuizSuccess();
  setTimeout(() => {
    showProfileResults();
    saveQuizToDB();
  }, 5500);
}

function showQuizSuccess() {
  const successMsg = document.createElement('div');
  successMsg.className = 'quiz-success';
  successMsg.innerHTML = `
    <div class="success-content">
      <h3>Thank you for your honesty! 💙</h3>
      <p>Your answers help us understand the impact of social media.</p>
    </div>
  `;
  
  document.body.appendChild(successMsg);
  
  setTimeout(() => {
    successMsg.remove();
  }, 5500);
}

function closeQuiz() {
  const quizPopup = document.getElementById('quizPopup');
  if (quizPopup) {
    quizPopup.remove();
  }
  
  sessionStorage.removeItem('quizShown');
  
  document.body.style.overflow = 'auto';
}

function triggerQuizAfterLastPost() {
  const feed = document.getElementById('feedContent');
  
  if (!feed) {
    console.warn('Feed element not found');
    return;
  }
  setTimeout(() => {
    const lastPost = feed.querySelector('.post-card:last-child');
    
    if (!lastPost) {
      console.warn('Last post not found');
      return;
    }
    if (sessionStorage.getItem('quizCompleted')) {
      return;
    }

    if (sessionStorage.getItem('quizShown')) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !sessionStorage.getItem('quizCompleted') && !sessionStorage.getItem('quizShown')) {
          sessionStorage.setItem('quizShown', 'true');
          initializeQuiz();
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    observer.observe(lastPost);
  }, 500);
}
