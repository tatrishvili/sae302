# Quiz Results & Database Integration Guide

## Overview
The quiz system now calculates user profiles and stores them in your database. Here's how to set it up completely.

---

## Frontend Flow (Already Implemented ✅)

### 1. Quiz Flow
```
User answers quiz → Click Submit → Results calculated → Profile shown → Saved to DB
```

### 2. Data Flow in Browser
```javascript
// User answers stored in sessionStorage
sessionStorage.quizResults = '{"1":"sometimes","2":"authentic","3":"happy"}'

// Profile calculated
calculateQuizResults() → returns:
{
  profile: "authentic",
  scores: { authentic: 3, careful: 0, perfectionist: 0, struggling: 0 },
  answers: { 1: "sometimes", 2: "authentic", 3: "happy" },
  timestamp: "2026-01-26T10:30:00Z"
}

// Saved for viewing
sessionStorage.quizProfile = JSON.stringify(result)

// Sent to your backend
saveQuizToDB() → fetch('/api/quiz/save-result', POST)
```

---

## Backend Setup Required

### Step 1: Create Database Schema

**Using MongoDB** (Recommended):
```javascript
// Quiz Results Collection
db.createCollection("quiz_results", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "profile", "timestamp"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { 
          bsonType: "string",
          description: "Unique user identifier"
        },
        profile: { 
          bsonType: "string",
          enum: ["authentic", "careful", "perfectionist", "struggling"],
          description: "Calculated user profile"
        },
        scores: {
          bsonType: "object",
          properties: {
            authentic: { bsonType: "int" },
            careful: { bsonType: "int" },
            perfectionist: { bsonType: "int" },
            struggling: { bsonType: "int" }
          }
        },
        answers: {
          bsonType: "object",
          properties: {
            "1": { bsonType: "string" },  // Question 1 answer
            "2": { bsonType: "string" },  // Question 2 answer
            "3": { bsonType: "string" }   // Question 3 answer
          }
        },
        timestamp: { bsonType: "date" }
      }
    }
  }
});

// Create index for faster queries
db.quiz_results.createIndex({ userId: 1, timestamp: -1 });
db.quiz_results.createIndex({ profile: 1 });
```

**Using PostgreSQL**:
```sql
CREATE TABLE quiz_results (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  profile VARCHAR(50) NOT NULL CHECK (profile IN ('authentic', 'careful', 'perfectionist', 'struggling')),
  scores JSONB NOT NULL,
  answers JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_profile (profile),
  INDEX idx_created_at (created_at)
);
```

---

### Step 2: Create Backend API Endpoint

**Node.js + Express Example**:
```javascript
const express = require('express');
const router = express.Router();
const QuizResult = require('./models/QuizResult');

// POST /api/quiz/save-result
router.post('/quiz/save-result', async (req, res) => {
  try {
    const { userId, profile, scores, answers, timestamp } = req.body;

    // Validate required fields
    if (!userId || !profile) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save to database
    const result = new QuizResult({
      userId,
      profile,
      scores,
      answers,
      timestamp: new Date(timestamp)
    });

    await result.save();

    res.json({
      success: true,
      message: 'Quiz result saved',
      id: result._id
    });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ error: 'Failed to save quiz result' });
  }
});

// GET /api/quiz/profile/:userId
router.get('/quiz/profile/:userId', async (req, res) => {
  try {
    const result = await QuizResult.findOne({ 
      userId: req.params.userId 
    }).sort({ timestamp: -1 });

    if (!result) {
      return res.status(404).json({ error: 'No quiz results found' });
    }

    res.json({
      profile: result.profile,
      scores: result.scores,
      timestamp: result.timestamp
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;
```

