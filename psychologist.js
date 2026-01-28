// Psychologist Q&A Data with translations
const psychologistQA = [
  {
    id: 1,
    question: "Why can't I stop comparing myself to everyone around me?",
    questionFr: "Pourquoi est-ce que je n'arrive pas à arrêter de me comparer à tout le monde autour de moi ?",
    answers: [
      "Social comparison is a mechanism that is useful to us as humans. It allows us to situate ourselves within a group, to find inspiration, and to be able to progress.",
      "When we compare ourselves to others by always considering them as superior to ourselves, we speak of upward comparison. When this type of comparison is frequent and focuses on points that are important to our identity (appearance, perception of success...), it leads us to have negative thoughts about ourselves and to compare ourselves again to reposition ourselves, set new (often unrealistic) objectives, and so on.",
      "Social networks are often platforms where the frequency of upward comparison is high, and the image we compare ourselves to is biased (unrealistic) because it represents only a moment in someone's life, generally a valorizing one, and it can even be presented in an enhanced way (filters, for example)."
    ]
  },
  {
    id: 2,
    question: "Even though I like my photo before posting it, I still feel nervous once it's online.",
    questionFr: "Même si j'aime ma photo avant de la poster, je me sens quand même nerveuse une fois c'est en ligne.",
    answers: [
      "When you choose a photo of yourself, you base it on your own criteria of what you like to see, with the perspective you have of yourself. When the photo is published, it becomes an exposure to the views of others, and therefore to the criteria of other people.",
      "This can lead to receiving signs of validation (on social networks in the form of comments, likes...) or signs of invalidation (negative comments...). When we don't feel validated, we can experience a feeling of rejection, thus feeling threatened in our social integration and vulnerable. The nervousness can come from this risk.",
      "A photo on social networks is exposed to more potential views than if you choose directly who to show it to in person. Sometimes it's even exposed to the views of people you're not close to, so more criteria different from yours and potentially less kindness than in person.",
      "On social networks, the way to receive approval can be quantified and compared to others... we come back to the first question."
    ]
  },
  {
    id: 3,
    question: "Why do I always have the feeling that everything I do is never enough to be at the level of others?",
    questionFr: "Pourquoi j'ai toujours l'impression que tout ce que je fais n'est jamais suffisant pour être à la hauteur des autres ?",
    answers: [
      "Not feeling at the level of others is generally linked to self-esteem, that is, the value you accord to yourself.",
      "When you compare yourself to others, finding them superior, upward comparison as is often the case on social networks, the threshold to reach to find yourself 'just as good,' 'at the level' increases permanently. You will find a higher comparison each time. This threshold is therefore unattainable.",
      "The criteria are always higher, your view of yourself always more critical. We can find a form of perfectionism.",
      "When you constantly feel like a failure, self-esteem decreases."
    ]
  },
  {
    id: 4,
    question: "What makes people today try so hard to surpass one another?",
    questionFr: "Qu'est ce qui fait que les gens aujourd'hui essayent toujours autant de se surpasser les uns les autres ?",
    answers: [
      "This can be related to an image of 'success' in our society: showing that you are competent in what you do, that you are efficient at all times, and that others perceive you this way. It can also be related to the image broadcast in the media and thus also on social networks.",
      "The representations are generally like this: there are few images of people in moments of vulnerability. This distorts the image of the 'norm' if we only see people who are doing well or who face difficulties quickly and apparently easily.",
      "If everyone finds themselves in the need to have something 'sufficiently' valorizing to share, it's therefore beyond the already biased 'norm.' So there is a form of competition to do even 'better' and even more 'valorizing' to be recognized and not 'just at the same level as another accomplishment,' which is then perceived as 'normal.'"
    ]
  }
];

let selectedQuestion = null;

function initializePsychologistChat() {
  const questionsList = document.getElementById('questionsList');
  
  // Clear existing questions to prevent duplicates
  questionsList.innerHTML = '';
  
  // Create question buttons
  psychologistQA.forEach(qa => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.innerHTML = `
      <button class="question-btn" onclick="selectQuestion(${qa.id})">
        <span class="question-text">${qa.question}</span>
        <span class="question-arrow">›</span>
      </button>
    `;
    questionsList.appendChild(questionDiv);
  });
}

function selectQuestion(questionId) {
  selectedQuestion = questionId;
  const qa = psychologistQA.find(q => q.id === questionId);
  
  if (!qa) return;
  
  // Hide questions, show chat
  document.getElementById('questionsSection').style.display = 'none';
  document.getElementById('chatSection').style.display = 'flex';
  
  // Clear previous messages
  const messagesContainer = document.getElementById('messagesContainer');
  messagesContainer.innerHTML = '';
  
  // Add question from user
  const userMessageDiv = document.createElement('div');
  userMessageDiv.className = 'message user-message';
  userMessageDiv.textContent = qa.question;
  messagesContainer.appendChild(userMessageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Send answers one by one with typing animation
  qa.answers.forEach((answer, index) => {
    setTimeout(() => {
      // Create typing indicator message
      const typingDiv = document.createElement('div');
      typingDiv.className = 'message psychologist-message typing-indicator';
      typingDiv.id = `typingIndicator-${index}`;
      typingDiv.innerHTML = `
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      `;
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // After typing animation, replace with actual message
      setTimeout(() => {
        const typing = document.getElementById(`typingIndicator-${index}`);
        if (typing) {
          typing.remove();
        }
        
        // Add psychologist message
        const psychologistMessageDiv = document.createElement('div');
        psychologistMessageDiv.className = 'message psychologist-message';
        psychologistMessageDiv.textContent = answer;
        messagesContainer.appendChild(psychologistMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 800); // Show typing for 800ms
    }, 1500 * (index + 1)); // Stagger between messages
  });
}

function closePsychologistModal() {
  // Deprecated - not used on psychologist.html page
}

function openChatInterface() {
  // Hide video section and show questions
  document.getElementById('videoSection').style.display = 'none';
  document.getElementById('questionsSection').style.display = 'block';
  document.getElementById('chatSection').style.display = 'none';
  
  // Clear and initialize the questions list
  const questionsList = document.getElementById('questionsList');
  if (questionsList) {
    questionsList.innerHTML = '';
    initializePsychologistChat();
  }
  
  // Scroll to top of questions section
  setTimeout(() => {
    const questionsSection = document.getElementById('questionsSection');
    if (questionsSection) {
      questionsSection.scrollTop = 0;
    }
  }, 100);
}

function backToVideo() {
  document.getElementById('videoSection').style.display = 'block';
  document.getElementById('questionsSection').style.display = 'none';
  document.getElementById('chatSection').style.display = 'none';
}

function backToQuestions() {
  document.getElementById('questionsSection').style.display = 'block';
  document.getElementById('chatSection').style.display = 'none';
  // Clear messages
  document.getElementById('messagesContainer').innerHTML = '';
  // Reset the questions list to show fresh buttons
  initializePsychologistChat();
  // Scroll to top of questions
  document.getElementById('questionsSection').scrollTop = 0;
}

function closeSelfConfidencePopup() {
  // Deprecated - no longer used
}

function goBackToFeed() {
  // Navigate to disconnection scene where Justine shows her overwhelm
  // User can then choose to continue to feed or disconnect completely
  window.location.href = 'disconnection-scene.html';
}

function showSelfConfidencePopup() {
  // Deprecated - no longer used
}

function showJustineThoughtPopup() {
  // Deprecated - no longer used
}
