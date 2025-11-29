/**
 * Request logging middleware
 */
export function requestLogger(req, res, next) {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse).substring(0, 100)}`;
      }

      if (logLine.length > 150) {
        logLine = logLine.slice(0, 149) + '…';
      }

      console.log(`[${new Date().toLocaleTimeString()}] ${logLine}`);
    }
  });

  next();
}

/**
 * CORS middleware configuration
 */
export function corsConfig() {
  const allowedOrigins = [
    "http://localhost:5173",
    process.env.CORS_ORIGIN,        // Vercel frontend
  ].filter(Boolean);                // removes undefined/null

  return {
    origin: function (origin, callback) {
      // Allow server-to-server, health checks, and tools
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("CORS error: origin not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
}

