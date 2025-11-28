# Getting Started with the Backend

## Quick Setup Guide

### Step 1: Install Node.js
Download from https://nodejs.org/ (v16 or higher)

### Step 2: Install MongoDB
**Option A: Local MongoDB**
- Windows: Download from https://www.mongodb.com/try/download/community
- macOS: `brew install mongodb-community`
- Linux: Follow https://docs.mongodb.com/manual/installation/

**Option B: MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create free account
- Create cluster
- Get connection string

### Step 3: Install Dependencies
```bash
cd backend
npm install
```

### Step 4: Configure Environment
Create `.env` file in backend folder:

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/text_humanizer

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**How to get Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikey
2. Click "Get API Key"
3. Create new API key
4. Copy and paste into `.env`

### Step 5: Start MongoDB
**If using local MongoDB:**
```bash
# macOS/Linux
brew services start mongodb-community

# Windows
# MongoDB should be running as service after installation
# Or run: mongod
```

### Step 6: Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Server running on http://0.0.0.0:5000
✓ Environment: development
✓ Database: MongoDB (text_humanizer)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Testing the API

### Health Check
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-11-19T12:00:00.000Z",
  "uptime": 1234.567
}
```

### Transform Text
```bash
curl -X POST http://localhost:5000/api/transform \
  -H "Content-Type: application/json" \
  -d '{
    "originalText": "The utilization of renewable energy sources is of paramount importance for the mitigation of climate change and the assurance of a sustainable future.",
    "mode": "paraphrase",
    "formality": 50,
    "targetAudience": "general",
    "verbosity": "balanced",
    "deepHumanization": false
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "655a1b2c3d4e5f6g7h8i9j0k",
    "originalText": "The utilization of renewable energy sources...",
    "humanizedText": "Switching to renewables is crucial. I mean, it's really the only way we can fight climate change...",
    "mode": "paraphrase",
    "formality": 50,
    "targetAudience": "general",
    "verbosity": "balanced",
    "timestamp": 1234567890000
  }
}
```

### Get All Transformations
```bash
curl "http://localhost:5000/api/transformations?limit=10"
```

### Get Single Transformation
```bash
curl http://localhost:5000/api/transformations/655a1b2c3d4e5f6g7h8i9j0k
```

### Delete Transformation
```bash
curl -X DELETE http://localhost:5000/api/transformations/655a1b2c3d4e5f6g7h8i9j0k
```

---

## Using Thunder Client or Postman

### Create Collection

**1. Transform Text**
- Method: POST
- URL: `http://localhost:5000/api/transform`
- Body (JSON):
```json
{
  "originalText": "Your text here",
  "mode": "paraphrase",
  "formality": 50,
  "targetAudience": "general",
  "verbosity": "balanced"
}
```

**2. Get Transformations**
- Method: GET
- URL: `http://localhost:5000/api/transformations`

**3. Get Single**
- Method: GET
- URL: `http://localhost:5000/api/transformations/:id`

**4. Delete**
- Method: DELETE
- URL: `http://localhost:5000/api/transformations/:id`

---

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas: Verify connection string and whitelist IP

### Gemini API Error
```
Error: Failed to humanize text: Invalid API key
```
**Solution:**
- Get fresh API key from https://aistudio.google.com/app/apikey
- Copy entire key (not partial)
- Restart server after updating `.env`

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
- Change PORT in `.env` to something else (e.g., 5001)
- Or kill process using port:

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

### CORS Error in Frontend
```
Access to XMLHttpRequest blocked by CORS
```
**Solution:**
- Update `CORS_ORIGIN` in `.env` to match frontend URL
- If frontend runs on http://localhost:3000, set:
```env
CORS_ORIGIN=http://localhost:3000
```

### Validation Error
```json
{
  "error": "Validation error",
  "details": [...]
}
```
**Check:**
- `originalText` is not empty and ≤ 10000 chars
- `mode` is one of: paraphrase, style, tone, vocabulary
- `targetAudience` is one of: general, academic, professional, casual, technical
- `verbosity` is one of: concise, balanced, detailed
- `formality` is number between 0-100

