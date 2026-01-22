let feed;
let popupShown = false;
let transitionsShown = {
  transition1: false
};

document.addEventListener('DOMContentLoaded', () => {
  feed = document.getElementById('feedContent');

  loadProfileImage();
  
  
  restoreScrollPosition();
  
  resumeAfterPost();
  setupScrollStop();
  setupJustineTransitions();

  document.getElementById('popupPostBtn').onclick = () => {
    window.location.href = 'edit-post.html';
  };
});

// ==============================
// JUSTINE TRANSITION MANAGEMENT
// ==============================

function setupJustineTransitions() {
  // Trigger when user scrolls to post-6 (appears later in feed)
  // Duration: 8 seconds - gives users time to read and think
  setupTransitionTrigger('post-6', 'justineTransition1', 'transition1', 8000);
}

function setupTransitionTrigger(triggerClass, transitionId, transitionKey, displayDuration) {
  // Find the trigger element first
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
  addNewPostsAfterJustine();

  feed.style.overflowY = 'auto';

  const cards = feed.querySelectorAll('.post-card');
  if (cards[index]) {
    cards[index].scrollIntoView({ block: 'start' });
  }

  sessionStorage.removeItem('justinePost');
}

function addNewPostsAfterJustine() {
  const newPosts = [
   { user: 'clara.vsl', img: 'images/image2.png', text: ' night walks + ice cream = always a good idea 🍦', cardClass: 'orange-card', avatar: 'images/clara.png', likes: '1K', comments: '456' },
    { user: 'zoe.pch', img: 'images/image10.png', text: ' I needed some fresh air and a change of scenery. this place never disappoints 🌊', cardClass: 'orange-card', avatar: 'images/image10.png', likes: '500', comments: '210' },
    { user: 'lucie_mn', img: 'images/image11.png', text: 'felt nice to dress up. good memories from today.', cardClass: 'orange-card', avatar: 'images/image9.png', likes: '1.2K', comments: '200' }
    
  
  ];

  newPosts.forEach(p => {
    const card = document.createElement('div');
    card.className = `post-card ${p.cardClass}`;
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
}

function insertJustinePost(post, index) {
  const card = document.createElement('div');
  card.className = 'post-card orange-card justine-post';
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
  if (savedScrollPosition) {
    setTimeout(() => {
      feed.scrollTop = parseInt(savedScrollPosition);
      feed.style.overflowY = 'auto';
      popupShown = true;
      sessionStorage.removeItem('feedScrollPosition');
    }, 100);
  }
}