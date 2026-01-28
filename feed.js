let feed;
let popupShown = false;
let secondPostPopupShown = false;
let quizShown = false;
let transitionsShown = {
  transition1: false,
  transition2: false
};

document.addEventListener('DOMContentLoaded', () => {
  feed = document.getElementById('feedContent');

  // Clear old posts on fresh start (if no justinePost data)
  const hasCurrentPost = sessionStorage.getItem('justinePost');
  if (!hasCurrentPost) {
    sessionStorage.removeItem('justinePostsArray');
    sessionStorage.removeItem('stoppedIndex');
    sessionStorage.removeItem('feedScrollPosition');
    // Clear quiz flags to allow quiz to show
    sessionStorage.removeItem('quizShown');
    sessionStorage.removeItem('quizCompleted');
  }

  loadProfileImage();

  restoreScrollPosition();

  resumeAfterPost();
  setupScrollStop();
  setupJustineTransitions();

  document.getElementById('popupPostBtn').onclick = () => {
    window.location.href = 'edit-post.html';
  };
  setupSelfConfidenceButton();
});



function setupJustineTransitions() {
  setupTransitionTrigger('post-6', 'justineTransition1', 'transition1', 8000);
  setupTransitionTriggerForRaphPost();
}

function setupTransitionTrigger(triggerClass, transitionId, transitionKey, displayDuration) {
  const triggerElement = document.querySelector(`[data-scroll-trigger="${triggerClass}"]`);
  
  if (!triggerElement) {
    console.warn(`Transition trigger not found: ${triggerClass}`);
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      // Only trigger once and only when element is intersecting
      if (entry.isIntersecting && !transitionsShown[transitionKey]) {
        transitionsShown[transitionKey] = true;
        showJustineTransition(transitionId, displayDuration);
        observer.unobserve(entry.target); // Stop observing after triggered
      }
    });
  }, {
    root: feed,
    threshold: 0.4
  });

  observer.observe(triggerElement);
}

function setupTransitionTriggerForRaphPost() {
  // Setup observer for Raph post - will be created dynamically
  const setupRaphObserver = () => {
    const raphCard = feed.querySelector('[data-raph-post]');
    if (!raphCard) {
      // Not yet added, try again later
      setTimeout(setupRaphObserver, 500);
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !transitionsShown['transition2']) {
          transitionsShown['transition2'] = true;
          showJustineTransition('justineTransition2', 8000);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: feed,
      threshold: 0.4
    });

    observer.observe(raphCard);
  };

  setupRaphObserver();
}

function showJustineTransition(transitionId, displayDuration = 8000) {
  const transition = document.getElementById(transitionId);
  if (!transition) {
    console.error(`Transition element not found: ${transitionId}`);
    return;
  }

  // Show the transition overlay
  transition.classList.remove('hidden');
  feed.style.overflowY = 'hidden';

  // Auto-hide after duration
  const hideTimer = setTimeout(() => {
    hideJustineTransition(transitionId);
  }, displayDuration);

  // Allow click to skip - remove existing listeners to prevent duplicates
  const handleClick = (e) => {
    e.stopPropagation();
    clearTimeout(hideTimer);
    hideJustineTransition(transitionId);
    transition.removeEventListener('click', handleClick);
  };
  
  transition.addEventListener('click', handleClick);
}

function hideJustineTransition(transitionId) {
  const transition = document.getElementById(transitionId);
  if (!transition) {
    console.error(`Transition element not found: ${transitionId}`);
    return;
  }

  // Add fade-out animation
  transition.classList.add('transition-fade-out');
  
  // Wait for animation to complete before hiding
  setTimeout(() => {
    transition.classList.add('hidden');
    transition.classList.remove('transition-fade-out');
    
    // Resume feed scrolling
    if (feed) {
      feed.style.overflowY = 'auto';
    }
  }, 500);
}

function setupScrollStop() {
  const trigger = document.getElementById('modalTriggerPoint');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !popupShown) {
        popupShown = true;
        stopScrollAndShowPopup();
        // Unobserve after first trigger so it doesn't trigger again
        observer.unobserve(trigger);
      }
    });
  }, {
    root: feed,
    threshold: 0.6
  });

  observer.observe(trigger);
}

function stopScrollAndShowPopup() {
  feed.style.overflowY = 'hidden';

  const posts = feed.querySelectorAll('.post-card');
  const scrollPosition = feed.scrollTop;
  

  sessionStorage.setItem('feedScrollPosition', scrollPosition);
  sessionStorage.setItem('stoppedIndex', posts.length);

  setTimeout(() => {
    document.getElementById('justinePopup').classList.remove('hidden');
  }, 1000);
}

