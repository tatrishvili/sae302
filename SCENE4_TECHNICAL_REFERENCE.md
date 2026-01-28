# Scene 4 Data Structure Reference for Future Development

## SessionStorage Keys

### Primary Keys:
```javascript
// Array of edited image data URIs
sessionStorage.getItem('justinePostsArray')
// Returns: JSON array of base64 image strings
// Example: ["data:image/jpeg;base64,...", "data:image/jpeg;base64,..."]

// Current post being processed
sessionStorage.getItem('justinePost')
// Returns: JSON object with { image: "", caption: "", isSecondPost: boolean }

// Scroll position for resuming
sessionStorage.getItem('feedScrollPosition')
// Returns: number (scroll position in pixels)

// Index where post should be inserted
sessionStorage.getItem('stoppedIndex')
// Returns: number (index in post array)
```

### localStorage Keys:
```javascript
// Profile image selected during registration
localStorage.getItem('selectedProfilePhoto')
// Returns: image path string (e.g., "images/justine1.png")
```

---

## Key Functions & Their Purpose

### In `edit-post.js`:

```javascript
// Initialize second post detection
isSecondPost = postsData ? JSON.parse(postsData).length >= 1 : false;

// Show advanced tools for second post
updateForSecondPost()

// Save post with array management
savePost() 
// Updates justinePostsArray with new post

// Apply advanced filters (second post only)
applyAdvancedFilters(smoothing, skinTone, saturation, contrast)

// Reset all story data
resetStory()
```

### In `feed.js`:

```javascript
// Check post number and load accordingly
resumeAfterPost() 
// Detects if 2+ posts exist, calls addNewPostsAfterJustine()

// Load other users' posts
addNewPostsAfterJustine()
// Called automatically when 2+ posts exist
```

### In `profil-after.js`:

```javascript
// Display multiple posts
// Reads justinePostsArray and renders grid

// Show popup for second post
showPostAnotherPopup()
// Appears after first post is saved

// Navigate to second post editing
goToSecondPost()

// Continue to feed
continueBrowsing()
// Handles different flows based on post count
```

---

## For Scene 5 Development (Comparison & Anxiety)

### Data You Can Access:

```javascript
// Get all posts Justine has made
const postsArray = JSON.parse(sessionStorage.getItem('justinePostsArray'));
// Use these to show comparison between posts

// Get profile image
const profilePhoto = localStorage.getItem('selectedProfilePhoto');

// Check current progress
const postCount = postsArray ? postsArray.length : 0;
```

### Recommended Scene 5 Features:

1. **Post Comparison View**
   - Display original and heavily edited versions side-by-side
   - Show the transformation progression

2. **Feed Comparison**
   - Display Justine's posts alongside influencer posts
   - Show engagement metrics (likes, comments)

3. **Reflection Quiz**
   - Already mentioned in your script
   - Use popup system similar to Scene 4

4. **Anxiety Indicators**
   - Visual changes when scrolling through influencers
   - Highlight posts with high engagement
   - Show comments that trigger comparison

### Implementation Pattern:

```javascript
// Scene 5 pattern (from Scene 4 for reference)
document.addEventListener('DOMContentLoaded', () => {
    // Get posts array
    const postsArray = JSON.parse(sessionStorage.getItem('justinePostsArray'));
    
    if (postsArray && postsArray.length >= 2) {
        // Show comparison view
        displayComparisonView(postsArray);
    }
});

function displayComparisonView(postsArray) {
    // First post (original)
    const original = postsArray[0];
    
    // Second post (heavily edited)
    const edited = postsArray[1];
    
    // Show side-by-side or swipe comparison
}
```

---

## Navigation Tree

```
index.html (Register)
    ↓
profile.html (Profile Photo)
    ↓
feed.html (Initial Feed) ← First time only
    ↓
[Popup] "Post something"
    ↓
edit-post.html (First Post)
    ├─ Basic tools visible
    └─ isSecondPost = false
    ↓
profile-after.html (1 post visible)
    ├─ Shows "Post another photo" popup
    └─ stoppedIndex = first post location
    ↓
feed.html (resumeAfterPost triggers)
    ├─ Shows 1st post
    ├─ NO additional posts yet
    └─ popupShown = true
    ↓
[Popup] "Post another photo" (in profile-after)
    ↓
edit-post.html (Second Post)
    ├─ Advanced tools visible
    └─ isSecondPost = true
    ↓
profile-after.html (2 posts visible)
    ├─ Shows both posts
    └─ No popup shown this time
    ↓
feed.html (resumeAfterPost triggers)
    ├─ Shows 2nd post
    ├─ Calls addNewPostsAfterJustine() automatically
    └─ Shows influencer posts
    ↓
[Scene 5: Comparison begins]
```

---

## CSS Classes & Variables

```css
/* Advanced Controls */
#advancedControls
#advancedControls h4

/* Popups */
.justine-popup
.justine-popup.hidden
.popup-box

/* Profile Grid */
.profile-posts-grid
.profile-post-item

/* Editor */
.editor-controls
.editor-controls.hidden
.control-group
```

---

## Important Notes for Scene 5 Dev

1. **Data Persistence:** SessionStorage clears when user goes back, so save any comparison data early

2. **Post Order:** Posts are stored in chronological order in the array. First post = index 0, Second post = index 1

3. **Image Quality:** Posts are stored as JPEG data URIs, so they're already compressed

4. **Popup System:** Uses custom divs, not DOM-based elements, so they don't appear in HTML initially

5. **Profile Count:** Post count updates dynamically, so use JavaScript to get current number

6. **Feed Timing:** New posts added after second post ONLY, creating a clear narrative break

---

## Debugging Tips

```javascript
// Check what posts exist
console.log(JSON.parse(sessionStorage.getItem('justinePostsArray')));

// Check current position
console.log('Scroll:', sessionStorage.getItem('feedScrollPosition'));

// Clear everything for fresh start
sessionStorage.clear();
localStorage.clear();

// Check if second post
const postsArray = sessionStorage.getItem('justinePostsArray');
console.log('Is second post?', postsArray && JSON.parse(postsArray).length >= 1);
```

---

## Performance Considerations

- Image data URIs can be large (1-2 MB each as base64)
- SessionStorage has ~5-10 MB limit on most browsers
- Don't store more than necessary
- Consider compressing or storing as blobs if adding more posts beyond Scene 4

---

## Accessibility Notes

- Advanced controls are hidden by default (good for Scene 3)
- Shown progressively for Scene 4 (progressive disclosure)
- Popups can be dismissed with button or click
- All controls have proper labels for screen readers
