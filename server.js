import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import { connectDB } from './configs/database.js';
import { getEnvConfig } from './configs/environment.js';
import { requestLogger, corsConfig } from './utils/middleware.js';
import { errorHandler, notFoundHandler } from './utils/errorHandler.js';
import routes from './routes/index.js';

const app = express();
const config = getEnvConfig();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors(corsConfig()));
app.use(requestLogger);

// Routes
app.use('/', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Connect to MongoDB and start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start listening
    const server = app.listen(config.port, '0.0.0.0', () => {
      console.log('━'.repeat(60));
      console.log(`✓ Server running on http://0.0.0.0:${config.port}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
      console.log(`✓ Database: MongoDB (${config.mongodbUri.split('/').pop()})`);
      console.log('━'.repeat(60));
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n✓ Shutting down gracefully...');
      server.close(() => {
        console.log('✓ Server closed');
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;
