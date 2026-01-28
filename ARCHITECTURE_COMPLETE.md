# Complete System Architecture: Quiz → Profile → Database

## 🎯 What the User Experiences

```
1. User takes quiz (3 questions) → Hits Submit
2. System calculates personality profile (4 types)
3. Beautiful popup shows their profile with:
   - Profile type (Authentic, Careful, Perfectionist, or Struggling)
   - Personalized message
   - 4 key traits about them
   - Tailored advice
   - Share button
4. Data automatically sent to your backend database
5. User can continue or share their profile
```

---

## 🔧 Technical Architecture

### Frontend (Browser)
```
quiz.js → Collects answers → Stores in sessionStorage
                                    ↓
quiz-results.js → Calculates profile → Shows popup
                                    ↓
                                Calls saveQuizToDB()
                                    ↓
                    fetch('/api/quiz/save-result', POST)
```

### Backend (Your Server)
```
POST /api/quiz/save-result
        ↓
Validate data
        ↓
Save to database (MongoDB/PostgreSQL/etc)
        ↓
Return success response
```

### Database
```
quiz_results collection/table
    - userId (string)
    - profile (string: "authentic", "careful", "perfectionist", "struggling")
    - scores (object with 4 scores)
    - answers (object with answers)
    - timestamp (date)
```

---

## 📊 Profile Types & Scoring

### How Scoring Works
Each answer contributes points to one of 4 profiles:

**Question 1: Editing frequency**
- "Never" → +3 authentic
- "Sometimes" → +3 careful  
- "Often" → +2 perfectionist, +1 careful
- "Always" → +3 perfectionist

**Question 2: What matters most**
- "Authentic" → +3 authentic
- "Looking good" → +2 careful, +1 perfectionist
- "Getting likes" → +2 perfectionist, +1 struggling
- "Comparing" → +3 struggling

**Question 3: How you feel posting**
- "Happy" → +3 authentic
- "Anxious" → +2 careful, +1 struggling
- "Checking likes" → +2 perfectionist, +1 struggling
- "Worried" → +3 struggling

**Result:** Highest total score = user's profile

### The 4 Profiles

```javascript
{
  authentic: {
    name: "The Authentic",
    icon: "🌱",
    color: "#4CAF50",
    description: "You prioritize being genuine over perfection",
    traits: [
      "Confident in your identity",
      "Shares real moments",
      "Values honest connections",
      "Doesn't seek constant validation"
    ],
    message: "You're comfortable with who you are. You post to share experiences, not to impress others.",
    advice: "Keep being yourself! Your authenticity is attractive and draws real friends."
  },
  careful: {
    name: "The Careful Curator",
    icon: "🎨",
    color: "#2196F3",
    description: "You balance authenticity with presentation",
    ...
  },
  perfectionist: {
    name: "The Perfectionist",
    icon: "✨",
    color: "#FF9800",
    description: "You aim for the perfect presentation",
    ...
  },
  struggling: {
    name: "The Struggling Seeker",
    icon: "💭",
    color: "#E91E63",
    description: "Social media is affecting your self-esteem",
    ...
  }
}
```

---

## 🚀 Step-by-Step Backend Implementation

### Step 1: Choose Your Stack

**Option A: Node.js + Express + MongoDB**
```bash
npm install express mongodb dotenv cors
```

**Option B: Python + Flask + MongoDB**
```bash
pip install flask pymongo python-dotenv
```

**Option C: Node.js + Express + PostgreSQL**
```bash
npm install express pg dotenv cors
```

---

### Step 2: Database Setup

#### MongoDB
```javascript
// Connection string in .env
MONGODB_URI=mongodb://localhost:27017/amically

// Collection
db.quiz_results.createIndex({ userId: 1, timestamp: -1 })
```

#### PostgreSQL
```sql
CREATE TABLE quiz_results (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  profile VARCHAR(50) NOT NULL CHECK (profile IN ('authentic', 'careful', 'perfectionist', 'struggling')),
  scores JSONB NOT NULL,
  answers JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON quiz_results(user_id);
CREATE INDEX idx_profile ON quiz_results(profile);
```

---

### Step 3: API Endpoint

#### Node.js + Express + MongoDB
```javascript
// server.js
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.MONGODB_URI);
let db;

client.connect().then(() => {
  db = client.db('amically');
  console.log('Connected to MongoDB');
});

// Save quiz result
app.post('/api/quiz/save-result', async (req, res) => {
  try {
    const { userId, profile, scores, answers, timestamp } = req.body;
    
    // Validate
    if (!userId || !profile) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await db.collection('quiz_results').insertOne({
      userId,
      profile,
      scores,
      answers,
      timestamp: new Date(timestamp)
    });

    res.json({
      success: true,
      message: 'Quiz result saved',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to save quiz result' });
  }
});

// Get user profile
app.get('/api/quiz/profile/:userId', async (req, res) => {
  try {
    const result = await db.collection('quiz_results')
      .findOne({ userId: req.params.userId });

    if (!result) {
      return res.status(404).json({ error: 'No results found' });
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

// Get statistics
app.get('/api/quiz/stats', async (req, res) => {
  try {
    const stats = await db.collection('quiz_results')
      .aggregate([
        {
          $group: {
            _id: '$profile',
            count: { $sum: 1 }
          }
        }
      ]).toArray();

    const total = await db.collection('quiz_results').countDocuments();

    res.json({
      total,
      byProfile: stats.reduce((acc, s) => {
        acc[s._id] = s.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

#### Python + Flask + MongoDB
```python
from flask import Flask, request, jsonify
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
client = MongoClient(os.getenv('MONGODB_URI'))
db = client['amically']

