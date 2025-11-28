import { validationResult } from 'express-validator';
import { humanizeText } from '../services/HumanizationService.js';
import * as storageService from '../services/StorageService.js';

/**
 * Transform text endpoint
 * POST /api/transform
 */
export async function transformText(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation error',
        details: errors.array()
      });
    }

    const { originalText, mode, formality, targetAudience, verbosity, deepHumanization } = req.body;

    console.log('🔄 Transforming text...');
    const humanizedText = await humanizeText({
      text: originalText,
      mode,
      formality,
      targetAudience,
      verbosity,
      deepHumanization
    });

    const transformationData = {
      userId: req.user?.id || null,
      originalText,
      humanizedText,
      mode,
      formality,
      targetAudience,
      verbosity,
      timestamp: new Date()
    };

    const savedTransformation = await storageService.saveTransformation(transformationData);

    res.status(201).json({
      success: true,
      data: {
        ...savedTransformation,
        timestamp: savedTransformation.timestamp?.getTime()
      }
    });
  } catch (error) {
    console.error('Transform error:', error);
    res.status(500).json({
      error: error.message || 'Failed to transform text'
    });
  }
}

/**
 * Get transformation history
 * GET /api/transformations
 */
export async function getTransformations(req, res) {
  try {
    const limit = req.query.limit ? Math.min(parseInt(req.query.limit), 500) : 50;
    const userId = req.user?.id || null;

    const transformations = await storageService.getTransformations(userId, limit);

    // Convert timestamp to number for frontend compatibility
    const transformationsWithTimestamp = transformations.map(t => ({
      ...t,
      timestamp: t.timestamp?.getTime ? t.timestamp.getTime() : t.timestamp
    }));

    res.json({
      success: true,
      data: transformationsWithTimestamp
    });
  } catch (error) {
    console.error('Get transformations error:', error);
    res.status(500).json({
      error: error.message || 'Failed to retrieve transformations'
    });
  }
}

/**
 * Get a single transformation by ID
 * GET /api/transformations/:id
 */
export async function getTransformationById(req, res) {
  try {
    const { id } = req.params;

    const transformation = await storageService.getTransformationById(id);

    if (!transformation) {
      return res.status(404).json({
        error: 'Transformation not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...transformation,
        timestamp: transformation.timestamp?.getTime ? transformation.timestamp.getTime() : transformation.timestamp
      }
    });
  } catch (error) {
    console.error('Get transformation error:', error);
    res.status(500).json({
      error: error.message || 'Failed to retrieve transformation'
    });
  }
}

/**
 * Delete a transformation
 * DELETE /api/transformations/:id
 */
export async function deleteTransformation(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null;

    const deleted = await storageService.deleteTransformation(id, userId);

    if (!deleted) {
      return res.status(404).json({
        error: 'Transformation not found'
      });
    }

    res.json({
      success: true,
      message: 'Transformation deleted successfully'
    });
  } catch (error) {
    console.error('Delete transformation error:', error);
    res.status(500).json({
      error: error.message || 'Failed to delete transformation'
    });
  }
}
