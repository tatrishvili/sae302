# Scene 4 Quick Start Guide

## For Viewers/Users

### What's New in Scene 4?

After posting your first photo and seeing it get likes, you'll be encouraged to **post another photo**. This time, you have access to more advanced editing tools:

- **Face Smoothing** - Make skin appear smoother
- **Skin Tone** - Adjust warmth/coolness of your complexion  
- **Saturation** - Make colors more vibrant
- **Contrast** - Make image pop more

### The Experience Flow

```
1. Choose a photo from Scene 3
   ↓
2. Edit with basic tools (brightness, blur, filters)
   ↓
3. See your post get likes! ✓
   ↓
4. View your profile with 1 post
   ↓
5. [Popup] "The original looks a bit off... Post another photo?"
   ↓
6. Choose to post another OR continue scrolling
   ↓
7. If you post again:
   - Get access to ADVANCED tools
   - Edit your face more intensively
   - See more likes and followers increase
   ↓
8. Profile now shows 2 posts
   ↓
9. Continue scrolling in feed
   - See posts from other influencers
   - Start comparing yourself
   ↓
10. Scene 5: The anxiety and comparison spiral begins
```

### What This Scene Represents

Scene 4 shows how social media usage **escalates**:

- **First time:** Just a little touch-up seems harmless
- **Second time:** More intensive editing becomes normal
- **The tools:** More powerful features appear, encouraging more manipulation
- **The feedback:** Positive likes encourage continued editing
- **The result:** Your real self vs. your edited self becomes a bigger gap

This is the moment Justine's casual usage transforms into compulsive behavior.

---

## For Developers Working on Scene 5

### What You Have Available

After Scene 4 completes, you have:

1. **Two edited photos:**
   ```javascript
   const postsArray = JSON.parse(sessionStorage.getItem('justinePostsArray'));
   // postsArray[0] = first post
   // postsArray[1] = second post (more heavily edited)
   ```

2. **Profile info:**
   ```javascript
   const profilePhoto = localStorage.getItem('selectedProfilePhoto');
   const postCount = postsArray.length; // Should be 2
   ```

3. **Follower count changed:**
   - Started with 0
   - +3-4 after first post
   - +2-4 after second post
   - Total: 5-8 followers

### Scene 5 Hook: Comparison

The next scene should leverage:
- **Side-by-side comparison** of the two posts
- **Influencer posts** now appearing in feed
- **Engagement metrics** (likes, comments) showing Justine's posts get less engagement
- **Reflection quiz** to make viewers think about their own usage
- **Anxiety indicators** in Justine's expressions/thoughts

---

## Files to Understand

### Core Files
1. **edit-post.js** - Where the editing happens
2. **feed.js** - Feed management and post loading
3. **profil-after.js** - Profile display and popups

### Key Variables
- `isSecondPost` - Boolean, true when editing second post
- `postsArray` - Array of all edited photos
- `justinePost` - Current post being processed
- `stoppedIndex` - Where to insert post in feed

### Important Functions
```javascript
// Get posts array
const posts = JSON.parse(sessionStorage.getItem('justinePostsArray'));

// Check if it's a second post
const isSecond = posts.length >= 1;

// Apply advanced filters (second post only)
applyAdvancedFilters(smoothing, skinTone, saturation, contrast);
```

---

## Design Patterns to Follow

### Popup Pattern (Used in Scene 4)
```javascript
// Create overlay
const overlay = document.createElement('div');
overlay.style.cssText = `...`;
overlay.innerHTML = `...`;

// Add to page
document.body.appendChild(overlay);

// Remove on action
overlay.remove();
```

### Data Management Pattern
```javascript
// Check what stage we're at
const posts = JSON.parse(sessionStorage.getItem('justinePostsArray'));
if (posts && posts.length >= 2) {
    // Second post complete, can proceed to Scene 5
}
```

### Navigation Pattern
```javascript
// Conditional navigation based on progress
function continueBrowsing() {
    const posts = JSON.parse(sessionStorage.getItem('justinePostsArray'));
    if (posts.length >= 2) {
        window.location.href = 'scene5.html';
    }
}
```

---

## Troubleshooting Common Issues

### Posts not appearing in profile?
- Check `justinePostsArray` exists in sessionStorage
- Verify images are valid base64 data URIs
- Check profile grid has correct CSS grid setup

### Advanced controls not showing?
- Make sure `isSecondPost` is detected correctly
- Check that `updateForSecondPost()` is called
- Verify `#advancedControls` div has `hidden` class initially

### Popup not appearing?
- Check `showPostAnotherPopup()` is called from profil-after.js
- Verify overlay z-index is high enough
- Check that DOM elements are loaded before function calls

### Navigation not working?
- Verify function names match onclick handlers
- Check window.location.href paths are correct
- Ensure sessionStorage data isn't being cleared prematurely

---

## Design Decisions Explained

### Why Advanced Tools Only on Second Post?
- Represents escalation of behavior
- Shows progression from innocent to compulsive
- Supports narrative of increasing self-consciousness

### Why Store Posts as Array?
- Allows multiple posts for Scene 5 comparison
- Preserves post order chronologically
- Easier to display in profile grid

### Why SessionStorage vs LocalStorage?
- Posts are scene-specific (not persistent)
- Clears when user closes browser (natural reset)
- Prevents data from persisting if user refreshes
- Encourages restarting the experience

### Why Popup After First Post?
- Leverages psychological principle of reinforcement
- If you got likes once, try again
- Mirrors real social media behavior
- Sets up the escalation theme

---

## CSS Classes to Know

```css
.hidden { display: none; }
#advancedControls { background: gradient; }
.justine-popup { fixed overlay positioning }
.profile-post-item { grid item for posts }
.editor-controls { container for input sliders }
```

---

## Performance Tips

- Image data URIs can be large (1-2 MB each)
- SessionStorage has ~5-10 MB limit
- Don't create unnecessary copies of image data
- Test with actual image sizes for performance

---

## Next Steps

1. **Scene 5 Development:**
   - Build comparison view
   - Implement anxiety indicators
   - Create quiz system

2. **Scene 6:**
   - Testimonies/interviews
   - Psychology explanation

3. **Scene 7+:**
   - Disconnection moment
   - Desktop version begins

---

## Support & Questions

For questions about Scene 4 implementation:
- See SCENE4_TECHNICAL_REFERENCE.md
- Check SCENE4_IMPLEMENTATION.md for detailed changes
- Review SCENE4_NARRATIVE.md for all text content

---

**Remember:** Every feature in Scene 4 serves the documentary's message about social media escalation and disconnection.
