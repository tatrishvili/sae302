# 🎬 Quick Visual Reference Card

## Transition System at a Glance

### What Happens When User Scrolls

```
Feed shows →  Post 2 enters view  → Justine says "Everyone looks perfect" 
              Post 3 enters view  → Justine says "Everyone looks so good..."
              Post 5 enters view  → Justine says "Why don't I look like this?"
```

### Visual Appearance

```
┌─────────────────────────────────────────────────┐
│                                                 │
│         [Dark Semi-Transparent Overlay]         │
│                                                 │
│                   [Justine's Face Image]        │
│                        |                        │
│         ┌──────────────────────────────┐        │
│         │   "Everyone looks perfect"   │        │
│         │     💭 (Thought Bubble)     │        │
│         └──────────────────────────────┘        │
│                        ●  ● ●                   │
│                  (Comic bubble tail)            │
│                                                 │
└─────────────────────────────────────────────────┘
         (Click anywhere to skip this)
```

---

## Three Current Transitions

### 1️⃣ Transition 1 (Scene 2)
- **Trigger**: User scrolls to post-2
- **Image**: justine2.png (surprised look)
- **Text**: "Everyone looks perfect."
- **Duration**: 2 seconds

### 2️⃣ Transition 2 (Scene 3)
- **Trigger**: User scrolls to post-3
- **Image**: justine1.png (uncertain look)
- **Text**: "Everyone looks so good... Maybe I should retouch it?"
- **Duration**: 2.5 seconds

### 3️⃣ Transition 3 (Scene 4)
- **Trigger**: User scrolls to post-5
- **Image**: justine3.png (insecure look)
- **Text**: "Why don't I look like this?"
- **Duration**: 2 seconds

---

## How to Add a 4th Transition (Copy & Paste)

### Step 1: Add HTML (in feed.html, line ~35)
```html
<div class="justine-transition hidden" id="justineTransition4">
  <div class="transition-overlay">
    <img src="images/justine2.png" alt="Justine" class="justine-face">
    <div class="thought-bubble">
      <p>"NEW TEXT HERE"</p>
    </div>
  </div>
</div>
```

### Step 2: Add JavaScript (in feed.js, setupJustineTransitions)
```javascript
setupTransitionTrigger('post-6', 'justineTransition4', 'transition4', 2500);
```

### Step 3: Add State (feed.js, line 3)
```javascript
let transitionsShown = {
  transition1: false,
  transition2: false,
  transition3: false,
  transition4: false,  // ← ADD THIS
};
```

**Done!** That's it. The 4th transition is now active.

---

## File Locations Quick Reference

```
feed.html (Line 32-54)
├─ <div class="justine-transition hidden" id="justineTransition1">
├─ <div class="justine-transition hidden" id="justineTransition2">
└─ <div class="justine-transition hidden" id="justineTransition3">

feed.js (Line 28-45)
├─ setupJustineTransitions()
│  ├─ setupTransitionTrigger('post-2', 'justineTransition1', ...)
│  ├─ setupTransitionTrigger('post-3', 'justineTransition2', ...)
│  └─ setupTransitionTrigger('post-5', 'justineTransition3', ...)
│
├─ showJustineTransition(transitionId, duration)
└─ hideJustineTransition(transitionId)

styles.css (Line 1556-1649)
├─ .justine-transition { ... }
├─ .transition-overlay { ... }
├─ @keyframes fadeInScale { ... }
├─ @keyframes slideUp { ... }
├─ .thought-bubble { ... }
└─ @keyframes bubbleAppear { ... }
```

---

## What Each Component Does

### 🎯 IntersectionObserver
**Location**: feed.js - `setupTransitionTrigger()`
**Job**: Watches for posts entering the viewport
**Triggers**: When post is 40% visible

### 🎨 Overlay
**Location**: feed.html - `<div class="justine-transition">`
**Job**: Full-screen background overlay
**Effect**: Makes scene darker, focuses on transition

