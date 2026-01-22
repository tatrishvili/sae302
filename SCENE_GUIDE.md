# Scene-by-Scene Transition Integration Guide

## Current Status (Scenes 1-3) ✓ IMPLEMENTED

### Scene 1: Sign Up
- **Location**: `register.html`
- **Transitions**: None (typing animation only)
- **Description**: Justine creates her profile with hesitation

---

### Scene 2: First Interaction ✓
- **Location**: `feed.html` 
- **Transition**: `justineTransition1` 
- **Trigger**: When user scrolls to `data-scroll-trigger="post-2"`
- **Image**: `justine2.png` (surprised/fascinated expression)
- **Thought**: *"Everyone looks perfect."*
- **Duration**: 2 seconds
- **Purpose**: Show Justine's initial wonder at the perfect content

**Code Location**: [feed.js](feed.js#L21-L26)

---

### Scene 3: First Post ✓
- **Location**: `feed.html` → `edit-post.html`
- **Transition**: `justineTransition2`
- **Trigger**: When user scrolls to `data-scroll-trigger="post-3"`
- **Image**: `justine1.png` (uncertain/hesitant expression)
- **Thought**: *"Everyone looks so good... Maybe I should retouch it?"*
- **Duration**: 2.5 seconds
- **Purpose**: Show Justine's internal conflict about editing

**Code Location**: [feed.js](feed.js#L28-L33)

---

### Scene 4: Retouching Sessions ✓
- **Location**: `feed.html`
- **Transition**: `justineTransition3`
- **Trigger**: When user scrolls to `data-scroll-trigger="post-5"`
- **Image**: `justine3.png` (insecure/comparing expression)
- **Thought**: *"Why don't I look like this?"*
- **Duration**: 2 seconds
- **Purpose**: Show the beginning of comparison anxiety

**Code Location**: [feed.js](feed.js#L35-L40)

---

## Future Implementation (Scenes 5-10)

### Scene 5: Comparison & Self-Reflection
**Status**: ⏳ To be implemented

**What you need:**
1. Create new file: `reflection.html` or add section to `feed.html`
2. Create 1-2 new Justine face drawings (exhausted/sad look)
3. Add interactive quiz popups (Yes/Often/I don't know)

**Implementation Steps:**
```html
<!-- In feed.html -->
<div class="justine-transition hidden" id="justineTransition4">
  <div class="transition-overlay">
    <img src="images/justine-sad.png" alt="Justine">
    <div class="thought-bubble">
      <p>"Scrolling makes me feel worse..."</p>
    </div>
  </div>
</div>

<!-- Add quiz popup -->
<div class="quiz-popup hidden" id="quizPopup1">
  <div class="quiz-content">
    <p>Have you ever opened social media "just for a minute" and stayed much longer?</p>
    <button onclick="recordAnswer('yes')">Yes</button>
    <button onclick="recordAnswer('often')">Often</button>
    <button onclick="recordAnswer('idk')">I don't know</button>
    <button onclick="recordAnswer('no')">Not really</button>
  </div>
</div>
```

```javascript
// In feed.js
function setupScene5Transitions() {
  setupTransitionTrigger('post-7', 'justineTransition4', 'transition4', 3000);
  // After transition, show quiz
  setTimeout(() => {
    showQuizPopup('quizPopup1');
  }, 3500);
}
```

---

### Scene 6: The Testimonies
**Status**: ⏳ To be implemented

**What you need:**
1. Create `testimonies.html` (embedded video or video player)
2. Create Justine face showing realization/hope
3. Add "Want to learn more?" popup

**Implementation:**
```html
<!-- New page structure -->
<!-- testimonies.html -->
<div class="iphone-frame">
  <div class="iphone-screen">
    <!-- Video player -->
    <div class="video-player" id="videoPlayer">
      <video src="videos/testimony-1.mp4"></video>
    </div>
    
    <!-- Justine transition during video -->
    <div class="justine-transition hidden" id="justineTransition5">
      <div class="transition-overlay">
        <img src="images/justine-thoughtful.png" alt="Justine">
        <div class="thought-bubble">
          <p>"Wait... is my usage actually not healthy?"</p>
        </div>
      </div>
    </div>
    
    <!-- Learn more prompt -->
    <div class="popup hidden" id="learnMorePopup">
      <p>Would you like to discover more information about self-confidence?</p>
      <button onclick="goToPodcast()">Yes, learn more</button>
      <button onclick="skipPodcast()">Continue scrolling</button>
    </div>
  </div>
</div>
```

---

### Scene 8: Psychologist Podcast
**Status**: ⏳ To be implemented

**What you need:**
1. Create `podcast.html` (podcast player or info page)
2. Add interactive chat/Q&A section
3. Justine transition showing inspiration/relief

**Implementation:**
```html
<!-- podcast.html -->
<div class="podcast-section">
  <!-- Podcast player -->
  <div class="podcast-player">
    <audio controls>
      <source src="audio/psychology-podcast.mp3">
    </audio>
  </div>
  
  <!-- Justine inspiration moment -->
  <div class="justine-transition hidden" id="justineTransition6">
    <div class="transition-overlay">
      <img src="images/justine-inspired.png" alt="Justine">
      <div class="thought-bubble">
        <p>"I'm not alone in this..."</p>
      </div>
    </div>
  </div>
  
  <!-- Interactive chat with psychologist -->
  <div class="chat-section" id="chatSection">
    <div class="questions-list">
      <button class="question-btn" data-question="What is self-esteem?">
        What is self-esteem?
      </button>
      <button class="question-btn" data-question="How does social media affect teens?">
        How does social media affect teens?
      </button>
      <!-- More questions -->
    </div>
    <div class="chat-response" id="chatResponse"></div>
  </div>
</div>
```

---

### Scene 9: Disconnection
**Status**: ⏳ To be implemented

**What you need:**
1. Create `disconnection.html` (digital dissolution effect)
2. Animated fade-out of UI elements
3. Transition to Justine's final decision

**Implementation:**
```html
<!-- disconnection.html -->
<div class="disconnection-sequence">
  <!-- Amically interface gradually dissolving -->
  <div class="feed-dissolve" id="feedDissolve">
    <!-- All interface elements fade out one by one -->
  </div>
  
  <!-- Justine's moment of clarity -->
  <div class="justine-transition hidden" id="justineTransition7">
    <div class="transition-overlay">
      <img src="images/justine-peaceful.png" alt="Justine">
      <div class="thought-bubble">
        <p>"I'm pressing disconnect."</p>
      </div>
    </div>
  </div>
  
  <!-- Disconnect button for user -->
  <button class="disconnect-btn" onclick="goToReflection()">
    ⏹ Disconnect
  </button>
</div>
```

```javascript
// Animation sequence for Scene 9
function startDisconnectionSequence() {
  const elements = document.querySelectorAll('.feed-dissolve > *');
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.95)';
      el.style.transition = 'all 0.8s ease-out';
    }, index * 300);
  });
  
  setTimeout(() => {
    showJustineTransition('justineTransition7', 3000);
  }, elements.length * 300);
}
```

---

### Scene 10: The Reflection
**Status**: ⏳ To be implemented

**What you need:**
1. Create `reflection.html` (desktop version desktop view)
2. Real testimonies and data display
3. Interactive exploration of resources

**Implementation:**
```html
<!-- reflection.html -->
<body class="desktop-view">
  <div class="reflection-container">
    <h1>You are leaving Justine's world</h1>
    
    <!-- Testimonies Section -->
    <div class="testimonies-grid">
      <div class="testimony-card">
        <img src="images/testimony1.jpg" alt="Testimony">
        <p>"I realized I was checking my phone 150 times a day..."</p>
      </div>
      <!-- More testimonies -->
    </div>
    
    <!-- Statistics Section -->
    <div class="stats-section">
      <div class="stat">
        <h3>92%</h3>
        <p>of teens report FOMO</p>
      </div>
      <!-- More stats -->
    </div>
    
    <!-- Resources Section -->
    <div class="resources-section">
      <h2>Resources & Help</h2>
      <a href="https://...">Digital Wellness Guide</a>
      <!-- More resources -->
    </div>
  </div>
</body>
```

---

## How Transitions Work in Each Scene

### Scene Flow with Transitions
```
SCENE 1: SIGN UP
├─ No transitions (just typing animation)

SCENE 2: FIRST INTERACTION ✓
├─ Post-2 visible
├─ [Transition 1 shows Justine's wonder]
├─ Feed resumes

SCENE 3: FIRST POST ✓
├─ User navigates to edit-post.html
├─ Edits and posts photo
├─ Returns to feed
├─ Post-3 visible
├─ [Transition 2 shows Justine's doubt]
├─ Feed resumes

SCENE 4: RETOUCHING ✓
├─ Post-5 visible
├─ [Transition 3 shows Justine's comparison anxiety]
├─ Feed resumes
├─ User clicks popup to continue

SCENE 5: COMPARISON
├─ Post-7 visible
├─ [Transition 4 shows Justine's exhaustion]
├─ Quiz popup appears
├─ User answers questions
├─ Content reflects answers

SCENE 6: TESTIMONIES
├─ Navigate to testimonies.html
├─ Video plays
├─ [Transition 5 shows Justine's realization]
├─ "Learn more?" popup
├─ User chooses path

SCENE 8: PODCAST
├─ Navigate to podcast.html
├─ [Transition 6 shows Justine's inspiration]
├─ Interactive Q&A appears

SCENE 9: DISCONNECTION
├─ Navigate to disconnection.html
├─ Interface dissolves animation
├─ [Transition 7 shows Justine's peace]
├─ Disconnect button interactive

SCENE 10: REFLECTION
├─ Desktop view activates
├─ Testimonies, stats, resources displayed
├─ User can explore and reflect
```

---

## Key Integration Principles

1. **Transitions break user flow**: They pause scrolling/interaction
2. **Show emotion first**: Face/expression before narrative context
3. **Keep duration short**: 2-3 seconds max to maintain engagement
4. **Click to skip**: Always allow users to skip transitions
5. **State tracking**: Don't show same transition twice
6. **Timing**: Show transitions at emotional peaks, not random moments

---

## Testing Checklist for Each Scene

- [ ] Transition appears at correct trigger point
- [ ] Transition displays for correct duration
- [ ] Click/tap skips transition immediately
- [ ] Feed scrolling pauses during transition
- [ ] Animation is smooth (no jank)
- [ ] Text in thought bubble is readable
- [ ] Justine's face loads correctly
- [ ] Transition doesn't repeat on revisit
- [ ] Works on mobile (narrow viewport)

