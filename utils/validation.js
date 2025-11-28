import { TRANSFORMATION_MODES, TARGET_AUDIENCES, VERBOSITY_LEVELS, MIN_TEXT_LENGTH, MAX_TEXT_LENGTH } from '../configs/constants.js';

/**
 * Validate transformation request
 */
export function validateTransformationRequest(originalText, mode, formality, targetAudience, verbosity) {
  const errors = [];

  // Validate originalText
  if (!originalText || typeof originalText !== 'string') {
    errors.push('Original text is required and must be a string');
  } else if (originalText.trim().length < MIN_TEXT_LENGTH) {
    errors.push(`Text must be at least ${MIN_TEXT_LENGTH} character`);
  } else if (originalText.length > MAX_TEXT_LENGTH) {
    errors.push(`Text must be less than ${MAX_TEXT_LENGTH} characters`);
  }

  // Validate mode
  if (!mode || !TRANSFORMATION_MODES.includes(mode)) {
    errors.push(`Mode must be one of: ${TRANSFORMATION_MODES.join(', ')}`);
  }

  // Validate formality
  if (formality !== undefined) {
    if (typeof formality !== 'number' || formality < 0 || formality > 100) {
      errors.push('Formality must be a number between 0 and 100');
    }
  }

  // Validate targetAudience
  if (!targetAudience || !TARGET_AUDIENCES.includes(targetAudience)) {
    errors.push(`Target audience must be one of: ${TARGET_AUDIENCES.join(', ')}`);
  }

  // Validate verbosity
  if (!verbosity || !VERBOSITY_LEVELS.includes(verbosity)) {
    errors.push(`Verbosity must be one of: ${VERBOSITY_LEVELS.join(', ')}`);
  }

  return errors;
}

/**
 * Format transformation for response
 */
export function formatTransformation(transformation) {
  return {
    id: transformation._id,
    originalText: transformation.originalText,
    humanizedText: transformation.humanizedText,
    mode: transformation.mode,
    formality: transformation.formality,
    targetAudience: transformation.targetAudience,
    verbosity: transformation.verbosity,
    timestamp: transformation.timestamp?.getTime ? transformation.timestamp.getTime() : transformation.timestamp,
    createdAt: transformation.createdAt,
    updatedAt: transformation.updatedAt
  };
}

/**
 * Handle async errors
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