@app.route('/api/quiz/save-result', methods=['POST'])
def save_quiz_result():
    try:
        data = request.json
        
        if not data.get('userId') or not data.get('profile'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        result = db.quiz_results.insert_one({
            'userId': data['userId'],
            'profile': data['profile'],
            'scores': data['scores'],
            'answers': data['answers'],
            'timestamp': datetime.fromisoformat(data['timestamp'])
        })
        
        return jsonify({
            'success': True,
            'id': str(result.inserted_id)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/quiz/profile/<user_id>', methods=['GET'])
def get_profile(user_id):
    try:
        result = db.quiz_results.find_one(
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

@app.route('/api/quiz/stats', methods=['GET'])
def get_stats():
    try:
        total = db.quiz_results.count_documents({})
        stats = {}
        
        for profile in ['authentic', 'careful', 'perfectionist', 'struggling']:
            count = db.quiz_results.count_documents({'profile': profile})
            stats[profile] = count
        
        return jsonify({
            'total': total,
            'byProfile': stats
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

---

### Step 4: Test Everything

```bash
# 1. Start your backend
node server.js  # or python server.py

# 2. Open browser → amically feed
# 3. Scroll to quiz
# 4. Answer questions
# 5. Check browser Network tab → POST to /api/quiz/save-result
# 6. Check your database for the saved data

# 7. Test endpoints with curl
curl -X POST http://localhost:3000/api/quiz/save-result \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "profile": "authentic",
    "scores": {"authentic": 3, "careful": 0, "perfectionist": 0, "struggling": 0},
    "answers": {"1": "never", "2": "authentic", "3": "happy"},
    "timestamp": "2026-01-26T10:30:00Z"
  }'

curl http://localhost:3000/api/quiz/stats
curl http://localhost:3000/api/quiz/profile/test-user
```

---

## 📱 Frontend User ID Setup

Add this to your `feed.js`:

```javascript
// Initialize user on page load
function initializeUser() {
  let userId = localStorage.getItem('userId');
  
  if (!userId) {
    // Generate unique ID for anonymous users
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  }
  
  // Use in current session
  sessionStorage.setItem('userId', userId);
  console.log('User ID:', userId);
}

// Call on page load
initializeUser();
```

---

## 🔐 CORS Configuration (If Frontend ≠ Backend)

If your frontend and backend are on different domains:

```javascript
// Node.js + Express
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'https://amically.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));
```

---

## 📈 Analytics Ideas

```javascript
// Get profile distribution
async function getProfileStats() {
  const response = await fetch('/api/quiz/stats');
  return await response.json();
  
  // Returns:
  // {
  //   total: 150,
  //   byProfile: {
  //     authentic: 45,
  //     careful: 52,
  //     perfectionist: 38,
  //     struggling: 15
  //   }
  // }
}

// Find struggling users
async function getStrugglingUsers() {
  const response = await fetch('/api/quiz/struggling-users');
  return await response.json();
}

// Generate report
async function generateReport() {
  const stats = await getProfileStats();
  console.log(`
    Quiz Results Report
    -------------------
    Total responses: ${stats.total}
    Authentic: ${stats.byProfile.authentic} (${(stats.byProfile.authentic/stats.total*100).toFixed(1)}%)
    Careful: ${stats.byProfile.careful} (${(stats.byProfile.careful/stats.total*100).toFixed(1)}%)
    Perfectionist: ${stats.byProfile.perfectionist} (${(stats.byProfile.perfectionist/stats.total*100).toFixed(1)}%)
    Struggling: ${stats.byProfile.struggling} (${(stats.byProfile.struggling/stats.total*100).toFixed(1)}%)
  `);
}
```

---

## ✅ Checklist

- [ ] Choose your backend stack (Node/Python, MongoDB/PostgreSQL)
- [ ] Create database and schema
- [ ] Build `/api/quiz/save-result` endpoint
- [ ] Build `/api/quiz/stats` endpoint (optional)
- [ ] Add `initializeUser()` to frontend
- [ ] Test with sample POST request
- [ ] Verify data in database
- [ ] Deploy to production
- [ ] Monitor quiz responses
- [ ] Build analytics dashboard (future)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to save quiz result" | Check `/api/quiz/save-result` endpoint is running |
| Empty database | Check MONGODB_URI is correct |
| CORS error | Check CORS headers in backend |
| Profile not showing | Check browser console for JavaScript errors |
| User ID not tracking | Call `initializeUser()` on page load |
| POST 404 error | Check endpoint path is `/api/quiz/save-result` |

---

## 📞 Need Help?

Check [DATABASE_INTEGRATION.md](DATABASE_INTEGRATION.md) for complete backend examples with error handling!