**Python + Flask Example**:
```python
from flask import Flask, request, jsonify
from datetime import datetime
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient('mongodb://localhost:27017/')
db = client['amically']
quiz_results = db['quiz_results']

@app.route('/api/quiz/save-result', methods=['POST'])
def save_quiz_result():
    try:
        data = request.json
        
        # Validate
        if not data.get('userId') or not data.get('profile'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Save to database
        result = {
            'userId': data['userId'],
            'profile': data['profile'],
            'scores': data['scores'],
            'answers': data['answers'],
            'timestamp': datetime.fromisoformat(data['timestamp'])
        }
        
        inserted = quiz_results.insert_one(result)
        
        return jsonify({
            'success': True,
            'id': str(inserted.inserted_id)
        })
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/quiz/profile/<user_id>', methods=['GET'])
def get_user_profile(user_id):
    try:
        result = quiz_results.find_one(
            {'userId': user_id},
            sort=[('timestamp', -1)]
        )
        
        if not result:
            return jsonify({'error': 'No results found'}), 404
        
        return jsonify({
            'profile': result['profile'],
            'scores': result['scores'],
            'timestamp': result['timestamp'].isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

---

### Step 3: Add User ID Tracking

Update your JavaScript to generate/track user IDs:

**In feed.js or main script**:
```javascript
function initializeUser() {
  let userId = localStorage.getItem('userId');
  
  if (!userId) {
    // Generate unique ID for anonymous users
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  
  // Store in sessionStorage for current session
  sessionStorage.setItem('userId', userId);
}

// Call on page load
initializeUser();
```

---

### Step 4: Update Frontend to Send UserID

The `quiz-results.js` already includes this code that sends to your backend:

```javascript
async function saveQuizToDB() {
  const result = JSON.parse(sessionStorage.getItem('quizProfile'));
  
  try {
    const response = await fetch('/api/quiz/save-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: sessionStorage.getItem('userId') || 'anonymous',
        profile: result.profile,
        scores: result.scores,
        answers: result.answers,
        timestamp: result.timestamp
      })
    });

    const data = await response.json();
    console.log('Quiz result saved:', data);
    return data;
  } catch (error) {
    console.error('Error saving quiz result:', error);
  }
}
```

---

## Testing the Complete Flow

### Test Locally (Before Database)
1. Open Feed
2. Create 2 posts (triggers quiz after scrolling)
3. Answer all quiz questions
4. See profile result popup
5. Check browser console: `console.log(JSON.parse(sessionStorage.getItem('quizProfile')))`

### Test with Database
1. Start your backend server
2. Make sure `/api/quiz/save-result` endpoint is working
3. Check browser Console → Network tab → POST to `/api/quiz/save-result`
4. Verify data in your database

---

## User Profiles Explained

### 1. **The Authentic** 🌱
- **Score**: Highest in "authentic" category
- **Traits**: Genuine, confident, shares real moments
- **Message**: "You're comfortable with who you are"
- **Color**: Green (#4CAF50)

### 2. **The Careful Curator** 🎨
- **Score**: Balanced between authentic & perfectionist
- **Traits**: Thoughtful, selective, values presentation
- **Message**: "You balance authenticity with presentation"
- **Color**: Blue (#2196F3)

### 3. **The Perfectionist** ✨
- **Score**: High in editing, likes, perfectionism
- **Traits**: High standards, seeks validation, influenced by others
- **Message**: "You aim for the perfect presentation"
- **Color**: Orange (#FF9800)

### 4. **The Struggling Seeker** 💭
- **Score**: High in anxiety, comparison, validation-seeking
- **Traits**: Very influenced by others, anxious about image
- **Message**: "Social media is affecting your self-esteem"
- **Color**: Pink (#E91E63)

---

## Analytics Ideas (Optional)

```javascript
async function getProfileStats() {
  const response = await fetch('/api/quiz/stats');
  const stats = await response.json();
  
  return {
    totalResponses: stats.total,
    byProfile: {
      authentic: stats.authentic,
      careful: stats.careful,
      perfectionist: stats.perfectionist,
      struggling: stats.struggling
    },
    averageScores: stats.averageScores
  };
}

async function getStrugglingUsers() {
  const response = await fetch('/api/quiz/profile/struggling');
  return await response.json();
}

async function compareProfiles() {
  const response = await fetch('/api/quiz/compare');
  return await response.json();
}
```

---

## Troubleshooting

### Quiz not saving?
1. Check browser Console for errors
2. Verify `/api/quiz/save-result` endpoint exists
3. Check CORS headers if backend is different domain
4. Verify `userId` is being set: `sessionStorage.getItem('userId')`

### Profile not showing?
1. Verify `quiz-results.js` is loaded: Check Network tab
2. Check Console for JavaScript errors
3. Verify `quizResults` is in sessionStorage after quiz submit

### Database not receiving data?
1. Add logging to backend endpoint
2. Use Postman to test: POST to `/api/quiz/save-result` with sample data
3. Check network tab to see actual payload being sent

---

## Next Steps

1. **Create your backend endpoint** using the examples above
2. **Set up your database** (MongoDB or PostgreSQL)
3. **Test the complete flow** locally
4. **Add user authentication** (optional, but recommended for analytics)
5. **Build analytics dashboard** to visualize results
