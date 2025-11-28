import express from 'express';
import transformationRoutes from './transformations.js';

const router = express.Router();

// API Routes
router.use('/api', transformationRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