function resumeAfterPost() {
  const postData = sessionStorage.getItem('justinePost');
  if (!postData) return;

  const post = JSON.parse(postData);
  const index = Number(sessionStorage.getItem('stoppedIndex'));

  insertJustinePost(post, index);
  

  const postsData = sessionStorage.getItem('justinePostsArray');
  const postsArray = postsData ? JSON.parse(postsData) : [];
  

  addNewPostsAfterJustine();

  feed.style.overflowY = 'auto';

  const cards = feed.querySelectorAll('.post-card');
  if (cards[index]) {
    cards[index].scrollIntoView({ block: 'start' });
  }

  setTimeout(() => {
    // Call the quiz.js version which handles it properly
    if (typeof triggerQuizAfterLastPost === 'function') {
      triggerQuizAfterLastPost();
    }
  }, 1000);
  sessionStorage.removeItem('justinePost');
}

function openSelfConfidenceInfo() {
  // Open the psychologist modal to show the interview
  const modal = document.getElementById('psychologistModal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function openSelfConfidenceInfoPage() {
  // Save scroll position before navigating away
  const feedContent = document.getElementById('feedContent');
  if (feedContent) {
    sessionStorage.setItem('feedScrollPosition', feedContent.scrollTop);
  }
  // Navigate to a separate psychologist page
  window.location.href = 'psychologist.html';
}

function setupSelfConfidenceButton() {
}

function addNewPostsAfterJustine() {
  const newPosts = [
   { user: 'clara.vsl', img: 'images/image2.png', text: ' night walks + ice cream = always a good idea 🍦', cardClass: 'pink-card', avatar: 'images/clara.png', likes: '1K', comments: '456' },
    { user: 'zoe.pch', img: 'images/image10.png', text: ' I needed some fresh air and a change of scenery. this place never disappoints 🌊', cardClass: 'yellow-card', avatar: 'images/image10.png', likes: '500', comments: '210' },
    { user: 'lucie_mn', img: 'images/image11.png', text: 'felt nice to dress up. good memories from today.', cardClass: 'orange-card', avatar: 'images/image9.png', likes: '1.2K', comments: '200' },
     { user: 'anais_b', img: 'images/image19.png', text: 'I didn’t feel like coming today but i did it anyway.progress doesn’t happen overnight.', cardClass: 'yellow-card', avatar: 'images/anais.png', likes: '600', comments: '50' },
    { user: 'ines.blt', img: 'images/image12.png', text: 'New year new hobbie :) \n#Serygraphy', cardClass: 'pink-card', avatar: 'images/image8.png', likes: '2.6k', comments: '520' },
     { user: 'Juliane_swift', img: 'images/image23.png', text: '', cardClass: 'pink-card', avatar: 'images/image23.png', likes: '4.4k', comments: '120' },
     { user: 'Vivien-peronne.', img: 'images/image24.png', text: 'happy birthday to me !', cardClass: 'pink-card', avatar: 'images/image24.png', likes: '1.5k', comments: '260' },
    { user: 'Hannah_swan', img: 'images/image13.png', text: 'I got my Skateboard finally!', cardClass: 'yellow-card', avatar: 'images/image13.png', likes: '300', comments: '43' },
    // Add new posts below - continue the color pattern (orange, pink, yellow)
    { user: 'max_rch', img: 'images/image14.png', text: 'Lost in thoughts', cardClass: 'orange-card', avatar: 'images/image14.png', likes: '200', comments: '25' },
    { user: 'ines.blt', img: 'images/image15.png', text: 'We are waiting for you february 19 at 22pm #PleaseClap', cardClass: 'pink-card', avatar: 'images/image8.png', likes: '10K', comments: '50' },
     { user: 'sarah_222', img: 'images/image16.png', text: 'Make-up by the @beauty-glow', cardClass: 'yellow-card', avatar: 'images/image16.png', likes: '1K', comments: '50' },
     { user: 'Max_drew', img: 'images/image17.png', text: 'New shoot', cardClass: 'orange-card', avatar: 'images/image17.png', likes: '600', comments: '50' },
      { user: 'Amber_shoots', img: 'images/image18.png', text: 'Golden hour 💛', cardClass: 'pink-card', avatar: 'images/image18.png', likes: '2K', comments: '101' },
      { user: 'LinearSouls_', img: 'images/image20.png', text: 'Better together !', cardClass: 'yellow-card', avatar: 'images/image20.png', likes: '870', comments: '61' },
      { user: 'Raph_', img: 'images/image21.png', text: 'Best dressed for the prom ?', cardClass: 'orange-card', avatar: 'images/image21.png', likes: '1K7', comments: '172' }
  ];

  let hannahCardElement = null;

  newPosts.forEach((p, index) => {
    const card = document.createElement('div');
    card.className = `post-card ${p.cardClass}`;
    
    if (p.user === 'Hannah_swan') {
      card.id = 'hannah-post-card';
      hannahCardElement = card;
    }
    
    if (p.user === 'Raph_') {
      card.setAttribute('data-raph-post', 'true');
    }
    
    if (p.user === 'LinearSouls_') {
      card.setAttribute('data-linear-souls', 'true');
    }
    
    card.innerHTML = `
      <div class="post-header">
        <div class="user-info">
          <div class="user-avatar">
            <img src="${p.avatar}" alt="User" class="avatar-img">
          </div>
          <div class="username">${p.user}</div>
        </div>
        <div class="post-menu">
          <span class="menu-dots">···</span>
        </div>
      </div>
      <div class="post-image"><img src="${p.img}" class="post-img"></div>
      <div class="post-caption">${p.text}</div>
      <div class="post-footer">
        <div class="likes">
          <img src="images/like.png" alt="Like" class="footer-icon">
          <span>${p.likes} likes</span>
        </div>
        <div class="comments">
          <img src="images/comment.png" alt="Comment" class="footer-icon">
          <span>${p.comments} comments</span>
        </div>
      </div>
    `;
    feed.appendChild(card);
  });

  // Add the Eva interview video card at the end of the feed
  addVideoCard();

  if (hannahCardElement) {
    setupSecondPostPopupTrigger(hannahCardElement);
  }
}

function setupVideoWatchListener() {
  const setupVideoObserver = () => {
    const videoCard = feed.querySelector('[data-video-card]');
    if (!videoCard) {
      setTimeout(setupVideoObserver, 500);
      return;
    }

    const videoElement = videoCard.querySelector('.post-video');
    if (!videoElement) return;
    const WATCH_THRESHOLD = 8; 
    const secondsSeen = new Set();
    let triggered = false;

    const tryTrigger = (reason) => {
      if (triggered) return;
      triggered = true;
      console.debug('[feed] video watch trigger:', reason);
      setTimeout(() => {
        if (typeof window.showJustineThoughtPopup === 'function') {
          window.showJustineThoughtPopup();
        } else if (typeof window.showSelfConfidencePopup === 'function') {
          // fallback if the primary function isn't available yet
          console.warn('[feed] showJustineThoughtPopup not found, falling back to showSelfConfidencePopup');
          window.showSelfConfidencePopup();
        } else {
          console.warn('[feed] No popup function available to call after video watch');
        }
      }, 1500);
    };

    videoElement.addEventListener('timeupdate', () => {
      const sec = Math.floor(videoElement.currentTime);
      secondsSeen.add(sec);
      if (secondsSeen.size % 2 === 0) {
        console.debug('[feed] video timeupdate', videoElement.currentTime, 'secondsSeen', secondsSeen.size);
      }
      if (secondsSeen.size >= WATCH_THRESHOLD) {
        tryTrigger('threshold');
      }
    });

    videoElement.addEventListener('ended', () => {
      tryTrigger('ended');
    });

    videoElement.addEventListener('seeked', () => {
      const sec = Math.floor(videoElement.currentTime);
      if (sec >= Math.max(WATCH_THRESHOLD - 1, 1)) {
        tryTrigger('seeked-to-end');
      }
    });
  };

  setupVideoObserver();
}

function setupSecondPostPopupTrigger(anaisCard) {
  const postsArray = sessionStorage.getItem('justinePostsArray');
  const postsData = postsArray ? JSON.parse(postsArray) : [];
  
  if (postsData.length === 1) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !secondPostPopupShown) {
          secondPostPopupShown = true;
          stopScrollAndShowSecondPostPopup();
          observer.unobserve(anaisCard);
        }
      });
    }, {
      root: feed,
      threshold: 0.5
    });

    observer.observe(anaisCard);
  }
}

