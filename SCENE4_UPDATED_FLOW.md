# Updated Scene 4 Flow - Second Post Popup in Feed

## New Flow (CORRECTED)

```
1. First Post Creation
   ├─ User edits photo
   ├─ Saves with basic tools only
   └─ Redirect to profile-after.html

2. Profile After First Post
   ├─ Shows 1 post
   ├─ Shows follower count
   └─ [Continue scrolling button] → feed.html

3. Feed Shows First Post + Other Users' Posts
   ├─ First post appears in feed
   ├─ Other users' posts start loading (clara.vsl, zoe.pch, etc.)
   ├─ User scrolls automatically/manually
   └─ [Scroll continues...]

4. Scroll Reaches anais_b's Post (Podcast Post)
   └─ [SCROLL STOPS - Popup appears]
   
5. Second Post Popup
   ├─ Text: "The original looks a bit off... Maybe I should post something else."
   ├─ Two options:
   │  ├─ [Later] → Continue scrolling in feed
   │  └─ [Post another] → Go to edit-post.html
   └─ Only shows after first post (not after second)

6. If User Clicks "Post another"
   ├─ Go to edit-post.html
   ├─ Advanced controls now visible
   ├─ Edit second photo with intensive tools
   ├─ Save post
   └─ Redirect to profile-after.html (2 posts visible)

7. Profile After Second Post
   ├─ Shows 2 posts
   ├─ Follower count increased more
   └─ [Continue scrolling] → feed.html

8. Feed After Second Post
   ├─ No popup shown (already did second post)
   ├─ Shows all posts
   └─ Ready for Scene 5
```

## Key Changes Made

### profil-after.js
- **Removed**: showPostAnotherPopup(), closePopupAndContinue(), goToSecondPost()
- **Kept**: Simple continueBrowsing() → feed.html
- **Removed**: Popup trigger after first post
- **Effect**: Profile page is now clean, no popups

### feed.js
- **Modified**: addNewPostsAfterJustine()
  - Now marks anais_b's post with id="anais-post-card"
  - Calls setupSecondPostPopupTrigger()
  
- **Added**: setupSecondPostPopupTrigger()
  - Observes anais_b's post
  - Only triggers if postsArray.length === 1 (after first post, not after second)
  - Shows popup when post intersects
  
- **Added**: stopScrollAndShowSecondPostPopup()
  - Stops scroll
  - Shows justineSecondPostPopup
  - Saves scroll position for later

### feed.html
- **No Changes**: Popup already exists as #justineSecondPostPopup
- **Usage**: Now triggered by feed.js scroll detection instead of profile popup

## Detection Logic

The popup only shows after the **first post**:
```javascript
const postsArray = sessionStorage.getItem('justinePostsArray');
const postsData = postsArray ? JSON.parse(postsArray) : [];

if (postsData.length === 1) {  // Only first post exists
  setupSecondPostPopupTrigger(anaisCard);
}
```

After second post, `postsData.length === 2`, so popup doesn't trigger.

## User Journey Visualization

```
register.html
    ↓
profile.html
    ↓
feed.html (initial feed)
    ↓ [Popup: "Post something"]
edit-post.html (FIRST post)
    ├─ Basic tools only
    └─ [Save] → success animation
    ↓
profile-after.html (1 post visible)
    ├─ [Continue scrolling]
    ↓
feed.html (with anais post)
    ├─ Scrolling...
    ├─ [Reaches anais_b post]
    └─ [POPUP: "Post another photo?"]
         ├─ [Later] → resume scrolling
         └─ [Post another] ↓
          edit-post.html (SECOND post)
            ├─ Advanced tools visible
            └─ [Save] → success animation
            ↓
          profile-after.html (2 posts visible)
            ├─ [Continue scrolling]
            ↓
          feed.html (all posts shown)
            └─ No popup (already did 2nd post)
            ↓
          [Scene 5 begins]
```

## Narrative Purpose

- **In Profile**: User sees their achievement (1 post), then continues
- **In Feed**: Seeing others' posts → triggers comparison/insecurity
- **At anais_b Post**: Specific moment where Justine thinks "should post again"
- **Advanced Editing**: More intensive tools for second post
- **Scene 5**: Ready to explore the comparison anxiety

This creates the proper narrative arc of escalation through social influence.
