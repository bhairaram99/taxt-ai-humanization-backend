# Backend Project Structure

```
backend/
│
├── 📄 server.js                      # Main server entry point
│                                      # - Express app initialization
│                                      # - MongoDB connection
│                                      # - Middleware setup
│                                      # - Error handling
│
├── 📄 package.json                   # Project dependencies
│                                      # - Express, Mongoose, Gemini API
│                                      # - Development scripts
│                                      # - Meta information
│
├── 📄 .env                           # Environment variables
│                                      # - GEMINI_API_KEY
│                                      # - MONGODB_URI
│                                      # - PORT, NODE_ENV, CORS_ORIGIN
│
├── 📄 .gitignore                     # Git ignore rules
├── 📄 README.md                      # Setup & usage guide
├── 📄 ANALYSIS.md                    # Architecture analysis & migration report
│
├── 📁 configs/                       # Configuration files
│   ├── database.js                   # MongoDB connection & setup
│   │   - connectDB(): Connect to MongoDB
│   │   - disconnectDB(): Close connection
│   │
│   ├── constants.js                  # Application constants
│   │   - TRANSFORMATION_MODES (paraphrase, style, tone, vocabulary)
│   │   - TARGET_AUDIENCES (general, academic, professional, casual, technical)
│   │   - VERBOSITY_LEVELS (concise, balanced, detailed)
│   │   - MODE_INFO & AUDIENCE_INFO (display data)
│   │   - Validation limits (MAX_TEXT_LENGTH: 10000, etc.)
│   │
│   └── environment.js                # Environment config
│       - getEnvConfig(): Load all env variables
│       - isDevelopment(), isProduction()
│
├── 📁 models/                        # Mongoose data models
│   ├── User.js                       # User schema
│   │   Fields:
│   │   - username (unique, 3-50 chars)
│   │   - email (unique, valid format)
│   │   - password (6+ chars, not returned)
│   │   - createdAt (indexed)
│   │
│   └── Transformation.js             # Transformation schema
│       Fields:
│       - userId (ref to User, nullable)
│       - originalText (1-10000 chars)
│       - humanizedText
│       - mode (enum: paraphrase, style, tone, vocabulary)
│       - formality (0-100)
│       - targetAudience (enum)
│       - verbosity (enum)
│       - timestamp (indexed)
│       Indexes:
│       - userId + timestamp
│       - timestamp (for sorting)
│
├── 📁 services/                      # Business logic layer
│   ├── HumanizationService.js        # Gemini AI integration (migrated from gemini.ts)
│   │   Functions:
│   │   - humanizeText(params): Main humanization
│   │   - multiPassHumanization(params): 3-pass transformation
│   │   - validateAndEnforceHumanization(text): Quality scoring
│   │   - applyDeterministicFixes(text, issues): Manual improvements
│   │   
│   │   Features:
│   │   - Temperature-based passing (1.0 → 0.95 → 0.9)
│   │   - AI phrase detection & removal
│   │   - Contraction injection
│   │   - Sentence variation analysis
│   │   - Colloquial marker detection
│   │
│   └── StorageService.js             # Database operations
│       Functions:
│       - saveTransformation(data): Insert new transformation
│       - getTransformations(userId, limit): Query with filtering
│       - getTransformationById(id): Get single transformation
│       - deleteTransformation(id, userId): Delete with ownership check
│       - updateTransformation(id, data): Update transformation
│
├── 📁 controllers/                   # Request handlers
│   └── TransformationController.js   # API endpoint handlers
│       Functions:
│       - transformText(req, res): POST /api/transform
│       - getTransformations(req, res): GET /api/transformations
│       - getTransformationById(req, res): GET /api/transformations/:id
│       - deleteTransformation(req, res): DELETE /api/transformations/:id
│
├── 📁 routes/                        # API route definitions
│   ├── index.js                      # Main router
│   │   - Combines all routes
│   │   - Health check endpoint
│   │
│   └── transformations.js            # Transformation routes
│       Routes:
│       - POST /api/transform
│         Validations: originalText, mode, formality, targetAudience, verbosity
│       - GET /api/transformations
│       - GET /api/transformations/:id
│       - DELETE /api/transformations/:id
│
└── 📁 utils/                         # Utility functions & middleware
    ├── validation.js                 # Request validation helpers
    │   Functions:
    │   - validateTransformationRequest(): Full validation
    │   - formatTransformation(): Response formatting
    │   - asyncHandler(): Async error handling wrapper
    │
    ├── errorHandler.js               # Error handling
    │   Classes/Functions:
    │   - AppError: Custom error class
    │   - errorHandler(): Global error middleware
    │   - notFoundHandler(): 404 handler
    │
    └── middleware.js                 # Custom middleware
        Functions:
        - requestLogger(): Request logging middleware
        - corsConfig(): CORS configuration
```