---

## Development Tips

### 1. Enable Debug Logging
```bash
# Add to .env
DEBUG=*
```

### 2. Check MongoDB Data
**Using MongoDB Compass:**
- Download from https://www.mongodb.com/products/tools/compass
- Connect to `mongodb://localhost:27017`
- Browse `text_humanizer` database

**Using MongoDB CLI:**
```bash
mongosh
use text_humanizer
db.transformations.find()
db.users.find()
```

### 3. Hot Reload
Server automatically reloads on file changes in development:
```bash
npm run dev
```

### 4. Environment Switching
```bash
# Development
NODE_ENV=development npm run dev

# Production
NODE_ENV=production npm start
```

### 5. Check Server Logs
All API requests are logged with:
- Timestamp
- HTTP method
- Route path
- Status code
- Response time
- Response preview

---

## Frontend Integration

### Connect React Frontend

In your React client, update the API base URL:

```javascript
// src/lib/api.js or similar
const API_BASE = 'http://localhost:5000';

export async function transformText(params) {
  const response = await fetch(`${API_BASE}/api/transform`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return response.json();
}

export async function getTransformations(limit = 50) {
  const response = await fetch(`${API_BASE}/api/transformations?limit=${limit}`);
  return response.json();
}
```

---

## Production Deployment

### Before Deploying

1. **Set environment variables:**
```env
NODE_ENV=production
GEMINI_API_KEY=your_production_key
MONGODB_URI=your_production_mongodb_uri
PORT=5000
CORS_ORIGIN=your_production_domain
```

2. **Test production build:**
```bash
npm start
```

3. **Check logs for errors**

### Deploy Options

**Option 1: Heroku**
```bash
heroku login
heroku create your-app-name
git push heroku main
```

**Option 2: Railway**
```bash
railway login
railway link
railway up
```

**Option 3: DigitalOcean**
- Create droplet
- Install Node.js and MongoDB
- Clone repository
- `npm install`
- `npm start`
- Use PM2 for process management

**Option 4: AWS/Google Cloud/Azure**
- Deploy to compute instance
- Use CloudSQL/DocumentDB for MongoDB
- Set up load balancing

---

## File Structure Reference

```
backend/
├── server.js                    ← START HERE
├── package.json               ← Dependencies
├── .env                       ← Configuration
├── README.md                  ← Full documentation
├── ANALYSIS.md                ← Architecture analysis
├── STRUCTURE.md               ← Project structure
├── SETUP.md                   ← This file
│
├── configs/
│   ├── database.js
│   ├── constants.js
│   └── environment.js
│
├── models/
│   ├── User.js
│   └── Transformation.js
│
├── services/
│   ├── HumanizationService.js
│   └── StorageService.js
│
├── controllers/
│   └── TransformationController.js
│
├── routes/
│   ├── index.js
│   └── transformations.js
│
└── utils/
    ├── validation.js
    ├── errorHandler.js
    └── middleware.js
```

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure `.env`
3. ✅ Start MongoDB
4. ✅ Start server (`npm run dev`)
5. ✅ Test API endpoints
6. ✅ Integrate with frontend
7. ✅ Deploy to production

---

## Support & Resources

- **Gemini API Docs**: https://ai.google.dev/
- **Mongoose Docs**: https://mongoosejs.com/
- **Express Docs**: https://expressjs.com/
- **MongoDB Docs**: https://docs.mongodb.com/

---

## Summary

Your backend is now ready! The server:
- ✅ Connects to MongoDB
- ✅ Exposes REST API endpoints
- ✅ Integrates with Google Gemini for text humanization
- ✅ Has proper error handling
- ✅ Logs all requests
- ✅ Validates all inputs
- ✅ Returns consistent responses

Happy coding! 🚀
