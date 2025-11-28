# Text Humanizer Backend

Node.js + Express + MongoDB backend for AI-powered text humanization using Google's Gemini API.

## Project Structure

```
backend/
├── server.js                 # Main server entry point
├── package.json             # Dependencies
├── .env                     # Environment variables
│
├── configs/
│   ├── database.js         # MongoDB connection
│   ├── constants.js        # App constants
│   └── environment.js      # Environment config
│
├── models/
│   ├── User.js            # User schema
│   └── Transformation.js   # Transformation schema
│
├── services/
│   ├── HumanizationService.js    # Gemini AI integration
│   └── StorageService.js         # Database operations
│
├── controllers/
│   └── TransformationController.js  # API handlers
│
├── routes/
│   ├── index.js            # Main routes
│   └── transformations.js   # Transformation routes
│
└── utils/
    ├── validation.js       # Request validation
    ├── errorHandler.js     # Error handling
    └── middleware.js       # Custom middleware
```

## Features

- **Text Humanization**: Convert AI-generated text to human-like text using Gemini API
- **Multiple Transformation Modes**: Paraphrase, Style, Tone, Vocabulary
- **Flexible Configuration**: Formality levels, target audiences, verbosity options
- **Deep Humanization**: 3-pass transformation for advanced AI detection bypass
- **MongoDB Storage**: Persistent storage of transformations
- **RESTful API**: Clean API endpoints with validation
- **Error Handling**: Comprehensive error handling and logging

## Prerequisites

- Node.js 16+ or higher
- MongoDB (local or cloud)
- Google Gemini API key

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file in the backend folder:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   MONGODB_URI=mongodb://localhost:27017/text_humanizer
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Ensure MongoDB is running**:
   - Local MongoDB: `mongod`
   - Or use MongoDB Atlas (cloud)

## Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Transform Text
- **POST** `/api/transform`
- **Body**:
  ```json
  {
    "originalText": "Your text here",
    "mode": "paraphrase",
    "formality": 50,
    "targetAudience": "general",
    "verbosity": "balanced",
    "deepHumanization": false
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "...",
      "originalText": "...",
      "humanizedText": "...",
      "mode": "paraphrase",
      "formality": 50,
      "targetAudience": "general",
      "verbosity": "balanced",
      "timestamp": 1234567890
    }
  }
  ```

### Get Transformations
- **GET** `/api/transformations?limit=50`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "...",
        "originalText": "...",
        "humanizedText": "...",
        ...
      }
    ]
  }
  ```

### Get Single Transformation
- **GET** `/api/transformations/:id`

### Delete Transformation
- **DELETE** `/api/transformations/:id`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Transformation deleted successfully"
  }
  ```

### Health Check
- **GET** `/health`
- **Response**:
  ```json
  {
    "status": "ok",
    "timestamp": "2024-11-19T12:00:00.000Z",
    "uptime": 1234.567
  }
  ```

## Configuration Options

### Transformation Modes
- `paraphrase`: Rewrites text while preserving meaning
- `style`: Improves writing style and flow
- `tone`: Adjusts emotional quality
- `vocabulary`: Enriches vocabulary

### Target Audiences
- `general`: General audience
- `academic`: Academic writing
- `professional`: Professional settings
- `casual`: Conversational tone
- `technical`: Technical writing

### Verbosity Levels
- `concise`: Brief but flowing
- `balanced`: Detailed yet engaging
- `detailed`: Thorough with examples

### Formality Levels
- 0-33: Casual
- 34-66: Neutral
- 67-100: Formal

## Database Schema

### Transformation Document
```javascript
{
  _id: ObjectId,
  userId: ObjectId | null,
  originalText: String,
  humanizedText: String,
  mode: String,
  formality: Number,
  targetAudience: String,
  verbosity: String,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### User Document
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Development

### Running Tests
```bash
npm test
```

### Debugging
Set `NODE_ENV=development` to see detailed error messages and stack traces.

### Logging
The server logs all API requests with timestamps, methods, status codes, and response times.

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `404`: Not Found
- `500`: Server Error

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Required |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/text_humanizer` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:5173` |

## Technologies

- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **Google Generative AI**: Gemini API
- **Express Validator**: Request validation
- **CORS**: Cross-Origin Resource Sharing
- **Dotenv**: Environment variables

## Migration from TypeScript PostgreSQL to Node.js MongoDB

### Key Changes

| Aspect | Old (TypeScript + PostgreSQL) | New (Node.js + MongoDB) |
|--------|-------------------------------|----------------------|
| **Database** | PostgreSQL with Drizzle ORM | MongoDB with Mongoose |
| **Language** | TypeScript | JavaScript (CommonJS to ES Modules) |
| **ORM** | Drizzle ORM | Mongoose |
| **Schema** | SQL tables with types | Mongoose schemas |
| **Validation** | Zod | Express Validator |
| **Storage** | `storage.ts` class | Service functions |
| **API Framework** | Express (same) | Express (same) |
| **Humanization** | `gemini.ts` | `HumanizationService.js` |

### Migration Benefits

✓ Simpler setup (no TypeScript compilation)
✓ Faster development cycle
✓ Flexible schema with Mongoose
✓ Better for rapid prototyping
✓ Native JavaScript ecosystem
✓ Reduced deployment complexity

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or connect to MongoDB Atlas
- Check `MONGODB_URI` in `.env`

### Gemini API Error
- Verify `GEMINI_API_KEY` is correct
- Check API key permissions in Google Cloud Console
- Ensure API is enabled

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # macOS/Linux
  lsof -i :5000
  kill -9 <PID>
  ```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