### 😊 Justine Face
**Location**: feed.html - `<img class="justine-face">`
**Images**: justine1.png, justine2.png, justine3.png
**Animation**: Slides up (slideUp keyframe)

### 💭 Thought Bubble
**Location**: feed.html - `<div class="thought-bubble">`
**Style**: Comic-style speech bubble with tail
**Animation**: Fades in with delay (bubbleAppear keyframe)

### ⏰ Timer
**Location**: feed.js - `showJustineTransition()`
**Job**: Auto-hides transition after set duration
**Default**: 2-3 seconds

---

## Common Customizations

### Change Image
```html
<!-- Current -->
<img src="images/justine2.png" alt="Justine">

<!-- Change to -->
<img src="images/justine1.png" alt="Justine">
<!-- or -->
<img src="images/justine3.png" alt="Justine">
```

### Change Text
```html
<!-- Current -->
<p>"Everyone looks perfect."</p>

<!-- Change to -->
<p>"Your custom thought here"</p>
```

### Change Trigger Post
```javascript
// Current
setupTransitionTrigger('post-2', 'justineTransition1', 'transition1', 2000);

// Change trigger from post-2 to post-4
setupTransitionTrigger('post-4', 'justineTransition1', 'transition1', 2000);
```

### Change Duration (in seconds)
```javascript
// Current: 2 seconds
setupTransitionTrigger('post-2', 'justineTransition1', 'transition1', 2000);

// Change to 3 seconds
setupTransitionTrigger('post-2', 'justineTransition1', 'transition1', 3000);

// Change to 1 second
setupTransitionTrigger('post-2', 'justineTransition1', 'transition1', 1000);
```

---

## Testing the Transitions

### Method 1: Live Testing
1. Open feed.html in browser
2. Scroll down slowly
3. Watch for transitions at post-2, post-3, post-5
4. Click to skip or wait for auto-hide

### Method 2: Instant Testing (Developer)
In feed.js, add after `setupJustineTransitions()`:
```javascript
// Temporarily show transition immediately
showJustineTransition('justineTransition1', 3000);
```

Then remove when done.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Transition doesn't show | Check: post trigger exists, ID matches, setupJustineTransitions() called |
| Transition stuck on screen | Check: hideJustineTransition called, timer working |
| Feed scrolling doesn't pause | Check: `feed.style.overflowY = 'hidden'` is set |
| Text not readable | Check: thought-bubble color contrast, font size |
| Animation jittery | Check: CSS animations used (not JS), no heavy scripts |
| Image not loading | Check: image path correct, file exists in /images/ |
| Transition repeats | Check: `transitionsShown` state, observer unobserved |

---

## Performance Notes

✅ **Optimized**: Uses CSS animations (GPU accelerated)
✅ **Efficient**: IntersectionObserver (better than scroll events)
✅ **Lightweight**: No external libraries, vanilla JS
✅ **Mobile-friendly**: Works on touch & mouse
✅ **Accessible**: Text is readable, animations smooth

---

## Next Steps for Full Documentary

1. **Add Quiz popups** (Scene 5)
2. **Create Testimonies page** (Scene 6)
3. **Build Podcast section** (Scene 8)
4. **Design Disconnection sequence** (Scene 9)
5. **Build Reflection/Desktop view** (Scene 10)

Each scene can follow the same transition pattern!

---

## Documentation Map

Start here → **This file (You are here)**
↓
For code snippets → **QUICK_SNIPPETS.md**
↓
For detailed guide → **TRANSITIONS_GUIDE.md**
↓
For architecture → **ARCHITECTURE.md**
↓
For full scene planning → **SCENE_GUIDE.md**

---

## Contact Points in Code

### In feed.html (Lines 32-54)
Transitions HTML structure

### In feed.js (Lines 28-87)
All transition logic & handlers

### In styles.css (Lines 1556-1649)
All transition styling & animations

**Made changes? Check these 3 files!**

