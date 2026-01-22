# Quick Snippets & Copy-Paste Code

## 1. Add a New Transition (Copy-Paste Ready)

### HTML (add to feed.html inside `.iphone-screen`)
```html
<div class="justine-transition hidden" id="justineTransition4">
  <div class="transition-overlay">
    <img src="images/justine-YOUR-IMAGE.png" alt="Justine" class="justine-face">
    <div class="thought-bubble">
      <p>"YOUR THOUGHT TEXT HERE"</p>
    </div>
  </div>
</div>
```

### JavaScript (add to `setupJustineTransitions()` in feed.js)
```javascript
setupTransitionTrigger('post-8', 'justineTransition4', 'transition4', 2500);
```

### JavaScript (update the state tracking at top of feed.js)
```javascript
let transitionsShown = {
  transition1: false,
  transition2: false,
  transition3: false,
  transition4: false  // ADD THIS LINE
};
```

---

## 2. Create Multi-Line Thought Bubble

```html
<div class="thought-bubble">
  <p>"First line of thought"</p>
  <p>"Second line of thought"</p>
  <p>"Even a third line if needed"</p>
</div>
```

The CSS automatically adds spacing between `<p>` tags.

---

## 3. Change Transition Images

**Current images available:**
- `justine1.png` - Uncertain/hesitant look
- `justine2.png` - Surprised/fascinated look  
- `justine3.png` - Insecure/comparing look

**To use different image:**
```html
<img src="images/justine2.png" alt="Justine" class="justine-face">
<!-- Change 'justine2.png' to 'justine1.png' or 'justine3.png' -->
```

---

## 4. Change Trigger Post

For any transition, change which post triggers it:

```javascript
// Current:
setupTransitionTrigger('post-2', 'justineTransition1', 'transition1', 2000);

// Change to trigger at post-4:
setupTransitionTrigger('post-4', 'justineTransition1', 'transition1', 2000);

// Change to trigger at post-7:
setupTransitionTrigger('post-7', 'justineTransition1', 'transition1', 2000);
```

**Available post triggers in your feed:**
- `post-1` to `post-7` (existing posts)
- Custom: any `[data-scroll-trigger="NAME"]` you add

---

## 5. Change Display Duration

```javascript
// 1 second
setupTransitionTrigger('post-2', 'justineTransition1', 'transition1', 1000);

// 2 seconds (default)
setupTransitionTrigger('post-2', 'justineTransition1', 'transition1', 2000);

// 3 seconds
setupTransitionTrigger('post-2', 'justineTransition1', 'transition1', 3000);

// 5 seconds
setupTransitionTrigger('post-2', 'justineTransition1', 'transition1', 5000);
```

---

## 6. Show Transition Immediately (Testing)

Add this to `feed.js` after `setupJustineTransitions()`:
```javascript
// Uncomment below to test transitions immediately
// showJustineTransition('justineTransition1', 3000);
// showJustineTransition('justineTransition2', 3000);
// showJustineTransition('justineTransition3', 3000);
```

Then uncomment whichever one you want to test.

---

## 7. Advanced: Chain Multiple Transitions

Show one transition after another:

```javascript
function showChainedTransitions() {
  showJustineTransition('justineTransition1', 2000);
  
  setTimeout(() => {
    showJustineTransition('justineTransition2', 2000);
  }, 2500);
  
  setTimeout(() => {
    showJustineTransition('justineTransition3', 2000);
  }, 5000);
}

// Call when you want:
// showChainedTransitions();
```

---

## 8. Add Click Sound to Transitions (Optional)

In `feed.js`, modify `hideJustineTransition()`:

```javascript
function hideJustineTransition(transitionId) {
  const transition = document.getElementById(transitionId);
  if (!transition) return;

  // Play sound when closing
  const sound = new Audio('audio/transition-close.mp3');
  sound.play().catch(err => console.log('Audio play failed:', err));

  transition.classList.add('transition-fade-out');
  
  setTimeout(() => {
    transition.classList.add('hidden');
    transition.classList.remove('transition-fade-out');
    feed.style.overflowY = 'auto';
  }, 500);
}
```

---

## 9. Add Loading Delay (Slow Reveal Effect)

Modify `showJustineTransition()` in feed.js:

```javascript
function showJustineTransition(transitionId, displayDuration = 2500) {
  const transition = document.getElementById(transitionId);
  if (!transition) return;

  // Add slight delay for dramatic effect
  setTimeout(() => {
    transition.classList.remove('hidden');
    feed.style.overflowY = 'hidden';

    setTimeout(() => {
      hideJustineTransition(transitionId);
    }, displayDuration);

    transition.addEventListener('click', () => {
      hideJustineTransition(transitionId);
    });
  }, 500); // 500ms delay before showing
}
```

---

## 10. Quiz Popup Snippet (Scene 5)