function insertJustinePost(post, index) {
  const justinePosts = feed.querySelectorAll('.justine-post');
  const cardClass = justinePosts.length === 0 ? 'orange-card' : 'pink-card';
  
  const card = document.createElement('div');
  card.className = `post-card ${cardClass} justine-post`;
  card.innerHTML = `
    <div class="post-header">
      <div class="username">Justine__</div>
    </div>
    <div class="post-image">
      <img src="${post.image}">
    </div>
    <div class="post-caption">${post.caption}</div>
  `;

  const posts = feed.querySelectorAll('.post-card');
  feed.insertBefore(card, posts[index] || null);
}

function insertNewPosts() {
  const newPosts = [
    { user: 'lina', img: 'images/image10.png', text: 'late night thoughts' },
    { user: 'max', img: 'images/image11.png', text: 'somewhere quiet' }
  ];

  newPosts.forEach(p => {
    const card = document.createElement('div');
    card.className = 'post-card pink-card';
    card.innerHTML = `
      <div class="post-header">${p.user}</div>
      <div class="post-image"><img src="${p.img}"></div>
      <div class="post-caption">${p.text}</div>
    `;
    feed.appendChild(card);
  });
}

function loadProfileImage() {
  const selectedPhoto = localStorage.getItem('selectedProfilePhoto');
  if (selectedPhoto) {
    const navProfileImage = document.getElementById('navProfileImage');
    const navPlaceholder = document.querySelector('.nav-placeholder');
    
    if (navProfileImage) {
      navProfileImage.src = selectedPhoto;
      navProfileImage.style.display = 'block';
      if (navPlaceholder) {
        navPlaceholder.style.display = 'none';
      }
    }
  }
}

