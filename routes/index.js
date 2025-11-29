import express from 'express';
import transformationRoutes from './transformations.js';

const router = express.Router();

// --- ADD THIS ROUTE HERE ---
router.get("/", (req, res) => {
  res.json({ message: "API running", status: "ok" });
});

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
