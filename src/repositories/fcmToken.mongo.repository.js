const FcmToken = require('../modelsMongo/fcmTokens');

/**
 * Creates a new FCM token entry in the database.
 * @param {Object} data - Object containing user_id, token, device info, etc.
 * @returns {Promise<FcmToken>} - The created token document.
 */
async function createToken(data) {
  const token = new FcmToken(data);
  return await token.save();
}
/**
 * Checks whether an FCM token exists for a specific user.
 * @param {mongoose.Types.Number} userId - The ID of the user.
 * @returns {Promise<boolean>} - True if a token exists, otherwise false.
 */
async function existsByUserId(userId) {
  return await FcmToken.exists({ user_id: userId });
}


/**
 * Updates an existing token for a user with new data.
 * Updates the `last_update` timestamp automatically.
 * @param {mongoose.Types.Number} userId - The ID of the user.
 * @param {Object} newTokenData - Fields to update (e.g. token, device info).
 * @returns {Promise<FcmToken>} - The updated token document.
 */
async function updateTokenByUserId(userId, newTokenData) {
  return await FcmToken.findOneAndUpdate(
    { user_id: userId },
    {
      ...newTokenData,
      last_update: Date.now(),
    },
    { new: true }
  );
}

/**
 * Retrieves the FCM token document for a specific user.
 * @param {mongoose.Types.Number} userId - The ID of the user.
 * @returns {Promise<FcmToken|null>} - The token document or null if not found.
 */
async function getTokenByUserId(userId) {
  return await FcmToken.findOne({ user_id: userId });
}


module.exports = {
  createToken,
  existsByUserId,
  updateTokenByUserId,
  getTokenByUserId,
};
