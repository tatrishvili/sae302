// QUIZ RESULTS & PROFILE SYSTEM
// ==============================

const profileDefinitions = {
  authentic: {
    name: "The Authentic",
    description: "You prioritize being genuine over perfection",
    icon: "🌱",
    color: "#4CAF50",
    traits: [
      "Confident in your identity",
      "Shares real moments",
      "Values honest connections",
      "Doesn't seek constant validation"
    ],
    message: "You're comfortable with who you are. You post to share experiences, not to impress others.",
    advice: "Keep being yourself! Your authenticity is attractive and draws real friends."
  },
  careful: {
    name: "The Careful Curator",
    description: "You balance authenticity with presentation",
    icon: "🎨",
    color: "#2196F3",
    traits: [
      "Thoughtful about your image",
      "Selective with what you share",
      "Values presentation",
      "Moderately influenced by others"
    ],
    message: "You like to present your best self while staying true to who you are.",
    advice: "You're finding a healthy balance. Just make sure the 'curated version' is still recognizably you."
  },
  perfectionist: {
    name: "The Perfectionist",
    description: "You aim for the perfect presentation",
    icon: "✨",
    color: "#FF9800",
    traits: [
      "High standards for yourself",
      "Values appearance & likes",
      "Seeks validation",
      "Influenced by others' posts"
    ],
    message: "You put effort into your image, but be careful not to lose yourself in the process.",
    advice: "Remember: nobody's life is perfect, not even the ones that look perfect online."
  },
  struggling: {
    name: "The Struggling Seeker",
    description: "Social media is affecting your self-esteem",
    icon: "💭",
    color: "#E91E63",
    traits: [
      "Very influenced by others",
      "Seeks constant validation",
      "Anxious about your image",
      "Compares yourself to others"
    ],
    message: "You're feeling the pressure of social media. Your worth isn't measured in likes.",
    advice: "Consider taking breaks from social media. Focus on real-life connections instead."
  }
};

function calculateQuizResults() {
  const quizResults = sessionStorage.getItem('quizResults');
  if (!quizResults) return null;

  const answers = JSON.parse(quizResults);
  
  // Scoring system
  const scores = {
    authentic: 0,
    careful: 0,
    perfectionist: 0,
    struggling: 0
  };

  // Question 1: How often do you edit?
  const editFrequency = answers[1];
  if (editFrequency === 'never') {
    scores.authentic += 3;
  } else if (editFrequency === 'sometimes') {
    scores.careful += 3;
  } else if (editFrequency === 'often') {
    scores.perfectionist += 2;
    scores.careful += 1;
  } else if (editFrequency === 'always') {
    scores.perfectionist += 3;
  }

  // Question 2: What matters most?
  const matters = answers[2];
  if (matters === 'authentic') {
    scores.authentic += 3;
  } else if (matters === 'looking_good') {
    scores.careful += 2;
    scores.perfectionist += 1;
  } else if (matters === 'likes') {
    scores.perfectionist += 2;
    scores.struggling += 1;
  } else if (matters === 'comparing') {
    scores.struggling += 3;
  }

  // Question 3: How do you feel after posting?
  const feeling = answers[3];
  if (feeling === 'happy') {
    scores.authentic += 3;
  } else if (feeling === 'anxious') {
    scores.careful += 2;
    scores.struggling += 1;
  } else if (feeling === 'checking') {
    scores.perfectionist += 2;
    scores.struggling += 1;
  } else if (feeling === 'worried') {
    scores.struggling += 3;
  }

  // Determine profile (highest score)
  let profile = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );

  const result = {
    profile: profile,
    scores: scores,
    answers: answers,
    timestamp: new Date().toISOString()
  };

  // Store in sessionStorage
  sessionStorage.setItem('quizProfile', JSON.stringify(result));

  return result;
}

function getProfileData(profileType) {
  return profileDefinitions[profileType];
}

function showProfileResults() {
  const result = calculateQuizResults();
  if (!result) {
    console.error('No quiz results found');
    return;
  }

  const profileData = getProfileData(result.profile);
  const overlay = document.createElement('div');
  overlay.id = 'profileResultsOverlay';
  overlay.className = 'profile-results-overlay';
  overlay.innerHTML = `
    <div class="profile-results-container">
      <button class="close-btn" onclick="closeProfileResults()">✕</button>
      
      <div class="profile-header" style="border-color: ${profileData.color};">
        <div class="profile-icon">${profileData.icon}</div>
        <h2>${profileData.name}</h2>
        <p class="profile-subtitle">${profileData.description}</p>
      </div>

      <div class="profile-message">
        <p>"${profileData.message}"</p>
      </div>

      <div class="profile-traits">
        <h3>About You:</h3>
        <ul>
          ${profileData.traits.map(trait => `<li>${trait}</li>`).join('')}
        </ul>
      </div>

      <div class="profile-advice">
        <h3>Our Advice:</h3>
        <p>${profileData.advice}</p>
      </div>

      <div class="profile-actions">
        <button class="btn secondary" onclick="shareProfile()">Share Profile 📤</button>
        <button class="btn primary" onclick="closeProfileResults()">Continue</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

function closeProfileResults() {
  const overlay = document.getElementById('profileResultsOverlay');
  if (overlay) {
    overlay.remove();
  }
  document.body.style.overflow = 'auto';
}

function viewFullProfile() {
  // Navigate to full profile page
  sessionStorage.setItem('viewingQuizProfile', 'true');
  window.location.href = 'quiz-profile.html';
}

function shareProfile() {
  const result = JSON.parse(sessionStorage.getItem('quizProfile'));
  const profileData = getProfileData(result.profile);
  
  const shareText = `I just discovered I'm "${profileData.name}" on the Amically quiz! ${profileData.icon}
${profileData.description}
Do you know your social media personality?`;

  if (navigator.share) {
    navigator.share({
      title: 'Amically Quiz Result',
      text: shareText
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(shareText);
    alert('Profile copied to clipboard!');
  }
}

// Save to database
async function saveQuizToDB() {
  const result = JSON.parse(sessionStorage.getItem('quizProfile'));
  
  try {
    const response = await fetch('/api/quiz/save-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: sessionStorage.getItem('userId') || 'anonymous',
        profile: result.profile,
        scores: result.scores,
        answers: result.answers,
        timestamp: result.timestamp
      })
    });

    const data = await response.json();
    console.log('Quiz result saved:', data);
    return data;
  } catch (error) {
    console.error('Error saving quiz result:', error);
  }
}
