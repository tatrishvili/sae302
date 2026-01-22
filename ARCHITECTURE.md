# Transition System Architecture

## Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│               JUSTINE'S THOUGHT TRANSITIONS                  │
└─────────────────────────────────────────────────────────────┘

SCENE 2: FIRST INTERACTION
┌──────────────────────────────────┐
│  User scrolls to POST-2           │
│         ↓ (Intersection Detected) │
├──────────────────────────────────┤
│  Transition 1 appears             │
│  [Image: justine2.png]            │
│  💭 "Everyone looks perfect"      │
│  (Display: 2 seconds)             │
│  ✓ Click to skip                  │
└──────────────────────────────────┘

SCENE 3: FIRST POST HESITATION  
┌──────────────────────────────────┐
│  User scrolls to POST-3           │
│         ↓ (Intersection Detected) │
├──────────────────────────────────┤
│  Transition 2 appears             │
│  [Image: justine1.png]            │
│  💭 "Everyone looks so good...    │
│     Maybe I should retouch it?"   │
│  (Display: 2.5 seconds)           │
│  ✓ Click to skip                  │
└──────────────────────────────────┘

SCENE 4: COMPARISON BEGINS
┌──────────────────────────────────┐
│  User scrolls to POST-5           │
│         ↓ (Intersection Detected) │
├──────────────────────────────────┤
│  Transition 3 appears             │
│  [Image: justine3.png]            │
│  💭 "Why don't I look like this?" │
│  (Display: 2 seconds)             │
│  ✓ Click to skip                  │
└──────────────────────────────────┘
```

## Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    feed.html                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ <div class="iphone-frame">                             │ │
│  │   <div class="iphone-screen">                          │ │
│  │     <!-- Justine Transitions (OVERLAYS) -->            │ │
│  │     <div id="justineTransition1" class="hidden">       │ │
│  │       <img src="images/justine2.png">                  │ │
│  │       <div class="thought-bubble">...</div>            │ │
│  │     </div>                                             │ │
│  │                                                         │ │
│  │     <!-- Feed Content (BACKGROUND) -->                 │ │
│  │     <div class="feed-page">                            │ │
│  │       <div id="feedContent">                           │ │
│  │         <div class="post-card" data-scroll-trigger="post-2">
│  │         <div class="post-card" data-scroll-trigger="post-3">
│  │       </div>                                            │ │
│  │     </div>                                             │ │
│  │   </div>                                               │ │
│  │ </div>                                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────────┐
│                    feed.js                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  setupJustineTransitions()                                  │
│    ├─ setupTransitionTrigger('post-2', ...)               │
│    ├─ setupTransitionTrigger('post-3', ...)               │
│    └─ setupTransitionTrigger('post-5', ...)               │
│                                                              │
│  setupTransitionTrigger()                                   │
│    ├─ Creates IntersectionObserver                         │
│    └─ Watches for specific post visibility                 │
│                                                              │
│  showJustineTransition()                                    │
│    ├─ Remove .hidden class                                 │
│    ├─ Pause feed scroll                                    │
│    └─ Set auto-hide timer                                  │
│                                                              │
│  hideJustineTransition()                                    │
│    ├─ Add fade-out animation                               │
│    ├─ Resume feed scroll                                   │
│    └─ Add .hidden class                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
            ↓
┌─────────────────────────────────────────────────────────────┐
│                    styles.css                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  .justine-transition                                        │
│    ├─ position: fixed (full screen overlay)                │
│    ├─ z-index: 500 (above everything)                      │
│    └─ opacity: transition 0.6s                             │
│                                                              │
│  .transition-overlay                                        │
│    ├─ fadeInScale animation                                │
│    └─ flexbox centered                                     │
│                                                              │
│  .justine-face                                              │
│    ├─ slideUp animation                                    │
│    └─ max-width: 300px                                     │
│                                                              │
│  .thought-bubble                                            │
│    ├─ bubbleAppear animation (0.3s delay)                  │
│    ├─ Comic-style speech bubble (border + tail)            │
│    └─ max-width: 280px                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## State Management

```javascript
// Tracks which transitions have been shown
transitionsShown = {
  transition1: false,  // ← Set to true after first display
  transition2: false,
  transition3: false
}

// Prevents duplicate displays
if (!transitionsShown[transitionKey]) {
  showJustineTransition(transitionId, displayDuration);
  transitionsShown[transitionKey] = true;
}
```

## Animation Timeline

### Transition Entry (0.8s total)
```
0ms    ├─ Overlay opacity: 0 → 1 (0.6s)
300ms  │
400ms  ├─ Face slides up (0.8s)
800ms  │
1000ms ├─ Thought bubble appears (0.8s, but starts at 0.3s)
1100ms │
1600ms └─ All animations complete
```

### Transition Exit (0.5s)
```
0ms    ├─ Fade out animation (0.5s)
500ms  └─ Remove from DOM
```

## User Interaction Flow

```
User loads feed.html
    ↓
DOMContentLoaded triggers
    ↓
setupJustineTransitions() initializes IntersectionObservers
    ↓
User scrolls feed
    ↓
Post becomes visible in viewport
    ↓
IntersectionObserver detects threshold (0.4)
    ↓
showJustineTransition() called
    ↓
┌─────────────────────────────────────┐
│ Transition visible for X milliseconds│
│                                      │
│ User can:                            │
│ • Wait for auto-hide                 │
│ • Click to skip immediately          │
└─────────────────────────────────────┘
    ↓
hideJustineTransition() called
    ↓
Feed resumes scrolling
    ↓
Next transition trigger point reached
    ↓ (repeat)
```

## Customization Points

| Element | File | How to Change |
|---------|------|---------------|
| Justine's face image | feed.html | Change `<img src="images/justine2.png">` |
| Thought text | feed.html | Edit text in `<p>` tag |
| Trigger point | feed.js | Change `'post-2'` in `setupTransitionTrigger()` |
| Display duration | feed.js | Change milliseconds (e.g., `2000`) |
| Animations speed | styles.css | Change animation duration (e.g., `0.8s`) |
| Overlay darkness | styles.css | Change `background: rgba(0, 0, 0, 0.6)` |
| Bubble style | styles.css | Modify `.thought-bubble` properties |

