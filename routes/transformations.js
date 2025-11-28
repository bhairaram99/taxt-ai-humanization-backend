import express from 'express';
import { body } from 'express-validator';
import * as transformationController from '../controllers/TransformationController.js';
import { TRANSFORMATION_MODES, TARGET_AUDIENCES, VERBOSITY_LEVELS } from '../configs/constants.js';

const router = express.Router();

/**
 * POST /api/transform
 * Transform text using Gemini AI
 */
router.post('/transform',
  body('originalText')
    .trim()
    .notEmpty().withMessage('Original text is required')
    .isLength({ min: 1, max: 10000 }).withMessage('Text must be between 1 and 10000 characters'),
  body('mode')
    .isIn(TRANSFORMATION_MODES).withMessage(`Mode must be one of: ${TRANSFORMATION_MODES.join(', ')}`),
  body('formality')
    .optional({ checkFalsy: false })
    .isInt({ min: 0, max: 100 }).withMessage('Formality must be between 0 and 100'),
  body('targetAudience')
    .isIn(TARGET_AUDIENCES).withMessage(`Target audience must be one of: ${TARGET_AUDIENCES.join(', ')}`),
  body('verbosity')
    .isIn(VERBOSITY_LEVELS).withMessage(`Verbosity must be one of: ${VERBOSITY_LEVELS.join(', ')}`),
  body('deepHumanization')
    .optional({ checkFalsy: false })
    .isBoolean().withMessage('deepHumanization must be a boolean'),
  transformationController.transformText
);

/**
 * GET /api/transformations
 * Get transformation history
 */
router.get('/transformations',
  transformationController.getTransformations
);

/**
 * GET /api/transformations/:id
 * Get a single transformation by ID
 */
router.get('/transformations/:id',
  transformationController.getTransformationById
);

/**
 * DELETE /api/transformations/:id
 * Delete a transformation
 */
router.delete('/transformations/:id',
  transformationController.deleteTransformation
);

export default router;
