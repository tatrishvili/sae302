# System Architecture Diagram

## Complete Quiz → Profile → Database Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER EXPERIENCE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User scrolls to end of feed                                 │
│  ↓                                                              │
│  2. Quiz popup appears (quiz.js)                                │
│  ↓                                                              │
│  3. User answers 3 questions                                    │
│     - How often do you edit? (never/sometimes/often/always)     │
│     - What matters most? (authentic/looks/likes/comparing)      │
│     - How do you feel? (happy/anxious/checking/worried)        │
│  ↓                                                              │
│  4. Click "Submit Quiz"                                         │
│     ├─ Answers stored in sessionStorage.quizResults              │
│     ├─ Close quiz popup                                         │
│     └─ Show 3-second success message                            │
│  ↓                                                              │
│  5. Profile popup appears (quiz-results.js) ✨ NEW              │
│     ├─ Icon: 🌱 🎨 ✨ 💭                                         │
│     ├─ Name: Authentic/Careful/Perfectionist/Struggling        │
│     ├─ Message: Personalized based on profile                   │
│     ├─ Traits: 4 key characteristics                            │
│     ├─ Advice: Tailored guidance                                │
│     ├─ Button: Share or Continue                                │
│     └─ Styling: Beautiful gradient (150+ lines SCSS)            │
│  ↓                                                              │
│  6. Data sent to backend                                        │
│     POST /api/quiz/save-result                                  │
│  ↓                                                              │
│  7. Saved in database ✅                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

```
┌─────────────────────────────────────────────────────┐
│                   feed.html                         │
│  ├─ feed.js (main feed logic)                       │
│  ├─ quiz.js (quiz system)                           │
│  ├─ quiz-results.js ✨ NEW (profile system)        │
│  ├─ styles.css (compiled from scss)                 │
│  └─ images/ (user photos)                           │
└─────────────────────────────────────────────────────┘
```

---

## Data Processing Pipeline

```
quiz.js (Quiz Collection)
  └─ quizAnswers = { 1: "never", 2: "authentic", 3: "happy" }
     └─ sessionStorage.setItem('quizResults', JSON.stringify())
        └─ quiz-results.js (Profile Calculation)
           └─ calculateQuizResults()
              ├─ Parse answers from sessionStorage
              ├─ Apply scoring algorithm
              │  ├─ Question 1 → +3 authentic
              │  ├─ Question 2 → +3 authentic
              │  └─ Question 3 → +3 authentic
              ├─ Total: authentic=9, others=0
              ├─ Winner: "authentic"
              └─ sessionStorage.setItem('quizProfile', JSON.stringify(result))
                 └─ showProfileResults()
                    ├─ Get profile data from profileDefinitions
                    ├─ Create popup HTML
                    ├─ Insert into DOM
                    ├─ Apply SCSS styling (animations, colors)
                    └─ saveQuizToDB()
                       └─ fetch('/api/quiz/save-result', POST)
                          └─ Backend processes request...
```

---

## Scoring System Visualization

```
QUESTION 1: Editing Frequency
────────────────────────────
never     ──→ authentic:3
sometimes ──→ careful:3
often     ──→ perfectionist:2 + careful:1
always    ──→ perfectionist:3

QUESTION 2: What Matters
────────────────────────
authentic    ──→ authentic:3
looking_good ──→ careful:2 + perfectionist:1
likes        ──→ perfectionist:2 + struggling:1
comparing    ──→ struggling:3

QUESTION 3: How You Feel
────────────────────────
happy    ──→ authentic:3
anxious  ──→ careful:2 + struggling:1
checking ──→ perfectionist:2 + struggling:1
worried  ──→ struggling:3

RESULT: Profile with highest total wins!
```

---

## Profile Type Decision Tree