function restoreScrollPosition() {
  const savedScrollPosition = sessionStorage.getItem('feedScrollPosition');
  const scrollToVideo = sessionStorage.getItem('scrollToVideoCard');
  
  if (scrollToVideo) {
    setTimeout(() => {
      ensureVideoCardExists();
      const videoCard = document.querySelector('[data-video-card="true"]');
      if (videoCard && feed) {
        const cardPosition = videoCard.offsetTop;
        feed.scrollTop = cardPosition;
        popupShown = true;
      }
      sessionStorage.removeItem('scrollToVideoCard');
    }, 100);
  } else if (savedScrollPosition) {
    setTimeout(() => {
      feed.scrollTop = parseInt(savedScrollPosition);
      feed.style.overflowY = 'auto';
      popupShown = true;
      sessionStorage.removeItem('feedScrollPosition');
    }, 100);
  }
}

function goToSecondPost() {
  window.location.href = 'edit-post.html';
}

function stopScrollAndShowSecondPostPopup() {
  feed.style.overflowY = 'hidden';

  const posts = feed.querySelectorAll('.post-card');
  const scrollPosition = feed.scrollTop;

  sessionStorage.setItem('feedScrollPosition', scrollPosition);
  sessionStorage.setItem('stoppedIndex', posts.length);

  setTimeout(() => {
    document.getElementById('justineSecondPostPopup').classList.remove('hidden');
  }, 1000);
}

function showSecondPostPopup() {
  feed.style.overflowY = 'hidden';
  const secondPostPopup = document.getElementById('justineSecondPostPopup');
  if (secondPostPopup) {
    secondPostPopup.classList.remove('hidden');
  }
}

function addVideoCard() {
  const videoCard = document.createElement('div');
  videoCard.className = 'post-card video-card orange-card';
  videoCard.setAttribute('data-video-card', 'true');
  videoCard.innerHTML = `
    <div class="post-header">
      <div class="user-info">
        <div class="user-avatar">
          <img src="images/association.png" alt="Expert" class="avatar-img">
        </div>
        <div class="username">Youth_confidence-center</div>
      </div>
      <div class="post-menu">
        <span class="menu-dots">···</span>
      </div>
    </div>
    <div class="post-video-container">
      <video class="post-video" controls controlsList="nodownload">
        <source src="videos/interview-eva.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <div class="video-timestamps">
        <div class="timestamp-item">
          <button class="timestamp-btn" data-time="0">Start</button>
        </div>
        <div class="timestamp-item">
          <button class="timestamp-btn" data-time="15">0:15</button>
        </div>
        <div class="timestamp-item">
          <button class="timestamp-btn" data-time="30">0:30</button>
        </div>
        <div class="timestamp-item">
          <button class="timestamp-btn" data-time="45">0:45</button>
        </div>
      </div>
      <button class="discover-more-about-self-confidence" onclick="openSelfConfidenceInfoPage()">
        Discover More
      </button>
    </div>
    <div class="post-caption">Self-confidence in young people,interview </div>
    <div class="post-footer">
      <div class="likes">
        <img src="images/like.png" alt="Like" class="footer-icon">
        <span>5.2K likes</span>
      </div>
      <div class="comments">
        <img src="images/comment.png" alt="Comment" class="footer-icon">
        <span>892 comments</span>
      </div>
    </div>
  `;
  
  feed.appendChild(videoCard);
  const timestampBtns = videoCard.querySelectorAll('.timestamp-btn');
  const video = videoCard.querySelector('.post-video');
  
  timestampBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const time = parseInt(btn.getAttribute('data-time'));
      video.currentTime = time;
      video.play();
    });
  });
}

// Ensure the Eva interview video card exists on the feed so other flows can target it
function ensureVideoCardExists() {
  // If a video card is already present, do nothing
  if (document.querySelector('[data-video-card="true"]')) return;
  // Add the video card at the end of current feed
  addVideoCard();
}