## File Sizes & Line Counts

| File | Lines | Purpose |
|------|-------|---------|
| server.js | ~70 | Main entry point |
| HumanizationService.js | ~500 | Gemini integration |
| Transformation.js | ~60 | Mongoose schema |
| User.js | ~40 | Mongoose schema |
| TransformationController.js | ~100 | API handlers |
| transformations.js | ~50 | Route definitions |
| StorageService.js | ~80 | Database operations |
| validation.js | ~60 | Validation helpers |
| errorHandler.js | ~40 | Error handling |
| middleware.js | ~40 | Custom middleware |

## Architecture Layers

```
┌─────────────────────────────────────────┐
│        Client (React Frontend)          │
└─────────────────────────────────────────┘
                    ↓ HTTP/REST
┌─────────────────────────────────────────┐
│         API Layer (Routes)              │
│     - transformations.js                │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Controller Layer                     │
│    - TransformationController.js        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Service Layer (Business Logic)       │
│    - HumanizationService.js             │
│    - StorageService.js                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Data Access Layer                  │
│    - Mongoose Models                    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Database Layer                       │
│    - MongoDB                            │
└─────────────────────────────────────────┘
```

## External Services

```
┌──────────────────────────────────────────────┐
│        Backend Server                        │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │  HumanizationService                │   │
│  │  - Calls Gemini API                 │   │
│  │  - Processes 3-pass transformation  │   │
│  └─────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────────┐
│    Google Generative AI (Gemini)             │
│    - Model: gemini-2.5-flash                 │
│    - Humanization logic                      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│        Backend Server                        │
│                                              │
│  ┌─────────────────────────────────────┐   │
│  │  Storage Service                    │   │
│  │  - MongoDB operations               │   │
│  │  - CRUD transformations             │   │
│  └─────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
            ↓
┌──────────────────────────────────────────────┐
│    MongoDB Database                          │
│    - Collections: users, transformations     │
│    - Indexes: userId, timestamp              │
└──────────────────────────────────────────────┘
```

## Request Flow Example

```
Frontend HTTP Request
│
│ POST /api/transform
│ {
│   "originalText": "...",
│   "mode": "paraphrase",
│   ...
│ }
│
↓
Router (routes/transformations.js)
│
├─ Validate input with express-validator
├─ Check for validation errors
│
↓
Controller (TransformationController.js)
│
├─ Extract validated data
├─ Call HumanizationService.humanizeText()
│
↓
Service (HumanizationService.js)
│
├─ Call Gemini API (Pass 1, 2, 3)
├─ Validate humanization quality
├─ Apply deterministic fixes if needed
├─ Return humanized text
│
↓ (Back to Controller)
│
├─ Call StorageService.saveTransformation()
│
↓
Storage Service (StorageService.js)
│
├─ Create Transformation document
├─ Save to MongoDB
├─ Return saved document
│
↓ (Back to Controller)
│
├─ Format response
├─ Send HTTP 201 response
│
↓
Frontend receives response
{
  "success": true,
  "data": {
    "_id": "...",
    "humanizedText": "...",
    "timestamp": 1234567890
  }
}
```

## Environment Variables

```
.env file structure:
├── GEMINI_API_KEY=xxxxxxxx (Required)
├── MONGODB_URI=mongodb://... (Required)
├── PORT=5000 (Optional, default 5000)
├── NODE_ENV=development (development/production)
└── CORS_ORIGIN=http://localhost:5173 (Frontend origin)
```

## Key Features

✅ **Text Humanization**: AI-powered text transformation
✅ **Multi-mode Support**: Paraphrase, Style, Tone, Vocabulary
✅ **Quality Validation**: 3-pass transformation with scoring
✅ **Database Persistence**: MongoDB with Mongoose
✅ **RESTful API**: Clean, documented endpoints
✅ **Error Handling**: Comprehensive error handling
✅ **Request Logging**: API call tracking
✅ **CORS Support**: Cross-origin requests
✅ **Modular Architecture**: Easy to extend
✅ **Environment Config**: .env-based configuration