```
                          START
                            │
                ┌───────────┴───────────┐
                │                       │
              Q1: Editing?              │
            (never/sometimes)           │
                │                       │
             AUTHENTIC PATH         PERFECTIONIST PATH
                │                       │
              Q2: ──────→ AUTHENTIC      │
              matters?                   │
         (authentic/happy)               │
                │                        │
          Score: 6-9         ┌──────────┴──────────┐
                │            │                     │
           ✅ AUTHENTIC     Anxious/Worried?   ✅ PERFECTIONIST
              (6-9 pts)         YES                (6-9 pts)
                              (Struggling)
                                 │
                          ✅ STRUGGLING
                            (4-5+ pts)

Middle ground:
  ✅ CAREFUL CURATOR (authentic:3-4 + careful:2-3)
```

---

## Database Schema

### MongoDB
```javascript
db.quiz_results {
  _id: ObjectId(),
  userId: "user_1707389400000_abc123",
  profile: "authentic",
  scores: {
    authentic: 3,
    careful: 0,
    perfectionist: 0,
    struggling: 0
  },
  answers: {
    "1": "never",
    "2": "authentic",
    "3": "happy"
  },
  timestamp: ISODate("2026-01-26T10:30:00Z")
}
```

### PostgreSQL
```sql
quiz_results (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  profile VARCHAR(50),
  scores JSONB,
  answers JSONB,
  timestamp TIMESTAMP
)
```

---

## API Request/Response

### Request (Frontend → Backend)

```http
POST /api/quiz/save-result HTTP/1.1
Host: your-backend.com
Content-Type: application/json

{
  "userId": "user_1707389400000_abc123",
  "profile": "authentic",
  "scores": {
    "authentic": 3,
    "careful": 0,
    "perfectionist": 0,
    "struggling": 0
  },
  "answers": {
    "1": "never",
    "2": "authentic",
    "3": "happy"
  },
  "timestamp": "2026-01-26T10:30:00Z"
}
```

### Response (Backend → Frontend)

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Quiz result saved",
  "id": "507f1f77bcf86cd799439011"
}
```

### Error Response

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Missing required fields"
}
```

---

## Component Relationships

```
┌─────────────────────────────────────────────────┐
│                    feed.html                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │         feed.js (Feed Logic)             │  │
│  │  - Displays posts                        │  │
│  │  - Manages feed state                    │  │
│  │  - Triggers quiz after scroll            │  │
│  └──────────────────────────────────────────┘  │
│           │                                    │
│           └──→ calls triggerQuizAfterLastPost()│
│               (from quiz.js)                   │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │      quiz.js (Quiz Popup System)         │  │
│  │  - Shows quiz popup                      │  │
│  │  - Collects answers                      │  │
│  │  - Manages quiz state                    │  │
│  │  - Stores in sessionStorage              │  │
│  └──────────────────────────────────────────┘  │
│           │                                    │
│           └──→ calls submitQuiz()              │
│               └──→ calls showProfileResults()  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │   quiz-results.js ✨ (Profile System)   │  │
│  │  - Calculates profile                    │  │
│  │  - Shows results popup                   │  │
│  │  - Manages sharing                       │  │
│  │  - Sends to database                     │  │
│  └──────────────────────────────────────────┘  │
│           │                                    │
│           └──→ calls saveQuizToDB()            │
│               └──→ fetch to /api/...          │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │   styles.css (Compiled from SCSS)        │  │
│  │  - Quiz popup styling                    │  │
│  │  - Profile popup styling ✨ NEW          │  │
│  │  - Animations                            │  │
│  │  - Mobile responsive                     │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## File Dependency Tree

```
feed.html
  ├─ feed.js
  │  ├─ Uses: sessionStorage (posts, followerCount)
  │  ├─ Uses: quiz.js functions
  │  └─ Triggers: triggerQuizAfterLastPost()
  │
  ├─ quiz.js
  │  ├─ Sets: sessionStorage.quizResults
  │  ├─ Calls: showProfileResults() from quiz-results.js ✨ NEW
  │  └─ Calls: saveQuizToDB() from quiz-results.js ✨ NEW
  │
  ├─ quiz-results.js ✨ NEW
  │  ├─ Reads: sessionStorage.quizResults
  │  ├─ Reads: sessionStorage.userId
  │  ├─ Uses: profileDefinitions
  │  ├─ Calls: fetch() to /api/quiz/save-result
  │  └─ Uses: scss styling (.profile-results-overlay, etc)
  │
  └─ css/styles.css (compiled from scss/styles.scss)
     ├─ .quiz-overlay (existing)
     ├─ .quiz-container (existing)
     ├─ .profile-results-overlay ✨ NEW
     ├─ .profile-results-container ✨ NEW
     ├─ .profile-header ✨ NEW
     ├─ .profile-message ✨ NEW
     ├─ .profile-traits ✨ NEW
     ├─ .profile-advice ✨ NEW
     └─ .profile-actions ✨ NEW