Add to `feed.html`:
```html
<div class="quiz-popup hidden" id="quizPopup1">
  <div class="quiz-content">
    <div class="quiz-question">
      <p>Have you ever opened social media "just for a minute" and stayed much longer?</p>
    </div>
    <div class="quiz-options">
      <button class="quiz-btn" onclick="recordQuizAnswer('yes')">Yes</button>
      <button class="quiz-btn" onclick="recordQuizAnswer('often')">Often</button>
      <button class="quiz-btn" onclick="recordQuizAnswer('idk')">I don't know</button>
      <button class="quiz-btn" onclick="recordQuizAnswer('no')">Not really</button>
    </div>
  </div>
</div>
```

Add to `feed.js`:
```javascript
function recordQuizAnswer(answer) {
  console.log('User answered:', answer);
  sessionStorage.setItem('quizAnswer1', answer);
  
  const popup = document.getElementById('quizPopup1');
  popup.classList.add('hidden');
  feed.style.overflowY = 'auto';
}

function showQuizPopup(quizId) {
  const popup = document.getElementById(quizId);
  popup.classList.remove('hidden');
  feed.style.overflowY = 'hidden';
}
```

Add to `styles.css`:
```css
.quiz-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.quiz-popup:not(.hidden) {
  opacity: 1;
  pointer-events: auto;
}

.quiz-popup.hidden {
  pointer-events: none;
  opacity: 0;
}

.quiz-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 300px;
  text-align: center;
  animation: slideUp 0.5s ease-out;
}

.quiz-question p {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quiz-btn {
  padding: 12px 20px;
  background: linear-gradient(135deg, #FFB88C 0%, #FFD4A3 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quiz-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 184, 140, 0.5);
}
```

---

## 11. Session Storage for Scene Progress

Track which scenes user has completed:

```javascript
// Save scene completion
function completeScene(sceneNumber) {
  let completedScenes = JSON.parse(sessionStorage.getItem('completedScenes')) || [];
  if (!completedScenes.includes(sceneNumber)) {
    completedScenes.push(sceneNumber);
    sessionStorage.setItem('completedScenes', JSON.stringify(completedScenes));
  }
}

// Check if scene completed
function isSceneCompleted(sceneNumber) {
  const completedScenes = JSON.parse(sessionStorage.getItem('completedScenes')) || [];
  return completedScenes.includes(sceneNumber);
}

// Use in transitions:
if (!isSceneCompleted(2)) {
  showJustineTransition('justineTransition1', 2000);
  completeScene(2);
}
```

---

## 12. Custom Animation Speed

Change animation speed for all transitions in `styles.css`:

```css
/* Current: 0.8s */
.transition-overlay {
  animation: fadeInScale 0.8s ease-out;
}

/* Faster: 0.5s */
.transition-overlay {
  animation: fadeInScale 0.5s ease-out;
}

/* Slower: 1.2s */
.transition-overlay {
  animation: fadeInScale 1.2s ease-out;
}
```

---

## 13. Hide Overlay Darkness Option

In `styles.css`:

```css
/* Current: darker overlay */
.justine-transition {
  background: rgba(0, 0, 0, 0.6);
}

/* Lighter overlay */
.justine-transition {
  background: rgba(0, 0, 0, 0.3);
}

/* No overlay (just transition shows) */
.justine-transition {
  background: transparent;
}

/* Colored overlay */
.justine-transition {
  background: rgba(255, 184, 140, 0.2); /* Amically orange tint */
}
```

---

## 14. Mobile Responsiveness Check

Ensure transitions work on all screen sizes:

```css
@media (max-width: 600px) {
  .justine-face {
    max-width: 200px;
  }
  
  .thought-bubble {
    max-width: 180px;
    font-size: 14px;
  }
}
```

---

## 15. Debug: Console Logging

Add to `feed.js` to debug transitions:

```javascript
function setupTransitionTrigger(triggerClass, transitionId, transitionKey, displayDuration) {
  console.log(`Setting up transition: ${transitionId} for post: ${triggerClass}`);
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log(`Trigger detected: ${triggerClass}, showing ${transitionId}`);
      }
      if (entry.isIntersecting && !transitionsShown[transitionKey]) {
        transitionsShown[transitionKey] = true;
        console.log(`Showing transition: ${transitionId}`);
        showJustineTransition(transitionId, displayDuration);
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: feed,
    threshold: 0.4
  });

  const triggerElement = document.querySelector(`[data-scroll-trigger="${triggerClass}"]`);
  if (triggerElement) {
    console.log(`Observing element with trigger: ${triggerClass}`);
    observer.observe(triggerElement);
  } else {
    console.warn(`No element found with trigger: ${triggerClass}`);
  }
}
```

---

## Files to Keep Updated

- ✅ `feed.html` - Add new transition overlays here
- ✅ `feed.js` - Add trigger setup in `setupJustineTransitions()`
- ✅ `styles.css` - Already has transition styles
- ✅ `images/` - Add new Justine face expressions here

**Don't modify:** `index.html`, `register.html`, `script.js` (unless expanding to other pages)

