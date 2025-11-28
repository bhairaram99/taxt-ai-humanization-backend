import mongoose from 'mongoose';
import { TRANSFORMATION_MODES, TARGET_AUDIENCES, VERBOSITY_LEVELS } from '../configs/constants.js';

const TransformationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    originalText: {
      type: String,
      required: [true, 'Original text is required'],
      minlength: [1, 'Text cannot be empty'],
      maxlength: [10000, 'Text is too long (max 10,000 characters)'],
      trim: true
    },
    humanizedText: {
      type: String,
      required: [true, 'Humanized text is required'],
      trim: true
    },
    mode: {
      type: String,
      enum: {
        values: TRANSFORMATION_MODES,
        message: `Mode must be one of: ${TRANSFORMATION_MODES.join(', ')}`
      },
      required: [true, 'Transformation mode is required']
    },
    formality: {
      type: Number,
      min: [0, 'Formality must be between 0 and 100'],
      max: [100, 'Formality must be between 0 and 100'],
      default: 50
    },
    targetAudience: {
      type: String,
      enum: {
        values: TARGET_AUDIENCES,
        message: `Target audience must be one of: ${TARGET_AUDIENCES.join(', ')}`
      },
      default: 'general'
    },
    verbosity: {
      type: String,
      enum: {
        values: VERBOSITY_LEVELS,
        message: `Verbosity must be one of: ${VERBOSITY_LEVELS.join(', ')}`
      },
      default: 'balanced'
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true,
    collection: 'transformations'
  }
);

// Create index for faster queries
TransformationSchema.index({ userId: 1, timestamp: -1 });
TransformationSchema.index({ timestamp: -1 });

export const Transformation = mongoose.model('Transformation', TransformationSchema);
