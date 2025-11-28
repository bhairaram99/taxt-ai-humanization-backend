import { Transformation } from '../models/Transformation.js';

/**
 * Save a transformation to the database
 */
export async function saveTransformation(transformationData) {
  try {
    const transformation = new Transformation(transformationData);
    const savedTransformation = await transformation.save();
    return savedTransformation.toObject();
  } catch (error) {
    throw new Error(`Failed to save transformation: ${error.message}`);
  }
}

/**
 * Get transformations with optional filtering
 */
export async function getTransformations(userId = null, limit = 50) {
  try {
    let query = {};

    if (userId === null) {
      // Get transformations for anonymous users
      query.userId = null;
    } else if (userId) {
      // Get transformations for specific user
      query.userId = userId;
    }
    // If userId is undefined, return all transformations

    const transformations = await Transformation.find(query)
      .sort({ timestamp: -1 })
      .limit(Math.min(limit, 500))
      .lean()
      .exec();

    return transformations;
  } catch (error) {
    throw new Error(`Failed to retrieve transformations: ${error.message}`);
  }
}

/**
 * Delete a transformation
 */
export async function deleteTransformation(id, userId = null) {
  try {
    let query = { _id: id };

    if (userId === null) {
      query.userId = null;
    } else if (userId) {
      query.userId = userId;
    }

    const result = await Transformation.findByIdAndDelete(id, query);
    return !!result;
  } catch (error) {
    throw new Error(`Failed to delete transformation: ${error.message}`);
  }
}

/**
 * Get transformation by ID
 */
export async function getTransformationById(id) {
  try {
    const transformation = await Transformation.findById(id).lean().exec();
    return transformation;
  } catch (error) {
    throw new Error(`Failed to retrieve transformation: ${error.message}`);
  }
}

/**
 * Update a transformation
 */
export async function updateTransformation(id, updateData) {
  try {
    const transformation = await Transformation.findByIdAndUpdate(id, updateData, { new: true }).lean().exec();
    return transformation;
  } catch (error) {
    throw new Error(`Failed to update transformation: ${error.message}`);
  }
}