```

---

## Timeline: Quiz Submission to Database

```
T+0s   User clicks Submit
        └─ submitQuiz() validates answers
        └─ sessionStorage.quizResults = JSON.stringify()
        └─ closeQuiz() removes popup
        └─ showQuizSuccess() shows 3-sec message

T+1s   setTimeout callback triggers
        └─ showProfileResults() displays profile popup
        └─ saveQuizToDB() called

T+1.1s fetch() request sent
        └─ POST /api/quiz/save-result
        └─ Include: userId, profile, scores, answers, timestamp

T+1.5s Backend processes
        └─ Validate fields
        └─ Insert into database
        └─ Return success response

T+2s   Frontend receives response
        └─ console.log('Quiz result saved')
        └─ Ready for next action

T+3s   Success message fades out
        └─ Profile popup still visible
        └─ User can Share or Continue
```

---

## Mobile Responsiveness

```
DESKTOP (> 600px)              MOBILE (≤ 600px)
┌─────────────────┐           ┌──────────────┐
│ Quiz/Profile    │           │ Quiz/Profile │
│ 550px wide      │           │ 100% width   │
│ Centered        │           │ Full-screen  │
│ Padding 20px    │           │ Padding 20px │
│                 │           │              │
│ Font: 15-16px   │           │ Font: 14-15px│
│ Buttons: flex   │           │ Buttons: full│
│ Traits: 15px    │           │ Traits: 13px │
│ Columns: 1      │           │ Columns: 1   │
│ Gap: 20px       │           │ Gap: 15px    │
└─────────────────┘           └──────────────┘
```

---

## Status Indicators

| Component | Status | Notes |
|-----------|--------|-------|
| quiz.js | ✅ Working | Existing system |
| Quiz popup | ✅ Working | Asks 3 questions |
| Answer collection | ✅ Working | Stored in sessionStorage |
| quiz-results.js | ✅ NEW | 200+ lines created |
| Profile calculation | ✅ Working | Scoring algorithm implemented |
| Profile popup | ✅ NEW | Beautiful 4-type system |
| SCSS styling | ✅ NEW | 150+ lines added |
| CSS compilation | ✅ Working | Auto-compiled successfully |
| Data to sessionStorage | ✅ Working | Profile data stored |
| saveQuizToDB() | ✅ Working | fetch() ready |
| Backend endpoint | ❌ Needs You | Must create POST /api/... |
| Database | ❌ Needs You | Must create table |
| Analytics (optional) | ⏳ Future | Can build later |

---

## Next: What You Need to Build

```
Your Backend Server
    ↓
Receive POST /api/quiz/save-result
    ↓
Validate fields:
  - userId ✓
  - profile ✓
  - scores ✓
  - answers ✓
  - timestamp ✓
    ↓
Insert into database:
  CREATE TABLE quiz_results (
    user_id, profile, scores, answers, timestamp
  )
    ↓
Return success:
  { success: true, id: ... }
    ↓
DONE! ✅
```

**Examples for all backends in DATABASE_INTEGRATION.md**
