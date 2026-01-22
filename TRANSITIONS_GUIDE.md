# Justine's Transition System - Implementation Guide

## Overview
The transition system creates immersive moments where the narrative shifts from the mobile interface to Justine's face (with her inner thoughts in speech bubbles). This creates a bridge between the digital world and human emotions.

## How It Works

### 1. **Three Transition Overlays (Scene 2, 3, 4)**

Located in `feed.html`, you have three transition overlays that display at key moments:

```html
<div class="justine-transition hidden" id="justineTransition1">
  <div class="transition-overlay">
    <img src="images/justine2.png" alt="Justine" class="justine-face">
    <div class="thought-bubble">
      <p>"Everyone looks perfect."</p>
    </div>
  </div>
</div>
```

### 2. **Trigger Points**

Each transition is triggered when the user scrolls to specific posts:

- **Transition 1** (`justineTransition1`): Triggers at **post-2**
  - *Scene 2 - First Interaction*
  - Shows: Justine's surprised face with thought "Everyone looks perfect"
  
- **Transition 2** (`justineTransition2`): Triggers at **post-3**
  - *Scene 3 - First Post hesitation*
  - Shows: Justine uncertain, thinking about editing
  
- **Transition 3** (`justineTransition3`): Triggers at **post-5**
  - *Scene 4 - Comparison begins*
  - Shows: Justine insecure, thinking "Why don't I look like this?"

### 3. **How to Customize**

#### Change Which Post Triggers a Transition
In `feed.js`, modify the `setupJustineTransitions()` function:

```javascript
// Change 'post-2' to any post's data-scroll-trigger value
setupTransitionTrigger('post-2', 'justineTransition1', 'transition1', 2000);
```

#### Change Display Duration
The last parameter (e.g., `2000`) is milliseconds:
```javascript
setupTransitionTrigger('post-2', 'justineTransition1', 'transition1', 3000); // 3 seconds
```

#### Change Justine's Face or Text
Edit the HTML in `feed.html`:
```html
<img src="images/justine1.png" alt="Justine" class="justine-face">
<!-- Change justine1.png to justine2.png or justine3.png -->

<div class="thought-bubble">
  <p>"Your custom thought here"</p>
</div>
```

#### Add or Remove Transitions
Simply duplicate a transition block, change the ID, and add the corresponding trigger:

```html
<!-- In feed.html -->
<div class="justine-transition hidden" id="justineTransition4">
  <div class="transition-overlay">
    <img src="images/justine1.png" alt="Justine" class="justine-face">
    <div class="thought-bubble">
      <p>"New thought"</p>
    </div>
  </div>
</div>
```

```javascript
// In feed.js setupJustineTransitions()
setupTransitionTrigger('post-4', 'justineTransition4', 'transition4', 2500);
```

### 4. **User Interactions**

- **Auto-dismiss**: Transitions automatically fade out after the set duration
- **Click to skip**: Users can click anywhere on the transition to close it immediately
- **Feed pauses**: While a transition is showing, the feed scrolling is paused
- **Smooth animations**: Fade-in/out effects with scaling and sliding motions

### 5. **CSS Animation Details**

The transitions use these key animations (in `styles.css`):

- `fadeInScale`: Main overlay appears with fade + scale
- `slideUp`: Justine's face slides up into view
- `bubbleAppear`: Thought bubble appears with delay
- `transition-fade-out`: Smooth exit animation

### 6. **Scene Flow**

**Current Implementation:**
```
Landing Page 
    ↓
Register (Scene 1)
    ↓
Feed loads (Scene 2)
    ↓ [TRANSITION 1: "Everyone looks perfect"]
    ↓ Posts scroll
    ↓ [TRANSITION 2: "Everyone looks so good..."]
    ↓ Posts scroll
    ↓ [TRANSITION 3: "Why don't I look like this?"]
    ↓ More posts
    ↓ Popup appears for creating post
```

### 7. **Adding More Complex Transitions**

For future scenes (5-10), you can:

1. Create new transition overlays with different Justine face expressions
2. Add different trigger points based on user scroll position
3. Combine transitions with interactive elements (quiz popups)
4. Add timing delays to chain multiple transitions

Example for future use:
```javascript
// Scene 6 - Testimonies
function setupTestimonialTransition() {
  // Trigger when scrolling to a specific testimonial section
  setupTransitionTrigger('testimonial-video', 'justineTransition4', 'transition4', 3000);
}
```

---

## Files Modified

- `feed.html`: Added three transition overlay divs
- `feed.js`: Added transition management system
- `css/styles.css`: Added transition styling and animations

## Testing

1. Load `feed.html`
2. Scroll down gradually through the posts
3. Watch for transitions to appear at each trigger point
4. Click on a transition to skip it
5. Notice how the feed pauses during transitions

---

## Future Enhancement Ideas

- Add swipe gesture support to skip transitions
- Add quiz popups during transitions (Scene 5)
- Create video transitions between scenes
- Add sound effects to transitions
- Create a skip-all-transitions button
- Track which transitions user has seen for subsequent visits
