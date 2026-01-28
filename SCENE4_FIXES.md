# Scene 4 - Popup & Data Storage Fixes ✅

## Issues Fixed

### 1. **Popup Not Appearing at anais_b Post** ❌ → ✅
**Problem:** The popup never showed when scrolling to anais_b's post

**Root Cause:** 
- `addNewPostsAfterJustine()` was only called when `postsArray.length >= 2`
- But after the first post, length is 1, so the observer for anais_b post was never set up
- Therefore the popup trigger never initialized

**Solution:**
- Changed `resumeAfterPost()` to always call `addNewPostsAfterJustine()`
- Now the observer is set up after any post, not just the second post

### 2. **Second Popup Not Triggering (Flag Conflict)** ❌ → ✅
**Problem:** Even after fixing the observer setup, the popup still didn't show

**Root Cause:**
- The `popupShown` flag was set to `true` when the first popup appeared
- When checking for the second popup, `!popupShown` was `false`, so it never triggered
- Both popups were using the same flag!

**Solution:**
- Added `secondPostPopupShown` flag for the second popup
- Each popup now has its own independent flag
- First popup uses: `popupShown`
- Second popup uses: `secondPostPopupShown`

### 3. **Photos Accumulating (No Limit)** ❌ → ✅
**Problem:** Old photos were being stored and accumulating in sessionStorage

**Root Cause:**
- No maximum limit on posts
- Array was never cleared between sessions
- Old posts kept showing up

**Solution:**
- Added limit of 2 posts max in `savePost()` function
- If more than 2 posts exist, keep only the last 2: `postsArray.slice(-2)`
- Clear posts array on fresh start (when no `justinePost` in sessionStorage)

### 4. **Old Posts Showing on Fresh Start** ❌ → ✅
**Problem:** When user starts fresh, they see old posts from previous sessions

**Root Cause:**
- SessionStorage wasn't cleared between sessions
- Old `justinePostsArray` was persisting

**Solution:**
- Added clear logic in `feed.js` DOMContentLoaded:
  ```javascript
  // Clear old posts on fresh start
  const hasCurrentPost = sessionStorage.getItem('justinePost');
  if (!hasCurrentPost) {
    sessionStorage.removeItem('justinePostsArray');
    sessionStorage.removeItem('stoppedIndex');
    sessionStorage.removeItem('feedScrollPosition');
  }
  ```
- If user enters feed without a current post being edited, clear old data
- This ensures fresh starts are truly fresh

## Files Modified

### `feed.js`
1. Added `secondPostPopupShown` flag at top
2. Added clearing logic in DOMContentLoaded
3. Modified `resumeAfterPost()` to always call `addNewPostsAfterJustine()`
4. Updated `setupSecondPostPopupTrigger()` to use `secondPostPopupShown` flag

### `edit-post.js`
1. Updated `savePost()` to limit posts to 2 max
2. Added check: `if (postsArray.length > 2) { postsArray = postsArray.slice(-2); }`

### `profil-after.js`
1. Added comments explaining post clearing behavior
2. No functional changes needed (works with new system)

## How It Works Now

### Fresh Start
```
User enters feed.html for first time
  ↓
justinePost not in sessionStorage
  ↓
Clear old posts: justinePostsArray removed
  ↓
No old posts show up ✓
```

### First Post Flow
```
User creates and saves first post
  ↓
postsArray = [post1]
justinePost = post1 data
  ↓
resumeAfterPost() called
  ↓
addNewPostsAfterJustine() called
  ↓
setupSecondPostPopupTrigger() sets up observer
  ↓
User scrolls to anais_b post
  ↓
IntersectionObserver detects entry
  ↓
secondPostPopupShown = false ✓
  ↓
stopScrollAndShowSecondPostPopup() called
  ↓
Popup appears ✓
```

### Second Post Flow
```
User creates and saves second post
  ↓
postsArray = [post1, post2] (limited to 2)
justinePost = post2 data
  ↓
resumeAfterPost() called
  ↓
addNewPostsAfterJustine() called
  ↓
setupSecondPostPopupTrigger() checks length
  ↓
postsData.length === 2 (not 1)
  ↓
Observer NOT set up
  ↓
No popup shows ✓ (correct - already did second post)
```

## Data Storage Now

### SessionStorage
```javascript
justinePostsArray = [
  "data:image/jpeg;base64,...",  // First post
  "data:image/jpeg;base64,..."   // Second post (max 2)
]

justinePost = {
  image: "current_post_data",
  caption: "text",
  isSecondPost: boolean
}
```

### When Cleared
- Fresh feed visit (no justinePost in sessionStorage)
- Browser tab refresh
- User goes back intentionally

### When Kept
- During active story (justinePost exists)
- Between profile and feed navigation
- During post creation process

## Testing Checklist

- [x] First post saves
- [x] Popup appears at anais_b's post after first post
- [x] Popup doesn't appear after second post
- [x] Only 2 posts max stored (no accumulation)
- [x] Fresh start clears old posts
- [x] Switching between pages preserves current post
- [x] Back button works correctly
- [x] Profile shows correct number of posts

## Performance Impact

- ✅ No noticeable change
- ✅ SessionStorage usage capped at 2 posts
- ✅ Observers automatically unobserved after trigger
- ✅ Clearing logic runs once per page load

---

**Status:** All issues fixed and tested ✅
