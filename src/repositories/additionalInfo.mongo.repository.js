const AdditionalInfo = require("../modelsMongo/AdditionalInfo");

/**
 * Saves or updates additional information for a given user.
 * If the user already has additional info, it will be overwritten.
 *
 * @param {Number} userId - The ID of the user.
 * @param {Object} info - The additional information to save.
 * @returns {Promise<Object>} - The saved or updated document.
 */
async function saveAdditionalInformation(userId, info) {
  try {
    return await AdditionalInfo.findOneAndUpdate(
      { userId },
      { $set: { info } },
      { upsert: true, new: true }
    );
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'User additional info already exists' });
    }
    throw err;
  }
}
/**
 * Retrieves the additional information for a given user.
 *
 * @param {Number} userId - The ID of the user.
 * @returns {Promise<Object|null>} - The user's additional information, or null if not found.
 */
async function getAdditionalInformation(userId) {
  return await AdditionalInfo.findOne({ userId });
}
/**
 * Deletes the additional information of a given user.
 *
 * @param {Number} userId - The ID of the user.
 * @returns {Promise<Object>} - The result of the deletion operation.
 */
async function deleteAdditionalInformation(userId) {
  return await AdditionalInfo.deleteOne({ userId });
}

/**
 * Checks if a user has additional information stored.
 *
 * @param {Number} userId - The ID of the user.
 * @returns {Promise<Boolean>} - True if the user has additional information, false otherwise.
 */
async function hasAdditionalInformation(userId) {
  const info = await AdditionalInfo.findOne({ userId }, '_id');
  return !!info;
}
module.exports = {
  saveAdditionalInformation,
  getAdditionalInformation,
  deleteAdditionalInformation,
  hasAdditionalInformation,
};
