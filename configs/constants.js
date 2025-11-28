export const TRANSFORMATION_MODES = ['paraphrase', 'style', 'tone', 'vocabulary'];

export const TARGET_AUDIENCES = ['general', 'academic', 'professional', 'casual', 'technical'];

export const VERBOSITY_LEVELS = ['concise', 'balanced', 'detailed'];

export const MODE_INFO = {
  paraphrase: {
    label: 'Paraphrase',
    description: 'Rewrites text while preserving the original meaning'
  },
  style: {
    label: 'Style Enhancement',
    description: 'Improves writing style and flow'
  },
  tone: {
    label: 'Tone Adjustment',
    description: 'Adjusts the tone and emotional quality'
  },
  vocabulary: {
    label: 'Vocabulary Enhancement',
    description: 'Enriches vocabulary with better word choices'
  }
};

export const AUDIENCE_INFO = {
  general: 'General Audience',
  academic: 'Academic',
  professional: 'Professional',
  casual: 'Casual',
  technical: 'Technical'
};

export const MAX_TEXT_LENGTH = 10000;
export const MIN_TEXT_LENGTH = 1;
export const DEFAULT_LIMIT = 50;
export const MAX_LIMIT = 500;
